import logging

import httpx

from config import settings

logger = logging.getLogger(__name__)


class HatenaBlogService:
    """
    Service to post report summaries to Hatena Blog via AtomPub API.
    Acts as a traffic funnel to the main portal.
    """

    def __init__(self):
        self.user_id = settings.HATENA_USER_ID
        self.api_key = settings.HATENA_API_KEY
        self._async_client = None

        if not self.user_id or not self.api_key:
            logger.warning(
                "[HatenaBlogService] Missing credentials (HATENA_USER_ID/API_KEY). Posting will be skipped."
            )
        else:
            logger.info(f"[HatenaBlogService] Initialized for user: {self.user_id}")

    async def _get_client(self) -> httpx.AsyncClient:
        """Lazy initialization of the async client."""
        if self._async_client is None or self._async_client.is_closed:
            self._async_client = httpx.AsyncClient(timeout=30.0)
        return self._async_client

    async def post_combined_digest(self, artifacts: list, gemini_service):
        """
        Creates a single "External Intelligence Catalyst" post combining multiple reports,
        acting as a hub to drive traffic to the main portal.
        """
        if not self.user_id or not self.api_key:
            return
        if not artifacts:
            return

        # Always use the Tech blog as the primary intelligence hub for Pattern D
        blog_id = settings.HATENA_TECH_BLOG_ID
        if not blog_id:
            logger.info("[HatenaBlogService] No HATENA_TECH_BLOG_ID set. Skipping combined digest.")
            return

        # 1. Prepare context from artifacts
        context_parts = []
        links_section = "\n\n---\n### 詳細な解析レポート（独自ポータル）\n\n"
        for art in artifacts:
            # Extract first 1000 chars for context to avoid token limits
            content_snippet = art.content[:1000] + "..." if len(art.content) > 1000 else art.content
            context_parts.append(f"【レポート: {art.title} ({art.category})】\n{content_snippet}\n")

            portal_url = f"{settings.PORTAL_BASE_URL}/reports/{art.category.lower()}/{art.filename}"
            links_section += f"- **[{art.title}]({portal_url})**\n"

        full_context = "\n".join(context_parts)

        # 2. Generate the Catalyst content and Title
        prompt_tpl = settings._load_prompt(settings.PROMPT_DIR, "hatena_catalyst_v1.txt")
        if not prompt_tpl:
            prompt_tpl = "以下の複数レポートを統合し、読者の知的好奇心を刺激するはてなブログ用の俯瞰記事を作成せよ。タイトルは1行目に `# TITLE: <title>` の形式で出力すること。\n\n{context}"

        prompt = prompt_tpl.format(context=full_context)

        try:
            logger.info("[HatenaBlogService] Generating combined Catalyst digest via Gemini...")
            generated_text = await gemini_service.generate_report_async(prompt, tier="heavy")

            # Parse title and content
            lines = generated_text.strip().split("\n")
            title = "AYATO INTELLIGENCE: 統合マクロ分析レポート"
            content_md = generated_text

            if lines and lines[0].startswith("# TITLE:"):
                title = lines[0].replace("# TITLE:", "").strip()
                content_md = "\n".join(lines[1:]).strip()

            # Append the CTA links
            final_content = content_md + links_section

            # Convert markdown to HTML before posting to ensure proper rendering
            import markdown

            content_html = markdown.markdown(final_content)

            # 3. Post to Hatena
            xml_data = self._create_atom_xml(title, content_html, "Intelligence")
            endpoint = f"https://blog.hatena.ne.jp/{self.user_id}/{blog_id}/atom/entry"
            client = await self._get_client()

            response = await client.post(
                endpoint,
                content=xml_data.encode("utf-8"),
                auth=httpx.BasicAuth(self.user_id, self.api_key),
                headers={"Content-Type": "application/atom+xml; charset=utf-8"},
            )
            if response.status_code in [201, 200]:
                logger.info(
                    f"[HatenaBlogService] Successfully posted combined digest to {blog_id}: {title}"
                )
            else:
                logger.error(
                    f"[HatenaBlogService] Failed to post combined digest: {response.status_code} {response.text}"
                )

        except Exception as e:
            logger.error(f"[HatenaBlogService] Error generating/posting combined digest: {e}")

    def _get_blog_id(self, category: str) -> str:
        cat = category.lower()
        if cat in ["news", "tech", "ai", "ai/tech"]:
            return settings.HATENA_TECH_BLOG_ID
        if cat in ["finance", "energy"]:
            return settings.HATENA_FINANCE_BLOG_ID
        return None

    def _extract_summary(self, content_md: str, max_sections: int = 3) -> str:
        """Extracts the first N sections of the markdown."""
        sections = content_md.split("\n## ")
        if len(sections) <= 1:
            return content_md[:1000]

        summary_sections = sections[:max_sections]
        return "\n## ".join(summary_sections)

    def _create_atom_xml(self, title: str, content: str, category: str) -> str:
        """Creates AtomPub compatible XML."""
        esc_c = content.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        esc_t = title.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

        xml = f"""<?xml version="1.0" encoding="utf-8"?>
<entry xmlns="http://www.w3.org/2005/Atom"
       xmlns:app="http://www.w3.org/2007/app">
  <title>{esc_t}</title>
  <author><name>{self.user_id}</name></author>
  <content type="text/html">
{esc_c}
  </content>
  <category term="{category}" />
  <app:control>
    <app:draft>no</app:draft>
  </app:control>
</entry>"""
        return xml

    async def close(self):
        """Closes the underlying async client."""
        if self._async_client:
            await self._async_client.aclose()
