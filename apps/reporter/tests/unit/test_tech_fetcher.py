import xml.etree.ElementTree as ET

import pytest

from plugins.tech.main import TechFetcher


@pytest.fixture
def fetcher():
    return TechFetcher()


def test_parse_arxiv_atom(fetcher):
    """Verify arXiv Atom parsing logic with clean XML."""
    mock_atom = """<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
<entry>
<id>http://arxiv.org/abs/2403.12345v1</id>
<title>Test AI Paper</title>
<summary>Amazing research about AI.</summary>
<published>2026-03-29T10:00:00Z</published>
<link title="pdf" href="http://arxiv.org/pdf/2403.12345v1"/>
<primary_category xmlns="http://arxiv.org/schemas/atom" term="cs.AI"/>
</entry>
</feed>"""
    # Use huge window and check internal details
    root = ET.fromstring(mock_atom)
    results = fetcher._parse_arxiv(root, hours_back=24 * 365 * 10)
    print(f"Debug ArXiv results: {results}")
    assert len(results) == 1
    assert results[0]["title"] == "Test AI Paper"


def test_parse_nvidia_rss(fetcher):
    """Verify NVIDIA-style RSS 2.0 parsing logic with clean XML."""
    mock_rss = """<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<item>
<title>NVIDIA AI News</title>
<link>https://developer.nvidia.com/blog/ai-news/</link>
<pubDate>Sun, 29 Mar 2026 10:00:00 +0000</pubDate>
<description>NVIDIA is doing great things.</description>
</item>
</channel>
</rss>"""
    root = ET.fromstring(mock_rss)
    results = fetcher._parse_rss(root, 24 * 365 * 10, "tech", "https://nvidia.com/feed")
    print(f"Debug NVIDIA results: {results}")
    assert len(results) == 1
    assert results[0]["title"] == "NVIDIA AI News"


def test_parse_itmedia_complex_rss(fetcher):
    """Verify ITmedia-style RSS with namespaces and clean XML."""
    mock_rss = """<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
<item>
<title>ITmedia AI+ Breaking</title>
<link>https://www.itmedia.co.jp/news/articles/2403/29/news123.html</link>
<pubDate>Sun, 29 Mar 2026 10:00:00 +0900</pubDate>
<description>AI technology evolution in Japan.</description>
<dc:date>2026-03-29T10:00:00+09:00</dc:date>
</item>
</channel>
</rss>"""
    root = ET.fromstring(mock_rss)
    results = fetcher._parse_rss(root, 24 * 365 * 10, "tech", "https://itmedia.co.jp/feed")
    print(f"Debug ITmedia results: {results}")
    assert len(results) == 1
    assert results[0]["title"] == "ITmedia AI+ Breaking"


if __name__ == "__main__":
    fetcher_obj = TechFetcher()
    test_parse_arxiv_atom(fetcher_obj)
    print("ArXiv: PASS")
    test_parse_nvidia_rss(fetcher_obj)
    print("NVIDIA: PASS")
    test_parse_itmedia_complex_rss(fetcher_obj)
    print("ITmedia: PASS")
    print("All tests PASSED manually.")
