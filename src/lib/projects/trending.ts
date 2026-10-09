/**
 * Calculates the time-decay trending score for a project.
 * Uses logarithmic decay: Score = (kudos + 1) / (ageHours + 2)^1.5
 *
 * @param kudosCount Number of verified kudos awarded to the project.
 * @param createdAt Creation timestamp of the project.
 * @param now Current timestamp (optional, defaults to current time).
 * @returns Trending score rounded to 4 decimal places.
 */
export function calculateTrendingScore(
  kudosCount: number,
  createdAt: Date,
  now: Date = new Date()
): number {
  const safeKudos = Math.max(0, Number(kudosCount) || 0);
  const diffMs = now.getTime() - createdAt.getTime();
  const ageHours = Math.max(0, diffMs / (1000 * 60 * 60));

  const numerator = safeKudos + 1;
  const denominator = Math.pow(ageHours + 2, 1.5);

  const rawScore = numerator / denominator;
  return Math.round(rawScore * 10000) / 10000;
}
