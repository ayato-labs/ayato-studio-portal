import pytest
from unittest.mock import AsyncMock, MagicMock
from plugins.global_news.main import GlobalNewsPlugin


@pytest.mark.asyncio
async def test_global_news_plugin_curation():
    plugin = GlobalNewsPlugin()

    # Mock Context and Services
    mock_context = MagicMock()
    mock_storage = MagicMock()
    mock_storage.is_news_url_processed = AsyncMock(return_value=False)
    mock_storage.save_ai_news_bulk = AsyncMock(return_value=2)
    mock_context.database = mock_storage

    mock_gemini = MagicMock()
    mock_gemini.curate_ai_news_batch = AsyncMock(return_value=[
        {"id": 0, "adopt": True, "category": "Models"},
        {"id": 1, "adopt": False, "category": "None"},
        {"id": 2, "adopt": True, "category": "Research"},
    ])
    mock_context.gemini_service = mock_gemini

    # Mock _fetch_single_feed
    plugin._fetch_single_feed = AsyncMock(return_value=[
        {
            "title": "OpenAI Launches GPT-5 Mini",
            "url": "https://example.com/gpt-5-mini",
            "source": "OpenAI Blog",
            "summary": "New lightweight model",
            "published_at": "2026-08-29T00:00:00Z",
        },
        {
            "title": "Generic Unrelated Tech News",
            "url": "https://example.com/other-tech",
            "source": "Generic Tech",
            "summary": "Some gossip",
            "published_at": "2026-08-29T00:00:00Z",
        },
        {
            "title": "Novel Reasoning Benchmark on arXiv",
            "url": "https://arxiv.org/abs/2608.12345",
            "source": "arXiv cs.AI",
            "summary": "Deep reasoning evaluation",
            "published_at": "2026-08-29T00:00:00Z",
        },
    ])
    plugin._load_feeds = MagicMock(return_value=["https://example.com/rss"])

    reports, items = await plugin.run(mock_context)

    assert len(items) == 2
    assert items[0]["title"] == "OpenAI Launches GPT-5 Mini"
    assert items[0]["category"] == "Models"
    assert items[1]["title"] == "Novel Reasoning Benchmark on arXiv"
    assert items[1]["category"] == "Research"
    mock_storage.save_ai_news_bulk.assert_called_once()
