import asyncio

import pytest
import tweepy
from google.genai.errors import APIError

from config import settings
from core.interfaces.plugin import ReportArtifact


@pytest.mark.skipif(
    not all(
        [
            settings.X_API_KEY,
            settings.X_API_SECRET,
            settings.X_ACCESS_TOKEN,
            settings.X_ACCESS_TOKEN_SECRET,
        ]
    ),
    reason="X credentials missing",
)
async def test_x_post_real(container):
    """
    Xへの実際の投稿テスト (Mockなし)
    ※ 実際に投稿されるため注意
    """
    if not container.x_service.client:
        pytest.skip("X Client not initialized (missing credentials)")
    test_item = {
        "id": "test-id-x-real",
        "title": "TEST: X Real API Unit Test",
        "summary": "This is a test post from Ayato Intelligence Engine automated unit testing.",
        "category": "Tech",
        "score": 100,
        "url": "https://ayato-studio.ai",
    }
    try:
        # First check Gemini to see if we can generate the tweet text
        prompt = f"Summarize this for X (catchy, JP): {test_item['title']}\n{test_item['summary']}"
        try:
            ai_text = await container.gemini_service.generate_report_async(prompt, tier="heavy")
        except APIError as e:
            pytest.skip(f"Gemini API error (transient/quota/rate limit): {e}")

        tweet_text = f"{ai_text.strip().strip('"')}\n\nhttps://ayato-studio.ai"
        if len(tweet_text) > 275:
            tweet_text = tweet_text[:272] + "..."

        await asyncio.to_thread(container.x_service.client.create_tweet, text=tweet_text)
    except tweepy.HTTPException as e:
        err_msg = str(e)
        if any(x in err_msg for x in ["402", "Payment Required", "credits", "429", "Rate limit"]):
            pytest.skip(f"X API Quota/Payment/Rate limit error: {e}")
        raise
    except Exception as e:
        err_msg = str(e)
        if any(x in err_msg for x in ["402", "Payment Required", "credits", "429", "Rate limit"]):
            pytest.skip(f"X API Quota/Payment/Rate limit error: {e}")
        raise


@pytest.mark.skipif(
    not all([settings.BLUESKY_HANDLE, settings.BLUESKY_APP_PASSWORD]),
    reason="Bluesky credentials missing",
)
async def test_bluesky_post_real(container):
    """
    Blueskyへの実際の投稿テスト (Mockなし)
    """
    test_item = {
        "id": "test-id-bs-real",
        "title": "TEST: Bluesky Real API Unit Test",
        "summary": "This is a test post for Bluesky from Ayato Intelligence Engine.",
        "category": "AI",
        "score": 100,
        "url": "https://ayato-studio.ai",
    }
    if not container.bluesky_service.is_logged_in:
        # ログイン試行
        if not await container.bluesky_service._ensure_logged_in():
            pytest.skip("Bluesky Login failed (missing credentials)")
    try:
        prompt = (
            f"Summarize this for BlueSky (catchy, JP): {test_item['title']}\n{test_item['summary']}"
        )
        try:
            ai_text = await container.gemini_service.generate_report_async(prompt, tier="heavy")
        except APIError as e:
            pytest.skip(f"Gemini API error (transient/quota/rate limit): {e}")

        final_text = f"{ai_text.strip().strip('"')}\n\nhttps://ayato-studio.ai"
        if len(final_text) > 290:
            final_text = final_text[:287] + "..."

        await container.bluesky_service.client.send_post(text=final_text)
    except Exception as e:
        err_msg = str(e).lower()
        if any(x in err_msg for x in ["auth", "login", "credentials", "rate", "limit", "quota"]):
            pytest.skip(f"Bluesky API error (likely auth/rate limit): {e}")
        raise


@pytest.mark.skipif(
    not all([settings.HATENA_USER_ID, settings.HATENA_API_KEY]), reason="Hatena credentials missing"
)
async def test_hatena_post_real(container):
    """
    はてなブログへの実際の投稿テスト (Mockなし)
    """
    if not settings.HATENA_USER_ID or not settings.HATENA_API_KEY:
        pytest.skip("Hatena credentials missing")
    title = "【TEST】実機API検証レポート"
    content = "# テストレポート\n\n## セクション1\nこれはテストです。\n\n## セクション2\n実機APIの動作を確認しています。"

    artifact = ReportArtifact(
        title=title, content=content, filename="test-real-api-post", category="Tech", market="tech"
    )

    try:
        # We need to make sure we don't fail on Gemini quota inside hatena posting
        try:
            await container.hatena_service.post_combined_digest(
                [artifact], container.gemini_service
            )
        except APIError as e:
            pytest.skip(f"Gemini API error (transient/quota/rate limit): {e}")
    except Exception as e:
        err_msg = str(e).lower()
        if any(
            x in err_msg
            for x in [
                "auth",
                "credentials",
                "rate",
                "limit",
                "quota",
                "unauthorized",
                "401",
                "429",
                "403",
            ]
        ):
            pytest.skip(f"Hatena API error (likely auth/rate limit): {e}")
        raise


async def test_gemini_real(container):
    """
    Gemini APIの実際の呼び出しテスト (Mockなし)
    """
    if not settings.GOOGLE_API_KEY or settings.GOOGLE_API_KEY == "YOUR_API_KEY":
        pytest.skip("GOOGLE_API_KEY is not configured")
    prompt = "Hello, this is a test. Reply with 'ACK'."
    try:
        response = await container.gemini_service.generate_report_async(prompt, tier="light")
        assert "ACK" in response.upper()
    except APIError as e:
        pytest.skip(f"Gemini API error (transient/quota/rate limit): {e}")
