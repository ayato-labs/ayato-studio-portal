from typing import Any


class FakeModels:
    """Fake model client for genai.Client.models"""

    def __init__(self, response_text: str = "Fake LLM Response", should_fail: bool = False):
        self.response_text = response_text
        self.should_fail = should_fail
        self.call_count = 0

    def generate_content(self, model: str, contents: str, config: dict | None = None) -> Any:
        self.call_count += 1
        if self.should_fail:
            raise Exception("Fake API Failure")

        class FakeResponse:
            def __init__(self, text):
                self.text = text

        return FakeResponse(self.response_text)

    async def embed_content(self, model: str, contents: str) -> Any:
        self.call_count += 1
        if self.should_fail:
            raise Exception("Fake Embedding Failure")

        class FakeEmbedding:
            def __init__(self, values):
                self.values = values

        class FakeResponse:
            def __init__(self, values):
                self.embeddings = [FakeEmbedding(values)]

        return FakeResponse([0.1, 0.2, 0.3])


class FakeAioModels:
    """Fake async model client for genai.Client.aio.models"""

    def __init__(self, response_text: str = "Fake LLM Response", should_fail: bool = False):
        self.response_text = response_text
        self.should_fail = should_fail
        self.call_count = 0

    async def generate_content(self, model: str, contents: str, config: dict | None = None) -> Any:
        self.call_count += 1
        if self.should_fail:
            # Simulate 429 for testing retries
            raise Exception("429 Resource Exhausted")

        class FakeResponse:
            def __init__(self, text):
                self.text = text

        return FakeResponse(self.response_text)

    async def embed_content(self, model: str, contents: str) -> Any:
        self.call_count += 1
        if self.should_fail:
            raise Exception("Fake Embedding Failure")

        class FakeEmbedding:
            def __init__(self, values):
                self.values = values

        class FakeResponse:
            def __init__(self, values):
                self.embeddings = [FakeEmbedding(values)]

        return FakeResponse([0.1, 0.2, 0.3])


class FakeAio:
    """Fake aio client for genai.Client.aio"""

    def __init__(self, response_text: str = "Fake LLM Response", should_fail: bool = False):
        self.models = FakeAioModels(response_text, should_fail)


class FakeGeminiClient:
    """
    Fake Gemini Client that mimics the google-genai Client structure.
    Used for unit testing without MagicMock().
    """

    def __init__(
        self,
        api_key: str = "fake_key",
        response_text: str = "Fake LLM Response",
        should_fail: bool = False,
        **kwargs,
    ):
        self.api_key = api_key
        self.models = FakeModels(response_text, should_fail)
        self.aio = FakeAio(response_text, should_fail)
