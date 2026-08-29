from abc import ABC, abstractmethod


class BaseStorage(ABC):
    """Abstract interface for all storage drivers."""

    @abstractmethod
    async def is_processed(self, item_id: str) -> bool:
        pass

    @abstractmethod
    async def save_item(self, item_id: str, source: str, **kwargs):
        pass

    @abstractmethod
    async def save_ai_score(self, item_id: str, score: int, reason: str, **kwargs):
        pass

    @abstractmethod
    async def save_report(
        self,
        item_id: str,
        language: str,
        title: str,
        content_md: str,
        model_name: str,
        category: str = "News",
        market: str = "general",
    ):
        pass

    @abstractmethod
    async def fetch_recent_scored_items(
        self, market: str, days: int = 3, min_score: int = 70
    ) -> list[dict]:
        """Fetches high-quality items from the archive for a specific market/region."""
        pass

    @abstractmethod
    async def fetch_raw_items(self, days: int = 1, limit: int = 50) -> list[dict]:
        """Fetches raw items directly from the database (emergency boost)."""
        pass
