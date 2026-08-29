import asyncio
import json
import logging
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import UTC, datetime, timedelta

from dateutil import parser as date_parser
from dateutil.tz import gettz

from config import settings
from core.interfaces.plugin import IAyatoPlugin, ReportArtifact
from core.service_container import ServiceContainer
from core.utils.affiliate_manager import AffiliateManager
from core.utils.content_extractor import ContentExtractor
from core.utils.disclaimer_manager import DisclaimerManager
from core.utils.fetch_util import FetchUtil

logger = logging.getLogger(__name__)

# Timezone Abbreviation Mapping for robust parsing
TZ_INFOS = {
    "EST": gettz("America/New_York"),
    "EDT": gettz("America/New_York"),
    "JST": gettz("Asia/Tokyo"),
}


class EnergyFetcher:
    """Fetcher specialized for Energy and Geopolitical news."""

    async def fetch_rss(self, hours_back=settings.FRESHNESS_WINDOW_HOURS) -> list[dict]:
        items = []
        feeds = [(url, "energy") for url in settings.ENERGY_RSS_FEEDS]

        async def fetch_and_parse(url, market):
            req = urllib.request.Request(url, headers=settings.DEFAULT_HEADERS)
            content = await FetchUtil.safe_fetch_url(req)
            if content:
                try:
                    return self._parse_rss(ET.fromstring(content), hours_back, market, url)
                except Exception as e:
                    logger.error(f"[EnergyPlugin] RSS Parse Error ({url}): {e}")
            return []

        results = await asyncio.gather(*[fetch_and_parse(url, market) for url, market in feeds])
        for res in results:
            items.extend(res)
        return items

    def _parse_rss(self, root, hours_back, market, source_url) -> list[dict]:
        news_items = []
        ns = {"atom": "http://www.w3.org/2005/Atom"}
        entries = root.findall(".//item") or root.findall(".//atom:entry", ns)
        is_atom = not root.findall(".//item")
        now_utc = datetime.now(UTC)
        cutoff_date = now_utc - timedelta(hours=hours_back)
        for entry in entries:
            try:
                if is_atom:
                    link = entry.find("atom:link", ns).get("href")
                    title_el = entry.find("atom:title", ns)
                    title = title_el.text if title_el is not None else ""
                    published = entry.find("atom:published", ns) or entry.find("atom:updated", ns)
                    published = (
                        published.text if published is not None else datetime.now(UTC).isoformat()
                    )
                    summary_el = entry.find("atom:summary", ns) or entry.find("atom:content", ns)
                    summary = summary_el.text if summary_el is not None else ""
                else:
                    link_el = entry.find("link")
                    link = link_el.text if link_el is not None else ""
                    title_el = entry.find("title")
                    title = title_el.text if title_el is not None else ""
                    pub_el = entry.find("pubDate")
                    published = pub_el.text if pub_el is not None else ""
                    d_el = entry.find("description")
                    summary = (d_el.text if d_el is not None else "") or ""

                # Robust parsing with dateutil and UTC awareness
                try:
                    pub_dt = date_parser.parse(published, tzinfos=TZ_INFOS)
                    if pub_dt.tzinfo is None:
                        pub_dt = pub_dt.replace(tzinfo=UTC)

                    if pub_dt < cutoff_date:
                        continue
                except Exception as e:
                    logger.warning(
                        f"[EnergyPlugin] Date filter parse error for {link} (letting through): {e}"
                    )

                news_items.append(
                    {
                        "id": link,
                        "title": title.strip(),
                        "summary": re.sub("<.*?>", "", summary[:500]).strip(),
                        "url": link,
                        "published": published,
                        "category": "Energy",
                        "market": market,
                        "source": source_url,
                    }
                )
            except Exception as e:
                logger.warning(f"[EnergyPlugin] Failed to parse news entry: {e}")
        return news_items


class Plugin(IAyatoPlugin):
    def __init__(self):
        self.fetcher = EnergyFetcher()

    async def run(
        self, container: ServiceContainer, force: bool = False, **kwargs
    ) -> tuple[list[ReportArtifact], list[dict]]:
        logger.info(f"[EnergyPlugin] Starting Discovery Phase. Force Mode: {force}")

        # 0. Discovery Phase (Robust)
        lookback = 48 if force else settings.FRESHNESS_WINDOW_HOURS
        items = await self.fetcher.fetch_rss(hours_back=lookback)

        # --- Emergency Boost Recovery ---
        if not items:
            logger.info(
                "[EnergyPlugin] Live feeds empty. Attempting emergency boost from raw_items..."
            )
            items = await container.database.fetch_raw_items(days=3, limit=50)

        container.metrics_service.metrics["fetched_items"] += len(items)

        logger.info(f"[EnergyPlugin] Fetched {len(items)} raw items.")

        if not items:
            logger.info("[EnergyPlugin] No new energy items found even with recovery.")
            return [], []

        semaphore = asyncio.Semaphore(5)

        async def score_item(item):
            logger.debug(f"[EnergyPlugin] Entering score_item for: {item.get('title')[:30]}")
            async with semaphore:
                # 1. Deduplication Check (Hard-bypassed in force mode)
                is_processed = False
                if not force:
                    is_processed = await container.database.is_processed(item["id"])

                if is_processed:
                    logger.debug(f"[EnergyPlugin] Already processed, skipping: {item.get('id')}")
                    container.metrics_service.metrics["filtered_items"] += 1
                    return None

                await container.database.save_item(
                    item_id=item["id"],
                    source=item["source"],
                    title=item["title"],
                    summary=item["summary"],
                    url=item["url"],
                    published_at=item["published"],
                    raw_metadata=item,
                )

                prompt_tpl = settings._load_prompt(settings.PROMPT_DIR, "energy_score_v1.txt")
                if not prompt_tpl:
                    prompt_tpl = (
                        "Score the following energy news for impact (0-100). "
                        'Return ONLY JSON: {{"score": N, "reason": "S"}}\n'
                        "Title: {title}\nSummary: {summary}"
                    )

                prompt = prompt_tpl.format(title=item["title"], summary=item["summary"])

                try:
                    schema = {
                        "type": "OBJECT",
                        "properties": {
                            "score": {"type": "INTEGER"},
                            "reason": {"type": "STRING"},
                        },
                        "required": ["score", "reason"],
                    }
                    data = await container.gemini_service.call_structured_async(
                        prompt, response_schema=schema, tier="light"
                    )
                    score = data.get("score", 0)
                    reason = data.get("reason", "")

                    await container.database.save_ai_score(
                        item_id=item["id"],
                        model_name=settings.AI_MODEL_LIGHT_TASK[0],
                        score=score,
                        reason=reason,
                        prompt_used="energy_score_v1.txt",
                    )

                    if score >= 0:
                        logger.info(
                            f"[EnergyPlugin] Scored Item: {item['title'][:50]} | Score: {score}"
                        )
                        item["score"] = score
                        item["ai_reason"] = reason
                        item["is_regional_representative"] = False
                        container.metrics_service.metrics["processed_items"] += 1
                        return item
                except Exception as e:
                    logger.error(f"[EnergyPlugin] Error scoring item {item.get('id')}: {e}")
                return None

        # Process scoring tasks concurrently with exception handling
        tasks = [score_item(it) for it in items]
        all_scored_items = await asyncio.gather(*tasks, return_exceptions=True)

        scored_items = []
        for r in all_scored_items:
            if isinstance(r, Exception):
                logger.error(f"[EnergyPlugin] Scoring task failed: {r}")
                container.metrics_service.metrics["failed_items"] += 1
            elif r:
                scored_items.append(r)

        logger.info(f"[EnergyPlugin] Scoring Phase Complete: {len(scored_items)} items scored.")

        # --- Diversity Guard Implementation ---
        source_meta = settings.SOURCE_METADATA

        def get_region(it):
            label = source_meta.get(it.get("source"), "")
            if "(" in label and ")" in label:
                return label.split("(")[-1].split(")")[0]
            return "Global"

        high_items = [it for it in scored_items if it.get("score", 0) >= 80]
        selected_ids = {it["id"] for it in high_items}
        items_by_region = {}
        for it in scored_items:
            region = get_region(it)
            if region not in items_by_region:
                items_by_region[region] = []
            items_by_region[region].append(it)

        for region, r_items in items_by_region.items():
            if not r_items:
                continue
            if not any(it["id"] in selected_ids for it in r_items):
                top_regional = sorted(r_items, key=lambda x: x.get("score", 0), reverse=True)[0]
                top_regional["is_regional_representative"] = True
                high_items.append(top_regional)
                selected_ids.add(top_regional["id"])
                logger.info(
                    f"[EnergyPlugin] Force-including {region}: {top_regional['title'][:50]}"
                )

        high_items = sorted(high_items, key=lambda x: x.get("score", 0), reverse=True)[:12]

        if high_items:
            logger.info(f"[EnergyPlugin] Enrichment for {len(high_items)} items...")

            async def enrich_item(it):
                full_text = await ContentExtractor.extract_full_text(it["url"])
                if full_text:
                    it["full_content"] = full_text[:8000]
                    logger.debug(f"[EnergyPlugin] Enriched: {it['title'][:40]}")
                return it

            high_items = await asyncio.gather(*[enrich_item(it) for it in high_items])

        if not high_items:
            return [], []

        artifacts = await self._generate_artifacts(container, high_items)
        return artifacts, high_items

    async def _generate_artifacts(
        self, container: ServiceContainer, items: list[dict]
    ) -> list[ReportArtifact]:
        data_for_ai = []
        for it in items:
            entry = {
                "title": it["title"],
                "summary": it["summary"],
                "url": it["url"],
                "score": it.get("score"),
                "source": it.get("source"),
                "is_regional_representative": it.get("is_regional_representative", False),
            }
            if "full_content" in it:
                entry["full_content_body"] = it["full_content"]
            data_for_ai.append(entry)

        items_json = json.dumps(data_for_ai, ensure_ascii=False, indent=2)

        async def generate(lang):
            now = datetime.now()
            display_timestamp = now.strftime("%Y-%m-%d %H:%M JST")

            prompt_tpl = settings._load_prompt(settings.PROMPT_DIR, "energy_report_v1.txt")
            if not prompt_tpl:
                prompt = f"Analyze these energy news items in {lang}: {items_json}"
            else:
                prompt = prompt_tpl.format(lang=lang, date_str=display_timestamp, data=items_json)

            report_md = await container.gemini_service.generate_report_async(prompt, tier="heavy")

            ref_section = "\n\n## 参考資料 (Reference Material)\n"
            for it in items:
                ref_section += f"- [{it['title']}]({it['url']})\n"
            report_md += ref_section

            # Closer to finance
            report_md = await AffiliateManager.inject_async(container, report_md, "finance")
            report_md = DisclaimerManager.inject(report_md, lang)

            # --- Dynamic Title Generation ---
            raw_titles_str = "\n".join([f"- {it['title']}" for it in items[:5]])
            ai_title = await container.gemini_service.generate_title_async(
                report_md, lang=lang, raw_titles=raw_titles_str
            )
            if ai_title:
                display_title = ai_title
            else:
                display_title = f"Energy Situation Report - {display_timestamp} ({lang.upper()})"

            # Clean filename: Use timestamp + AI Title
            filename = f"{now.strftime('%Y%m%d-%H%M%S')}-{display_title}-{lang}"
            avg_score = sum([it.get("score", 0) for it in items]) // len(items) if items else 80

            return ReportArtifact(
                title=display_title,
                content=report_md,
                filename=filename,
                category="Energy",
                market="energy",
                score=avg_score,
                language=lang,
            )

        results = await asyncio.gather(generate("en"), generate("jp"))
        return list(results)
