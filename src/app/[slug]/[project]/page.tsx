import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getPublicProject } from "@/lib/projects";
import { getCoverImageUrl } from "@/lib/storage/urls";
import { TechBadge } from "@/components/TechBadge";
import { PeerReactions } from "@/components/PeerReactions";
import { KudosButton } from "@/components/KudosButton";
import { BookmarkButton } from "@/components/BookmarkButton";
import { MediaLightbox } from "@/components/showcase/MediaLightbox";
import { LaunchBar } from "@/components/showcase/LaunchBar";
import { DeveloperBioCard } from "@/components/showcase/DeveloperBioCard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; project: string }>;
}): Promise<Metadata> {
  const { slug, project: projectSlug } = await params;
  const data = await getPublicProject(slug, projectSlug);

  if (!data || data.project.status !== "PUBLISHED") {
    return { title: "Project Not Found — Showphan" };
  }

  const { project, author } = data;
  const title = `${project.title} by @${author.slug} — Showphan Showcase`;
  const description = project.summary;
  const coverUrl = getCoverImageUrl(project.coverImageKey);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://showphan.vercel.app";
  const dynamicOgUrl = `${baseUrl}/api/og/project?slug=${slug}&project=${projectSlug}`;
  const effectiveOgImage = coverUrl || dynamicOgUrl;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [effectiveOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [effectiveOgImage],
    },
  };
}

export default async function StandaloneProjectPage({
  params,
}: {
  params: Promise<{ slug: string; project: string }>;
}) {
  const { slug, project: projectSlug } = await params;
  const data = await getPublicProject(slug, projectSlug);

  if (!data || data.project.status !== "PUBLISHED") {
    notFound();
  }

  const { project, author, moreProjects, authorTotalKudos, authorPublishedCount } = data;
  const coverUrl = getCoverImageUrl(project.coverImageKey);
  const authorName = author.displayName || author.name || author.slug;

  return (
    <div className="flex-1 flex flex-col bg-[var(--background)] min-h-screen">
      {/* 1. Top Breadcrumb Navigation Bar */}
      <nav aria-label="Breadcrumb" className="border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md py-3.5 px-4 sm:px-6 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs">
          <Link
            href={`/${author.slug}`}
            className="text-[var(--foreground-muted)] hover:text-[#0052ff] transition-colors flex items-center gap-1.5 font-semibold group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            <span>Back to @{author.slug}&apos;s portfolio</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              ✓ Verified Showcase
            </span>
          </div>
        </div>
      </nav>

      {/* 2. Main Article Canvas */}
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 flex-1 w-full pb-28 md:pb-16">
        {/* A. Pristine 16:9 Media Canvas with Modal Lightbox */}
        <section aria-label="Project Visual Showcase">
          <MediaLightbox
            src={coverUrl}
            alt={project.title}
            title={project.title}
          />
        </section>

        {/* B. Project Header & Identity Strip */}
        <section className="space-y-6 pb-6 border-b border-[var(--border)]">
          {/* Metadata Row: Author + Date */}
          <div className="flex items-center gap-3 text-xs text-[var(--foreground-muted)]">
            <Link
              href={`/${author.slug}`}
              className="flex items-center gap-2 hover:text-[#0052ff] transition-colors"
            >
              {author.avatarUrl ? (
                <div className="relative w-6 h-6 rounded-full overflow-hidden border border-[var(--border)] shrink-0 bg-gray-100">
                  <Image
                    src={author.avatarUrl}
                    alt={authorName}
                    fill
                    sizes="24px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-blue-50 text-[#0052ff] font-bold text-[10px] flex items-center justify-center shrink-0 border border-blue-100">
                  {authorName.slice(0, 1).toUpperCase()}
                </div>
              )}
              <span className="font-bold text-[var(--foreground)]">{authorName}</span>
            </Link>
            <span>•</span>
            <time dateTime={project.createdAt.toISOString()} className="font-mono">
              {new Date(project.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>

          {/* Title & 140-Char Summary */}
          <div className="space-y-2.5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#0c0d12]">
              {project.title}
            </h1>
            <p className="text-base sm:text-lg text-[var(--foreground-muted)] leading-relaxed max-w-3xl">
              {project.summary}
            </p>
          </div>

          {/* #Tags Row */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-[var(--surface-muted)] text-[var(--foreground-muted)] text-xs font-mono border border-[var(--border)]"
                >
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}

          {/* Launch Bar & Primary Action Links */}
          <div className="pt-2">
            <LaunchBar
              liveUrl={project.liveUrl}
              repoUrl={project.repoUrl}
              title={project.title}
            />
          </div>
        </section>

        {/* C. Kudos & Peer Reactions Feedback Dock */}
        <section aria-label="Community Reactions" className="p-4 sm:p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border)]/70">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--foreground-muted)]">
              Developer Community Feedback
            </span>
            <div className="flex items-center gap-2">
              <BookmarkButton projectId={project.id} size="md" />
              <KudosButton
                projectId={project.id}
                initialKudosCount={project.kudosCount}
                size="md"
              />
            </div>
          </div>

          <PeerReactions
            projectId={project.id}
            repoUrl={project.repoUrl}
          />
        </section>

        {/* D. Technologies & Tools Catalog Badges */}
        {project.technologies.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs uppercase tracking-wider font-bold text-[var(--foreground-muted)]">
              Technologies & Tools
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <TechBadge
                  key={t.technology.id}
                  name={t.technology.name}
                  iconName={t.technology.iconColor}
                  size="md"
                />
              ))}
            </div>
          </section>
        )}

        {/* E. Deep-Dive Markdown Technical Write-Up */}
        {project.description && (
          <section className="space-y-3 pt-4 border-t border-[var(--border)]">
            <h2 className="text-xs uppercase tracking-wider font-bold text-[var(--foreground-muted)]">
              About the Project
            </h2>
            <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-sm prose prose-slate max-w-none text-[var(--foreground)] leading-relaxed space-y-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                {project.description}
              </ReactMarkdown>
            </div>
          </section>
        )}

        {/* F. Structured Engineering Highlights (Role & Architecture + Key Learnings) */}
        {(project.role || project.learnings) && (
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-[var(--border)]">
            {project.role && (
              <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-sm space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0052ff]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0052ff]">
                    Architectural Decisions & Role
                  </span>
                </div>
                <p className="text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-line">
                  {project.role}
                </p>
              </div>
            )}

            {project.learnings && (
              <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-sm space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Key Challenges & Learnings
                  </span>
                </div>
                <p className="text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-line">
                  {project.learnings}
                </p>
              </div>
            )}
          </section>
        )}

        {/* G. Authoritative Developer Bio Card */}
        <section aria-label="About the Creator" className="pt-6 border-t border-[var(--border)]">
          <DeveloperBioCard
            author={author}
            totalKudos={authorTotalKudos}
            publishedCount={authorPublishedCount}
          />
        </section>

        {/* H. "More by Creator" Dynamic 3-Card Shelf */}
        {moreProjects.length > 0 && (
          <section className="pt-8 border-t border-[var(--border)] space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#0c0d12] tracking-tight">
                More by {authorName}
              </h3>
              <Link
                href={`/${author.slug}`}
                className="text-xs font-bold text-[#0052ff] hover:underline"
              >
                View all showcases →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {moreProjects.map((p) => {
                const pCover = getCoverImageUrl(p.coverImageKey);
                return (
                  <Link
                    key={p.id}
                    href={`/${author.slug}/${p.slug}`}
                    className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[#0052ff] hover:shadow-md transition-all space-y-3 block group"
                  >
                    <div className="aspect-video w-full rounded-xl bg-slate-100 overflow-hidden relative border border-[var(--border)]">
                      {pCover ? (
                        <Image
                          src={pCover}
                          alt={p.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 300px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-[#0052ff] bg-blue-50">
                          ⚡
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-sm text-[var(--foreground)] group-hover:text-[#0052ff] transition-colors truncate">
                          {p.title}
                        </h4>
                        <span className="text-[11px] font-mono font-bold text-[#0052ff] shrink-0">
                          ★ {p.kudosCount}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--foreground-muted)] line-clamp-2 leading-relaxed">
                        {p.summary}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
