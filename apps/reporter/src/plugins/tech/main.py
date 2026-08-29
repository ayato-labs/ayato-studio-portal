import asyncio
import json
import logging
import re
import urllib.parse
import urllib.request
import warnings
import xml.etree.ElementTree as ET
from datetime import UTC, datetime, timedelta

from dateutil import parser as date_parser
from dateutil.parser import UnknownTimezoneWarning
from dateutil.tz import gettz

from config import settings
from core.interfaces.plugin import IAyatoPlugin, ReportArtifact
from core.service_container import ServiceContainer
from core.utils.affiliate_manager import AffiliateManager
from core.utils.content_extractor import ContentExtractor
from core.utils.disclaimer_manager import DisclaimerManager
from core.utils.fetch_util import FetchUtil

# Suppress dateutil warnings that confuse PowerShell
warnings.filterwarnings("ignore", category=UnknownTimezoneWarning)

logger = logging.getLogger(__name__)

# Timezone Abbreviation Mapping for robust parsing
TZ_INFOS = {
    "EST": gettz("America/New_York"),
    "EDT": gettz("America/New_York"),
    "JST": gettz("Asia/Tokyo"),
}


class TechFetcher:
    """Fetcher specialized for AI, Machine Learning, and Big Tech news."""

    ARXIV_BASE = "https://export.arxiv.org/api/query?"

    async def fetch_arxiv(self, hours_back=settings.FRESHNESS_WINDOW_HOURS) -> list[dict]:
        query = " OR ".join([f"cat:{cat}" for cat in settings.ARXIV_CORE_CATEGORIES])
        url = (
            f"{self.ARXIV_BASE}search_query={urllib.parse.quote(query)}"
            f"&sortBy=submittedDate&sortOrder=descending"
            f"&max_results=50"
        )
        req = urllib.request.Request(url, headers=settings.DEFAULT_HEADERS)
        content = await FetchUtil.safe_fetch_url(req)
        if content:
            try:
                # arXiv return Atom XML directly
                return self._parse_arxiv(ET.fromstring(content), hours_back)
            except Exception as e:
                logger.error(f"[TechFetcher] arXiv Fetch Error: {e}")
        return []

    def _parse_arxiv(self, root, hours_back) -> list[dict]:
        ns = {
            "atom": "http://www.w3.org/2005/Atom",
            "arxiv": "http://arxiv.org/schemas/atom",
        }
        papers = []
        now_utc = datetime.now(UTC)
        cutoff_date = now_utc - timedelta(hours=hours_back)

        for entry in root.findall("atom:entry", ns):
            try:
                published_el = entry.find("atom:published", ns)
                published = published_el.text if published_el is not None else ""

                # Robust parsing with timezone abbreviation support
                pub_dt = date_parser.parse(published, tzinfos=TZ_INFOS)
                if pub_dt.tzinfo is None:
                    pub_dt = pub_dt.replace(tzinfo=UTC)

                if pub_dt < cutoff_date:
                    continue

                # Extract arXiv specific metadata defensively
                journal_ref_el = entry.find("{http://arxiv.org/schemas/atom}journal_ref")
                comment_el = entry.find("{http://arxiv.org/schemas/atom}comment")

                title_el = entry.find("atom:title", ns)
                summary_el = entry.find("atom:summary", ns)
                id_el = entry.find("atom:id", ns)

                title = title_el.text.strip() if title_el is not None else "Untitled"
                summary = summary_el.text.strip() if summary_el is not None else ""
                summary = re.sub(r"\s+", " ", summary)

                paper_id = ""
                if id_el is not None:
                    paper_id = id_el.text.split("/")[-1]

                pdf_link = entry.find('atom:link[@title="pdf"]', ns)
                url = (
                    pdf_link.get("href")
                    if pdf_link is not None
                    else (id_el.text if id_el is not None else "")
                )

                papers.append(
                    {
                        "id": f"arxiv_{paper_id}",
                        "title": title,
                        "summary": summary[:500],
                        "url": url,
                        "published": published,
                        "category": (
                            entry.find("arxiv:primary_category", ns).get("term")
                            if entry.find("arxiv:primary_category", ns) is not None
                            else "unknown"
                        ),
                        "market": "tech",
                        "source": "arxiv",
                        "journal_ref": (
                            journal_ref_el.text
                            if journal_ref_el is not None and journal_ref_el.text
                            else "N/A"
                        ),
                        "comment": (
                            comment_el.text if comment_el is not None and comment_el.text else "N/A"
                        ),
                    }
                )
            except Exception as e:
                logger.warning(f"[TechFetcher] Skipping entry due to parse error: {e}")
                continue
        return papers

    async def fetch_rss(self, hours_back=settings.FRESHNESS_WINDOW_HOURS) -> list[dict]:
        items = []
        feeds = [(url, "tech") for url in settings.TECH_RSS_FEEDS]

        async def fetch_and_parse(url, market):
            req = urllib.request.Request(url, headers=settings.DEFAULT_HEADERS)
            content = await FetchUtil.safe_fetch_url(req)
            if content:
                try:
                    # Defensive decoding for RSS content
                    text_content = content.decode("utf-8-sig", errors="replace")
                    return self._parse_rss(ET.fromstring(text_content), hours_back, market, url)
                except Exception as e:
                    logger.error(f"RSS Parse Error ({url}): {e}")
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
                    link_el = entry.find("atom:link", ns)
                    link = link_el.get("href") if link_el is not None else ""
                    title_el = entry.find("atom:title", ns)
                    title = title_el.text if title_el is not None else ""
                    published_el = entry.find("atom:published", ns)
                    if published_el is None:
                        published_el = entry.find("atom:updated", ns)

                    published = (
                        published_el.text
                        if published_el is not None
                        else datetime.now(UTC).isoformat()
                    )
                    summary_el = entry.find("atom:summary", ns)
                    if summary_el is None:
                        summary_el = entry.find("atom:content", ns)
                    summary = summary_el.text if summary_el is not None else ""
                else:
                    link_el = entry.find("link")
                    link = link_el.text if link_el is not None else ""
                    title_el = entry.find("title")
                    title = title_el.text if title_el is not None else ""
                    published_el = entry.find("pubDate")
                    published = published_el.text if published_el is not None else ""
                    summary_el = entry.find("description")
                    summary = summary_el.text if summary_el is not None else ""

                # Time-Delta Filter (UTC-Aware Robust Pivot)
                try:
                    pub_dt = date_parser.parse(published, tzinfos=TZ_INFOS)
                    if pub_dt.tzinfo is None:
                        pub_dt = pub_dt.replace(tzinfo=UTC)

                    if pub_dt < cutoff_date:
                        continue
                except Exception as e:
                    logger.warning(
                        f"[NewsPlugin] Date filter parse error for {link} (letting through): {e}"
                    )

                news_items.append(
                    {
                        "id": link,
                        "title": title.strip(),
                        "summary": re.sub("<.*?>", "", summary[:500]).strip(),
                        "url": link,
                        "published": published,
                        "category": "Tech",
                        "market": market,
                        "source": source_url,
                    }
                )
            except Exception as e:
                logger.warning(f"[TechPlugin] Failed to parse news entry: {e}")
        return news_items


class Plugin(IAyatoPlugin):
    def __init__(self):
        self.fetcher = TechFetcher()

    async def _get_peer_review_status(self, item, container) -> dict:
        """Determines if a tech item (arXiv) appears peer-reviewed."""
        if item.get("source") != "arxiv":
            return {"is_peer_reviewed": False, "vetted_venue": None}

        # Check for Journal Ref or "accepted at" hints in comments
        comments = item.get("comment", "")
        journal = item.get("journal_ref", "")
        if journal != "N/A" or "accepted" in comments.lower() or "published in" in comments.lower():
            return {
                "is_peer_reviewed": True,
                "vetted_venue": journal if journal != "N/A" else comments,
            }

        # Fallback: LLM vetting
        prompt = (
            f"Based on these arXiv metadata, does this paper appear published "
            f"or accepted in a vetted venue (CVPR, NeurIPS, ICML, etc)?\n"
            f"Journal: {journal}\nComments: {comments}\n"
            f'Return JSON: {{"is_peer_reviewed": bool, "vetted_venue": str_or_null}}'
        )
        schema = {
            "type": "OBJECT",
            "properties": {
                "is_peer_reviewed": {"type": "BOOLEAN"},
                "vetted_venue": {"type": "STRING"},
            },
        }

        try:
            result = await container.gemini_service.call_structured_async(
                prompt, response_schema=schema, tier="light"
            )
            return result
        except Exception as e:
            logger.warning(f"[TechPlugin] LLM fallback for peer-review failed: {e}")
            return {"is_peer_reviewed": False, "vetted_venue": None}

    async def run(
        self, container: ServiceContainer, force: bool = False, **kwargs
    ) -> tuple[list[ReportArtifact], list[dict]]:
        logger.info(f"[TechPlugin] Starting Discovery Phase (Concurrent). Force Mode: {force}")

        # 0. Discovery Phase (Robust)
        lookback = 48 if force else settings.FRESHNESS_WINDOW_HOURS
        arxiv_task = self.fetcher.fetch_arxiv(hours_back=lookback)
        rss_task = self.fetcher.fetch_rss(hours_back=lookback)
        results = await asyncio.gather(arxiv_task, rss_task)
        items = results[0] + results[1]

        # --- Emergency Boost Recovery ---
        if not items:
            logger.info(
                "[TechPlugin] Live feeds empty. Attempting emergency boost from raw_items..."
            )
            items = await container.database.fetch_raw_items(days=3, limit=100)
        container.metrics_service.metrics["fetched_items"] += len(items)

        semaphore = asyncio.Semaphore(5)

        async def score_item(item):
            async with semaphore:
                # 1. Deduplication Check (Hard-bypassed in force mode)
                is_processed = False
                if not force:
                    is_processed = await container.database.is_processed(item["id"])

                if is_processed:
                    container.metrics_service.metrics["filtered_items"] += 1
                    logger.info(f"[TechPlugin] Already processed, skipping: {item['id']}")
                    return None

                # 2. Keyword Filter (Conditional in force mode)
                rejected_by_keyword = any(
                    kw.lower() in item["title"].lower() for kw in settings.NO_GO_KEYWORDS
                )
                if not force and rejected_by_keyword:
                    container.metrics_service.metrics["filtered_items"] += 1
                    logger.info(f"[TechPlugin] Rejected by keyword: {item['title'][:40]}")
                    return None

                # 2. Save raw item for audit
                try:
                    await container.database.save_item(
                        item_id=item["id"],
                        source=item["source"],
                        title=item["title"],
                        summary=item["summary"],
                        url=item["url"],
                        published_at=item["published"],
                        raw_metadata=item,
                    )
                except Exception as e:
                    if force:
                        logger.debug(f"[TechPlugin] Note: Item {item['id']} already in DB.")
                    else:
                        raise e

                # 3. AI Scoring
                prompt_tpl = settings._load_prompt(settings.PROMPT_DIR, "tech_score_v1.txt")
                if not prompt_tpl:
                    prompt_tpl = (
                        "Score the AI research for impact (0-100). "
                        'Return ONLY JSON: {{"score": N, "reason": "str"}}\n'
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
                        prompt_used="tech_score_v1.txt",
                    )

                    if score >= 0:
                        item["score"] = score
                        item["ai_reason"] = reason
                        item["is_regional_representative"] = False
                        if item.get("source") == "arxiv":
                            item["trust_info"] = await self._get_peer_review_status(item, container)
                        container.metrics_service.metrics["processed_items"] += 1
                        return item
                except Exception as e:
                    logger.error(f"Error scoring item {item.get('id')}: {e}", exc_info=True)
                return None

        # Process scoring tasks concurrently with exception handling
        tasks = [score_item(it) for it in items]
        all_scored_items = await asyncio.gather(*tasks, return_exceptions=True)

        # Filter results: successfully scored items only
        scored_items = []
        for r in all_scored_items:
            if isinstance(r, Exception):
                logger.error(f"[TechPlugin] Scoring task failed: {r}")
                container.metrics_service.metrics["failed_items"] += 1
            elif r:
                scored_items.append(r)

        logger.info(f"[TechPlugin] Scoring Phase Complete: {len(scored_items)} items scored.")

        # --- Diversity Guard 2.2 Implementation (7 Strict Buckets) ---
        source_meta = settings.SOURCE_METADATA

        def get_region_bucket(it):
            label = source_meta.get(it.get("source"), "")
            if "(日本)" in label:
                return "Japan"
            if "(米国)" in label:
                return "USA"
            if any(kw in label for kw in ["(ドイツ)", "(フランス)", "(イギリス)", "(欧州)"]):
                return "Europe"
            if any(kw in label for kw in ["(中国)", "(香港)"]):
                return "China"
            if any(kw in label for kw in ["(韓国)", "(インド)", "(マレーシア)", "(東南アジア)"]):
                return "Asia (ex-JP/CN)"
            if any(kw in label for kw in ["(サウジアラビア)", "(中東)"]):
                return "Middle East"
            return "Global / Other"

        # 1. Primary Selection (Relative Ranking)
        high_impact_items = [it for it in scored_items if it.get("score", 0) >= 30]
        selected_ids = {it["id"] for it in high_impact_items}
        logger.info(
            f"[TechPlugin] Selection Phase: {len(high_impact_items)} high-impact items found (>=30 score). Total scored items: {len(scored_items)}"
        )

        # 2. Regional Representative Selection (Guaranteed at least one per region if exists)
        buckets = [
            "Japan",
            "USA",
            "Europe",
            "China",
            "Asia (ex-JP/CN)",
            "Middle East",
            "Global / Other",
        ]
        items_by_bucket = {b: [] for b in buckets}
        for it in scored_items:
            bucket = get_region_bucket(it)
            items_by_bucket[bucket].append(it)

        for bucket in buckets:
            b_items = items_by_bucket[bucket]
            if not b_items:
                continue

            # Ensure at least the top one of the bucket is included if nothing else from it is selected
            if not any(it["id"] in selected_ids for it in b_items):
                top_regional = sorted(b_items, key=lambda x: x.get("score", 0), reverse=True)[0]
                top_regional["is_regional_representative"] = True
                high_impact_items.append(top_regional)
                selected_ids.add(top_regional["id"])
                logger.info(
                    f"[TechPlugin] Diversity Guard: Budget Selection for {bucket}: {top_regional['title'][:50]}"
                )

        # 3. Last Resort Fallback: If still nothing selected, pick top 3 items overall
        if not high_impact_items and scored_items:
            logger.info(
                "[TechPlugin] Last Resort: No high impact or regional news. Picking top 3 overall."
            )
            top_three = sorted(scored_items, key=lambda x: x.get("score", 0), reverse=True)[:3]
            for it in top_three:
                it["is_emergency_inclusion"] = True
                high_impact_items.append(it)
                selected_ids.add(it["id"])

        # Final consolidation: Top 15 total items (High Impact + Regional)
        final_items = sorted(high_impact_items, key=lambda x: x.get("score", 0), reverse=True)[:15]

        if not final_items:
            logger.warning(
                "[TechPlugin] ABORT: Selection phase resulted in 0 items. No report will be generated."
            )
            return [], []

        # Enrichment Phase (Full Text)
        async def enrich_item(it):
            full_text = await ContentExtractor.extract_full_text(it["url"])
            if full_text:
                it["full_content"] = full_text[:8000]
            return it

        enriched_items = await asyncio.gather(*[enrich_item(it) for it in final_items])

        logger.info(f"[TechPlugin] Starting generation for {len(enriched_items)} enriched items...")
        artifacts = await self._generate_artifacts(container, enriched_items)
        logger.info(f"[TechPlugin] Generated {len(artifacts)} ReportArtifacts.")
        return artifacts, enriched_items

    async def _generate_artifacts(
        self, container: ServiceContainer, items: list[dict]
    ) -> list[ReportArtifact]:
        items_json = json.dumps(items, ensure_ascii=False, indent=2)

        async def generate(lang):
            now = datetime.now(UTC)
            display_timestamp = now.strftime("%Y-%m-%d %H:%M JST")

            prompt_tpl = settings._load_prompt(settings.PROMPT_DIR, "tech_report_v1.txt")
            if not prompt_tpl:
                prompt = self._get_prompt(lang, display_timestamp, items_json)
            else:
                prompt_data = []
                for it in items:
                    raw_source = it.get("source", "UNKNOWN")
                    source_label = settings.SOURCE_METADATA.get(raw_source, raw_source)
                    entry = {
                        "title": it["title"],
                        "summary": it["summary"],
                        "url": it["url"],
                        "score": it.get("score"),
                        "source": raw_source,
                        "source_label": source_label,
                        "is_regional_representative": it.get("is_regional_representative", False),
                    }
                    if "full_content" in it:
                        entry["full_content_body"] = it["full_content"]
                    prompt_data.append(entry)

                data_str = json.dumps(prompt_data, ensure_ascii=False, indent=2)
                prompt = prompt_tpl.format(lang=lang, date_str=display_timestamp, data=data_str)

            report_md = await container.gemini_service.generate_report_async(prompt, tier="heavy")

            # Programmatic Reference Injection
            ref_section = "\n\n## 参考資料 (Reference Material)\n"
            for it in items:
                ref_section += f"- [{it['title']}]({it['url']})\n"
            report_md += ref_section

            report_md = await AffiliateManager.inject_async(container, report_md, "tech")
            report_md = DisclaimerManager.inject(report_md, lang)

            # --- Dynamic Title Generation ---
            raw_titles_str = "\n".join([f"- {it['title']}" for it in items[:5]])
            ai_title = await container.gemini_service.generate_title_async(
                report_md, lang=lang, raw_titles=raw_titles_str
            )
            if ai_title:
                display_title = ai_title
            else:
                display_title = f"Intelligence Snapshot - {display_timestamp} ({lang.upper()})"

            # Clean filename: Use timestamp + AI Title
            filename = f"{now.strftime('%Y%m%d-%H%M%S')}-{display_title}-{lang}"
            avg_score = sum([it.get("score", 0) for it in items]) // len(items) if items else 80

            return ReportArtifact(
                title=display_title,
                content=report_md,
                filename=filename,
                category="Tech",
                market="tech",
                score=avg_score,
                language=lang,
            )

        jp_artifact = await generate("jp")
        return [jp_artifact]

    def _get_prompt(self, lang, date_str, data):
        """Fallback prompt if text file is missing."""
        return (
            f"You are a top-tier tech analyst. Generate a detail report in {lang}.\n"
            f"Date: {date_str}\nData: {data}\n"
            f"Focus on business impact and technical novelty."
        )
