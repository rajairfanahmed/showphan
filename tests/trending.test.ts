import { calculateTrendingScore } from "../src/lib/projects/trending";

function runTrendingAlgorithmTests() {
  console.log("🧪 Running Trending Algorithm TDD Suite...\n");

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    total++;
    if (condition) {
      console.log(`   ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`   ❌ [FAIL] ${testName}${details ? ` - ${details}` : ""}`);
      throw new Error(`Assertion failed: ${testName}`);
    }
  }

  const now = new Date("2026-10-09T12:00:00Z");

  // Test 1: Brand new project with 0 kudos
  console.log("1. Base Score for New Project with 0 Kudos");
  const newProjectDate = new Date("2026-10-09T12:00:00Z");
  const baseScore = calculateTrendingScore(0, newProjectDate, now);
  // (0 + 1) / (0 + 2)^1.5 = 1 / 2.828427 ~= 0.3536
  assert(
    Math.abs(baseScore - 0.3536) < 0.001,
    "Calculates expected baseline score for brand new project",
    `Expected ~0.3536, got ${baseScore}`
  );

  // Test 2: Project with 10 kudos after 1 hour
  console.log("\n2. Project with Active Momentum (10 Kudos at 1 Hour)");
  const activeDate = new Date("2026-10-09T11:00:00Z");
  const activeScore = calculateTrendingScore(10, activeDate, now);
  // (10 + 1) / (1 + 2)^1.5 = 11 / 3^1.5 = 11 / 5.19615 ~= 2.1170
  assert(
    Math.abs(activeScore - 2.117) < 0.001,
    "Calculates accurate score with positive kudos and 1h age",
    `Expected ~2.117, got ${activeScore}`
  );

  // Test 3: Velocity Outranks Stale Volume (The Core Innovation)
  console.log("\n3. Velocity Outranks Stale All-Time Volume");
  // Fresh project: 2 hours old, 15 kudos
  const freshDate = new Date("2026-10-09T10:00:00Z");
  const freshScore = calculateTrendingScore(15, freshDate, now);
  // (15 + 1) / (2 + 2)^1.5 = 16 / 4^1.5 = 16 / 8 = 2.0

  // Stale project: 70 hours old, 40 kudos (high all-time volume, but stalled)
  const staleDate = new Date(now.getTime() - 70 * 60 * 60 * 1000);
  const staleScore = calculateTrendingScore(40, staleDate, now);
  // (40 + 1) / (70 + 2)^1.5 = 41 / 72^1.5 = 41 / 610.94 ~= 0.0671

  assert(
    freshScore > staleScore,
    "Fresh project with 15 kudos outranks 70h-old project with 40 kudos",
    `Fresh: ${freshScore}, Stale: ${staleScore}`
  );

  // Test 4: Handles edge cases gracefully (negative kudos or future timestamp)
  console.log("\n4. Edge Cases: Negative Kudos & Future Dates");
  const futureDate = new Date("2026-10-09T13:00:00Z");
  const futureScore = calculateTrendingScore(5, futureDate, now);
  // Age should floor at 0: (5 + 1) / (0 + 2)^1.5 = 6 / 2.8284 ~= 2.1213
  assert(
    Math.abs(futureScore - 2.1213) < 0.001,
    "Future timestamps clamped to age 0 without crashing",
    `Expected ~2.1213, got ${futureScore}`
  );

  const negKudosScore = calculateTrendingScore(-5, newProjectDate, now);
  assert(
    negKudosScore === baseScore,
    "Negative kudos clamped to 0",
    `Expected ${baseScore}, got ${negKudosScore}`
  );

  console.log(`\n🎉 All ${passed}/${total} Trending Algorithm Unit Tests PASSED!\n`);
}

runTrendingAlgorithmTests();
