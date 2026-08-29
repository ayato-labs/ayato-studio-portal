import asyncio
import logging

from core.interfaces.plugin import ReportArtifact

logger = logging.getLogger(__name__)


class OutputHandler:
    """
    Ayato Intelligence Engine - Output Orchestrator.
    Handles artifact sanitization, persistent storage, and final distribution.
    """

    def __init__(self, container):
        self.container = container

    async def process_artifacts(self, artifacts: list[ReportArtifact]):
        """Processes and distributes artifacts asynchronously."""
        if not artifacts:
            logger.debug("[OutputHandler] No artifacts to process.")
            return

        tasks = [self._process_single_artifact(a) for a in artifacts]
        await asyncio.gather(*tasks)

    async def _process_single_artifact(self, artifact: ReportArtifact):
        """Helper to process a single artifact asynchronously."""
        try:
            # 0. Smart Sanitization (Refinement via AI if necessary)
            try:
                is_safe, violations = self.container.compliance_validator.validate(artifact.content)
                if not is_safe:
                    logger.warning(
                        f"[OutputHandler] Compliance violations for {artifact.title}: {violations}. Refining via AI..."
                    )
                    artifact.content = await self._ai_refine_compliance(
                        artifact.content, artifact.language
                    )
            except Exception as comp_err:
                logger.warning(
                    f"[OutputHandler] Compliance check unavailable ({comp_err}). Proceeding without validation."
                )

            # 1. Database & External Persistence
            # Ensure DB save is awaited and confirmed
            logger.info(f"[OutputHandler] Saving to DB: {artifact.title}")
            await self.container.database.save_report(
                title=artifact.title,
                content_md=artifact.content,
                category=artifact.category,
                market=artifact.market,
                score=artifact.score,
                language=artifact.language,
                run_id=getattr(self.container, "run_id", "manual"),
                metadata={"filename": artifact.filename},
            )

            logger.info(f"DEBUG: Successfully saved report: '{artifact.title}'")
            self.container.metrics_service.metrics["generated_reports"] += 1

            logger.info(
                f"[OutputHandler] Successfully processed and persistent artifact: {artifact.title}"
            )
        except Exception as e:
            logger.error(f"[OutputHandler] Failed to process artifact {artifact.title}: {e}")
            import traceback

            logger.error(traceback.format_exc())

    async def _ai_refine_compliance(self, content: str, lang: str) -> str:
        """Uses Gemini to refine content if compliance violations are detected."""
        prompt = (
            f"You are a compliance officer. The following information "
            f"news summary in {lang} contains potential sensitivity "
            f"or formatting issues. Please rewrite it for strict "
            f"neutrality and professional clarity while keeping "
            f"the core facts intact.\n\n"
            f"ORIGINAL CONTENT:\n{content}"
        )

        try:
            # Use 'light' tier for quick refinement
            refined_content = await self.container.gemini_service.generate_report_async(
                prompt, tier="light"
            )
            return refined_content.strip()
        except Exception as e:
            logger.error(
                f"[OutputHandler] AI Refinement failed: {e}. Falling back to simple sanitize."
            )
            return self.container.compliance_validator.sanitize(content)
