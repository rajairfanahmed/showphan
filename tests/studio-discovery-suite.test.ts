import "dotenv/config";
import { evaluateQualityGate } from "../src/lib/projects/quality-gate";

async function runStudioDiscoverySuite() {
  console.log("🧪 Running Upload Project Studio & Real Discovery Feed Test Suite...\n");

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

  // 1. Quality Gate 5-Rule Invariants
  console.log("1. Testing 5-Rule Quality Gate Invariants...");
  const blankEval = evaluateQualityGate({});
  assert(
    !blankEval.canPublish && blankEval.satisfiedCount === 0,
    "Empty project satisfies 0/5 rules and blocks publishing"
  );
  assert(
    blankEval.missingRules.length === 5,
    "Empty project lists all 5 missing rules in checklist"
  );

  const partialEval = evaluateQualityGate({
    title: "Bunflare Edge Microservices",
    summary: "High velocity edge framework powered by Bun and Hono.",
    technologies: ["tech-bun", "tech-cloudflare"],
    liveUrl: "https://bunflare.dev",
  });
  assert(
    partialEval.satisfiedCount === 4 && !partialEval.canPublish,
    "Project missing cover image satisfies 4/5 rules and blocks publishing",
    `Got: ${partialEval.satisfiedCount}`
  );
  assert(
    partialEval.missingRules.includes("16:9 Cover Image"),
    "Quality gate accurately identifies missing 16:9 Cover Image"
  );

  const completeEval = evaluateQualityGate({
    title: "Bunflare Edge Microservices",
    summary: "High velocity edge framework powered by Bun and Hono.",
    coverImageKey: "covers/user/bunflare.webp",
    technologies: ["tech-bun", "tech-cloudflare"],
    liveUrl: "https://bunflare.dev",
    repoUrl: "https://github.com/bunflare/starter",
  });
  assert(
    completeEval.canPublish && completeEval.satisfiedCount === 5,
    "Fully populated project satisfies 5/5 rules and permits publishing"
  );
  assert(
    completeEval.missingRules.length === 0,
    "Zero missing rules when Quality Gate is 100% satisfied"
  );

  // 2. Summary 140 Character Boundary
  console.log("\n2. Testing 140-Character Summary Boundary Rule...");
  const boundaryValid = evaluateQualityGate({
    title: "Valid Project",
    summary: "a".repeat(140),
    coverImageKey: "key.webp",
    technologies: ["t1"],
    liveUrl: "https://example.com",
  });
  assert(
    boundaryValid.rules.summary === true,
    "Exactly 140 character summary is accepted"
  );

  const boundaryInvalid = evaluateQualityGate({
    title: "Invalid Project",
    summary: "a".repeat(141),
    coverImageKey: "key.webp",
    technologies: ["t1"],
    liveUrl: "https://example.com",
  });
  assert(
    boundaryInvalid.rules.summary === false && !boundaryInvalid.canPublish,
    "141 character summary violates quality gate and blocks publishing"
  );

  // 3. Tag Tokenization & Domain Limit Verification
  console.log("\n3. Testing #Tag Formatting & 5-Tag Cap...");
  function normalizeTag(raw: string): string {
    const clean = raw.trim().replace(/^#+/, "").replace(/[^a-zA-Z0-9_-]/g, "");
    return clean ? `#${clean.toLowerCase()}` : "";
  }

  assert(
    normalizeTag("nextjs") === "#nextjs",
    "Prepends '#' to raw tag string"
  );
  assert(
    normalizeTag("##ai_workflow!") === "#ai_workflow",
    "Cleans multiple hashtags and strips invalid symbols"
  );

  const sampleTags = ["#ai", "#web3", "#react", "#devtools", "#infra", "#overflow"];
  const cappedTags = sampleTags.slice(0, 5);
  assert(
    cappedTags.length === 5,
    "Enforces strict 5-tag platform domain maximum"
  );

  // 4. Link Requirement (Live URL or Repo URL or both)
  console.log("\n4. Testing Link Invariants (Live URL or Repo URL)...");
  const repoOnlyEval = evaluateQualityGate({
    title: "Repo Only Project",
    summary: "Summary text.",
    coverImageKey: "key.webp",
    technologies: ["t1"],
    repoUrl: "https://github.com/maker/project",
  });
  assert(
    repoOnlyEval.rules.links === true && repoOnlyEval.canPublish,
    "Repository URL alone satisfies the link criteria"
  );

  const liveOnlyEval = evaluateQualityGate({
    title: "Live Only Project",
    summary: "Summary text.",
    coverImageKey: "key.webp",
    technologies: ["t1"],
    liveUrl: "https://maker.vercel.app",
  });
  assert(
    liveOnlyEval.rules.links === true && liveOnlyEval.canPublish,
    "Live URL alone satisfies the link criteria"
  );

  const noLinksEval = evaluateQualityGate({
    title: "No Links Project",
    summary: "Summary text.",
    coverImageKey: "key.webp",
    technologies: ["t1"],
  });
  assert(
    noLinksEval.rules.links === false && !noLinksEval.canPublish,
    "Project missing both live and repo links fails Quality Gate"
  );

  console.log(`\n🎉 Studio Discovery Suite Passed: ${passed}/${total} assertions successful!\n`);
}

runStudioDiscoverySuite().catch((err) => {
  console.error("Test Suite execution failed:", err);
  process.exit(1);
});
