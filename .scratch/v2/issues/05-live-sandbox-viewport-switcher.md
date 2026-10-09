# 05: Live Sandbox with Viewport Switcher

**What to build:** Add an interactive in-browser preview tab on project detail pages (`/[slug]/[project]`) featuring a multi-device Viewport Switcher (Desktop / Tablet / Mobile), strict HTML5 sandbox isolation, seamless toggle to 16:9 Cover Image, and Peer Reactions bar.

**Blocked by:** 02: Explore Showcase Hub & Kudos Action Flow.

**Status:** ready-for-agent

- [ ] Add `Live Sandbox` tab alongside `16:9 Visual Proof` on `/[slug]/[project]`.
- [ ] Implement `ViewportSwitcher` component allowing visitors to toggle between Desktop (100% width), Tablet (768px), and Mobile (375px) frames.
- [ ] Embed external live demo inside `<iframe sandbox="allow-scripts allow-same-origin allow-forms" loading="lazy" referrerpolicy="no-referrer">` with prominent "Open in New Tab ↗" fallback link.
- [ ] Add `PeerReactions` bar with 4 instant emoji reaction counters (🚀 Mindblown, 💎 Clean Code, 🎨 Great UI, ⚡ Blazing Fast) and direct "Discuss on GitHub" link.
- [ ] Verify clickjacking defense and sandbox attributes pass security tests.
