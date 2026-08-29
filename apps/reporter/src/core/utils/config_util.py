import json
import logging
import os

import yaml

logger = logging.getLogger(__name__)


def load_json_config(file_path: str) -> dict:
    """Loads a JSON config file and returns a dictionary."""
    if not os.path.exists(file_path):
        return {}
    try:
        with open(file_path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        logger.exception(f"Failed to load JSON config from {file_path}")
        return {}


def load_yaml_config(file_path: str) -> dict:
    """Loads a YAML config file and returns a dictionary."""
    if not os.path.exists(file_path):
        return {}
    try:
        with open(file_path, encoding="utf-8") as f:
            return yaml.safe_load(f) or {}
    except Exception:
        logger.exception(f"Failed to load YAML config from {file_path}")
        return {}


def load_json_value(base_dir: str, filename: str, key: str, default: any) -> any:
    """Generic loader for a specific key from a JSON config file."""
    path = os.path.join(base_dir, filename)
    if os.path.exists(path):
        try:
            with open(path, encoding="utf-8") as f:
                data = json.load(f)
                return data.get(key, default)
        except Exception as e:
            logger.warning(f"Failed to load {filename} key '{key}': {e}")
    return default


def load_template(base_dir: str, name: str, default: str = "") -> str:
    """Loads a template file if it exists, otherwise returns empty string or env override."""
    path = os.path.join(base_dir, "data", "templates", name)
    if os.path.exists(path):
        try:
            with open(path, encoding="utf-8") as f:
                return f.read()
        except Exception:
            logger.debug(f"Template {name} not found or unreadable at {path}")
    return os.getenv(f"AFFILIATE_{name.upper().replace('.', '_')}", default)


def load_prompt(prompt_dir: str, name: str, default: str = "") -> str:
    """Loads a prompt file."""
    path = os.path.join(prompt_dir, name)
    if os.path.exists(path):
        try:
            with open(path, encoding="utf-8") as f:
                return f.read()
        except Exception:
            logger.debug(f"Prompt {name} not found or unreadable at {path}")
    return default
