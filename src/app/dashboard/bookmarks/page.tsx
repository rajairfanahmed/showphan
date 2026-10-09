import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserBookmarks } from "@/lib/projects";
import { ProjectCard } from "@/components/ProjectCard";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Inspiration Vault - Showphan",
  description: "Your saved collection of inspiring developer projects and showcases.",
};

export default async function BookmarksPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session || !session.user) {
    redirect("/");
  }

  const projects = await getUserBookmarks(session.user.id);

  // Fetch kudos given by user for these projects
  let userKudosIds: string[] = [];
  if (projects.length > 0) {
    const kudos = await prisma.kudos.findMany({
      where: {
        userId: session.user.id,
        projectId: { in: projects.map((p) => p.id) },
      },
      select: { projectId: true },
    });
    userKudosIds = kudos.map((k) => k.projectId);
  }

  return (
    <div className="flex-1 flex flex-col bg-[var(--background)]">
      {/* Header Banner */}
      <section className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--card)]/50 via-[var(--background)] to-[var(--background)] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <Link href="/dashboard" className="hover:text-[var(--foreground)] transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-amber-500 font-semibold">Inspiration Vault</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🔖</span>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
                  Inspiration Vault
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 font-semibold">
                  {projects.length} Saved
                </span>
              </div>
              <p className="text-sm sm:text-base text-[var(--muted-foreground)] max-w-2xl leading-relaxed">
                Your private collection of bookmarked community projects, developer tools, and architectures.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/explore"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-sm shadow-amber-500/20"
              >
                <span>Discover More Showcases →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full space-y-8">
        {projects.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[var(--border)] rounded-2xl p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto text-2xl">
              🔖
            </div>
            <h3 className="font-bold text-xl text-[var(--foreground)]">
              Your Inspiration Vault is empty
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] max-w-md mx-auto">
              As you browse the Explore directory, click the bookmark icon on any project card to curate your own personal library of ideas.
            </p>
            <div className="pt-2">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-black text-sm font-bold hover:bg-amber-400 transition-colors shadow-md"
              >
                <span>Browse Explore Directory</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                hasBookmarked={true}
                hasGivenKudos={userKudosIds.includes(project.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
