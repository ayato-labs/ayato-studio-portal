from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from google.genai.errors import ClientError

from core.services.gemini import GeminiService


@pytest.mark.asyncio
async def test_gemini_malformed_json_response():
    """Unit Test: Handling completely broken JSON from LLM."""
    service = GeminiService()

    # We mock the high-level method to return a response with garbage text
    # This avoids hitting attribute errors in google.genai internal modules
    with patch.object(
        service.client.aio.models, "generate_content", new_callable=AsyncMock
    ) as mock_gen:
        mock_response = MagicMock()
        mock_response.text = "This is not JSON { incomplete: "
        mock_gen.return_value = mock_response

        schema = {"type": "OBJECT", "properties": {"score": {"type": "INTEGER"}}}

        # Should catch JSONDecodeError and return None or handle gracefully
        res = await service.call_structured_async("test", response_schema=schema)
        assert res is None or res == {}


@pytest.mark.asyncio
async def test_gemini_empty_response_handling():
    """Unit Test: Handling empty string response from LLM."""
    service = GeminiService()
    with patch.object(
        service.client.aio.models, "generate_content", new_callable=AsyncMock
    ) as mock_gen:
        mock_response = MagicMock()
        mock_response.text = ""  # Explicitly empty
        mock_gen.return_value = mock_response

        # The service currently RAISES an exception for empty text,
        # which is a valid robust behavior to trigger fallback/retry.
        # We verify it raises as expected.
        with pytest.raises(Exception) as exc:
            await service.generate_report_async("test")
        assert "Empty response" in str(exc.value)


@pytest.mark.asyncio
async def test_gemini_token_limit_simulation():
    """Unit Test: Simulating a huge input that might hit token limits."""
    service = GeminiService()
    # Use a size that is likely to trigger a 413 or 429 if real,
    # but we will mock it to ensure it doesn't hit our real quota
    huge_text = "A" * 1000000

    with patch.object(
        service.client.aio.models, "generate_content", new_callable=AsyncMock
    ) as mock_gen:
        mock_gen.side_effect = ClientError("413 Payload Too Large", {}, None)

        # If it fails with ClientError, GeminiService should eventually raise after retries
        # or handle it if it's non-retryable.
        with pytest.raises(ClientError):
            await service.generate_report_async(huge_text)
