# 9. Dynamic Social Previews, Sandbox Isolation, and Star Growth Widget

## Context
Following decisions on the frontend motion system and custom technology models, we addressed open questions around social sharing assets, iframe preview security, repository growth widgets, and platform curation limits.

## Decision
1. **Dynamic OpenGraph Engine (`ImageResponse`)**: Replaced the static fallback image (`vercel.svg`) with dynamic Next.js OpenGraph image generators (`/api/og/profile` and `/api/og/project`), rendering 1200×630 dark-mode cards with developer avatars, project titles, tech badges, and proof-of-work indicators for Twitter/LinkedIn shares.
2. **Sandbox Isolation & Safety**: Enforced strict HTML5 iframe sandbox attributes (`sandbox="allow-scripts allow-same-origin allow-forms"`, `loading="lazy"`, `referrerpolicy="no-referrer"`) for the Live Sandbox viewer, with an explicit "Open in New Tab" escape hatch to defend visitors against clickjacking or unauthorized navigation.
3. **Pure CSS Performance Guarantees**: Confirmed that all ambient lighting, border halos, and micro-interactions will use hardware-accelerated CSS and Tailwind variables (`transform: translate3d`, `opacity`, CSS radial gradients) without adding runtime JavaScript animation dependencies.
4. **Header & Hero Star Widget with Creator Link**: Upgraded the repository link in the header and homepage hero into an interactive GitHub Star widget showing real-time star counts, accompanied by a direct link to Raja Irfan Ahmed's portfolio ([https://rajairfanahmed.vercel.app](https://rajairfanahmed.vercel.app)).
5. **Quality Curation Quota**: Confirmed the 20-project limit per developer (with up to 6 featured projects) to maintain Showphan as a high-signal proof-of-work platform rather than an uncurated code repository dumper.

## Consequences
- Every social share generates a high-fidelity visual card, multiplying organic viral traffic.
- Live website testing is completely safe and isolated from the core Showphan domain.
- Bundle sizes remain ultra-lean, keeping load times sub-second.
- The creator's personal portfolio receives persistent visibility across all platform interactions.
