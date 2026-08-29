import logging
import os

from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


def _resolve_secret(
    value: str, project_id: str = os.environ.get("GCP_PROJECT_ID", "auto-blog-469806")
) -> str:
    """
    Resolves a secret value if it looks like a GCP Secret Manager placeholder.
    Value should start with 'gsm_secret_'.
    """
    if not value or not isinstance(value, str) or not value.startswith("gsm_secret_"):
        return value

    try:
        from google.cloud import secretmanager

        # If we are local, Google SDK will look for GOOGLE_APPLICATION_CREDENTIALS
        client = secretmanager.SecretManagerServiceClient()
        name = f"projects/{project_id}/secrets/{value}/versions/latest"
        response = client.access_secret_version(request={"name": name})
        resolved_value = response.payload.data.decode("UTF-8").strip()
        return resolved_value
    except ImportError:
        logger.warning(
            f"[SecretResolver] google-cloud-secret-manager not installed. Cannot resolve {value}"
        )
        return value
    except Exception:
        logger.exception(f"[SecretResolver] Failed to resolve secret {value}")
        return value


class Settings:
    """
    Unified settings manager for the Ayato Reporter system.
    Centralizes environment variables, JSON/YAML configs, and GCM secrets.
    """

    # --- Directory Structure ---
    # BASE_DIR is now /app/src or .../src
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

    # PRODUCT_ROOT is the actual project root (parent of src)
    PRODUCT_ROOT = os.path.dirname(BASE_DIR)
    if BASE_DIR == "/app" or "/app" in BASE_DIR:
        PRODUCT_ROOT = "/app"

    # Runtime Data (DB, Logs) - Stays at root
    DATA_ROOT = os.path.join(PRODUCT_ROOT, "data")
    DB_ROOT = os.path.join(DATA_ROOT, "db")
    DB_PATH = os.path.join(DB_ROOT, "items.db")
    DB_LOGS = os.path.join(DB_ROOT, "logs")

    # Operational Assets (Templates, YAML Configs) - Moved to src/data
    ASSET_ROOT = os.path.join(BASE_DIR, "data")
    PROMPT_DIR = os.path.join(ASSET_ROOT, "prompts")

    # Internal Configs (JSON) - Moved to src/config
    INTERNAL_CONFIG_DIR = os.path.join(BASE_DIR, "config")

    # --- Cloud Credentials ---
    _gcp_key_path = os.path.join(PRODUCT_ROOT, "ayato-studio-9e54158381d3.json")
    if os.path.exists(_gcp_key_path):
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = _gcp_key_path

    # --- AI Model Config (Dynamic Properties) ---
    @property
    def AI_MODEL_LIGHT_TASK(self):
        from core.utils import config_util as _cu

        return _cu.load_json_value(
            self.INTERNAL_CONFIG_DIR, "models.json", "light_task", ["gemma-3-27b-it"]
        )

    @property
    def AI_MODEL_HEAVY_TASK(self):
        from core.utils import config_util as _cu

        return _cu.load_json_value(
            self.INTERNAL_CONFIG_DIR,
            "models.json",
            "heavy_task",
            ["gemini-3.1-flash-lite-preview"],
        )

    @property
    def AI_REPORT_MODEL(self):
        return self.AI_MODEL_HEAVY_TASK

    GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GOOGLE_AI_STUDIO_API_KEY")
    FRESHNESS_WINDOW_HOURS = int(os.environ.get("FRESHNESS_WINDOW_HOURS", "24"))
    RAW_ITEMS_TTL_DAYS = int(os.environ.get("RAW_ITEMS_TTL_DAYS", "3"))
    FRED_API_KEY = os.environ.get("FRED_API_KEY")

    # --- Supabase Config ---
    SUPABASE_URL = os.environ.get("SUPABASE_URL")
    SUPABASE_KEY = _resolve_secret(os.environ.get("SUPABASE_KEY"))

    # --- Storage Config ---
    STORAGE_TYPE = os.environ.get("STORAGE_TYPE", "local").lower()
    GCS_BUCKET_NAME = os.environ.get("GCS_BUCKET_NAME")

    # --- SNS Config ---
    X_API_KEY = _resolve_secret(os.environ.get("X_API_KEY"))
    X_API_SECRET = _resolve_secret(os.environ.get("X_API_SECRET"))
    X_ACCESS_TOKEN = _resolve_secret(os.environ.get("X_ACCESS_TOKEN"))
    X_ACCESS_TOKEN_SECRET = _resolve_secret(os.environ.get("X_ACCESS_TOKEN_SECRET"))
    X_POST_THRESHOLD = float(os.environ.get("X_POST_THRESHOLD", "50"))

    @property
    def BLUESKY_HANDLE(self):
        from core.utils import config_util as _cu

        return _cu.load_json_value(
            self.INTERNAL_CONFIG_DIR,
            "sns.json",
            "bluesky_handle",
            os.environ.get("BLUESKY_HANDLE", "ayato-studio.ai"),
        )

    @property
    def BLUESKY_HANDLE_FALLBACK(self):
        from core.utils import config_util as _cu

        return _cu.load_json_value(
            self.INTERNAL_CONFIG_DIR,
            "sns.json",
            "bluesky_handle_fallback",
        )

    BLUESKY_APP_PASSWORD = _resolve_secret(os.environ.get("BLUESKY_APP_PASSWORD"))
    BLUESKY_POST_THRESHOLD = float(os.environ.get("BLUESKY_POST_THRESHOLD", "0"))

    # --- Hatena Config ---
    HATENA_USER_ID = os.environ.get("HATENA_USER_ID") or os.environ.get("HATENA_BLOG_ID")
    HATENA_API_KEY = os.environ.get("HATENA_API_KEY") or os.environ.get("HATENA_BLOG_API_KEY")
    HATENA_TECH_BLOG_ID = os.environ.get("HATENA_TECH_BLOG_ID", "ai-researcher.hatenablog.com")
    HATENA_FINANCE_BLOG_ID = os.environ.get(
        "HATENA_FINANCE_BLOG_ID", "ai-economy-analysis.hatenablog.com"
    )

    # --- General Meta ---
    PORTAL_BASE_URL = os.environ.get("PORTAL_BASE_URL", "https://ayato-studio.ai")
    IS_DEBUG_MODE = os.environ.get("AYATO_DEBUG", "false").lower() == "true"
    GCP_PROJECT_ID = os.environ.get("GCP_PROJECT_ID")

    # --- GitHub Automation Config ---
    GITHUB_TOKEN = _resolve_secret(os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_PAT"))
    GITHUB_REPO_OWNER = os.environ.get("GITHUB_REPO_OWNER", "Ayato-AI-for-Auto")
    GITHUB_REPO_NAME = os.environ.get("GITHUB_REPO_NAME", "ayato-studio-portal")

    # --- Fetching Config ---
    DEFAULT_HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,ja;q=0.8",
    }

    # --- Tech Plugin specialized settings ---
    ARXIV_CORE_CATEGORIES = ["cs.AI", "cs.LG", "stat.ML", "cs.CL", "cs.CV"]
    ARXIV_MAX_RESULTS = 50

    # --- RSS / Keywords (Loaded via Utils) ---
    @property
    def RSS_FEEDS(self):
        """Standard RSS feeds merged from all feeds_*.yaml files."""
        from core.utils import config_util as _cu

        # Feeds are operational assets, so look in ASSET_ROOT/config
        config_dir = os.path.join(self.ASSET_ROOT, "config")
        feeds = {}
        if os.path.exists(config_dir):
            for f in os.listdir(config_dir):
                if f.startswith("feeds_") and f.endswith(".yaml"):
                    feeds.update(_cu.load_yaml_config(os.path.join(config_dir, f)))
        return feeds

    @property
    def ENERGY_RSS_FEEDS(self):
        return self.RSS_FEEDS.get("energy_feeds", [])

    @property
    def TECH_RSS_FEEDS(self):
        return self.RSS_FEEDS.get("tech_feeds", [])

    @property
    def FINANCE_RSS_FEEDS(self):
        return self.RSS_FEEDS.get("finance_feeds", [])

    @property
    def SOURCE_METADATA(self):
        """Mapping from URL to human-readable source labels (Name, Region)."""
        from core.utils import config_util as _cu

        config_path = os.path.join(self.ASSET_ROOT, "config", "sources.yaml")
        if os.path.exists(config_path):
            return _cu.load_yaml_config(config_path).get("source_metadata", {})
        return {}

    # --- Keywords ---
    @property
    def NO_GO_KEYWORDS(self):
        from core.utils import config_util as _cu

        return _cu.load_json_value(self.INTERNAL_CONFIG_DIR, "sns.json", "no_go_keywords", [])

    # Backward Compatibility for Plugins
    @staticmethod
    def _load_prompt(*args, **kwargs):
        from core.utils import config_util as _cu

        return _cu.load_prompt(*args, **kwargs)

    @staticmethod
    def _load_template(*args, **kwargs):
        from core.utils import config_util as _cu

        return _cu.load_template(*args, **kwargs)

    @staticmethod
    def _load_json_config(*args, **kwargs):
        from core.utils import config_util as _cu

        return _cu.load_json_config(*args, **kwargs)


# Instantiate singleton
settings = Settings()
