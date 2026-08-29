from unittest.mock import AsyncMock, MagicMock

from core.engine import IntelligenceEngine


async def test_full_system_run_mocked(container):
    """
    プラグイン実行からSNS投稿までの全ユーザーフローをモックで検証。
    """
    engine = IntelligenceEngine(container)

    # 1. モックの設定
    # データベース
    container.database = AsyncMock()
    container.database.is_processed.return_value = False

    # Gemini
    container.gemini_service = AsyncMock()
    container.gemini_service.generate_report_async.return_value = (
        "## Structured Intelligence Report\nAI Analysis Content."
    )
    container.gemini_service.generate_title_async.return_value = "AI Generated Catchy Title"
    container.gemini_service.call_structured_async.return_value = {
        "score": 95,
        "reason": "High impact",
    }

    # SNS
    container.x_service = AsyncMock()
    container.bluesky_service = AsyncMock()
    container.hatena_service = AsyncMock()
    container._github_service = AsyncMock()

    # PluginManagerのモック化
    from core.interfaces.plugin import ReportArtifact

    mock_pm = MagicMock()
    mock_pm.get_all_manifests.return_value = [{"id": "tech"}]

    mock_tech_plugin = MagicMock()
    artifact = ReportArtifact(
        title="Test Report",
        content="## Content",
        filename="test-file",
        category="Tech",
        market="tech",
        score=95,
        language="jp",
    )
    scored_item = {"id": "tech-1", "url": "http://tech.com", "title": "Tech News", "score": 95}
    mock_tech_plugin.return_value.run = AsyncMock(return_value=([artifact], [scored_item]))

    mock_pm.load_plugin.return_value = mock_tech_plugin
    container.plugin_manager = mock_pm

    # 3. 実行
    await engine.execute(plugin_id="tech", force=True)

    # 4. 全工程の検証
    # - DBに保存されたか
    assert container.database.save_report.called
    # - Geminiでレポート生成されたか
    assert container.gemini_service.generate_report_async.called
    # - はてなブログに投稿されたか
    assert container.hatena_service.post_combined_digest.called
    # - SNS(X)に波及したか
    assert container.x_service.execute_top_posts.called
    # - SNS(Bluesky)に波及したか
    assert container.bluesky_service.execute_top_posts.called


async def test_system_error_handling(container):
    """
    カオス・テスト: プラグインが例外を投げた場合のシステムの堅牢性。
    一部のプラグインが失敗しても他が継続されるか。
    """
    # モックの設定
    container.database = AsyncMock()
    container.database.is_processed.return_value = False
    container.gemini_service = AsyncMock()
    container.x_service = AsyncMock()
    container.bluesky_service = AsyncMock()
    container.hatena_service = AsyncMock()
    container._github_service = AsyncMock()

    # PluginManagerのモック化
    mock_pm = MagicMock()
    mock_pm.get_all_manifests.return_value = [{"id": "tech"}, {"id": "weekly"}]

    mock_tech_plugin = MagicMock()
    mock_tech_run = AsyncMock(return_value=([], []))
    mock_tech_plugin.return_value.run = mock_tech_run

    mock_weekly_plugin = MagicMock()
    mock_weekly_run = AsyncMock(side_effect=Exception("Critical Weekly API Failure"))
    mock_weekly_plugin.return_value.run = mock_weekly_run

    def load_plugin_side_effect(plugin_id):
        if plugin_id == "tech":
            return mock_tech_plugin
        elif plugin_id == "weekly":
            return mock_weekly_plugin
        raise ValueError(f"Unknown plugin {plugin_id}")

    mock_pm.load_plugin.side_effect = load_plugin_side_effect
    container.plugin_manager = mock_pm

    engine = IntelligenceEngine(container)

    # 実行
    # 例外が外まで漏れず、エラーログを出力して終了することを確認
    await engine.execute(plugin_id="all", force=True)

    # 検証
    assert mock_tech_run.called
    assert mock_weekly_run.called
    # (ログにエラーが出力されているはず)
