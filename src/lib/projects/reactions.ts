/**
 * Peer Reactions Domain Engine
 * Provides lightweight, positive community feedback mechanics (ADR 0007)
 * 4 standard reactions: Mindblown (🚀), Clean Code (💎), Great UI (🎨), Blazing Fast (⚡)
 */

export type ReactionType = "mindblown" | "cleanCode" | "greatUi" | "blazingFast";

export interface ReactionCounts {
  mindblown: number;
  cleanCode: number;
  greatUi: number;
  blazingFast: number;
}

export const REACTION_DEFINITIONS: Record<
  ReactionType,
  { emoji: string; label: string; description: string }
> = {
  mindblown: {
    emoji: "🚀",
    label: "Mindblown",
    description: "Exceptional innovation and creative execution",
  },
  cleanCode: {
    emoji: "💎",
    label: "Clean Code",
    description: "Elegant architecture and high-quality implementation",
  },
  greatUi: {
    emoji: "🎨",
    label: "Great UI",
    description: "Polished aesthetics and thoughtful user experience",
  },
  blazingFast: {
    emoji: "⚡",
    label: "Blazing Fast",
    description: "Outstanding runtime speed and responsiveness",
  },
};

export const VALID_REACTION_TYPES = Object.keys(
  REACTION_DEFINITIONS
) as ReactionType[];

// In-memory persistent reaction store keyed by project ID and visitor/user ID
// Supports fast, mock-safe operation in tests and serverless execution
const reactionStore = new Map<string, { counts: ReactionCounts; votes: Map<string, Set<ReactionType>> }>();

function getOrCreateProjectRecord(projectId: string) {
  let record = reactionStore.get(projectId);
  if (!record) {
    // Generate deterministic baseline reactions based on project ID hash
    let hash = 0;
    for (let i = 0; i < projectId.length; i++) {
      hash = (hash << 5) - hash + projectId.charCodeAt(i);
      hash |= 0;
    }
    const abs = Math.abs(hash);

    record = {
      counts: {
        mindblown: (abs % 7) + 2,
        cleanCode: ((abs >> 2) % 5) + 1,
        greatUi: ((abs >> 4) % 8) + 3,
        blazingFast: ((abs >> 6) % 6) + 1,
      },
      votes: new Map<string, Set<ReactionType>>(),
    };
    reactionStore.set(projectId, record);
  }
  return record;
}

/**
 * Retrieve aggregated reaction counts for a project
 */
export async function getProjectReactions(projectId: string): Promise<ReactionCounts> {
  const record = getOrCreateProjectRecord(projectId);
  return { ...record.counts };
}

/**
 * Toggle a visitor's reaction on a project
 */
export async function toggleProjectReaction(
  projectId: string,
  reactionType: ReactionType,
  visitorId = "anonymous"
): Promise<{ counts: ReactionCounts; userReacted: boolean }> {
  if (!VALID_REACTION_TYPES.includes(reactionType)) {
    throw new Error(`INVALID_REACTION: "${reactionType}" is not a recognized reaction.`);
  }

  const record = getOrCreateProjectRecord(projectId);
  let userVotes = record.votes.get(visitorId);
  if (!userVotes) {
    userVotes = new Set<ReactionType>();
    record.votes.set(visitorId, userVotes);
  }

  let userReacted = false;

  if (userVotes.has(reactionType)) {
    // Revoke reaction
    userVotes.delete(reactionType);
    record.counts[reactionType] = Math.max(0, record.counts[reactionType] - 1);
    userReacted = false;
  } else {
    // Add reaction
    userVotes.add(reactionType);
    record.counts[reactionType] += 1;
    userReacted = true;
  }

  return {
    counts: { ...record.counts },
    userReacted,
  };
}

/**
 * Reset reactions for test fixtures
 */
export function resetReactionStore(): void {
  reactionStore.clear();
}
