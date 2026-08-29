import pytest
from google.genai.errors import APIError, ClientError

from config import settings
from core.services.gemini import GeminiService


@pytest.mark.asyncio
async def test_gemini_service_real_unstructured():
    """Unit Test (Real): Verify real Gemini API connectivity for unstructured text."""
    if not settings.GOOGLE_API_KEY or settings.GOOGLE_API_KEY == "YOUR_API_KEY":
        pytest.skip("GOOGLE_API_KEY is not configured")
    service = GeminiService()
    # Simple prompt that should always work
    try:
        res = await service.generate_report_async(
            "Reply only with 'Ayato Intelligence OK'", tier="light"
        )
        assert "Ayato Intelligence OK" in res
    except APIError as e:
        pytest.skip(f"Gemini API error (transient/quota/rate limit): {e}")


@pytest.mark.asyncio
async def test_gemini_service_real_structured():
    """Unit Test (Real): Verify real Gemini API connectivity for structured JSON."""
    if not settings.GOOGLE_API_KEY or settings.GOOGLE_API_KEY == "YOUR_API_KEY":
        pytest.skip("GOOGLE_API_KEY is not configured")
    service = GeminiService()
    prompt = "Create a JSON with a field 'status' set to 'active'"
    schema = {
        "type": "OBJECT",
        "properties": {"status": {"type": "STRING"}},
        "required": ["status"],
    }

    try:
        res = await service.call_structured_async(prompt, response_schema=schema, tier="light")
        assert isinstance(res, dict)
        assert res.get("status") == "active"
    except APIError as e:
        pytest.skip(f"Gemini API error (transient/quota/rate limit): {e}")


@pytest.mark.asyncio
async def test_gemini_service_invalid_key():
    """Unit Test (Real): Verify that invalid API key raises a clear exception."""
    service = GeminiService(api_key="invalid_key_12345")
    # We expect a ClientError when the actual API is called
    with pytest.raises(ClientError):
        await service.generate_report_async("test", tier="light")
