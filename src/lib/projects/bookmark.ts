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
