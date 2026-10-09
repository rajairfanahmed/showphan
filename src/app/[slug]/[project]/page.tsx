import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicProject } from "@/lib/projects";
import { getCoverImageUrl } from "@/lib/storage/urls";
import { TechBadge } from "@/components/TechBadge";
import { LiveSandboxViewer } from "@/components/LiveSandboxViewer";
import { PeerReactions } from "@/components/PeerReactions";
import { KudosButton } from "@/components/KudosButton";
import { BookmarkButton } from "@/components/BookmarkButton";
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
    return { title: "Project Not Found - Showphan" };
  }

  const { project, author } = data;
  const title = `${project.title} by ${author.displayName || author.name} - Showphan`;
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

  const { project, author, moreProjects } = data;
  const coverUrl = getCoverImageUrl(project.coverImageKey);

  return (
    <div className="flex-1 flex flex-col bg-[var(--background)]">
      {/* Back Bar */}
      <div className="border-b border-[var(--border)] bg-[var(--card)]/50 py-3 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-sm">
          <Link
            href={`/${author.slug}`}
            className="text-[var(--muted-foreground)] hover:text-amber-500 transition-colors flex items-center gap-1.5 font-medium"
          >
            <span>← Back to @{author.slug}&apos;s profile</span>
          </Link>
          <span className="text-xs text-[var(--muted-foreground)] hidden sm:inline">
            Published Project
          </span>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 flex-1 w-full">
        {/* Live Sandbox & Visual Proof Viewer */}
        <LiveSandboxViewer
          projectTitle={project.title}
          coverUrl={coverUrl}
          sandboxUrl={project.sandboxUrl}
          liveUrl={project.liveUrl}
          sandboxEnabled={project.sandboxEnabled}
        />

        {/* Title & Actions Header */}
        <div className="space-y-6 pb-8 border-b border-[var(--border)]">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
              <span>By</span>
              <Link href={`/${author.slug}`} className="font-bold text-[var(--foreground)] hover:text-amber-500">
                {author.displayName || author.name}
              </Link>
              <span>•</span>
              <time dateTime={project.createdAt.toISOString()}>
                {new Date(project.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  year: "numeric",
                })}
              </time>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
              {project.title}
            </h1>
            <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed">
              {project.summary}
            </p>
          </div>

          {/* Action Links & Interaction Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="ugc nofollow noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm shadow-md transition-all min-touch"
                >
                  <span>Live Site</span>
                  <span>↗</span>
                </a>
              )}

              {project.repoUrl ? (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="ugc nofollow noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] text-[var(--foreground)] font-semibold text-sm transition-colors min-touch"
                >
                  <span>Source Code</span>
                  <span>↗</span>
                </a>
              ) : (
                <span className="inline-flex items-center px-4 py-2 rounded-lg bg-zinc-900 border border-[var(--border)] text-zinc-400 text-xs font-mono">
                  Source code is private
                </span>
              )}
            </div>

            {/* Kudos & Bookmark Actions */}
            <div className="flex items-center gap-2">
              <BookmarkButton projectId={project.id} size="md" />
              <KudosButton
                projectId={project.id}
                initialKudosCount={project.kudosCount}
                size="md"
              />
            </div>
          </div>
        </div>

        {/* Peer Reactions Bar */}
        <PeerReactions
          projectId={project.id}
          repoUrl={project.repoUrl}
        />

        {/* Tech Stack */}
        {project.technologies.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs uppercase tracking-wider font-bold text-[var(--muted-foreground)]">
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
          </div>
        )}

        {/* Markdown Description */}
        {project.description && (
          <div className="space-y-3 pt-4 border-t border-[var(--border)]">
            <h2 className="text-xs uppercase tracking-wider font-bold text-[var(--muted-foreground)]">
              About the Project
            </h2>
            <div className="prose prose-invert prose-base max-w-none text-[var(--foreground)] leading-relaxed space-y-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                {project.description}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Role & Learnings */}
        {(project.role || project.learnings) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[var(--border)]">
            {project.role && (
              <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                  Role & Responsibilities
                </span>
                <p className="text-sm text-[var(--foreground)] leading-relaxed">{project.role}</p>
              </div>
            )}
            {project.learnings && (
              <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                  What Was Learned
                </span>
                <p className="text-sm text-[var(--foreground)] leading-relaxed">{project.learnings}</p>
              </div>
            )}
          </div>
        )}

        {/* More Projects by Developer */}
        {moreProjects.length > 0 && (
          <div className="pt-12 border-t border-[var(--border)] space-y-6">
            <h3 className="text-lg font-bold text-[var(--foreground)]">
              More by {author.displayName || author.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {moreProjects.map((p) => {
                const pCover = getCoverImageUrl(p.coverImageKey);
                return (
                  <Link
                    key={p.id}
                    href={`/${author.slug}/${p.slug}`}
                    className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-amber-500/50 transition-colors space-y-2 block"
                  >
                    <div className="aspect-video w-full rounded-md bg-zinc-900 overflow-hidden relative border border-[var(--border)]">
                      {pCover && <img src={pCover} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <h4 className="font-bold text-sm text-[var(--foreground)] truncate">{p.title}</h4>
                    <p className="text-xs text-[var(--muted-foreground)] line-clamp-1">{p.summary}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
