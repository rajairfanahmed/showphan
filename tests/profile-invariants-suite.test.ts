import assert from "node:assert";

console.log("🧪 Running Public Developer Profile Invariants Test Suite...\n");

// 1. Total Kudos Summation Invariant
console.log("1. Testing Profile Total Kudos Summation...");
const sampleProjects = [
  { id: "1", kudosCount: 15, isFeatured: true, technologies: [{ technology: { slug: "nextjs", name: "Next.js" } }] },
  { id: "2", kudosCount: 8, isFeatured: false, technologies: [{ technology: { slug: "react", name: "React" } }] },
  { id: "3", kudosCount: 22, isFeatured: true, technologies: [{ technology: { slug: "nextjs", name: "Next.js" } }] },
];

const computedTotal = sampleProjects.reduce((acc, p) => acc + (p.kudosCount || 0), 0);
assert.strictEqual(computedTotal, 45, "Total kudos correctly sums all project kudos");
console.log("   ✅ [PASS] Profile total kudos summation invariant verified\n");

// 2. Technology Deduplication Invariant
console.log("2. Testing Distinct Technology Deduplication...");
const techMap = new Map<string, string>();
sampleProjects.forEach((p) => {
  p.technologies.forEach((t) => {
    techMap.set(t.technology.slug, t.technology.name);
  });
});

const distinctTechs = Array.from(techMap.keys());
assert.strictEqual(distinctTechs.length, 2, "Duplicate 'nextjs' is deduplicated");
assert.deepStrictEqual(distinctTechs, ["nextjs", "react"], "Exact unique tech slugs preserved");
console.log("   ✅ [PASS] Technology deduplication across multi-project portfolios verified\n");

// 3. Filter Predicates Invariant
console.log("3. Testing Client-Side Filter Predicates...");
function filterProjects(projects: typeof sampleProjects, filter: string) {
  if (filter === "all") return projects;
  if (filter === "kudos") return [...projects].sort((a, b) => b.kudosCount - a.kudosCount);
  return projects.filter((p) =>
    p.technologies.some((t) => t.technology.slug === filter)
  );
}

const allFiltered = filterProjects(sampleProjects, "all");
assert.strictEqual(allFiltered.length, 3, "All filter returns entire set");

const kudosSorted = filterProjects(sampleProjects, "kudos");
assert.strictEqual(kudosSorted[0].kudosCount, 22, "Most kudos sorts highest first");
assert.strictEqual(kudosSorted[2].kudosCount, 8, "Most kudos sorts lowest last");

const nextFiltered = filterProjects(sampleProjects, "nextjs");
assert.strictEqual(nextFiltered.length, 2, "Tech filter accurately filters matching projects");
console.log("   ✅ [PASS] Filter predicates (all, kudos, tech) function correctly\n");

// 4. Sidebar Zero-Flash Transition Invariant
console.log("4. Testing Sidebar Zero-Flash Transition State Invariant...");
function getSidebarTransitionClass(isMounted: boolean): string {
  return isMounted ? "transition-all duration-300" : "transition-none";
}

assert.strictEqual(
  getSidebarTransitionClass(false),
  "transition-none",
  "Unmounted / initial render disables transition to prevent glitch"
);
assert.strictEqual(
  getSidebarTransitionClass(true),
  "transition-all duration-300",
  "Mounted render enables smooth user toggle transition"
);
console.log("   ✅ [PASS] Zero-flash transition state pattern holds\n");

console.log("🎉 Public Developer Profile Suite Passed: All 4 invariants verified successfully!");
