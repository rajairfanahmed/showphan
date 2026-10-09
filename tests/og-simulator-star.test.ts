import "dotenv/config";
import { NextRequest } from "next/server";
import { GET as profileOgHandler } from "../src/app/api/og/profile/route";
import { GET as projectOgHandler } from "../src/app/api/og/project/route";
import { GET as githubStarsHandler } from "../src/app/api/github/stars/route";
import fs from "fs";
import path from "path";

async function runOgSimulatorStarTests() {
  console.log("🧪 Running Dynamic OG Engine, Showcase Simulator & Star Widget Test Suite...\n");

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

  // 1. Dynamic OpenGraph Profile Card Generation Contract
  console.log("1. Testing GET /api/og/profile Route Handler...");
  const profileReq = new NextRequest("http://localhost:3000/api/og/profile?slug=rajairfanahmed");
  const profileRes = await profileOgHandler(profileReq);

  assert(profileRes.status === 200, "GET /api/og/profile returns HTTP 200 OK");
  const profileContentType = profileRes.headers.get("content-type");
  assert(
    profileContentType?.includes("image/png") ?? false,
    `Profile OG returns image/png content type (got: ${profileContentType})`
  );
  const profileCacheControl = profileRes.headers.get("cache-control");
  assert(
    profileCacheControl?.includes("s-maxage=3600") ?? false,
    "Profile OG returns edge caching header s-maxage=3600"
  );

  // 2. Dynamic OpenGraph Project Card Generation Contract
  console.log("\n2. Testing GET /api/og/project Route Handler...");
  const projectReq = new NextRequest("http://localhost:3000/api/og/project?slug=rajairfanahmed&project=distributed-cache");
  const projectRes = await projectOgHandler(projectReq);

  assert(projectRes.status === 200, "GET /api/og/project returns HTTP 200 OK");
  const projectContentType = projectRes.headers.get("content-type");
  assert(
    projectContentType?.includes("image/png") ?? false,
    `Project OG returns image/png content type (got: ${projectContentType})`
  );
  const projectCacheControl = projectRes.headers.get("cache-control");
  assert(
    projectCacheControl?.includes("s-maxage=3600") ?? false,
    "Project OG returns edge caching header s-maxage=3600"
  );

  // 3. Metadata OpenGraph Wiring Assertions
  console.log("\n3. Testing Metadata OpenGraph Route Integration...");
  const profilePagePath = path.resolve(__dirname, "../src/app/[slug]/page.tsx");
  const profilePageSource = fs.readFileSync(profilePagePath, "utf-8");
  assert(
    profilePageSource.includes("/api/og/profile?slug="),
    "Public Profile page.tsx connects generateMetadata openGraph.images to /api/og/profile"
  );
  assert(
    !profilePageSource.includes("/vercel.svg"),
    "Static vercel.svg fallback successfully eliminated from profile page metadata"
  );

  const projectPagePath = path.resolve(__dirname, "../src/app/[slug]/[project]/page.tsx");
  const projectPageSource = fs.readFileSync(projectPagePath, "utf-8");
  assert(
    projectPageSource.includes("/api/og/project?slug="),
    "Project detail page.tsx connects generateMetadata openGraph.images to /api/og/project"
  );

  // 4. GitHub Star Endpoint & Widget Contract
  console.log("\n4. Testing Live GitHub Star Endpoint & Attribution Contracts...");
  const starRes = await githubStarsHandler();
  assert(starRes.status === 200, "GET /api/github/stars returns HTTP 200 OK");
  const starData = await starRes.json();
  assert(
    typeof starData.stars === "number" && typeof starData.formatted === "string",
    "Returns numeric stars and formatted string payload"
  );

  const starWidgetPath = path.resolve(__dirname, "../src/components/GitHubStarWidget.tsx");
  const starWidgetSource = fs.readFileSync(starWidgetPath, "utf-8");
  assert(
    starWidgetSource.includes("https://github.com/rajairfanahmed/showphan"),
    "Star widget links to https://github.com/rajairfanahmed/showphan"
  );
  assert(
    starWidgetSource.includes("https://rajairfanahmed.vercel.app"),
    "Star widget displays creator portfolio backlink to Raja Irfan Ahmed"
  );

  // 5. Showcase Simulator Verification
  console.log("\n5. Testing Showcase Simulator Architecture...");
  const simulatorPath = path.resolve(__dirname, "../src/components/ShowcaseSimulator.tsx");
  const simulatorSource = fs.readFileSync(simulatorPath, "utf-8");
  assert(
    simulatorSource.includes("ViewportSwitcher"),
    "ShowcaseSimulator embeds ViewportSwitcher for multi-device simulation"
  );
  assert(
    simulatorSource.includes("16:9 Visual Proof") && simulatorSource.includes("Live Sandbox"),
    "ShowcaseSimulator implements both 16:9 Visual Proof and Live Sandbox preview tabs"
  );
  assert(
    simulatorSource.includes("mindblown") &&
    simulatorSource.includes("cleanCode") &&
    simulatorSource.includes("greatUi") &&
    simulatorSource.includes("blazingFast"),
    "ShowcaseSimulator includes all 4 interactive Peer Reactions"
  );

  console.log(`\n🎉 All ${passed}/${total} Dynamic OG & Showcase Simulator Tests PASSED!\n`);
}

runOgSimulatorStarTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
