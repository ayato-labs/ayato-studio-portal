import json
import logging
from datetime import datetime, timedelta

from config import settings
from core.interfaces.plugin import IAyatoPlugin, ReportArtifact
from core.service_container import ServiceContainer

logger = logging.getLogger(__name__)


class Plugin(IAyatoPlugin):
    def __init__(self):
        self.run_id = datetime.now().strftime("%Y%m%d_%H%M%S")

    async def run(
        self, container: ServiceContainer, force: bool = False, **kwargs
    ) -> tuple[list[ReportArtifact], list[dict]]:
        now = datetime.now()

        # Guard Clause: Only execute on days divisible by 5
        # (5th, 10th, 15th, 20th, 25th, 30th)
        # AND only in the afternoon (>= 12:00 JST).
        # Bypass scheduled check if force mode is active.
        if not force and (now.day % 5 != 0 or now.hour < 12):
            logger.info(
                f"[WeeklyReviewPlugin] Skipping execution: Not scheduled (Day: {now.day}, Hour: {now.hour})."
            )
            return [], []

        logger.info("[WeeklyReviewPlugin] Starting Synthesis Phase (5-Day Cycle)...")

        # 1. Fetch reports from the past 5 days (Bypass score filter as reports are already curated)
        recent_reports = await container.database.fetch_recent_reports(days=5, language="jp")

        if not recent_reports:
            logger.warning("[WeeklyReviewPlugin] No high-impact reports found.")
            return [], []

        logger.info(f"[WeeklyReviewPlugin] Found {len(recent_reports)} source reports.")

        # 2. Generation Phase
        artifacts = await self._generate_artifacts(container, recent_reports)

        # Empty list for "items" as this is a meta-analysis.
        return artifacts, []

    async def _generate_artifacts(
        self, container: ServiceContainer, reports: list[dict]
    ) -> list[ReportArtifact]:
        # Prepare context data
        context_data = []
        for r in reports:
            context_data.append(
                {
                    "title": r.get("title"),
                    "summary": r.get("summary") or r.get("content_md", "")[:500],
                    "category": r.get("category"),
                }
            )

        reports_json = json.dumps(context_data, ensure_ascii=False, indent=2)

        async def generate(lang):
            nk = datetime.now()
            date_range = (
                f"{(nk - timedelta(days=7)).strftime('%Y-%m-%d')} to {nk.strftime('%Y-%m-%d')}"
            )

            # Load specialized weekly prompt
            prompt_tpl = settings._load_prompt(settings.PROMPT_DIR, "weekly_review_v1.txt")
            if not prompt_tpl:
                # Basic fallback
                prompt = (
                    f"Synthesize a weekly review for {date_range}.\n"
                    f"Report Data: {reports_json}\n"
                    f"Output in {lang}. Target length: 5000 chars."
                )
            else:
                prompt = prompt_tpl.format(lang=lang, date_range=date_range, data=reports_json)

            # Generate long-form report
            report_md = await container.gemini_service.generate_report_async(prompt, tier="heavy")

            # --- Dynamic Title Generation ---
            raw_titles_str = "\n".join([f"- {r['title']}" for r in reports])
            ai_title = await container.gemini_service.generate_title_async(
                report_md,
                lang=lang,
                template_name="title_generation_stock_v1.txt",
                raw_titles=raw_titles_str,
            )
            if ai_title:
                display_title = ai_title
            else:
                display_title = (
                    f"Weekly Intelligence Review - {nk.strftime('%Y-%m-%d')} ({lang.upper()})"
                )

            # Finalize artifact
            # %j is day of year for uniqueness
            filename = f"weekly-review-{nk.strftime('%Y%j')}-{lang}"

            return ReportArtifact(
                title=display_title,
                content=report_md,
                filename=filename,
                category="WeeklyReview",
                market="macro",
                score=90,  # Weekly reviews are high-impact by default
                language=lang,
            )

        jp_artifact = await generate("jp")
        return [jp_artifact]
