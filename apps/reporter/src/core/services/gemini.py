import json
import logging
import re

import google.genai as genai
from tenacity import retry, retry_if_exception, stop_after_attempt, wait_exponential

from core.utils.error_handler import safe_execute_async

logger = logging.getLogger(__name__)


def is_quota_error(exception):
    """Returns True if the exception is a 429 Resource Exhausted error."""
    msg = str(exception).lower()
    return "429" in msg or "resource_exhausted" in msg or "quota" in msg


class GeminiService:
    """Handles interaction with Google Gemini API using google-genai SDK."""

    def _get_settings(self):
        from config import settings

        return settings

    def _normalize_model_name(self, name: str) -> str:
        """Ensures the model name has the required 'models/' or 'tunedModels/' prefix."""
        if not name or "/" in name:
            return name
        return f"models/{name}"

    def __init__(self, api_key: str = None):
        self.api_key = api_key or self._get_settings().GOOGLE_API_KEY
        if not self.api_key:
            logging.error("Google AI Studio API Key is not set in config or env.")

        self.client = genai.Client(api_key=self.api_key, vertexai=False)

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception(is_quota_error),
        reraise=True,
    )
    async def _call_api_async(
        self,
        model_names: list[str],
        prompt: str,
        response_schema: dict = None,
        is_json_output: bool = True,
    ) -> str | dict | list:
        last_exception = None
        for i, raw_name in enumerate(model_names):
            model_name = self._normalize_model_name(raw_name)
            try:
                config = {}
                is_native_json_supported = any(
                    v in model_name.lower()
                    for v in ["gemini-1.5", "gemini-2", "gemini-2.5", "gemini-3"]
                )

                if is_native_json_supported:
                    if response_schema:
                        config["response_mime_type"] = "application/json"
                        config["response_schema"] = response_schema
                    elif is_json_output:
                        config["response_mime_type"] = "application/json"

                # If not supported, we don't set config and rely on parser's ability to extract
                # JSON from text blocks (which is already implemented in _parse_json_response).

                response = await self.client.aio.models.generate_content(
                    model=model_name, contents=prompt, config=config
                )

                if response.text:
                    if response_schema or is_json_output:
                        return self._parse_json_response(
                            response.text.strip(), "Gemini API (async)"
                        )
                    return response.text.strip()
                else:
                    raise Exception(f"Empty response from Gemini API for {model_name}")

            except Exception as e:
                last_exception = e
                if is_quota_error(e):
                    next_model = (
                        model_names[i + 1] if i + 1 < len(model_names) else "None (End of Chain)"
                    )
                    logging.warning(
                        f"[GeminiService] Quota Exhausted for {model_name}. Falling back to {next_model}..."
                    )
                    continue
                else:
                    logging.warning(
                        f"[GeminiService] Non-quota error for {model_name}: {e}. Falling back..."
                    )
                    continue

        if last_exception:
            raise last_exception
        raise Exception("Gemini API Request Failed All models")

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception(is_quota_error),
        reraise=True,
    )
    def _call_api(
        self,
        model_names: list[str],
        prompt: str,
        response_schema: dict = None,
        is_json_output: bool = True,
    ) -> str | dict | list:
        last_exception = None
        for i, raw_name in enumerate(model_names):
            model_name = self._normalize_model_name(raw_name)
            try:
                config = {}
                is_native_json_supported = any(
                    v in model_name.lower()
                    for v in ["gemini-1.5", "gemini-2", "gemini-2.5", "gemini-3"]
                )

                if is_native_json_supported:
                    if response_schema:
                        config["response_mime_type"] = "application/json"
                        config["response_schema"] = response_schema
                    elif is_json_output:
                        config["response_mime_type"] = "application/json"

                response = self.client.models.generate_content(
                    model=model_name, contents=prompt, config=config
                )
                if response.text:
                    if response_schema or is_json_output:
                        return self._parse_json_response(response.text.strip(), "Gemini API (sync)")
                    return response.text.strip()
                else:
                    raise Exception(f"Empty response from Gemini API (sync) for {model_name}")
            except Exception as e:
                last_exception = e
                if is_quota_error(e):
                    next_model = (
                        model_names[i + 1] if i + 1 < len(model_names) else "None (End of Chain)"
                    )
                    logging.warning(
                        f"[GeminiService] Quota Exhausted (Sync) for {model_name}. Falling back to {next_model}..."
                    )
                    continue
                else:
                    logging.warning(
                        f"[GeminiService] Non-quota error (Sync) for {model_name}: {e}. Falling back..."
                    )
                    continue

        if last_exception:
            raise last_exception
        raise Exception("Gemini API Sync Request Failed")

    def _parse_json_response(self, response_text: str, error_message_prefix: str) -> dict | list:
        try:
            return json.loads(response_text)
        except json.JSONDecodeError:
            # Fallback for LLM occasionally wrapping in markdown code blocks
            cleaned_text = response_text
            if response_text.startswith("```"):
                lines = response_text.split("\n")
                if lines[0].startswith("```json"):
                    cleaned_text = "\n".join(lines[1:-1])
                elif lines[0].startswith("```"):
                    cleaned_text = "\n".join(lines[1:-1])

            try:
                return json.loads(cleaned_text)
            except json.JSONDecodeError:
                logging.error(f"  - {error_message_prefix} Failed to parse JSON: {response_text}")
                return {}

    def _get_models_for_tier(self, tier: str = "heavy") -> list[str]:
        settings = self._get_settings()
        if tier == "light":
            return settings.AI_MODEL_LIGHT_TASK
        return settings.AI_MODEL_HEAVY_TASK

    async def call_structured_async(
        self, prompt: str, response_schema: dict, tier: str = "light"
    ) -> dict | list:
        """Calls API with structured schema using specified tier."""
        model_names = self._get_models_for_tier(tier)
        return await self._call_api_async(model_names, prompt, response_schema=response_schema)

    def select_tags(self, prompt: str, tier: str = "light") -> list[str]:
        """Select relevant tags. Defaults to 'light' tier."""
        model_names = self._get_models_for_tier(tier)
        schema = {"type": "ARRAY", "items": {"type": "STRING"}}
        parsed_json = self._call_api(model_names, prompt, response_schema=schema)
        return parsed_json if isinstance(parsed_json, list) else []

    def normalize_tags(
        self, tags: list[str], standard_concepts: list[str], tier: str = "light"
    ) -> dict[str, str]:
        """Maps tags to standard concepts using LLM. Tier defaults to 'light'."""
        model_names = self._get_models_for_tier(tier)
        std_json = json.dumps(standard_concepts, ensure_ascii=False)
        tags_json = json.dumps(tags, ensure_ascii=False)

        prompt_tpl = self._get_settings()._load_prompt(
            self._get_settings().PROMPT_DIR, "tag_normalization_v1.txt"
        )
        formatted_prompt = prompt_tpl.format(
            tags_json=tags_json,
            standard_concepts_json=std_json,
        )
        schema = {"type": "OBJECT", "additionalProperties": {"type": "STRING"}}
        parsed_json = self._call_api(model_names, formatted_prompt, response_schema=schema)
        return parsed_json if isinstance(parsed_json, dict) else {}

    async def generate_report_async(
        self, prompt: str, tier: str = "heavy", apply_global_style: bool = True
    ) -> str:
        """Generate report with optional global style directives."""
        model_names = self._get_models_for_tier(tier)
        full_prompt = (
            (self._get_global_style_directive() + "\n\n" + prompt) if apply_global_style else prompt
        )
        return await self._call_api_async(model_names, full_prompt, is_json_output=False)

    async def generate_title_async(
        self,
        content: str,
        lang: str = "jp",
        template_name: str = "title_generation_flow_v1.txt",
        raw_titles: str = "",
    ) -> str:
        """
        Generates a 10-35 character catchy title based on report content.
        Uses synthesized context (raw_titles) and Python post-processing for maximum impact.
        """
        settings = self._get_settings()
        prompt_tpl = settings._load_prompt(settings.PROMPT_DIR, template_name)
        if not prompt_tpl:
            prompt_tpl = "Generate a catchy title in {lang} for the following content: {content}"

        # Logic: Inject raw titles context if available to help grounding
        prompt = prompt_tpl.format(
            lang=lang,
            content=content[:2000],
            raw_titles=raw_titles if raw_titles else "No specific raw titles provided.",
        )

        try:
            schema = {
                "type": "OBJECT",
                "properties": {"title": {"type": "STRING"}},
                "required": ["title"],
            }

            result = await self.call_structured_async(prompt, response_schema=schema, tier="heavy")

            if isinstance(result, dict) and "title" in result:
                title = str(result["title"]).strip()

                # --- Pure Logic Improvement: Post-Processing ---
                # 1. Normalize numbers: Full-width to Half-width for better scannability
                title = title.translate(str.maketrans("０１２３４５６７８９", "0123456789"))
                # 2. Safety filter: Remove AI-like filler words
                title = re.sub(r"Snapshot|報告|レポート|要約|概要", "", title)
                # 3. Clean quotes and brackets
                title = title.strip("\"'「」 ")

                return title[:60]

            logger.warning(f"[GeminiService] Title generation returned unexpected format: {result}")
            return ""
        except Exception as e:
            logger.error(f"Failed to generate dynamic title (JSON mode): {e}")
            return ""

    def generate_report(self, prompt: str, tier: str = "heavy") -> str:
        """Generate report with directives (sync)."""
        model_names = self._get_models_for_tier(tier)
        full_prompt = self._get_global_style_directive() + "\n\n" + prompt
        return self._call_api(model_names, full_prompt, is_json_output=False)

    def _get_global_style_directive(self) -> str:
        """Injects global style constraints (Tone of Voice, Transparency wrap)."""
        settings = self._get_settings()
        prompt_tpl = settings._load_prompt(settings.PROMPT_DIR, "global_style_v1.txt")
        return (
            prompt_tpl
            if prompt_tpl
            else "Maintain a professional, analytical tone. Ensure high transparency."
        )

    @safe_execute_async(default_return=[])
    async def embed_content_async(self, model_name: str, text: str) -> list[float]:
        """Gemini SDK を使用して直接テキストをベクトル化する"""
        model_name = self._normalize_model_name(model_name)
        try:
            response = await self.client.aio.models.embed_content(model=model_name, contents=text)
            if response.embeddings:
                return response.embeddings[0].values
            return []
        except Exception as e:
            logging.error(f"  - Gemini Embedding Failed: {e}")
            return []

    async def curate_ai_news_batch(self, items: list[dict]) -> list[dict]:
        """
        Curates a batch of candidate news items using Gemma / Gemini Flash.
        Determines adoption (adopt: bool) and category classification.
        Does NOT translate or generate heavy summaries.
        """
        if not items:
            return []

        models = ["gemma-2-27b-it", "gemma-2-9b-it", "gemini-2.5-flash", "gemini-1.5-flash"]
        
        items_payload = [
            {
                "id": idx,
                "title": item.get("title", ""),
                "source": item.get("source", ""),
                "summary": (item.get("summary") or "")[:250],
            }
            for idx, item in enumerate(items)
        ]

        prompt = f"""
You are an expert AI curator for a global real-time AI news intelligence hub.
Review the following list of news articles candidates collected from worldwide RSS feeds.

Task:
1. For each article, decide whether it is significant, high-value, authentic AI / Machine Learning / LLM / Hardware / Research news (`adopt`: true or false).
   - ADOPT (true): AI model releases, breakthroughs, research papers (arXiv), LLM updates, major GPU/chip developments, open-source AI tooling, AI policy/regulation.
   - REJECT (false): Generic non-AI tech, clickbait/spam, marketing ads, trivial blog posts, non-AI business gossip.
2. If adopted, assign exactly one category from:
   - "Models" (New models, LLM releases, weights, checkpoints)
   - "Research" (ArXiv papers, novel algorithms, benchmarks)
   - "Open Source" (Open-source tools, GitHub repos, libraries)
   - "Industry" (Tech company AI strategies, investments, cloud)
   - "Hardware" (GPUs, NPUs, semiconductors, datacenter chips)
   - "Policy" (Government regulations, AI safety laws, standards)
   - "Tools" (AI developer utilities, frameworks, workflows)
   If not adopted, set category to "None".

Input Articles:
{json.dumps(items_payload, ensure_ascii=False, indent=2)}

Return a strict JSON array of objects with keys: "id" (int), "adopt" (boolean), "category" (string).
Example:
[
  {{"id": 0, "adopt": true, "category": "Models"}},
  {{"id": 1, "adopt": false, "category": "None"}}
]
"""
        schema = {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "id": {"type": "INTEGER"},
                    "adopt": {"type": "BOOLEAN"},
                    "category": {"type": "STRING"},
                },
                "required": ["id", "adopt", "category"],
            },
        }

        try:
            results = await self._call_api_async(
                model_names=models,
                prompt=prompt,
                response_schema=schema,
                is_json_output=True,
            )
            if isinstance(results, list):
                return results
            logger.warning(f"[GeminiService] Curation returned non-list result: {results}")
            return []
        except Exception as e:
            logger.error(f"[GeminiService] Failed to curate news batch: {e}")
            return []

