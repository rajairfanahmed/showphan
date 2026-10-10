# 13. Public Developer Profile and Portfolio Architecture

Date: 2026-10-10

## Status

Accepted

## Context

The Public Developer Profile page (`/[slug]`) is the single-link portfolio that Developers share on their GitHub profiles, Twitter/X, and job applications. It serves as an authoritative proof-of-work showcase for peers, clients, and technical recruiters.

To maximize signal for visitors while preserving blazing performance and the platform's Daylight Ceramic aesthetic, we establish the architecture for the developer portfolio page.

## Decision

We establish the following design and technical invariants for `/[slug]`:

1. **Daylight Ceramic Profile Header**:
   - Built with the Ceramic Daylight System (`#f5f6fa` canvas, `#ffffff` floating cards, `#0c0d12` obsidian text, `#0052ff` cobalt highlights).
   - High-contrast developer presentation: high-res avatar, display name, immutable `@slug`, technical bio, and direct GitHub profile link.
   - Proof-of-work badges: **Total Community Kudos ★** (aggregated across all published projects) and **Showcases Published 🚀**.
   - 1-click **Share Portfolio 🔗** button with instant clipboard copy and toast confirmation.

2. **Featured Work Top Shelf vs. Showcase Archive**:
   - Distinct **Featured Work** top shelf displaying the developer's flagship projects in high-impact 16:9 cards.
   - Comprehensive **All Projects** responsive fluid grid below for the developer's remaining catalog.

3. **Instant Interactive Filter Tabs**:
   - Client-side zero-latency filtering tabs allowing visitors and recruiters to filter the developer's projects by:
     - **All Projects**
     - **Most Kudos ★**
     - **Primary Technologies** (dynamic filter pills based on the developer's actual tech stacks, e.g., React, TypeScript, Rust, Python).

4. **Strict 16:9 Pristine Media Card Standards**:
   - Every project card features a strict 16:9 aspect ratio cover image with hover micro-lift and shadow.
   - Project title, punchy 140-character summary, kudos count badge, and technology stack chips with official brand icon accents.
   - Direct link to the standalone project showcase at `/[slug]/[project]`.

5. **Sequence Progression**:
   - Once the Public Developer Profile page (`/[slug]`) is implemented, the next focus area will be the **Dashboard Page (`/dashboard`)**.

## Consequences

- Recruiters can evaluate a developer's engineering capabilities and specific tech stack proficiencies in seconds.
- Developers get a single-link portfolio with genuine proof-of-work credibility.
- Cohesive, Awwwards-caliber Daylight Ceramic aesthetic across all pages.
