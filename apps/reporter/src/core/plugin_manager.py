import importlib.util
import json
import logging
import os
from typing import Any

from core.interfaces.plugin import IAyatoPlugin

logger = logging.getLogger(__name__)


class PluginManager:
    """Manages discovery and loading of reporter plugins."""

    def __init__(self, plugins_dir: str):
        self.plugins_dir = plugins_dir
        self.plugins: dict[str, dict[str, Any]] = {}

    def discover(self):
        """Scans the plugins directory for valid plugins."""
        abs_plugins_dir = os.path.abspath(self.plugins_dir)
        logger.info(f"Scanning for plugins in: {abs_plugins_dir}")

        if not os.path.exists(abs_plugins_dir):
            logger.warning(f"Plugins directory {abs_plugins_dir} does not exist.")
            return

        for entry in os.scandir(abs_plugins_dir):
            if entry.is_dir():
                manifest_path = os.path.join(entry.path, "manifest.json")
                logger.debug(
                    f"Checking directory: {entry.name} - manifest: {os.path.exists(manifest_path)}"
                )
                if os.path.exists(manifest_path):
                    try:
                        with open(manifest_path, encoding="utf-8") as f:
                            manifest = json.load(f)
                            plugin_id = manifest.get("id")
                            if plugin_id in ["tech", "weekly"]:
                                manifest["path"] = entry.path
                                self.plugins[plugin_id] = manifest
                                logger.info(
                                    f"Discovered plugin: {plugin_id} ({manifest.get('name')})"
                                )
                            else:
                                logger.warning(f"Skipping non-AI plugin: {plugin_id}")
                    except Exception as e:
                        logger.error(f"Failed to load manifest at {manifest_path}: {e}")

        logger.info(f"Discovery complete. Found {len(self.plugins)} plugins.")

    def load_plugin(self, plugin_id: str) -> type[IAyatoPlugin]:
        """Dynamically loads a plugin class by ID."""
        if plugin_id not in self.plugins:
            raise ValueError(f"Plugin {plugin_id} not discovered.")

        plugin_info = self.plugins[plugin_id]
        plugin_path = os.path.join(plugin_info["path"], "main.py")

        if not os.path.exists(plugin_path):
            raise FileNotFoundError(f"Plugin entry point not found at {plugin_path}")

        spec = importlib.util.spec_from_file_location(f"plugin_{plugin_id}", plugin_path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)

        # Expecting a class named 'Plugin' that implements IAyatoPlugin
        if hasattr(module, "Plugin"):
            return module.Plugin
        else:
            raise AttributeError(f"Module {plugin_path} does not define a 'Plugin' class.")

    def get_all_manifests(self) -> list[dict[str, Any]]:
        return list(self.plugins.values())
