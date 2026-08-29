from unittest.mock import AsyncMock, patch


async def test_x_text_truncation(container):
    """
    Xの文字数制限(半角280文字)を超えた場合の切り捨てロジックの検証。
    ※全角は半角２文字扱い。
    """
    long_summary = "A" * 1000
    item = {
        "id": "1",
        "title": "Long title",
        "summary": long_summary,
        "category": "Tech",
        "score": 100,
        "url": "https://example.com",
    }

    # Geminiが長い出力を返すと仮定
    container.gemini_service = AsyncMock()
    container.gemini_service.generate_report_async.return_value = "B" * 500

    with patch("tweepy.Client") as mock_client_class:
        mock_client = mock_client_class.return_value
        container.x_service.client = mock_client

        await container.x_service._post_item(item)

        # 検証: 280文字以内に収まっているか
        call_args = mock_client.create_tweet.call_args
        posted_text = call_args.kwargs["text"]
        assert len(posted_text) <= 280
        assert posted_text.endswith("...") or len(posted_text) < 280


async def test_hatena_xml_injection_resistance(container):
    """
    はてなブログのXML生成において、悪意のある入力や特殊文字が正しくエスケープされるか。
    """
    title = "Test </title><script>alert(1)</script>"
    content = "]]> <![CDATA[ content"

    xml = container.hatena_service._create_atom_xml(title, content, "Tech")

    # 閉じタグがエスケープされていること
    assert "</title>" not in xml.replace("<title>", "").replace(
        "</title>", ""
    )  # タイトルタグそのものはOK
    assert "&lt;/title&gt;" in xml
    assert "&lt;script&gt;" in xml
    assert "&lt;![CDATA[" in xml


async def test_bluesky_session_failure(container):
    """
    Blueskyのログインに失敗した場合、投稿処理が安全にスキップされるか。
    """
    container.bluesky_service.client = AsyncMock()
    # loginが例外を投げると設定
    container.bluesky_service.client.login.side_effect = Exception("Login Forbidden")

    # execute_top_posts を呼んでも例外でクラッシュせず、Falseを返すこと
    success = await container.bluesky_service.execute_top_posts([{"score": 100}], limit=1)
    assert success is False
