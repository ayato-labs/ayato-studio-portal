from datetime import datetime
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from core.storage.supabase_storage import SupabaseStorage
from plugins.weekly_review.main import Plugin


@pytest.mark.asyncio
async def test_supabase_fetch_recent_reports_query_fix():
    """
    SupabaseStorage.fetch_recent_reports が、
    ai_scores との JOIN を含まずに正しいクエリを発行するか検証。
    """
    storage = SupabaseStorage("https://example.com", "fake_key")
    storage._request = AsyncMock()
    storage._request.return_value.json.return_value = []

    await storage.fetch_recent_reports(days=5, language="jp")

    # _request が呼ばれた際の引数を検証
    args, kwargs = storage._request.call_args
    params = kwargs.get("params", {})

    # 修正後のクエリに ai_scores が含まれていないことを確認
    assert "ai_scores" not in params.get("select", "")
    assert "ai_scores.score" not in params
    # 必要なカラムが含まれていることを確認
    assert "title" in params.get("select", "")
    assert "generated_at" in params.get("select", "")


@pytest.mark.asyncio
async def test_weekly_review_force_mode_bypass():
    """
    WeeklyReviewPlugin が force=True の場合に、
    日付のガード条件をバイパスして実行されるか検証。
    """
    plugin = Plugin()
    container = MagicMock()
    container.database.fetch_recent_reports = AsyncMock(return_value=[])

    # force=False の場合(今日が5の倍数日でなければスキップされるはず)
    # ※今日がたまたま5の倍数日だと失敗するので、モックで時間を固定するか、挙動で判断
    with patch("plugins.weekly_review.main.datetime") as mock_date:
        # 5の倍数ではない日に設定 (2026-05-02)
        mock_date.now.return_value = datetime(2026, 5, 2, 10, 0)

        # 通常実行
        artifacts, items = await plugin.run(container, force=False)
        assert artifacts == []
        container.database.fetch_recent_reports.assert_not_called()

        # Force実行
        artifacts, items = await plugin.run(container, force=True)
        # データベースが呼ばれているか(ガードを抜けたか)を確認
        container.database.fetch_recent_reports.assert_called_once()


@pytest.mark.asyncio
async def test_weekly_review_dynamic_title_generation():
    """
    WeeklyReviewPlugin が生成後にタイトルの自動生成を呼び出すか検証。
    """
    plugin = Plugin()
    container = MagicMock()

    # 模擬データ
    container.database.fetch_recent_reports = AsyncMock(
        return_value=[{"title": "Report 1", "content_md": "Content 1", "category": "Tech"}]
    )
    container.gemini_service.generate_report_async = AsyncMock(
        return_value="Weekly Summary Content"
    )
    container.gemini_service.generate_title_async = AsyncMock(return_value="Catchy Title via AI")

    with patch("plugins.weekly_review.main.datetime") as mock_date:
        mock_date.now.return_value = datetime(2026, 5, 5, 13, 0)  # 実行可能日

        artifacts, items = await plugin.run(container, force=False)

        assert len(artifacts) > 0
        # タイトルが AI によって生成されたものになっているか確認
        assert artifacts[0].title == "Catchy Title via AI"
        container.gemini_service.generate_title_async.assert_called()
