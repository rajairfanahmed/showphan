import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getExploreProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { KudosButton } from "@/components/KudosButton";
import { TechBadge } from "@/components/TechBadge";
import { getCoverImageUrl } from "@/lib/storage/urls";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Explore Developer Projects & Showcases - Showphan",
  description:
    "Discover trending open-source projects, developer tools, boilerplates, and web apps. Award kudos to peer creators and get inspired.",
  openGraph: {
    title: "Explore Developer Projects & Showcases - Showphan",
    description:
      "Discover trending open-source projects, developer tools, boilerplates, and web apps.",
  },
};

interface ExplorePageProps {
  searchParams: Promise<{
    tab?: string;
    tech?: string;
    q?: string;
  }>;
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const { tab: rawTab, tech: rawTech, q: rawQ } = await searchParams;

  const tab =
    rawTab === "newest" || rawTab === "kudos" ? rawTab : "trending";
  const techSlug = rawTech || undefined;
  const query = rawQ || undefined;

  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  const {
    projects,
    totalCount,
    popularTechnologies,
    projectOfTheDay,
    givenKudosProjectIds,
  } = await getExploreProjects({
    tab,
    techSlug,
    query,
    userId: session?.user?.id,
  });

  // Construct query helper
  const getTabUrl = (targetTab: string) => {
    const params = new URLSearchParams();
    if (targetTab !== "trending") params.set("tab", targetTab);
    if (techSlug) params.set("tech", techSlug);
    if (query) params.set("q", query);
    const qs = params.toString();
    return `/explore${qs ? `?${qs}` : ""}`;
  };

  const getTechUrl = (targetTechSlug?: string) => {
    const params = new URLSearchParams();
    if (tab !== "trending") params.set("tab", tab);
    if (targetTechSlug) params.set("tech", targetTechSlug);
    if (query) params.set("q", query);
    const qs = params.toString();
    return `/explore${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-[var(--background)]">
      {/* Hero Header */}
      <section className="border-b border-[var(--border)] bg-gradient-to-b from-white via-[var(--background)] to-[var(--background)] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-[#0052ff] text-xs font-semibold tracking-wide uppercase">
            <span>★</span>
            <span>Community Showcase Directory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--foreground)] max-w-3xl mx-auto leading-tight">
            Discover Proof-of-Work Projects Built by World-Class Developers
          </h1>

          <p className="text-base sm:text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
            Explore high-velocity projects, interactive sandboxes, and developer tools. Award kudos to elevate outstanding work.
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto pt-2">
            <form action="/explore" method="GET" className="relative flex items-center">
              {tab !== "trending" && <input type="hidden" name="tab" value={tab} />}
              {techSlug && <input type="hidden" name="tech" value={techSlug} />}
              <div className="relative w-full">
                <input
                  type="text"
                  name="q"
                  defaultValue={query || ""}
                  placeholder="Search by title, description, or creator..."
                  className="w-full pl-11 pr-24 py-3 rounded-xl border border-[var(--border)] bg-white text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[#0052ff] focus:ring-1 focus:ring-[#0052ff] shadow-sm text-sm"
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-lg bg-[#0052ff] hover:bg-blue-600 text-white font-semibold text-xs transition-colors cursor-pointer shadow-sm"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full space-y-10">
        {/* Project of the Day Spotlight */}
        {projectOfTheDay && !techSlug && !query && (
          <section className="relative rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-50/50 via-white to-white p-6 sm:p-8 overflow-hidden shadow-xl shadow-blue-500/5">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Cover Preview */}
              <div className="w-full lg:w-1/2 aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-[var(--border)] relative shadow-md">
                {projectOfTheDay.coverImageKey ? (
                  <img
                    src={getCoverImageUrl(projectOfTheDay.coverImageKey) || undefined}
                    alt={projectOfTheDay.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-[#0052ff]">
                    <span className="text-4xl">★</span>
                    <span className="text-xs font-mono mt-2 uppercase tracking-widest font-bold">
                      Spotlight Preview
                    </span>
                  </div>
                )}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-blue-500/30 text-[#0052ff] text-xs font-bold shadow-md">
                  <span className="w-2 h-2 rounded-full bg-[#0052ff]" />
                  <span>PROJECT OF THE DAY</span>
                </div>
              </div>

              {/* Information */}
              <div className="w-full lg:w-1/2 space-y-4">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${projectOfTheDay.user.slug}`}
                    className="flex items-center gap-2 group"
                  >
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-100 border border-[var(--border)]">
                      {projectOfTheDay.user.avatarUrl ? (
                        <img
                          src={projectOfTheDay.user.avatarUrl}
                          alt={projectOfTheDay.user.displayName || projectOfTheDay.user.name || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#0052ff] text-white font-bold text-xs flex items-center justify-center">
                          {(projectOfTheDay.user.displayName || projectOfTheDay.user.name || "U")[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[#0052ff] transition-colors">
                      {projectOfTheDay.user.displayName || projectOfTheDay.user.name}
                    </span>
                  </Link>
                  <span className="text-xs text-[var(--muted-foreground)]">by @{projectOfTheDay.user.slug}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
                  <Link
                    href={`/${projectOfTheDay.user.slug}/${projectOfTheDay.slug}`}
                    className="hover:text-[#0052ff] transition-colors"
                  >
                    {projectOfTheDay.title}
                  </Link>
                </h2>

                <p className="text-sm sm:text-base text-[var(--muted-foreground)] line-clamp-3 leading-relaxed">
                  {projectOfTheDay.summary || "Outstanding developer showcase trending today on Showphan."}
                </p>

                {/* Tech Pills */}
                {projectOfTheDay.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {projectOfTheDay.technologies.slice(0, 4).map((t) => (
                      <TechBadge
                        key={t.technology.id}
                        name={t.technology.name}
                        iconName={t.technology.iconColor ?? undefined}
                        size="sm"
                      />
                    ))}
                  </div>
                )}

                <div className="pt-3 flex flex-wrap items-center gap-4">
                  <KudosButton
                    projectId={projectOfTheDay.id}
                    initialKudosCount={projectOfTheDay.kudosCount}
                    initialHasGiven={givenKudosProjectIds.includes(projectOfTheDay.id)}
                    size="md"
                  />
                  <Link
                    href={`/${projectOfTheDay.user.slug}/${projectOfTheDay.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0052ff] hover:bg-blue-600 text-white font-semibold text-sm transition-colors shadow-sm"
                  >
                    <span>View Full Showcase</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Filter & Tab Controls */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
            {/* Feed Tabs */}
            <div className="flex items-center gap-2">
              <Link
                href={getTabUrl("trending")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
                  tab === "trending"
                    ? "bg-[#0052ff] text-white shadow-sm"
                    : "bg-white border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-blue-500/40"
                }`}
              >
                <span>🔥</span>
                <span>Trending</span>
              </Link>
              <Link
                href={getTabUrl("newest")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
                  tab === "newest"
                    ? "bg-[#0052ff] text-white shadow-sm"
                    : "bg-white border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-blue-500/40"
                }`}
              >
                <span>⚡</span>
                <span>Newest</span>
              </Link>
              <Link
                href={getTabUrl("kudos")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
                  tab === "kudos"
                    ? "bg-[#0052ff] text-white shadow-sm"
                    : "bg-white border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-blue-500/40"
                }`}
              >
                <span>★</span>
                <span>Most Kudos</span>
              </Link>
            </div>

            {/* Results count indicator */}
            <div className="text-xs font-mono text-[var(--muted-foreground)] flex items-center gap-2">
              <span>Showing {projects.length} of {totalCount} {totalCount === 1 ? "project" : "projects"}</span>
              {(techSlug || query) && (
                <Link
                  href="/explore"
                  className="text-[#0052ff] hover:underline font-semibold"
                >
                  Clear filters
                </Link>
              )}
            </div>
          </div>

          {/* Technology Filter Pills */}
          {popularTechnologies.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
              <Link
                href={getTechUrl(undefined)}
                className={`px-3 py-1.5 rounded-full border whitespace-nowrap font-medium transition-colors ${
                  !techSlug
                    ? "border-blue-500/40 bg-blue-500/10 text-[#0052ff] font-semibold"
                    : "border-[var(--border)] bg-white text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-blue-500/30"
                }`}
              >
                All Technologies
              </Link>
              {popularTechnologies.map((t) => {
                const isActive = techSlug?.toLowerCase() === t.slug.toLowerCase();
                return (
                  <Link
                    key={t.id}
                    href={getTechUrl(t.slug)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border whitespace-nowrap font-medium transition-colors ${
                      isActive
                        ? "border-blue-500/40 bg-blue-500/10 text-[#0052ff] font-semibold"
                        : "border-[var(--border)] bg-white text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-blue-500/30"
                    }`}
                  >
                    <span>{t.name}</span>
                    <span className="opacity-60 text-[10px]">({t._count.projects})</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Project Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[var(--border)] rounded-3xl p-8 space-y-4 bg-white/50">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0052ff] border border-blue-100 flex items-center justify-center mx-auto text-2xl shadow-inner">
              🔍
            </div>
            <h3 className="font-bold text-xl text-[var(--foreground)]">No showcases found</h3>
            <p className="text-sm text-[var(--muted-foreground)] max-w-md mx-auto">
              {query
                ? `No projects matched "${query}". Try searching for another keyword or technology.`
                : "No projects published in this category yet. Be the first to showcase your work!"}
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              {(techSlug || query) && (
                <Link
                  href="/explore"
                  className="px-4 py-2 rounded-xl border border-[var(--border)] bg-white text-sm font-semibold text-[var(--foreground)] hover:border-blue-500/40 transition-colors"
                >
                  Reset Filters
                </Link>
              )}
              <Link
                href="/dashboard/new"
                className="px-5 py-2.5 rounded-xl bg-[#0052ff] text-white text-sm font-semibold hover:bg-blue-600 transition-colors shadow-sm"
              >
                + Submit Project
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                hasGivenKudos={givenKudosProjectIds.includes(project.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
