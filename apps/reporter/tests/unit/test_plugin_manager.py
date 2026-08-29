import json
from unittest.mock import patch

import pytest

from core.plugin_manager import PluginManager


@pytest.fixture
def temp_plugins_dir(tmp_path):
    """Create a temporary plugins directory for testing."""
    plugins_dir = tmp_path / "plugins"
    plugins_dir.mkdir()

    # Create a dummy 'tech' plugin
    tech_dir = plugins_dir / "tech"
    tech_dir.mkdir()
    manifest = {
        "id": "tech",
        "name": "Tech Plugin",
        "version": "1.0.0",
        "main": "main.py",
    }
    (tech_dir / "manifest.json").write_text(json.dumps(manifest))
    (tech_dir / "main.py").write_text(
        "class Plugin:\n    async def run(self, container, force=False): return [], []"
    )

    # Create a dummy 'weekly' plugin
    weekly_dir = plugins_dir / "weekly"
    weekly_dir.mkdir()
    w_manifest = {
        "id": "weekly",
        "name": "Weekly Plugin",
        "version": "1.0.0",
        "main": "main.py",
    }
    (weekly_dir / "manifest.json").write_text(json.dumps(w_manifest))
    (weekly_dir / "main.py").write_text(
        "class Plugin:\n    async def run(self, container, force=False): return [], []"
    )

    return plugins_dir


def test_plugin_manager_discovery(temp_plugins_dir):
    """Verify that PluginManager finds all plugins with a valid manifest."""
    with patch("core.plugin_manager.logger"):
        pm = PluginManager(str(temp_plugins_dir))
        pm.discover()
        plugins = pm.plugins

        assert "tech" in plugins
        assert "weekly" in plugins
        assert len(plugins) == 2


def test_plugin_manager_initialization(temp_plugins_dir):
    """Verify that PluginManager finds plugins and provides access to their classes."""
    with patch("core.plugin_manager.logger"):
        pm = PluginManager(str(temp_plugins_dir))
        pm.discover()

        assert "tech" in pm.plugins
        assert "weekly" in pm.plugins

        # Load the plugin class and verify it has a run method
        plugin_cls = pm.load_plugin("tech")
        assert hasattr(plugin_cls, "run")


def test_plugin_manager_get_plugin(temp_plugins_dir):
    """Verify specific plugin retrieval by ID."""
    with patch("core.plugin_manager.logger"):
        pm = PluginManager(str(temp_plugins_dir))
        pm.discover()

        plugin = pm.load_plugin("tech")
        assert plugin is not None
        with pytest.raises(ValueError):
            pm.load_plugin("invalid")
