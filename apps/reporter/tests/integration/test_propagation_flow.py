from unittest.mock import AsyncMock, patch


async def test_x_integration_flow(container):
    """
    Xの投稿フローの結合テスト。
    GeminiとDBはモック化し、XのAPIクライアントもモック化する。
    """
    # 準備
    mock_gemini = AsyncMock()
    mock_gemini.generate_report_async.return_value = "AI Summarized Content"
    container.gemini_service = mock_gemini

    mock_db = AsyncMock()
    container.database = mock_db

    # Xクライアントのモック化 (tweepy.Client)
    with patch("tweepy.Client") as mock_client_class:
        mock_client = mock_client_class.return_value
        container.x_service.client = mock_client

        items = [
            {"id": "1", "title": "Good News", "summary": "Sum", "score": 90},
            {"id": "2", "title": "Bad News", "summary": "Sum", "score": 10},  # 閾値以下
        ]

        # 実行
        await container.x_service.execute_top_posts(items, limit=1)

        # 検証
        # 1. Geminiが呼ばれたか
        mock_gemini.generate_report_async.assert_called_once()
        # 2. Xの投稿APIが呼ばれたか
        mock_client.create_tweet.assert_called_once()
        # 3. DBログが保存されたか
        mock_db.save_sns_log.assert_called_once()


async def test_output_handler_orchestration(container):
    """
    OutputHandlerがDB保存を正しくオーケストレーションしているか。
    """
    mock_db = AsyncMock()
    container.database = mock_db

    from core.interfaces.plugin import ReportArtifact
    from core.output_handler import OutputHandler

    handler = OutputHandler(container)
    artifact = ReportArtifact(
        title="Test Report",
        content="## Content",
        filename="test-file",
        category="Tech",
        market="tech",
        score=95,
        language="jp",
    )

    # 実行
    await handler.process_artifacts([artifact])

    # 検証
    mock_db.save_report.assert_called_once()
