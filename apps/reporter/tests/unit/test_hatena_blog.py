from core.services.hatena_blog import HatenaBlogService


def test_extract_summary_basic():
    service = HatenaBlogService()
    content = "# Title\n\n## Section 1\nInfo 1\n\n## Section 2\nInfo 2\n\n## Section 3\nInfo 3\n\n## Section 4\nInfo 4"
    # sections[0] = "# Title\n", sections[1] = "Section 1...", sections[2] = "Section 2..."
    summary = service._extract_summary(content, max_sections=3)

    assert "## Section 1" in summary
    assert "## Section 2" in summary
    assert "## Section 3" not in summary


def test_get_blog_id():
    service = HatenaBlogService()
    assert service._get_blog_id("News") == "ai-researcher.hatenablog.com"
    assert service._get_blog_id("AI/Tech") == "ai-researcher.hatenablog.com"
    assert service._get_blog_id("Finance") == "ai-economy-analysis.hatenablog.com"
    assert service._get_blog_id("Unknown") is None


def test_create_atom_xml_escaping():
    service = HatenaBlogService()
    service.hatena_id = "test_user"
    title = "Title & Risk < Low >"
    content = "Check it & see < here >"
    xml = service._create_atom_xml(title, content, "Tech")

    assert "<title>Title &amp; Risk &lt; Low &gt;</title>" in xml
    assert "Check it &amp; see &lt; here &gt;" in xml
    assert '<category term="Tech" />' in xml
    assert "<app:draft>no</app:draft>" in xml
