import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserBookmarksDetailed } from "@/lib/projects/bookmark";
import { InspirationVaultClient } from "@/components/bookmarks/InspirationVaultClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Inspiration Vault - Showphan",
  description:
    "Your private collection of inspiring developer showcases, architecture patterns, and UI proofs-of-work.",
};

export default async function BookmarksPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session || !session.user) {
    redirect("/");
  }

  const initialBookmarks = await getUserBookmarksDetailed(session.user.id);

  return <InspirationVaultClient initialBookmarks={initialBookmarks} />;
}
