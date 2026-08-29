import logging

from config import settings

logger = logging.getLogger(__name__)


def get_slug(filename: str) -> str:
    """
    Replicates the slug generation logic from the Portal's src/lib/api.ts.
    Used to ensure URL consistency between the Engine and the Web Portal.
    """
    if not filename:
        return "report"

    # Try to parse as URL
    if "://" in filename:
        try:
            # Simple URL parsing without external dependencies
            # (Matches logic: last part of path + hash)
            path_part = filename.split("/")[-1] or "article"
            if "?" in path_part:
                path_part = path_part.split("?")[0]

            # Java-style string hash (used in Portal's JS)
            hash_val = 0
            for char in filename:
                hash_val = ((hash_val << 5) - hash_val) + ord(char)
                hash_val &= 0xFFFFFFFF  # Keep as 32-bit int

            # Handle Signed Int (JS |= 0)
            if hash_val > 0x7FFFFFFF:
                hash_val -= 0x100000000

            # Convert to absolute base36 (Portal uses Math.abs(hash).toString(36))
            slug_hash = format_base36(abs(hash_val))

            # Final format: last_part-hash
            safe_part = "".join(c for c in path_part if c.isalnum() or c == "-")[:30].lower()
            return f"{safe_part}-{slug_hash}"
        except Exception as e:
            logger.warning(f"[URLUtil] URL slug fallback: {e}")

    # Fallback for non-URL filenames
    safe_name = "".join(c if c.isalnum() else "-" for c in filename).lower()
    return safe_name[:50].strip("-")


def format_base36(num: int) -> str:
    """Helper to convert int to base36 string."""
    alphabet = "0123456789abcdefghijklmnopqrstuvwxyz"
    if num == 0:
        return "0"
    arr = []
    while num:
        num, rem = divmod(num, 36)
        arr.append(alphabet[rem])
    arr.reverse()
    return "".join(arr)


def generate_portal_url(item_id: str) -> str:
    """Generates the full public URL for a given item_id."""
    slug = get_slug(item_id)
    base_url = settings.PORTAL_BASE_URL.rstrip("/")
    return f"{base_url}/reports/{slug}"
