"""GitHub API helpers (Chapter 3)."""


class GitHubTools:
    def __init__(self, token: str) -> None:
        self._token = token
