import pytest
from github import GithubException

from config import settings
from core.services.github_service import GithubService


def test_github_service_real_init():
    """Unit Test (Real): Verify GitHub service initializes correctly."""
    service = GithubService(settings.GITHUB_TOKEN)
    assert service is not None
    assert service._token == settings.GITHUB_TOKEN


def test_github_service_invalid_token():
    """Unit Test (Real): Verify GitHub API fails with fake token."""
    # This might not fail until we access a property that triggers API call
    service = GithubService("fake_token_12345")

    # Client property itself might succeed (lazy init), but API call should fail
    client = service.client
    with pytest.raises(GithubException):
        _ = client.get_user().login
