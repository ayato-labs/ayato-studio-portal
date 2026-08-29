import io
import logging
import re

from bs4 import BeautifulSoup
from pdfminer.high_level import extract_text

from core.utils.fetch_util import FetchUtil

logger = logging.getLogger(__name__)


class ContentExtractor:
    """
    Utility for extracting full text content from HTML and PDF.
    """

    @classmethod
    async def extract_full_text(cls, url: str) -> str:
        """
        Main entry point to fetch and extract text from a URL.
        Dispatches to specialized extractors based on URL patterns.
        """
        if not url:
            return ""

        try:
            if "arxiv.org/pdf/" in url or url.endswith(".pdf"):
                return await cls._extract_arxiv_pdf(url)
            else:
                return await cls._extract_rss_body(url)
        except Exception as e:
            logger.error(f"[ContentExtractor] Global Extraction Error: {e}")
            return ""

    @classmethod
    async def _extract_rss_body(cls, url: str) -> str:
        """
        Scrapes main article body from standard URL using BeautifulSoup.
        """
        logger.info(f"[ContentExtractor] Scraping HTML: {url}")
        content = await FetchUtil.safe_fetch_url(url)
        if not content:
            return ""

        try:
            soup = BeautifulSoup(content, "html.parser")

            # Remove noise
            noise_tags = [
                "script",
                "style",
                "nav",
                "header",
                "footer",
                "aside",
                "form",
            ]
            for tag in soup(noise_tags):
                tag.decompose()

            # Strategy: Look for <article>, then <main>
            article = soup.find("article") or soup.find("main")
            if not article:
                article = soup.body

            if not article:
                return ""

            # Extract paragraphs
            paragraphs = article.find_all("p")
            text_list = []
            for p in paragraphs:
                p_text = p.get_text().strip()
                if len(p_text) > 20:
                    text_list.append(p_text)

            text = "\n".join(text_list)

            # Clean up whitespace
            text = re.sub(r"\n+", "\n", text)
            return text[:10000]  # Limit for LLM safety
        except Exception as e:
            logger.warning(f"[ContentExtractor] HTML Parse Error for {url}: {e}")
            return ""

    @classmethod
    async def _extract_arxiv_pdf(cls, url: str) -> str:
        """
        Downloads a PDF from arXiv and extracts its text contents.
        """
        logger.info(f"[ContentExtractor] Extracting PDF: {url}")
        content = await FetchUtil.safe_fetch_url(url)
        if not content:
            return ""

        try:
            with io.BytesIO(content) as pdf_file:
                text = extract_text(pdf_file)

            # Simple cleanup for research papers
            text = re.sub(r"\u000c", "", text)
            text = re.sub(r"\n+", "\n", text)

            return text[:15000]
        except Exception as e:
            logger.error(f"[ContentExtractor] PDF Extraction Error for {url}: {e}")
            return ""
