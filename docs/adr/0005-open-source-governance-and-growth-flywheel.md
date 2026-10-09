# 5. Open Source Governance, Creator Attribution, and Growth Flywheel

## Context
Showphan V1 was architected as a free-tier portfolio platform, but lacked formal open-source governance, viral loops for repo growth, and public discoverability for search engines. To scale toward V2 and position Showphan as a candidate for Product of the Year, we required a clear licensing model, viral distribution hooks, and search engine crawl paths.

## Decision
1. **MIT License**: Formally adopted the MIT License for the code repository, ensuring zero friction for developers to adopt, fork, and star the project, while protecting the Showphan name and creator copyright.
2. **Permanent Creator Attribution**: Fixed creator attribution to Raja Irfan Ahmed across the global footer, root metadata (`authors`, `creator`, `publisher`), JSON-LD schema, and README badges, linking directly to [https://rajairfanahmed.vercel.app](https://rajairfanahmed.vercel.app).
3. **GitHub Username Slug Mirroring**: Auto-derived `Profile Slug` from the developer's GitHub handle (`profile.login`) upon authentication, resolving database constraint crashes while guaranteeing verifiable identity.
4. **Dynamic Badge Card Growth Loop**: Established an API route (`/api/badge/[slug]`) generating dynamic SVG proof-of-work cards for developers to embed in their GitHub profile READMEs, driving recursive traffic and repo stars.
5. **Showcase Directory (/explore)**: Added a public catalog with technology filtering and search to establish deep crawl paths for Google, unlocking Google Sitelinks like Dev.to.
6. **Live Sandbox Centerpiece**: Selected in-browser live demo embeds (Sandpack / responsive sandbox) as the flagship V2 feature.

## Consequences
- Open source community can freely contribute under a clear `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, and `SECURITY.md`.
- Developers actively promote Showphan by placing Badge Cards in their personal GitHub READMEs.
- Organic search crawlability expands dramatically via `/explore` and dynamic sitemaps.
