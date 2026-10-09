import "dotenv/config";
import { NextRequest } from "next/server";
import {
  VIEWPORT_OPTIONS,
  ViewportMode,
} from "../src/components/ViewportSwitcher";
import {
  REACTION_DEFINITIONS,
  VALID_REACTION_TYPES,
  getProjectReactions,
  toggleProjectReaction,
  resetReactionStore,
  ReactionType,
} from "../src/lib/projects/reactions";
import {
  GET as getReactionsHandler,
  POST as postReactionHandler,
} from "../src/app/api/projects/[id]/reactions/route";
import fs from "fs";
import path from "path";

async function runSandboxIsolationTests() {
  console.log("🧪 Running Live Sandbox & Security Isolation Test Suite...\n");

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

  // 1. Viewport Switcher Dimension & Preset Contracts
  console.log("1. Testing Viewport Switcher Presets & Breakpoints...");
  const desktopOpt = VIEWPORT_OPTIONS.find((v) => v.id === "desktop");
  const tabletOpt = VIEWPORT_OPTIONS.find((v) => v.id === "tablet");
  const mobileOpt = VIEWPORT_OPTIONS.find((v) => v.id === "mobile");

  assert(Boolean(desktopOpt && tabletOpt && mobileOpt), "Viewport switcher provides Desktop, Tablet, and Mobile modes");
  assert(desktopOpt?.width === "100%", "Desktop mode operates at 100% full width");
  assert(tabletOpt?.width === "768px" && tabletOpt?.pxWidth === 768, "Tablet mode constrains to standard 768px width");
  assert(mobileOpt?.width === "375px" && mobileOpt?.pxWidth === 375, "Mobile mode constrains to standard 375px width");

  // 2. HTML5 Sandbox Security, CSP & Clickjacking Isolation
  console.log("\n2. Testing HTML5 Sandbox Isolation & Security Attributes...");
  const viewerComponentPath = path.resolve(__dirname, "../src/components/LiveSandboxViewer.tsx");
  const viewerSource = fs.readFileSync(viewerComponentPath, "utf-8");

  const expectedSandboxAttr = 'sandbox="allow-scripts allow-same-origin allow-forms"';
  assert(
    viewerSource.includes(expectedSandboxAttr),
    "LiveSandboxViewer embeds iframe with strict HTML5 sandbox isolation (allow-scripts allow-same-origin allow-forms)"
  );

  assert(
    viewerSource.includes('referrerPolicy="no-referrer"'),
    "LiveSandboxViewer specifies referrerPolicy='no-referrer' to eliminate leakage of referer headers"
  );

  assert(
    viewerSource.includes('loading="lazy"'),
    "LiveSandboxViewer defers iframe loading with loading='lazy' for optimal initial page load"
  );

  assert(
    !viewerSource.includes("allow-top-navigation") && !viewerSource.includes("allow-modals"),
    "Sandbox prevents top-level frame redirection and intrusive browser modals"
  );

  // 3. Outbound Security & UGC Link Defense
  console.log("\n3. Testing UGC Rel & Outbound Link Security Contracts...");
  const ugcPattern = /rel="ugc nofollow noopener noreferrer"/g;
  const matches = viewerSource.match(ugcPattern);
  assert(
    Boolean(matches && matches.length >= 1),
    "External fallback and new-tab links carry rel='ugc nofollow noopener noreferrer'"
  );

  const peerReactionsPath = path.resolve(__dirname, "../src/components/PeerReactions.tsx");
  const peerReactionsSource = fs.readFileSync(peerReactionsPath, "utf-8");
  assert(
    peerReactionsSource.includes('rel="ugc nofollow noopener noreferrer"'),
    "Discuss on GitHub link carries rel='ugc nofollow noopener noreferrer'"
  );

  // 4. Peer Reactions Mechanics & Definitions
  console.log("\n4. Testing Peer Reactions Domain & Toggle Logic...");
  resetReactionStore();

  assert(
    VALID_REACTION_TYPES.length === 4,
    "Peer reactions defined exactly 4 standardized reaction categories"
  );

  assert(
    Boolean(
      REACTION_DEFINITIONS.mindblown &&
      REACTION_DEFINITIONS.cleanCode &&
      REACTION_DEFINITIONS.greatUi &&
      REACTION_DEFINITIONS.blazingFast
    ),
    "Canonical reaction types (🚀 Mindblown, 💎 Clean Code, 🎨 Great UI, ⚡ Blazing Fast) are defined"
  );

  const testProjectId = "proj_test_sandbox_123";
  const initialCounts = await getProjectReactions(testProjectId);
  assert(
    typeof initialCounts.mindblown === "number" &&
    typeof initialCounts.cleanCode === "number" &&
    typeof initialCounts.greatUi === "number" &&
    typeof initialCounts.blazingFast === "number",
    "Returns deterministic initial baseline counts"
  );

  // Toggle reaction ON
  const toggledOn = await toggleProjectReaction(testProjectId, "mindblown", "visitor-alpha");
  assert(
    toggledOn.userReacted === true &&
    toggledOn.counts.mindblown === initialCounts.mindblown + 1,
    "Toggling reaction increments reaction count and reports userReacted=true"
  );

  // Toggle reaction OFF (revoke)
  const toggledOff = await toggleProjectReaction(testProjectId, "mindblown", "visitor-alpha");
  assert(
    toggledOff.userReacted === false &&
    toggledOff.counts.mindblown === initialCounts.mindblown,
    "Toggling again revokes reaction, decrements count, and reports userReacted=false"
  );

  // 5. Peer Reactions API Route Handlers
  console.log("\n5. Testing Peer Reactions HTTP Route Handlers...");
  // GET reactions
  const getReq = new NextRequest("http://localhost:3000/api/projects/proj_test_sandbox_123/reactions");
  const getRes = await getReactionsHandler(getReq, {
    params: Promise.resolve({ id: "proj_test_sandbox_123" }),
  });
  assert(getRes.status === 200, "GET /api/projects/[id]/reactions returns HTTP 200");
  const getData = await getRes.json();
  assert(Boolean(getData.counts), "GET returns aggregated reaction counts payload");

  // POST invalid reaction
  const badPostReq = new NextRequest("http://localhost:3000/api/projects/proj_test_sandbox_123/reactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reaction: "invalid_reaction_type" }),
  });
  const badPostRes = await postReactionHandler(badPostReq, {
    params: Promise.resolve({ id: "proj_test_sandbox_123" }),
  });
  assert(badPostRes.status === 400, "POST with invalid reaction type returns HTTP 400 INVALID_REACTION");

  // POST valid reaction
  const goodPostReq = new NextRequest("http://localhost:3000/api/projects/proj_test_sandbox_123/reactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reaction: "blazingFast", visitorId: "visitor-beta" }),
  });
  const goodPostRes = await postReactionHandler(goodPostReq, {
    params: Promise.resolve({ id: "proj_test_sandbox_123" }),
  });
  assert(goodPostRes.status === 200, "POST with valid reaction returns HTTP 200");
  const postData = await goodPostRes.json();
  assert(postData.userReacted === true, "POST response indicates userReacted=true");

  console.log(`\n🎉 All ${passed}/${total} Live Sandbox & Security Isolation Tests PASSED!\n`);
}

runSandboxIsolationTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
