from core.utils.url_util import format_base36, get_slug


def test_format_base36():
    """Test the base36 conversion helper."""
    assert format_base36(0) == "0"
    assert format_base36(10) == "a"
    assert format_base36(35) == "z"
    assert format_base36(36) == "10"
    # Portals often use specific values, let's check a larger one
    assert format_base36(123456) == "2n9c"


def test_get_slug_basic():
    """Test slug generation for basic strings."""
    assert get_slug("") == "report"
    assert get_slug("Hello World") == "hello-world"
    assert get_slug("Test_File_123") == "test-file-123"


def test_get_slug_url():
    """Test slug generation for full URLs (portal compatibility)."""
    url = "https://example.com/news/article-one?query=1"
    slug = get_slug(url)

    # Should be in format: {safe_part}-{hash}
    assert "-" in slug
    parts = slug.split("-")

    # safe_part might contain hyphens, so we join everything but the last part
    safe_part_actual = "-".join(parts[:-1])
    hash_part_actual = parts[-1]

    assert safe_part_actual == "article-one"
    # Hash should be base36
    assert hash_part_actual.isalnum()


def test_get_slug_consistency():
    """Ensures same input produces same slug."""
    inp = "https://techcrunch.com/2024/01/01/ai-news/"
    assert get_slug(inp) == get_slug(inp)


def test_get_slug_trailing_slash():
    """Test handling of trailing slashes in URLs."""
    url1 = "https://example.com/item"
    url2 = "https://example.com/item/"
    # The current logic might produce different slugs due to split("/")[-1]
    # Let's verify current behavior and see if it's acceptable.
    slug1 = get_slug(url1)
    slug2 = get_slug(url2)

    # Based on code: path_part = filename.split("/")[-1] or "article"
    # url1 split gives "item"
    # url2 split gives "" (empty), so it falls back to "article"
    # However, the HASH will be different because the full string is used for the hash.
    assert slug1 != slug2
