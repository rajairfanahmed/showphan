import Link from "next/link";
import { getCoverImageUrl } from "@/lib/storage/urls";
import { TechBadge } from "./TechBadge";
import { KudosButton } from "./KudosButton";

export interface ProjectCardProps {
  project: {
    id: string;
    slug: string;
    title: string;
    summary: string;
    coverImageKey?: string | null;
    liveUrl?: string | null;
    repoUrl?: string | null;
    kudosCount: number;
    viewsCount?: number;
    trendingScore?: number;
    sandboxEnabled?: boolean;
    createdAt?: Date | string;
    user: {
      id: string;
      name?: string | null;
      displayName?: string | null;
      slug: string;
      avatarUrl?: string | null;
    };
    technologies?: Array<{
      technology: {
        id: string;
        name: string;
        slug: string;
        iconColor?: string | null;
      };
    }>;
  };
  hasGivenKudos?: boolean;
}

export function ProjectCard({ project, hasGivenKudos = false }: ProjectCardProps) {
  const coverUrl = getCoverImageUrl(project.coverImageKey ?? undefined);
  const user = project.user;
  const projectHref = `/${user.slug}/${project.slug}`;

  return (
    <article className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300">
      {/* 16:9 Cover Preview */}
      <Link href={projectHref} className="aspect-video w-full bg-zinc-950 relative overflow-hidden flex items-center justify-center block">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 text-zinc-600 group-hover:text-amber-500/70 transition-colors">
            <svg className="w-10 h-10 mb-2 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span className="text-xs font-mono tracking-wider opacity-70 uppercase font-semibold">
              Live Showcase
            </span>
          </div>
        )}

        {/* Live Sandbox indicator badge */}
        {project.sandboxEnabled && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-xs font-medium shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive</span>
          </div>
        )}

        {/* Views Count Pill */}
        {typeof project.viewsCount === "number" && project.viewsCount > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-zinc-300 text-xs font-mono">
            <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{project.viewsCount}</span>
          </div>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Creator Attribution */}
          <div className="flex items-center gap-2">
            <Link
              href={`/${user.slug}`}
              className="flex items-center gap-2 group/creator"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden bg-zinc-800 border border-[var(--border)] shrink-0">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName || user.name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-amber-500/20 text-amber-500 font-bold text-xs flex items-center justify-center">
                    {(user.displayName || user.name || "U")[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <span className="text-xs font-medium text-[var(--muted-foreground)] group-hover/creator:text-amber-500 transition-colors truncate max-w-[150px]">
                {user.displayName || user.name}
              </span>
            </Link>
          </div>

          {/* Title & Summary */}
          <Link href={projectHref} className="block group/title space-y-1.5">
            <h3 className="font-bold text-lg text-[var(--foreground)] group-hover/title:text-amber-500 transition-colors line-clamp-1">
              {project.title}
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
              {project.summary || "No description provided."}
            </p>
          </Link>
        </div>

        {/* Technologies Badges */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.technologies.slice(0, 3).map((t) => (
              <Link
                key={t.technology.id}
                href={`/explore/${t.technology.slug}`}
                className="hover:opacity-80 transition-opacity"
              >
                <TechBadge
                  name={t.technology.name}
                  iconName={t.technology.iconColor ?? undefined}
                  size="sm"
                />
              </Link>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-xs font-medium px-2 py-0.5 rounded border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)]">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer Interaction Bar */}
        <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2">
          {/* 1-Click Kudos Action */}
          <KudosButton
            projectId={project.id}
            initialKudosCount={project.kudosCount}
            initialHasGiven={hasGivenKudos}
            size="sm"
          />

          {/* External Links */}
          <div className="flex items-center gap-1.5">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Visit Live URL"
                className="p-1.5 rounded-lg border border-[var(--border)] hover:border-amber-500/40 hover:bg-amber-500/10 text-[var(--muted-foreground)] hover:text-amber-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="View Source Code"
                className="p-1.5 rounded-lg border border-[var(--border)] hover:border-amber-500/40 hover:bg-amber-500/10 text-[var(--muted-foreground)] hover:text-amber-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
