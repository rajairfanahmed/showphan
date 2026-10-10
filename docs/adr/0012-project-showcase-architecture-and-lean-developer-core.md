# 12. Project Showcase Architecture and Lean Developer Core

Date: 2026-10-10

## Status

Accepted

## Context

The Project Detail Showcase page (`/[slug]/[project]`) is the primary destination where peers, recruiters, and engineering managers evaluate a Developer's work.

Earlier explorations considered embedding heavy in-browser code emulators or iframe sandbox viewers (Sandpack / iframe preview) and embeddable README badge generators. However, these introduced significant browser bloat, iframe security sandboxing hurdles (X-Frame-Options blocks by modern web apps), and distracted from the core purpose of Showphan: highlighting a developer's real-world engineering craftsmanship with blistering performance.

## Decision

We streamline the Project Detail Showcase page to focus strictly on high-impact core features that make the platform live and genuinely useful for developers:

1. **Pristine 16:9 Media Canvas with High-Resolution Lightbox**:
   - Eliminate heavy embedded iframe sandbox viewers.
   - Display a verified, crisp 16:9 Pristine Cover Image with an interactive high-resolution modal Lightbox for deep UI inspection.
2. **High-Visibility Launch Bar**:
   - Render direct, high-contrast action buttons for "Live Site ↗" (Electric Cobalt `#0052ff`) and "Source Code ↗" (Ceramic white border), linking directly to the real application and GitHub repository.
3. **Daylight Ceramic Aesthetics**:
   - Zero orange or amber tones.
   - Silk mineral canvas (`#f5f6fa`), ceramic floating cards (`#ffffff`), and high-contrast obsidian typography (`#0c0d12`).
4. **Interactive Engagement & Peer Feedback**:
   - Floating / sticky interaction dock containing authenticated Kudos voting, Inspiration Vault bookmarking, and 4 standardized Peer Reactions (🚀 Mindblown, 💎 Clean Code, 🎨 Great UI, ⚡ Blazing Fast) with optimistic UI updates.
5. **Technical Deep-Dive**:
   - Rich Markdown description with GitHub-flavored Markdown and code block styling.
   - Structured sections for Role & Architectural Decisions and Key Learnings.
   - Official Technology Stack badges with icon brand accents.
6. **Developer Authority & Cross-Discovery**:
   - Authoritative Developer Profile card at the conclusion of the article, linking directly to `/[slug]`.
   - "More by Creator" 3-card dynamic shelf to encourage exploration across the developer's portfolio.

## Consequences

- Faster load times and zero iframe security vulnerabilities.
- Frictionless navigation to live developer deployments and GitHub source code.
- Lean, focused UI aligned with Awwwards-level Daylight aesthetics.
