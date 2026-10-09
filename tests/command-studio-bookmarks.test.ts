import "dotenv/config";
import { NextRequest } from "next/server";
import { prisma } from "../src/lib/prisma";
import { evaluateQualityGate } from "../src/lib/projects/quality-gate";
import { GET as getBookmark, POST as postBookmark, DELETE as deleteBookmark } from "../src/app/api/projects/[id]/bookmark/route";
import { POST as createTech } from "../src/app/api/technologies/route";

async function runCommandStudioBookmarksTests() {
  console.log("🧪 Running Command Studio, Custom Tech & Bookmarks Test Suite...\n");

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

  // 1. Quality Gate 5-Rule Real-time Evaluation Engine
  console.log("1. Testing 5-Rule Quality Gate HUD Logic...");
  const blankEval = evaluateQualityGate({});
  assert(
    !blankEval.canPublish && blankEval.satisfiedCount === 0,
    "Blank project satisfies 0/5 rules"
  );

  const partialEval = evaluateQualityGate({
    title: "My Open Source Tool",
    summary: "A cutting-edge developer tool for web performance.",
    technologies: ["tech-1"],
  });
  assert(
    partialEval.satisfiedCount === 3,
    "Project with title, summary, and tech satisfies 3/5 rules",
    `Got: ${partialEval.satisfiedCount}`
  );
  assert(
    !partialEval.canPublish,
    "Project missing cover image and links cannot be published"
  );

  const completeEval = evaluateQualityGate({
    title: "Production Showcase",
    summary: "Production ready developer platform with high performance.",
    coverImageKey: "covers/user/img.webp",
    technologies: ["tech-1", "tech-2"],
    liveUrl: "https://showphan.vercel.app",
    repoUrl: "https://github.com/rajairfanahmed/showphan",
  });
  assert(
    completeEval.canPublish && completeEval.satisfiedCount === 5,
    "Complete project satisfies all 5/5 rules and can publish"
  );

  // 2. Bookmark API Route Guards
  console.log("\n2. Testing Bookmark API Route Authentication Guards...");
  const unauthGetReq = new NextRequest("http://localhost/api/projects/proj-123/bookmark");
  const getRes = await getBookmark(unauthGetReq, {
    params: Promise.resolve({ id: "proj-123" }),
  });
  assert(
    getRes.status === 401,
    "GET /api/projects/[id]/bookmark returns 401 UNAUTHORIZED when no session exists",
    `Status: ${getRes.status}`
  );

  const unauthPostReq = new NextRequest("http://localhost/api/projects/proj-123/bookmark", {
    method: "POST",
  });
  const postRes = await postBookmark(unauthPostReq, {
    params: Promise.resolve({ id: "proj-123" }),
  });
  assert(
    postRes.status === 401,
    "POST /api/projects/[id]/bookmark returns 401 UNAUTHORIZED when no session exists",
    `Status: ${postRes.status}`
  );

  const unauthDeleteReq = new NextRequest("http://localhost/api/projects/proj-123/bookmark", {
    method: "DELETE",
  });
  const deleteRes = await deleteBookmark(unauthDeleteReq, {
    params: Promise.resolve({ id: "proj-123" }),
  });
  assert(
    deleteRes.status === 401,
    "DELETE /api/projects/[id]/bookmark returns 401 UNAUTHORIZED when no session exists",
    `Status: ${deleteRes.status}`
  );

  // 3. Custom Technology Creation Contract
  console.log("\n3. Testing Custom Technology Creation Route Guard...");
  const unauthTechReq = new NextRequest("http://localhost/api/technologies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Bun Runtime" }),
  });
  const techRes = await createTech(unauthTechReq);
  assert(
    techRes.status === 401,
    "POST /api/technologies returns 401 UNAUTHORIZED when not authenticated",
    `Status: ${techRes.status}`
  );

  console.log(`\n🎉 All ${passed}/${total} Command Studio & Bookmarks Contract Tests PASSED!\n`);
  process.exit(0);
}

runCommandStudioBookmarksTests().catch((err) => {
  console.error("❌ Test suite failed:", err);
  process.exit(1);
});
