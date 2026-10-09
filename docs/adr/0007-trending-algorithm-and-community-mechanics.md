# 7. Trending Algorithm, Community Kudos, and Discovery Architecture

## Context
A standalone portfolio platform risks low retention once a developer publishes their link. To drive daily recurring engagement and position Showphan as a community destination, we required a dynamic trending mechanism, lightweight feedback loops, and an expansive page hierarchy for search engine indexing.

## Decision
1. **GitHub-Verified Kudos**: Implemented a 1-vote-per-developer Kudos model in Prisma (`Kudos` table with `@@unique([userId, projectId])`), preventing bot manipulation and vote farming.
2. **Time-Decay Trending Algorithm**: Adopted a logarithmic decay score formula `Score = (Kudos + 1) / (Age_hours + 2)^1.5`, ensuring the trending feed surfaces newly launched, high-momentum projects rather than static all-time leaders.
3. **Automated "Project of the Day"**: Instituted a 24-hour spotlight banner on the homepage awarded to the highest-velocity project, triggering organic creator announcements on X, LinkedIn, and Reddit.
4. **Peer Reactions over Unmoderated Comments**: Standardized feedback on 4 positive peer reaction badges (🚀 Mindblown, 💎 Clean Code, 🎨 Great UI, ⚡ Blazing Fast) paired with a direct "Discuss on GitHub" button, avoiding toxic comment moderation while directing community traffic to the creator's repository.
5. **Inspiration Vault (/dashboard/bookmarks)**: Provided authenticated developers with a private bookmarking collection to save projects discovered in `/explore`.
6. **10-Route Application Map**: Cemented the canonical routing structure spanning public discovery (`/explore`, `/explore/[tech]`), profiles, showcases, studio, and dashboard.

## Consequences
- Every project receives an objective, tamper-resistant quality score.
- Community feedback is uniformly positive and constructive without administrative burden.
- Retention is reinforced by daily visits to check trending rankings and save inspiration.
