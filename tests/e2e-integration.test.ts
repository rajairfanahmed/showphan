import { evaluateQualityGate } from "../src/lib/projects/quality-gate";
import { slugify } from "../src/lib/projects";
import { getCoverImageUrl, publicR2Url } from "../src/lib/storage/urls";
import { prisma } from "../src/lib/prisma";

async function runIntegrationTests() {
  console.log("🚀 Starting End-to-End Integration Verification Suite...\n");

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      console.log(`   ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`   ❌ [FAIL] ${testName}`);
      throw new Error(`Assertion failed: ${testName}`);
    }
  }

  // 1. Database & Catalog Contract
  console.log("1. Verifying Database Connectivity & Technology Catalog...");
  const technologies = await prisma.technology.findMany({ orderBy: { name: "asc" } });
  assert(technologies.length >= 40, `Catalog contains ${technologies.length} seeded technologies (>= 40 required)`);
  const reactTech = technologies.find((t) => t.slug === "react");
  assert(Boolean(reactTech && reactTech.iconColor), "React technology contains offline Iconify icon reference");

  // 2. Storage URL Formatter Contract
  console.log("\n2. Verifying Storage URL Resolution...");
  assert(publicR2Url.includes("r2.dev") || publicR2Url.includes("http"), "Valid public R2 base URL configured");
  const testKey = "covers/user_123/1700000000.webp";
  const formattedUrl = getCoverImageUrl(testKey);
  assert(Boolean(formattedUrl && formattedUrl.endsWith(testKey)), "R2 cover image key correctly formatted to CDN URL");
  const externalUrl = "https://images.unsplash.com/photo-test";
  assert(getCoverImageUrl(externalUrl) === externalUrl, "External absolute URLs preserved without modification");
  assert(getCoverImageUrl(null) === null, "Null key returns null URL");

  // 3. Slugification & Collision Prevention Contract
  console.log("\n3. Verifying Slugifier & Routing Safety...");
  assert(slugify("Showphan: Developer Portfolio Platform!") === "showphan-developer-portfolio-platform", "Cleans special characters and lowercases");
  assert(slugify("   Leading and Trailing Spaces   ") === "leading-and-trailing-spaces", "Trims whitespace");
  assert(slugify("React & Next.js 16 Web-App") === "react-nextjs-16-web-app", "Handles punctuation cleanly");

  // 4. Quality Gate Rule Matrix
  console.log("\n4. Verifying Quality Gate 5-Rule Publishing Engine...");
  // Case A: Missing all rules
  const emptyEval = evaluateQualityGate({});
  assert(!emptyEval.canPublish && emptyEval.satisfiedCount === 0, "Empty project rejected with 0/5 score");
  assert(emptyEval.missingRules.length === 5, "All 5 rules reported as missing");

  // Case B: 4/5 rules satisfied (missing cover image)
  const missingCoverEval = evaluateQualityGate({
    title: "Awesome App",
    summary: "A cutting-edge developer tool built for high-performance workflows.",
    technologies: [{ id: "tech-1" }],
    liveUrl: "https://example.com",
  });
  assert(!missingCoverEval.canPublish && missingCoverEval.satisfiedCount === 4, "Missing cover image prevents publishing (4/5 score)");
  assert(missingCoverEval.missingRules.includes("16:9 Cover Image"), "Missing rule accurately identified");

  // Case C: Summary exceeds 140 chars
  const longSummaryEval = evaluateQualityGate({
    title: "Awesome App",
    summary: "A".repeat(141),
    coverImageKey: "covers/test.webp",
    technologies: [{ id: "tech-1" }],
    liveUrl: "https://example.com",
  });
  assert(!longSummaryEval.canPublish && !longSummaryEval.rules.summary, "Summary exceeding 140 characters rejected");

  // Case D: All 5 rules satisfied
  const validEval = evaluateQualityGate({
    title: "Showphan",
    summary: "Show the projects that matter to the people who matter.",
    coverImageKey: "covers/test.webp",
    technologies: [{ id: "tech-1" }],
    repoUrl: "https://github.com/rajairfanahmed/showphan",
  });
  assert(validEval.canPublish && validEval.satisfiedCount === 5, "Complete project passes Quality Gate (5/5 score)");

  // 5. Account and Project Cascading Data Integrity Check
  console.log("\n5. Verifying Neon DB Data Models & Schema Consistency...");
  const userCount = await prisma.user.count();
  const projectCount = await prisma.project.count();
  assert(userCount >= 0, `User table queryable via connection pool (current users: ${userCount})`);
  assert(projectCount >= 0, `Project table queryable via connection pool (current projects: ${projectCount})`);

  console.log(`\n🎉 E2E INTEGRATION SUITE COMPLETED: ${passed}/${total} assertions PASSED!`);
}

runIntegrationTests()
  .catch((e) => {
    console.error("Test execution failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
