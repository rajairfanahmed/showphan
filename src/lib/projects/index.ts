import { prisma } from "@/lib/prisma";
import { ProjectStatus } from "@/generated/prisma/enums";

export * from "./trending";
export * from "./kudos";
export * from "./explore";
export * from "./badge";
export * from "./bookmark";

export interface ProjectDraftInput {
  title: string;
}

export interface ProjectUpdateInput {
  title?: string;
  summary?: string;
  description?: string;
  coverImageKey?: string | null;
  liveUrl?: string | null;
  repoUrl?: string | null;
  role?: string | null;
  learnings?: string | null;
  tags?: string[];
  technologyIds?: string[];
  clientUpdatedAt?: string;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createProjectDraft(userId: string, title: string) {
  // Enforce 30 project limit
  const count = await prisma.project.count({
    where: { userId },
  });

  if (count >= 30) {
    throw new Error("PROJECT_LIMIT_REACHED: You can have at most 30 projects.");
  }

  const baseSlug = slugify(title) || "project";
  let slug = baseSlug;
  let counter = 1;

  // Ensure unique slug per user
  while (true) {
    const existing = await prisma.project.findUnique({
      where: {
        userId_slug: { userId, slug },
      },
    });
    if (!existing) break;
    slug = `${baseSlug}-${counter++}`;
  }

  const project = await prisma.project.create({
    data: {
      userId,
      title,
      slug,
      summary: "",
      description: "",
      status: ProjectStatus.DRAFT,
      position: count,
    },
  });

  return project;
}

export async function updateProject(
  userId: string,
  projectId: string,
  data: ProjectUpdateInput
) {
  const existing = await prisma.project.findFirst({
    where: { id: projectId, userId },
    include: { technologies: true },
  });

  if (!existing) {
    throw new Error("NOT_FOUND: Project not found or access denied.");
  }

  // Optimistic locking check
  if (data.clientUpdatedAt) {
    const existingIso = existing.updatedAt.toISOString();
    if (existingIso !== data.clientUpdatedAt) {
      throw new Error(
        "STALE_UPDATE: This project was modified in another tab or session. Please reload."
      );
    }
  }

  // If title changed, optionally update slug if still DRAFT
  let newSlug = existing.slug;
  if (data.title && data.title !== existing.title && existing.status === ProjectStatus.DRAFT) {
    const baseSlug = slugify(data.title) || "project";
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const collision = await prisma.project.findFirst({
        where: { userId, slug, NOT: { id: projectId } },
      });
      if (!collision) {
        newSlug = slug;
        break;
      }
      slug = `${baseSlug}-${counter++}`;
    }
  }

  const updatePayload: Record<string, unknown> = {
    slug: newSlug,
    ...(data.title !== undefined && { title: data.title }),
    ...(data.summary !== undefined && { summary: data.summary.slice(0, 140) }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.coverImageKey !== undefined && { coverImageKey: data.coverImageKey }),
    ...(data.liveUrl !== undefined && { liveUrl: data.liveUrl }),
    ...(data.repoUrl !== undefined && { repoUrl: data.repoUrl }),
    ...(data.role !== undefined && { role: data.role }),
    ...(data.learnings !== undefined && { learnings: data.learnings }),
    ...(data.tags !== undefined && { tags: data.tags.slice(0, 5) }),
  };

  // Update technologies relationship if provided (max 15)
  if (data.technologyIds !== undefined) {
    const cappedTechIds = data.technologyIds.slice(0, 15);
    updatePayload.technologies = {
      deleteMany: {},
      create: cappedTechIds.map((technologyId) => ({
        technology: { connect: { id: technologyId } },
      })),
    };
  }

  const updated = await prisma.project.update({
    where: { id: projectId },
    data: updatePayload as Parameters<typeof prisma.project.update>[0]["data"],
    include: {
      technologies: {
        include: { technology: true },
      },
    },
  });

  return updated;
}

export async function getUserProjects(userId: string) {
  return prisma.project.findMany({
    where: { userId },
    orderBy: [{ position: "asc" }, { createdAt: "desc" }],
    include: {
      technologies: {
        include: { technology: true },
      },
    },
  });
}

export async function deleteProject(userId: string, projectId: string) {
  const existing = await prisma.project.findFirst({
    where: { id: projectId, userId },
  });

  if (!existing) {
    throw new Error("NOT_FOUND: Project not found or access denied.");
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  return {
    deletedId: projectId,
    coverImageKey: existing.coverImageKey,
  };
}

export async function getPublicProfileBySlug(slug: string) {
  const user = await prisma.user.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      displayName: true,
      slug: true,
      bio: true,
      avatarUrl: true,
      searchVisible: true,
      createdAt: true,
      projects: {
        where: { status: ProjectStatus.PUBLISHED },
        orderBy: [{ position: "asc" }, { createdAt: "desc" }],
        include: {
          technologies: {
            include: { technology: true },
          },
        },
      },
    },
  });

  if (!user) return null;

  const featuredProjects = user.projects.filter((p) => p.isFeatured);
  const regularProjects = user.projects.filter((p) => !p.isFeatured);

  return {
    user,
    featuredProjects,
    regularProjects,
    publishedCount: user.projects.length,
  };
}

export async function getPublicProject(userSlug: string, projectSlug: string) {
  const user = await prisma.user.findUnique({
    where: { slug: userSlug },
    select: {
      id: true,
      name: true,
      displayName: true,
      slug: true,
      avatarUrl: true,
      bio: true,
    },
  });

  if (!user) return null;

  const project = await prisma.project.findUnique({
    where: {
      userId_slug: { userId: user.id, slug: projectSlug },
    },
    include: {
      technologies: {
        include: { technology: true },
      },
    },
  });

  if (!project) return null;

  // More projects by the same developer (up to 3)
  const moreProjects = await prisma.project.findMany({
    where: {
      userId: user.id,
      status: ProjectStatus.PUBLISHED,
      NOT: { id: project.id },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
    include: {
      technologies: {
        include: { technology: true },
      },
    },
  });

  return {
    project,
    author: user,
    moreProjects,
  };
}
