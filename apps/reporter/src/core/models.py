from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class AyatoItem(BaseModel):
    """
    Standardized data model for any intelligence item (News, Filing, Tweet, etc.)
    """

    id: str = Field(..., description="Unique ID for the item (e.g., URL or Entry ID)")
    title: str
    summary: str
    url: str
    published_at: str
    source: str
    market: str = "general"  # tech, finance, global
    category: str = "News"
    score: int = 50
    language: str = "jp"

    # AI Analysis results
    ai_analysis: str | None = None
    ai_metadata: dict[str, Any] = Field(default_factory=dict)

    # Metadata for internal tracking
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True


class ReportArtifact(BaseModel):
    """
    Standardized output artifact for plugins.
    """

    title: str
    content: str
    filename: str
    category: str
    market: str
    score: int
    language: str
    metadata: dict[str, Any] = Field(default_factory=dict)
