# Out-of-Scope Decision: Social Timeline Feeds & Public Comments

**Decision Date:** October 9, 2026  
**Status:** Rejected / Out of Scope for Showphan Core  
**Topic:** Algorithmic news feeds, public comment threads, follower metrics, and upvote feeds

---

## Rationale for Rejection

1. **Portfolio Ethos vs Social Media Noise:**  
   Showphan is a showcase for craftsmanship and engineering work, not an engagement-farming social network. Profiles exist to impress recruiters, peer engineers, and clients without vanity metrics or comment toxicity.
2. **Moderation Overhead:**  
   Public comment threads require spam filtering, content moderation engines, abuse reporting pipelines, and persistent user banning mechanisms that distract from core portfolio tooling.
3. **Performance Preservation:**  
   Social feeds require high-frequency writes, Redis fanout caches, and expensive follower graph queries that degrade database read performance for public showcase pages.

---

## Permitted Evolution
If community discovery is introduced in v1.2+, it will be structured as a curated, searchable developer directory (opt-in via `searchVisible`) rather than an algorithmic social timeline.
