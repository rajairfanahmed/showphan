# 08: GitHub Public Repository Import

**What to build:**
One-click repository metadata prefilling in the project creation form. The developer clicks "Import from GitHub", searches their public repositories fetched through a server-side GitHub API call using their token, and selects a repository. The form prefills Title, Summary, Repository URL, Homepage URL, and maps primary language and topics to the technology catalog without overwriting existing data without confirmation.

**Blocked by:** 03

**Status:** resolved

- [x] Implement server API route `GET /api/github/repos` using the developer's OAuth access token.
- [x] Build GitHub Import modal with repository search and pagination/scrolling.
- [x] Implement metadata parser that extracts title, description, `html_url`, `homepage`, primary language, and repository topics.
- [x] Add form population handler with overwrite-protection dialog if fields already contain user text.
