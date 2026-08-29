import pytest

from core.storage.supabase_storage import SupabaseStorage


@pytest.fixture
def storage():
    # Instantiate SupabaseStorage (dummy credentials as we only test _sanitize)
    return SupabaseStorage("https://example.com", "key")


def test_sanitize_category_basic(storage):
    assert storage._sanitize("  Energy  ") == "Energy"
    assert storage._sanitize("AI/Tech\n") == "AI/Tech"


def test_sanitize_category_empty_variants(storage):
    assert storage._sanitize("") == "News"
    assert storage._sanitize(None) == "News"
    assert storage._sanitize("   ") == "News"
    assert storage._sanitize("\n\t") == "News"


def test_sanitize_category_long_string(storage):
    long_cat = "A" * 100
    sanitized = storage._sanitize(long_cat)
    assert len(sanitized) == 50
    assert sanitized == "A" * 50


def test_sanitize_category_unicode(storage):
    assert storage._sanitize("エネルギー") == "エネルギー"
    assert storage._sanitize("🚀 Tech") == "🚀 Tech"


def test_sanitize_category_non_printable(storage):
    # \x00 is a control character
    assert storage._sanitize("Tech\x00Code") == "TechCode"


def test_sanitize_market_default(storage):
    assert storage._sanitize("", default="general") == "general"
    assert storage._sanitize(None, default="general") == "general"
