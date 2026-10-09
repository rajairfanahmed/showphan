import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicProfileBySlug } from "@/lib/projects";
import { getCoverImageUrl } from "@/lib/storage/urls";
import { TechBadge } from "@/components/TechBadge";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPublicProfileBySlug(slug);

  if (!data) {
    return { title: "Profile Not Found - Showphan" };
  }

  const { user, publishedCount } = data;
  const title = `${user.displayName || user.name} (@${user.slug}) - Projects on Showphan`;
  const description =
    user.bio ||
    `${user.displayName || user.name}'s developer portfolio with ${publishedCount} published project${publishedCount === 1 ? "" : "s"}.`;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://showphan.vercel.app";
  const ogImageUrl = `${baseUrl}/api/og/profile?slug=${slug}`;

  return {
    title,
    description,
    robots: {
      index: user.searchVisible && publishedCount > 0,
      follow: user.searchVisible && publishedCount > 0,
    },
    openGraph: {
      title,
      description,
      images: [ogImageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPublicProfileBySlug(slug);

  if (!data) {
    notFound();
  }

  const { user, featuredProjects, regularProjects, publishedCount } = data;

  return (
    <div className="flex-1 flex flex-col bg-[var(--background)]">
      {/* Profile Intro Banner */}
      <section className="border-b border-[var(--border)] bg-[var(--card)]/40 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full border-2 border-amber-500/40 p-1 shrink-0 overflow-hidden bg-zinc-900">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.displayName || user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-amber-500 text-black font-extrabold text-3xl flex items-center justify-center">
                {(user.displayName || user.name)?.[0]?.toUpperCase()}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 space-y-2 max-w-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
                {user.displayName || user.name}
              </h1>
              <span className="text-sm font-mono text-amber-500">@{user.slug}</span>
            </div>

            <p className="text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed">
              {user.bio || "Full-stack developer building projects that solve real problems."}
            </p>

            <div className="pt-2 flex items-center justify-center sm:justify-start gap-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)]">
                {publishedCount} {publishedCount === 1 ? "Project" : "Projects"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 space-y-16 w-full">
        {publishedCount === 0 ? (
          <div className="text-center py-20 border border-dashed border-[var(--border)] rounded-2xl p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto text-xl">
              🚀
            </div>
            <h3 className="font-bold text-lg text-[var(--foreground)]">No published projects yet</h3>
            <p className="text-sm text-[var(--muted-foreground)] max-w-md mx-auto">
              This developer hasn&apos;t published any projects on Showphan yet. Check back soon!
            </p>
          </div>
        ) : (
          <>
            {/* Featured Projects Section */}
            {featuredProjects.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold text-lg">★</span>
                  <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
                    Featured Work
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featuredProjects.map((project) => {
                    const coverUrl = getCoverImageUrl(project.coverImageKey);
                    return (
                      <Link
                        key={project.id}
                        href={`/${user.slug}/${project.slug}`}
                        className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden hover:border-amber-500/60 hover:-translate-y-1 transition-all duration-200 shadow-md"
                      >
                        <div className="aspect-video w-full bg-zinc-900 border-b border-[var(--border)] relative overflow-hidden flex items-center justify-center">
                          {coverUrl ? (
                            <img
                              src={coverUrl}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                            />
                          ) : (
                            <span className="text-xs text-zinc-500 font-mono">No Cover</span>
                          )}
                        </div>

                        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <h3 className="font-bold text-xl text-[var(--foreground)] group-hover:text-amber-500 transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
                              {project.summary}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {project.technologies.slice(0, 3).map((t) => (
                              <TechBadge
                                key={t.technology.id}
                                name={t.technology.name}
                                iconName={t.technology.iconColor}
                                size="sm"
                              />
                            ))}
                            {project.technologies.length > 3 && (
                              <span className="text-xs font-medium px-2 py-0.5 rounded border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)]">
                                +{project.technologies.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Standard Project Grid */}
            {regularProjects.length > 0 && (
              <section className="space-y-6">
                {featuredProjects.length > 0 && (
                  <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
                    All Projects
                  </h2>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularProjects.map((project) => {
                    const coverUrl = getCoverImageUrl(project.coverImageKey);
                    return (
                      <Link
                        key={project.id}
                        href={`/${user.slug}/${project.slug}`}
                        className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden hover:border-amber-500/60 hover:-translate-y-1 transition-all duration-200 shadow-sm"
                      >
                        <div className="aspect-video w-full bg-zinc-900 border-b border-[var(--border)] relative overflow-hidden flex items-center justify-center">
                          {coverUrl ? (
                            <img
                              src={coverUrl}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                            />
                          ) : (
                            <span className="text-xs text-zinc-500 font-mono">No Cover</span>
                          )}
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-1.5">
                            <h3 className="font-bold text-base text-[var(--foreground)] group-hover:text-amber-500 transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-xs text-[var(--muted-foreground)] line-clamp-2">
                              {project.summary}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {project.technologies.slice(0, 3).map((t) => (
                              <TechBadge
                                key={t.technology.id}
                                name={t.technology.name}
                                iconName={t.technology.iconColor}
                                size="sm"
                              />
                            ))}
                            {project.technologies.length > 3 && (
                              <span className="text-xs font-medium px-2 py-0.5 rounded border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)]">
                                +{project.technologies.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* Visitor Invitation */}
      <section className="border-t border-[var(--border)] py-8 text-center text-xs text-[var(--muted-foreground)]">
        <p>
          Like this portfolio?{" "}
          <Link href="/" className="text-amber-500 font-semibold hover:underline">
            Create your own developer showcase for free on Showphan
          </Link>
        </p>
      </section>
    </div>
  );
}
