import { prisma } from "@/lib/prisma";
import { ProjectStatus } from "@/generated/prisma/enums";

export interface BookmarkResult {
  bookmarked: boolean;
}

export async function toggleBookmark(
  userId: string,
  projectId: string
): Promise<BookmarkResult> {
  const existing = await prisma.bookmark.findUnique({
    where: {
      userId_projectId: { userId, projectId },
    },
  });

  if (existing) {
    await prisma.bookmark.delete({
      where: { id: existing.id },
    });
    return { bookmarked: false };
  } else {
    await prisma.bookmark.create({
      data: { userId, projectId },
    });
    return { bookmarked: true };
  }
}

export async function removeBookmark(
  userId: string,
  projectId: string
): Promise<BookmarkResult> {
  await prisma.bookmark.deleteMany({
    where: { userId, projectId },
  });
  return { bookmarked: false };
}

export async function getBookmarkStatus(
  userId: string,
  projectId: string
): Promise<BookmarkResult> {
  const existing = await prisma.bookmark.findUnique({
    where: {
      userId_projectId: { userId, projectId },
    },
  });

  return { bookmarked: Boolean(existing) };
}

export async function getUserBookmarks(userId: string) {
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      project: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              displayName: true,
              slug: true,
              avatarUrl: true,
            },
          },
          technologies: {
            include: {
              technology: true,
            },
          },
        },
      },
    },
  });

  return bookmarks
    .map((b) => b.project)
    .filter((p) => p.status === ProjectStatus.PUBLISHED);
}

export interface DetailedBookmarkItem {
  bookmarkId: string;
  bookmarkedAt: string;
  hasGivenKudos: boolean;
  project: {
    id: string;
    slug: string;
    title: string;
    summary: string;
    coverImageKey: string | null;
    liveUrl: string | null;
    repoUrl: string | null;
    tags: string[];
    status: ProjectStatus;
    kudosCount: number;
    viewsCount: number;
    bookmarksCount: number;
    createdAt: string;
    user: {
      id: string;
      name: string | null;
      displayName: string | null;
      slug: string;
      avatarUrl: string | null;
    };
    technologies: Array<{
      name: string;
      slug: string;
      iconColor: string | null;
      iconMono: string | null;
    }>;
  };
}

export async function getUserBookmarksDetailed(
  userId: string
): Promise<DetailedBookmarkItem[]> {
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      project: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              displayName: true,
              slug: true,
              avatarUrl: true,
            },
          },
          technologies: {
            include: {
              technology: true,
            },
          },
          kudos: {
            where: { userId },
            select: { id: true },
          },
          _count: {
            select: {
              kudos: true,
              bookmarks: true,
            },
          },
        },
      },
    },
  });

  const published = bookmarks.filter(
    (b) => b.project && b.project.status === ProjectStatus.PUBLISHED
  );

  return published.map((b) => {
    const p = b.project;
    return {
      bookmarkId: b.id,
      bookmarkedAt: b.createdAt.toISOString(),
      hasGivenKudos: p.kudos.length > 0,
      project: {
        id: p.id,
        slug: p.slug,
        title: p.title,
        summary: p.summary,
        coverImageKey: p.coverImageKey,
        liveUrl: p.liveUrl,
        repoUrl: p.repoUrl,
        tags: p.tags,
        status: p.status,
        kudosCount: p.kudosCount || p._count.kudos,
        viewsCount: p.viewsCount,
        bookmarksCount: p._count.bookmarks,
        createdAt: p.createdAt.toISOString(),
        user: {
          id: p.user.id,
          name: p.user.name,
          displayName: p.user.displayName,
          slug: p.user.slug === "raja-irfan-ahmed" ? "rajairfanahmed" : p.user.slug,
          avatarUrl: p.user.avatarUrl,
        },
        technologies: p.technologies.map((t) => ({
          name: t.technology.name,
          slug: t.technology.slug,
          iconColor: t.technology.iconColor,
          iconMono: t.technology.iconMono,
        })),
      },
    };
  });
}
