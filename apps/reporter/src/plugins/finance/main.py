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


class FinanceFetcher:
    """Fetcher specialized for Macro-Economic and Money Supply news."""

    async def fetch_rss(self, hours_back=settings.FRESHNESS_WINDOW_HOURS) -> list[dict]:
        items = []
        feeds = [(url, "finance") for url in settings.FINANCE_RSS_FEEDS]

        async def fetch_and_parse(url, market):
            req = urllib.request.Request(url, headers=settings.DEFAULT_HEADERS)
            content = await FetchUtil.safe_fetch_url(req)
            if content:
                try:
                    return self._parse_rss(ET.fromstring(content), hours_back, market, url)
                except Exception as e:
                    logger.error(f"[FinancePlugin] RSS Parse Error ({url}): {e}")
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
                    link_node = entry.find("atom:link", ns)
                    link = link_node.get("href") if link_node is not None else ""
                    title_node = entry.find("atom:title", ns)
                    title = title_node.text if title_node is not None else "No Title"
                    published_el = entry.find("atom:published", ns) or entry.find(
                        "atom:updated", ns
                    )
                    published = (
                        published_el.text
                        if published_el is not None
                        else datetime.now(UTC).isoformat()
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
                        f"[FinancePlugin] Date filter parse error for {link} (letting through): {e}"
                    )

                news_items.append(
                    {
                        "id": link,
                        "title": title.strip(),
                        "summary": re.sub("<.*?>", "", summary[:500]).strip(),
                        "url": link,
                        "published": published,
                        "category": "Finance",
                        "market": market,
                        "source": source_url,
                    }
                )
            except Exception as e:
                logger.warning(f"[FinancePlugin] Failed to parse news entry: {e}")
        return news_items

    async def fetch_market_data(self) -> dict:
        """Fetches major index data and specific tickers."""
        tickers = {"AAPL": "Apple", "TSLA": "Tesla", "NVDA": "Nvidia"}
        data = {}

        async def fetch_ticker_full(symbol, name):
            # 1. Fetch Current Quote
            q_url = f"https://query1.finance.yahoo.com/v7/finance/quote?symbols={urllib.parse.quote(symbol)}"
            # 2. Fetch 1-Month History for Stats
            h_url = f"https://query1.finance.yahoo.com/v8/finance/chart/{urllib.parse.quote(symbol)}?range=1mo&interval=1d"

            headers = {"User-Agent": "Mozilla/5.0"}
            req_q = urllib.request.Request(q_url, headers=headers)
            req_h = urllib.request.Request(h_url, headers=headers)

            res_q, res_h = await asyncio.gather(
                FetchUtil.safe_fetch_url(req_q), FetchUtil.safe_fetch_url(req_h)
            )

            ticker_data = {"name": name}

            if res_q:
                try:
                    raw = json.loads(res_q)
                    quote = raw["quoteResponse"]["result"][0]
                    ticker_data.update(
                        {
                            "price": quote.get("regularMarketPrice"),
                            "change_pct": (quote.get("regularMarketChangePercent")),
                            "volume": quote.get("regularMarketVolume"),
                        }
                    )
                except Exception as e:
                    logger.error(f"[FinancePlugin] Quote Parse Error ({symbol}): {e}")

            if res_h:
                try:
                    raw = json.loads(res_h)
                    volumes = raw["chart"]["result"][0]["indicators"]["quote"][0]["volume"]
                    if volumes:
                        import statistics

                        ticker_data["vol_avg_1m"] = statistics.mean(volumes)
                        ticker_data["vol_median_1m"] = statistics.median(volumes)
                        if ticker_data.get("volume"):
                            ticker_data["rvol"] = (
                                ticker_data["volume"] / ticker_data["vol_median_1m"]
                            )
                except Exception as e:
                    logger.error(f"[FinancePlugin] History Parse Error ({symbol}): {e}")

            return symbol, ticker_data

        results = await asyncio.gather(*[fetch_ticker_full(s, n) for s, n in tickers.items()])
        for symbol, res in results:
            data[symbol] = res

        logger.info(f"[FinancePlugin] Market Data Fetched: {json.dumps(data)}")
        return data

    async def fetch_macro_data(self) -> dict:
        """Fetches Macro-economic data from FRED (Federal Reserve)."""
        series = {
            "WALCL": "Fed Total Assets",
            "M2SL": "M2 Money Supply",
            "T10Y2Y": "10Y-2Y Treasury Spread",
        }
        fallbacks = {
            "WALCL": {"value": 7500, "change": -0.2},
            "M2SL": {"value": 20800, "change": 0.1},
            "T10Y2Y": {"value": -0.15, "change": 0.05},
        }
        data = {}

        async def fetch_series(series_id, label):
            if not settings.FRED_API_KEY:
                logger.warning("[FinancePlugin] FRED_API_KEY not found. Skipping macro data fetch.")
                return series_id, fallbacks.get(series_id)

            key = settings.FRED_API_KEY
            url = (
                f"https://api.stlouisfed.org/fred/series/observations"
                f"?series_id={series_id}&api_key={key}&file_type=json"
                f"&sort_order=desc&limit=2"
            )
            req = urllib.request.Request(url, headers=settings.DEFAULT_HEADERS)
            content = await FetchUtil.safe_fetch_url(req)

            if not content:
                logger.warning(f"[FinancePlugin] FRED Fetch Failed for {series_id}.")
                fb = fallbacks.get(series_id)
                if fb:
                    fb["unit"] = "Billions of Dollars"
                return series_id, fb

            try:
                raw = json.loads(content)
                obs = raw.get("observations", [])
                if len(obs) < 2:
                    return series_id, fallbacks.get(series_id)

                last_row = obs[0]
                prev_row = obs[1]

                latest_val = float(last_row["value"])
                prev_val = float(prev_row["value"])
                change_pct = ((latest_val - prev_val) / prev_val) * 100 if prev_val != 0 else 0

                return series_id, {
                    "label": label,
                    "value": latest_val,
                    "change_pct": change_pct,
                    "unit": "Billions of Dollars",
                }
            except Exception as e:
                logger.error(f"[FinancePlugin] Macro Parse Error ({series_id}): {e}")
                return series_id, fallbacks.get(series_id)

        tks = [fetch_series(sid, label) for sid, label in series.items()]
        results = await asyncio.gather(*tks)
        for sid, res in results:
            data[sid] = res
        return data


class Plugin(IAyatoPlugin):
    def __init__(self):
        self.fetcher = FinanceFetcher()

    async def run(
        self, container: ServiceContainer, force: bool = False, **kwargs
    ) -> tuple[list[ReportArtifact], list[dict]]:
        logger.info(f"[FinancePlugin] Starting Liquidity Discovery. Force Mode: {force}")

        # 0. Discovery Phase (Robust)
        lookback = 48 if force else settings.FRESHNESS_WINDOW_HOURS

        # Parallel fetch
        items_task = self.fetcher.fetch_rss(hours_back=lookback)
        market_data_task = self.fetcher.fetch_market_data()
        macro_data_task = self.fetcher.fetch_macro_data()

        items, market_data, macro_data = await asyncio.gather(
            items_task, market_data_task, macro_data_task
        )

        # --- Emergency Boost Recovery ---
        if not items:
            logger.info(
                "[FinancePlugin] Live feeds empty. Attempting emergency boost from raw_items..."
            )
            items = await container.database.fetch_raw_items(days=1, limit=30)

        container.metrics_service.metrics["fetched_items"] += len(items)

        if not items and not market_data and not macro_data:
            logger.info("[FinancePlugin] No new data found even with recovery.")
            return [], []

        semaphore = asyncio.Semaphore(5)

        async def score_item(item):
            async with semaphore:
                if await container.database.is_processed(item["id"]):
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

                boost = 0
                keywords = [
                    "liquidity",
                    "fed",
                    "central bank",
                    "inflation",
                ]
                if any(
                    kw in item["title"].lower() or kw in item["summary"].lower() for kw in keywords
                ):
                    boost = 10

                # 3. AI Scoring
                prompt_tpl = settings._load_prompt(settings.PROMPT_DIR, "finance_score_v1.txt")
                if not prompt_tpl:
                    prompt_tpl = (
                        "Score the following macro finance news for impact (0-100). "
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
                    score = min(100, data.get("score", 0) + boost)
                    reason = data.get("reason", "")

                    await container.database.save_ai_score(
                        item_id=item["id"],
                        model_name=settings.AI_MODEL_LIGHT_TASK[0],
                        score=score,
                        reason=reason,
                        prompt_used="finance_score_v1.txt",
                    )

                    if score >= 0:
                        item["score"] = score
                        item["ai_reason"] = reason
                        item["is_regional_representative"] = False
                        container.metrics_service.metrics["processed_items"] += 1
                        return item
                except Exception as e:
                    logger.error(f"[FinancePlugin] Error scoring item {item.get('id')}: {e}")
                return None

        # Process scoring tasks concurrently with exception handling
        tasks = [score_item(item) for item in items]
        all_scored_items = await asyncio.gather(*tasks, return_exceptions=True)

        scored_items = []
        for r in all_scored_items:
            if isinstance(r, Exception):
                logger.error(f"[FinancePlugin] Scoring task failed: {r}")
                container.metrics_service.metrics["failed_items"] += 1
            elif r:
                scored_items.append(r)

        logger.info(f"[FinancePlugin] Scoring Phase Complete: {len(scored_items)} items scored.")

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

        for _region, r_items in items_by_region.items():
            if not r_items:
                continue
            if not any(it["id"] in selected_ids for it in r_items):
                top_regional = sorted(r_items, key=lambda x: x.get("score", 0), reverse=True)[0]
                top_regional["is_regional_representative"] = True
                high_items.append(top_regional)
                selected_ids.add(top_regional["id"])

        high_items = sorted(high_items, key=lambda x: x.get("score", 0), reverse=True)[:12]

        if high_items:
            logger.info(f"[FinancePlugin] Enrichment for {len(high_items)} items...")

            async def enrich_item(it):
                full_text = await ContentExtractor.extract_full_text(it["url"])
                if full_text:
                    it["full_content"] = full_text[:8000]
                return it

            high_items = await asyncio.gather(*[enrich_item(it) for it in high_items])

        artifacts = await self._generate_artifacts(container, high_items, market_data, macro_data)
        return artifacts, high_items

    async def _generate_artifacts(
        self,
        container: ServiceContainer,
        items: list[dict],
        market_data: dict,
        macro_data: dict,
    ) -> list[ReportArtifact]:
        combined_data = {
            "news": [],
            "market_data": market_data,
            "macro_data": macro_data,
        }
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
            combined_data["news"].append(entry)

        data_json = json.dumps(combined_data, ensure_ascii=False, indent=2)

        async def generate(lang):
            now = datetime.now()
            display_timestamp = now.strftime("%Y-%m-%d %H:%M JST")

            prompt_tpl = settings._load_prompt(settings.PROMPT_DIR, "finance_report_v1.txt")
            if not prompt_tpl:
                prompt = f"Analyze these macro finance items in {lang}: {data_json}"
            else:
                prompt = prompt_tpl.format(lang=lang, date_str=display_timestamp, data=data_json)

            report_md = await container.gemini_service.generate_report_async(prompt, tier="heavy")

            ref_section = "\n\n## 参考資料 (Reference Material)\n"
            for it in items:
                ref_section += f"- [{it['title']}]({it['url']})\n"
            report_md += ref_section

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
                display_title = (
                    f"Money & Liquidity Snapshot - {display_timestamp} ({lang.upper()})"
                    if lang == "en"
                    else f"金融・流動性概況 - {display_timestamp} (JP)"
                )

            # Clean filename: Use timestamp + AI Title
            filename = f"{now.strftime('%Y%m%d-%H%M%S')}-{display_title}-{lang}"
            avg_score = sum([it.get("score", 0) for it in items]) // len(items) if items else 80

            return ReportArtifact(
                title=display_title,
                content=report_md,
                filename=filename,
                category="Finance",
                market="finance",
                score=avg_score,
                language=lang,
            )

        results = await asyncio.gather(generate("en"), generate("jp"))
        return list(results)
