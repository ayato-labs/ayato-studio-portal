import logging

from github import Github

from config import settings

logger = logging.getLogger(__name__)


class GithubService:
    """
    Service to handle GitHub-related automations.
    Primarily used for triggering portal rebuilds after content updates.
    """

    def __init__(self, token: str):
        self._token = token
        self._gh = None
        if not token:
            logger.warning("[GithubService] GITHUB_TOKEN is missing. Rebuilds will fail.")

    @property
    def client(self):
        if self._gh is None and self._token:
            self._gh = Github(self._token)
        return self._gh

    async def trigger_portal_rebuild(self):
        """
        Triggers a 'repository_dispatch' event to the portal repository.
        This will kick off the CI/CD pipeline (e.g., Astro build and deploy).
        """
        if not self.client:
            logger.error(
                "[GithubService] Cannot trigger rebuild: GitHub client is not initialized."
            )
            return False

        repo_full_name = f"{settings.GITHUB_REPO_OWNER}/{settings.GITHUB_REPO_NAME}"
        event_type = "rebuild_portal"

        try:
            # Note: PyGithub methods are mostly synchronous, but we can run them in a thread if needed.
            # For a single dispatch call, direct execution is usually acceptable in this orchestrator.
            repo = self.client.get_repo(repo_full_name)
            repo.create_repository_dispatch(event_type=event_type)

            logger.info(
                f"[GithubService] Portal rebuild triggered successfully for {repo_full_name} (Event: {event_type})"
            )
            return True
        except Exception as e:
            logger.error(f"[GithubService] Failed to trigger portal rebuild: {e}")
            return False

    def close(self):
        # PyGithub doesn't require explicit close for standard REST client
        pass
