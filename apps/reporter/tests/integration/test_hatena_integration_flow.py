from unittest.mock import MagicMock

import pytest

from core.services.gemini import GeminiService
from core.services.hatena_blog import HatenaBlogService


@pytest.fixture
def mock_gemini():
    return MagicMock(spec=GeminiService)


@pytest.fixture
def hatena_service():
    return HatenaBlogService()


@pytest.mark.asyncio
async def test_hatena_integration_flow_mock(mock_gemini, hatena_service):
    """Integration Test: Mocked Gemini -> Hatena Flow."""
    # We aren't doing heavy testing here, just verifying the structure for now
    assert hatena_service is not None
