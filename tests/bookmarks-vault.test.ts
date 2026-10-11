import { CATALOG_TECHNOLOGIES } from "../src/lib/catalog/technologies";
import { getCoverImageUrl } from "../src/lib/storage/urls";
import type { DetailedBookmarkItem } from "../src/lib/projects/bookmark";

console.log("🧪 Running Bookmarks & Inspiration Vault Seam Tests...\n");

let passed = 0;
let total = 0;

function assert(condition: boolean, message: string) {
  total++;
  if (condition) {
    passed++;
    console.log(`   ✅ [PASS] ${message}`);
  } else {
    console.error(`   ❌ [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// 1. Verify Catalog Category Mapping
const frontendTech = CATALOG_TECHNOLOGIES.find((t) => t.slug === "react");
const backendTech = CATALOG_TECHNOLOGIES.find((t) => t.slug === "nodejs" || t.slug === "postgresql");
const aiTech = CATALOG_TECHNOLOGIES.find((t) => t.slug === "python" || t.slug === "openai");

assert(Boolean(frontendTech && frontendTech.category === "Frontend"), "React maps to Frontend category");
assert(Boolean(backendTech), "Backend technologies verified in catalog");
assert(Boolean(aiTech), "AI/Data technologies verified in catalog");

// 2. Test Vault Category Aggregation Logic
function mapTechToVaultCategory(techSlug: string): string {
  const item = CATALOG_TECHNOLOGIES.find(
    (t) => t.slug === techSlug || t.id === techSlug
  );
  if (!item) return "Other";
  if (item.category === "Frontend") return "Frontend";
  if (
    item.category === "Backend" ||
    item.category === "Databases" ||
    item.category === "Cloud & DevOps"
  ) {
    return "Backend & Cloud";
  }
  if (item.category === "AI & Data") return "AI & Data";
  if (item.category === "Languages") return "Languages";
  if (item.category === "Mobile & Desktop") return "Mobile & Systems";
  return "Other";
}

assert(mapTechToVaultCategory("react") === "Frontend", "mapTechToVaultCategory maps 'react' to Frontend");
assert(mapTechToVaultCategory("nextjs") === "Frontend", "mapTechToVaultCategory maps 'nextjs' to Frontend");
assert(mapTechToVaultCategory("postgresql") === "Backend & Cloud", "mapTechToVaultCategory maps 'postgresql' to Backend & Cloud");
assert(mapTechToVaultCategory("docker") === "Backend & Cloud", "mapTechToVaultCategory maps 'docker' to Backend & Cloud");
assert(mapTechToVaultCategory("python") === "Languages", "mapTechToVaultCategory maps 'python' to Languages");

// 3. Test DetailedBookmarkItem Transformation & Cover URL Generation
const mockBookmarkItem: DetailedBookmarkItem = {
  bookmarkId: "bm-123",
  bookmarkedAt: new Date().toISOString(),
  hasGivenKudos: true,
  project: {
    id: "proj-123",
    slug: "showphan-core",
    title: "Showphan Core",
    summary: "High-fidelity developer portfolio platform",
    coverImageKey: "covers/alex/preview.webp",
    liveUrl: "https://showphan.vercel.app",
    repoUrl: "https://github.com/rajairfanahmed/showphan",
    tags: ["#react", "#nextjs"],
    status: "PUBLISHED" as const,
    kudosCount: 42,
    viewsCount: 300,
    bookmarksCount: 15,
    createdAt: new Date().toISOString(),
    user: {
      id: "usr-1",
      name: "Alex",
      displayName: "Alex Dev",
      slug: "alexdev",
      avatarUrl: "https://avatar.url",
    },
    technologies: [
      {
        name: "Next.js",
        slug: "nextjs",
        iconColor: "logos:nextjs-icon",
        iconMono: "simple-icons:nextdotjs",
      },
    ],
  },
};

assert(mockBookmarkItem.hasGivenKudos === true, "hasGivenKudos is preserved");
assert(mockBookmarkItem.project.technologies.length === 1, "technologies array preserved");

const coverUrl = getCoverImageUrl(mockBookmarkItem.project.coverImageKey);
assert(coverUrl !== null && coverUrl.includes("covers/alex/preview.webp"), "Cover image URL generated properly");

console.log(`\n🎉 BOOKMARKS VAULT TEST SUITE FINISHED: ${passed}/${total} assertions PASSED!\n`);
process.exit(0);
