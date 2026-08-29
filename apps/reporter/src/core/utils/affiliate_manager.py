import json
import logging
import os
import random

logger = logging.getLogger(__name__)


class AffiliateManager:
    """
    Manages monetization hooks (Affiliate links) for reports.
    Now supports Context-Aware injection via `data/ads.json`.
    """

    ADS_DB_PATH = os.path.join(os.path.dirname(__file__), "../../data/ads.json")
    _ads_cache: list[dict] = []

    @classmethod
    async def inject_async(cls, container, content: str, market: str) -> str:
        """
        Injects a context-aware ad with an AI-generated bridge.
        """
        from config import settings

        cls.load_ads()

        # 1. Select the best ad
        best_ad = cls._select_best_ad_data(content, market)
        if not best_ad:
            return content + cls.get_fallback_ad(market)

        # 2. Generate AI Bridge
        try:
            # Use a short summary for the prompt to save tokens/time
            content_summary = content[:500] + "..." if len(content) > 500 else content

            prompt_tpl = settings._load_prompt(settings.PROMPT_DIR, "affiliate_bridge_v1.txt")
            if prompt_tpl:
                prompt = prompt_tpl.format(
                    content_summary=content_summary,
                    ad_name=best_ad.get("name", ""),
                    ad_header=best_ad.get("header", ""),
                    ad_description=best_ad.get("description", ""),
                )

                bridge_text = await container.gemini_service.generate_report_async(
                    settings.AI_MODEL_LIGHT_TASK, prompt
                )

                # Wrap the bridge in a subtle style
                ad_html = (
                    f"\n\n---\n\n<div style='color: #666; font-style: italic; margin-bottom: 10px;'>{bridge_text}</div>\n"
                    + cls.render_ad_html(best_ad)
                )
                return content + ad_html
        except Exception:
            logger.exception(
                "[AffiliateManager] AI Bridge generation failed. Falling back to direct injection."
            )

        # Fallback to direct injection if AI fails
        return content + cls.render_ad_html(best_ad)

    @classmethod
    def _select_best_ad_data(cls, content: str, market: str) -> dict | None:
        """Internal helper to find the best ad object."""
        cls.load_ads()
        if not cls._ads_cache:
            return None

        scored_ads = []
        content_lower = content.lower()

        for ad in cls._ads_cache:
            score = 0
            if ad.get("market") == market:
                score += 5
            for keyword in ad.get("keywords", []):
                if keyword.lower() in content_lower:
                    score += 10
            score += ad.get("weight", 1.0) * random.uniform(0.5, 1.5)
            if score > 0:
                scored_ads.append((score, ad))

        if not scored_ads:
            return None

        scored_ads.sort(key=lambda x: x[0], reverse=True)
        return scored_ads[0][1]

    @classmethod
    def load_ads(cls):
        """Loads ads from JSON file if not already loaded."""
        if cls._ads_cache:
            return

        if os.path.exists(cls.ADS_DB_PATH):
            try:
                with open(cls.ADS_DB_PATH, encoding="utf-8") as f:
                    cls._ads_cache = json.load(f)
            except Exception as e:
                logger.error(f"[AffiliateManager] Error loading ads.json: {e}")
                cls._ads_cache = []
        else:
            logger.warning(f"[AffiliateManager] ads.json not found at {cls.ADS_DB_PATH}")

    @classmethod
    def get_best_ad(cls, content: str, market: str) -> str:
        """
        Selects the best ad based on keyword matching in content.
        """
        cls.load_ads()
        if not cls._ads_cache:
            return cls.get_fallback_ad(market)

        # Filter suitable ads by market (optional, usually keywords handle it better)
        # But for safety, we prioritize ads that match the market category if explicitly set
        candidate_ads = cls._ads_cache

        # Scoring
        scored_ads = []
        content_lower = content.lower()

        for ad in candidate_ads:
            score = 0
            if ad.get("market") == market:
                score += 5  # Base boost for market match

            for keyword in ad.get("keywords", []):
                if keyword.lower() in content_lower:
                    score += 10  # High boost for keyword match

            # Add some randomness weight to avoid showing same ad every time for similar content
            score += ad.get("weight", 1.0) * random.uniform(0.5, 1.5)

            if score > 0:
                scored_ads.append((score, ad))

        if not scored_ads:
            return cls.get_fallback_ad(market)

        # Sort by score desc
        scored_ads.sort(key=lambda x: x[0], reverse=True)
        best_ad = scored_ads[0][1]

        return cls.render_ad_html(best_ad)

    @classmethod
    def render_ad_html(cls, ad: dict) -> str:
        """Renders the HTML card for an ad object."""
        # Check for tracking pixel/image (A8.net often uses 1x1 pixel or banner image)
        impression_tag = ""
        if ad.get("image_url"):
            # If it's a banner url (like A8), we might want to display it or use it as tracking
            # simplified: append standard tracking image if present
            impression_tag = f'<img border="0" width="1" height="1" src="{ad["image_url"]}" alt="">'

        # Thumbnail support for higher CTR
        thumbnail_html = ""
        if ad.get("thumbnail_url"):
            thumbnail_html = f"<img src='{ad['thumbnail_url']}' style='width: 80px; height: 80px; object-fit: contain; border-radius: 4px; border: 1px solid #eee; background: #fff;' alt='Product Image'>"

        return f"""
<div style='border: 1px solid #ddd; padding: 15px; border-radius: 8px; background-color: #fefefe; margin: 20px 0; font-family: sans-serif; box-shadow: 0 2px 4px rgba(0,0,0,0.05); position: relative; border-top: 3px solid #00d4ff;'>
    <div style="position: absolute; top: -12px; left: 15px; font-size: 11px; color: #333; background: #fff; padding: 2px 10px; border-radius: 10px; border: 1px solid #00d4ff; font-weight: bold; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">[PR] 広告・プロモーション</div>
    <div style="display: flex; align-items: center; gap: 15px; margin-top: 10px;">
        {thumbnail_html}
        <div style='flex: 1;'>
            <strong style='font-size: 1.05em; color: #333;'>{ad.get("header", "")}</strong><br>
            <span style='font-size: 0.9em; color: #555; line-height: 1.4; display: block; margin-top: 4px;'>{ad.get("description", "")}</span>
        </div>
        <div style="display:flex; flex-direction:column; align-items:flex-end;">
            <a href='{ad.get("tracking_url", "#")}' target='_blank' rel='nofollow sponsored' style='background-color: #00d4ff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 0.9em; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,212,255,0.3);'>
                {ad.get("cta_text", "Click")}
            </a>
        </div>
    </div>
    {impression_tag}
</div>
"""

    @classmethod
    def get_fallback_ad(cls, market: str) -> str:
        """Original simple fallback if no smart ads match."""
        # Simple text links as emergency fallback
        link = "https://www.google.com"
        if market == "us":
            link = "https://www.moomoo.com/jp/"
            text = "米国株のリアルタイム板情報ならMooMoo証券"
        elif market == "jp":
            link = "https://shikiho.toyokeizai.net/"
            text = "会社四季報オンラインでプロの分析を"
        else:
            link = "https://www.udemy.com/"
            text = "UdemyでAIスキルを習得しよう"

        return f"\n\n---\n**[PR] {text}**\n[詳細をチェック]({link})\n"

    @classmethod
    def inject(cls, content: str, market: str) -> str:
        """Injects a context-aware hook into the bottom of the content (Synchronous)."""
        ad_data = cls._select_best_ad_data(content, market)
        if ad_data:
            return content + cls.render_ad_html(ad_data)
        return content + cls.get_fallback_ad(market)
