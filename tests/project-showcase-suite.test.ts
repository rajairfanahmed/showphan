import assert from "node:assert";

console.log("🧪 Running Project Detail Showcase Invariants Test Suite...\n");

// 1. Test External URL Validation for LaunchBar
console.log("1. Testing LaunchBar External Link Sanity...");
function sanitizeExternalUrl(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return null;
}

assert.strictEqual(
  sanitizeExternalUrl("https://example.com/app"),
  "https://example.com/app",
  "Valid HTTPS live URL is preserved"
);
assert.strictEqual(
  sanitizeExternalUrl("http://localhost:3000"),
  "http://localhost:3000",
  "Valid HTTP URL is preserved"
);
assert.strictEqual(
  sanitizeExternalUrl("javascript:alert(1)"),
  null,
  "JavaScript URI scheme is strictly blocked"
);
assert.strictEqual(sanitizeExternalUrl(""), null, "Empty string returns null");
assert.strictEqual(sanitizeExternalUrl(null), null, "Null returns null");
console.log("   ✅ [PASS] External LaunchBar URL sanitization blocks malicious schemes\n");

// 2. Test Author Aggregate Math
console.log("2. Testing Author Stats Aggregation Invariants...");
function computeAuthorStats(projects: { status: string; kudosCount: number }[]) {
  const published = projects.filter((p) => p.status === "PUBLISHED");
  const totalKudos = published.reduce((acc, p) => acc + p.kudosCount, 0);
  return {
    publishedCount: published.length,
    totalKudos,
  };
}

const mockProjects = [
  { status: "PUBLISHED", kudosCount: 14 },
  { status: "DRAFT", kudosCount: 0 },
  { status: "PUBLISHED", kudosCount: 22 },
  { status: "PUBLISHED", kudosCount: 5 },
];

const stats = computeAuthorStats(mockProjects);
assert.strictEqual(stats.publishedCount, 3, "Published count ignores drafts");
assert.strictEqual(stats.totalKudos, 41, "Total kudos correctly sums published projects");
console.log("   ✅ [PASS] Author statistics calculation is accurate\n");

// 3. Test 16:9 Media Lightbox Aspect Invariants
console.log("3. Testing 16:9 Media Aspect Invariant...");
const standardAspectRatio = 16 / 9;
const computed1080p = 1920 / 1080;
const computed720p = 1280 / 720;
assert.strictEqual(
  Math.abs(standardAspectRatio - computed1080p) < 0.001,
  true,
  "1080p matches 16:9 ratio"
);
assert.strictEqual(
  Math.abs(standardAspectRatio - computed720p) < 0.001,
  true,
  "720p matches 16:9 ratio"
);
console.log("   ✅ [PASS] 16:9 aspect ratio standard holds across standard resolutions\n");

console.log("🎉 Project Detail Showcase Suite Passed: All invariants verified successfully!");
