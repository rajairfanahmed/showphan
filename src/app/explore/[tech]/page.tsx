import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getExploreProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { TechBadge } from "@/components/TechBadge";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface ExploreTechPageProps {
  params: Promise<{ tech: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tech: string }>;
}): Promise<Metadata> {
  const { tech } = await params;
  const technology = await prisma.technology.findUnique({
    where: { slug: tech.toLowerCase() },
  });

  const techName = technology ? technology.name : tech;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://showphan.vercel.app";
  const title = `Top ${techName} Projects & Showcases - Showphan`;
  const description = `Explore top open-source developer projects, boilerplates, and web apps built with ${techName}. Discover creators and award kudos.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/explore/${tech.toLowerCase()}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/explore/${tech.toLowerCase()}`,
      siteName: "Showphan",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ExploreTechPage({
  params,
  searchParams,
}: ExploreTechPageProps) {
  const { tech } = await params;
  const { tab: rawTab } = await searchParams;

  const tab =
    rawTab === "newest" || rawTab === "kudos" ? rawTab : "trending";

  const technology = await prisma.technology.findUnique({
    where: { slug: tech.toLowerCase() },
  });

  if (!technology) {
    notFound();
  }

  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  const { projects, totalCount, givenKudosProjectIds } =
    await getExploreProjects({
      tab,
      techSlug: technology.slug,
      userId: session?.user?.id,
    });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://showphan.vercel.app";

  // Google Sitelinks / Rich Results JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${technology.name} Projects & Developer Showcases`,
    description: `Discover open-source projects built with ${technology.name}.`,
    url: `${siteUrl}/explore/${technology.slug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((p, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}/${p.user.slug}/${p.slug}`,
        name: p.title,
        description: p.summary,
      })),
    },
  };

  return (
    <div className="flex-1 flex flex-col bg-[var(--background)]">
      {/* Sitelinks Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Category Header */}
      <section className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--card)]/60 via-[var(--background)] to-[var(--background)] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/explore" className="hover:text-[var(--foreground)] transition-colors">
              Explore
            </Link>
            <span>/</span>
            <span className="text-amber-500 font-semibold">{technology.name}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <TechBadge
                  name={technology.name}
                  iconName={technology.iconColor ?? undefined}
                  size="md"
                />
                <span className="text-xs px-2.5 py-0.5 rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] font-mono">
                  {totalCount} {totalCount === 1 ? "showcase" : "showcases"}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
                Projects Built with {technology.name}
              </h1>

              <p className="text-sm sm:text-base text-[var(--muted-foreground)] max-w-2xl leading-relaxed">
                Discover innovative open-source projects, boilerplates, and developer utilities powered by {technology.name}.
              </p>
            </div>

            <Link
              href="/explore"
              className="self-start sm:self-center inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:border-amber-500/40 text-xs font-semibold text-[var(--foreground)] transition-colors"
            >
              <span>← All Technologies</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 w-full space-y-8">
        {/* Tab Controls */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-2">
            <Link
              href={`/explore/${technology.slug}?tab=trending`}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold text-xs transition-colors ${
                tab === "trending"
                  ? "bg-amber-500 text-black shadow-sm"
                  : "bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-amber-500/40"
              }`}
            >
              <span>🔥</span>
              <span>Trending</span>
            </Link>
            <Link
              href={`/explore/${technology.slug}?tab=newest`}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold text-xs transition-colors ${
                tab === "newest"
                  ? "bg-amber-500 text-black shadow-sm"
                  : "bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-amber-500/40"
              }`}
            >
              <span>⚡</span>
              <span>Newest</span>
            </Link>
            <Link
              href={`/explore/${technology.slug}?tab=kudos`}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold text-xs transition-colors ${
                tab === "kudos"
                  ? "bg-amber-500 text-black shadow-sm"
                  : "bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-amber-500/40"
              }`}
            >
              <span>★</span>
              <span>Most Kudos</span>
            </Link>
          </div>

          <div className="text-xs font-mono text-[var(--muted-foreground)]">
            {totalCount} {totalCount === 1 ? "project" : "projects"}
          </div>
        </div>

        {/* Project Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[var(--border)] rounded-2xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto text-xl">
              🛠️
            </div>
            <h3 className="font-bold text-lg text-[var(--foreground)]">
              No projects found for {technology.name}
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] max-w-md mx-auto">
              Be the first engineer to publish a project built with {technology.name} on Showphan!
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link
                href="/explore"
                className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs font-semibold text-[var(--foreground)] hover:border-amber-500/40 transition-colors"
              >
                Browse All
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg bg-amber-500 text-black text-xs font-semibold hover:bg-amber-400 transition-colors"
              >
                Publish Project
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
