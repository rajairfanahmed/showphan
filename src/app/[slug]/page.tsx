import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicProfileBySlug } from "@/lib/projects";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileProjectGrid } from "@/components/profile/ProfileProjectGrid";
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
    return { title: "Profile Not Found — Showphan" };
  }

  const { user, publishedCount } = data;
  const authorName = user.displayName || user.name || user.slug;
  const title = `${authorName} (@${user.slug}) — Developer Portfolio on Showphan`;
  const description =
    user.bio ||
    `${authorName}'s developer portfolio with ${publishedCount} published showcase${publishedCount === 1 ? "" : "s"}.`;

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

  const { user, featuredProjects, regularProjects, publishedCount, totalKudos, allTechnologies } = data;

  return (
    <div className="flex-1 flex flex-col bg-[var(--background)] min-h-screen">
      {/* 1. Developer Profile Header with Proof-of-Work Badges */}
      <ProfileHeader
        user={user}
        publishedCount={publishedCount}
        totalKudos={totalKudos}
      />

      {/* 2. Main Content & Showcase Matrix */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex-1 space-y-12 w-full">
        {publishedCount === 0 ? (
          <div className="text-center py-20 border border-dashed border-[var(--border)] rounded-3xl p-8 space-y-3 bg-white/70">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-[#0052ff] flex items-center justify-center mx-auto text-xl shadow-inner font-black">
              🚀
            </div>
            <h3 className="font-bold text-lg text-[var(--foreground)]">No published showcases yet</h3>
            <p className="text-sm text-[var(--foreground-muted)] max-w-md mx-auto">
              This developer hasn&apos;t published any projects on Showphan yet. Check back soon!
            </p>
          </div>
        ) : (
          <ProfileProjectGrid
            userSlug={user.slug}
            featuredProjects={featuredProjects}
            regularProjects={regularProjects}
            allTechnologies={allTechnologies}
          />
        )}
      </main>

      {/* 3. Footer Invitation */}
      <footer className="border-t border-[var(--border)] py-8 text-center text-xs text-[var(--foreground-muted)] bg-[var(--card)]/50">
        <p>
          Inspired by this portfolio?{" "}
          <Link href="/dashboard/new" className="text-[#0052ff] font-bold hover:underline">
            Create your own developer showcase on Showphan →
          </Link>
        </p>
      </footer>
    </div>
  );
}
