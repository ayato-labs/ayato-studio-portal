from dataclasses import dataclass
from typing import TYPE_CHECKING, Any, Protocol

if TYPE_CHECKING:
    from core.service_container import ServiceContainer


@dataclass
class ReportArtifact:
    """Standardized report output from a plugin."""

    title: str
    content: str
    filename: str
    category: str
    market: str
    score: int = 0
    language: str = "jp"
    metadata: dict[str, Any] = None


class IAyatoPlugin(Protocol):
    """Protocol that all Ayato Reporter plugins must implement."""

    async def run(
        self, context: "ServiceContainer", force: bool = False, **kwargs
    ) -> tuple[list[ReportArtifact], list[dict]]:
        """
        Runs the plugin and returns:
        1. A list of ReportArtifact objects for persistence and reporting.
        2. A list of raw scored items (dicts) for SNS propagation in the current run.
        """
        ...
