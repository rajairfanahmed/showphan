import "dotenv/config";
import { NextRequest } from "next/server";
import { prisma } from "../src/lib/prisma";
import { renderBadgeSvg, DeveloperBadgeData } from "../src/lib/projects/badge";
import { GET } from "../src/app/api/badge/[slug]/route";

async function runBadgeEndpointTests() {
  console.log("🧪 Running Dynamic README Badge Engine Test Suite...\n");

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

  // 1. Pure SVG Generator Unit Contract
  console.log("1. Testing Dynamic SVG Card Markup Generation...");
  const mockData: DeveloperBadgeData = {
    name: "Raja Irfan Ahmed",
    displayName: "Raja Irfan Ahmed <script>alert(1)</script>",
    slug: "rajairfanahmed",
    avatarUrl: "https://avatars.githubusercontent.com/u/123456",
    publishedCount: 5,
    totalKudos: 42,
    topTechnologies: ["TypeScript", "Next.js", "PostgreSQL"],
  };

  const svg = renderBadgeSvg(mockData);

  assert(
    svg.includes("<svg") && svg.includes("</svg>"),
    "Renders a complete, valid SVG root container"
  );
  assert(
    svg.includes('width="480"') && svg.includes('height="160"'),
    "Card maintains exact 480×160 dimensions"
  );
  assert(
    !svg.includes("<script>"),
    "Sanitizes and escapes malicious XML/HTML characters"
  );
  assert(
    svg.includes("&lt;script&gt;"),
    "Properly encodes XML entities"
  );
  assert(
    svg.includes("@rajairfanahmed"),
    "Renders the developer slug handle"
  );
  assert(
    svg.includes("5") && (svg.includes("Projects") || svg.includes("Showcases")),
    "Renders verified published projects count"
  );
  assert(
    svg.includes("42") && svg.includes("Kudos"),
    "Renders total aggregated kudos count"
  );
  assert(
    svg.includes("TypeScript") && svg.includes("Next.js") && svg.includes("PostgreSQL"),
    "Renders top 3 technology badges"
  );
  assert(
    svg.includes("Showphan Proof-of-Work • ⭐ Star on GitHub"),
    "Embeds high-contrast footer with GitHub Star CTA"
  );

  // 2. HTTP Endpoint Contract (GET /api/badge/[slug])
  console.log("\n2. Testing GET /api/badge/[slug] Route Handler...");

  // Mock prisma.user.findUnique for predictable unit & integration testing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (prisma.user as any).findUnique = async ({ where }: { where: { slug: string } }) => {
    if (where.slug === "nonexistent-user-99999") {
      return null;
    }
    if (where.slug === "rajairfanahmed") {
      return {
        id: "usr_raja",
        name: "Raja Irfan Ahmed",
        displayName: "Raja Irfan Ahmed",
        slug: "rajairfanahmed",
        avatarUrl: "https://avatars.githubusercontent.com/u/123456",
        projects: [
          {
            id: "proj_1",
            kudosCount: 42,
            technologies: [
              { technology: { name: "TypeScript" } },
              { technology: { name: "Next.js" } },
            ],
          },
        ],
      };
    }
    return null;
  };

  // A: Non-existent user returns 404
  const notFoundReq = new NextRequest("http://localhost/api/badge/nonexistent-user-99999");
  const notFoundRes = await GET(notFoundReq, {
    params: Promise.resolve({ slug: "nonexistent-user-99999" }),
  });

  assert(
    notFoundRes.status === 404,
    "GET /api/badge/[slug] returns 404 for non-existent slugs",
    `Received status: ${notFoundRes.status}`
  );

  // B: Existing user returns 200 with valid SVG and edge caching headers
  const validUserReq = new NextRequest("http://localhost/api/badge/rajairfanahmed");
  const validUserRes = await GET(validUserReq, {
    params: Promise.resolve({ slug: "rajairfanahmed" }),
  });

  assert(
    validUserRes.status === 200,
    "GET /api/badge/[slug] returns 200 for valid user slugs",
    `Received status: ${validUserRes.status}`
  );

  const contentType = validUserRes.headers.get("Content-Type");
  assert(
    Boolean(contentType && contentType.includes("image/svg+xml")),
    "Content-Type header is image/svg+xml",
    `Got: ${contentType}`
  );

  const cacheControl = validUserRes.headers.get("Cache-Control");
  assert(
    Boolean(cacheControl && cacheControl.includes("s-maxage=3600") && cacheControl.includes("stale-while-revalidate=86400")),
    "Cache-Control contains s-maxage=3600 and stale-while-revalidate=86400",
    `Got: ${cacheControl}`
  );

  const svgBody = await validUserRes.text();
  assert(
    svgBody.includes("<svg") && svgBody.includes("@rajairfanahmed") && svgBody.includes("Showphan Proof-of-Work • ⭐ Star on GitHub"),
    "Returns valid SVG body containing developer handle and GitHub Star CTA footer"
  );

  console.log(`\n🎉 All ${passed}/${total} Badge Engine Contract Tests PASSED!\n`);
  process.exit(0);
}

runBadgeEndpointTests().catch((err) => {
  console.error("❌ Test suite failed:", err);
  process.exit(1);
});
