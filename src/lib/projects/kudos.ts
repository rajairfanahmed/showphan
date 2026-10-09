import { prisma } from "@/lib/prisma";
import { calculateTrendingScore } from "./trending";

export interface KudosResult {
  given: boolean;
  kudosCount: number;
  trendingScore: number;
  alreadyVoted?: boolean;
}

export async function addKudos(
  userId: string,
  projectId: string
): Promise<KudosResult> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, kudosCount: true, createdAt: true },
  });

  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  const existing = await prisma.kudos.findUnique({
    where: {
      userId_projectId: { userId, projectId },
    },
  });

  if (existing) {
    return {
      given: true,
      kudosCount: project.kudosCount,
      trendingScore: calculateTrendingScore(project.kudosCount, project.createdAt),
      alreadyVoted: true,
    };
  }

  const newCount = project.kudosCount + 1;
  const newTrendingScore = calculateTrendingScore(newCount, project.createdAt);

  await prisma.$transaction([
    prisma.kudos.create({
      data: { userId, projectId },
    }),
    prisma.project.update({
      where: { id: projectId },
      data: {
        kudosCount: newCount,
        trendingScore: newTrendingScore,
      },
    }),
  ]);

  return {
    given: true,
    kudosCount: newCount,
    trendingScore: newTrendingScore,
    alreadyVoted: false,
  };
}

export async function removeKudos(
  userId: string,
  projectId: string
): Promise<KudosResult> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, kudosCount: true, createdAt: true },
  });

  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  const existing = await prisma.kudos.findUnique({
    where: {
      userId_projectId: { userId, projectId },
    },
  });

  if (!existing) {
    return {
      given: false,
      kudosCount: project.kudosCount,
      trendingScore: calculateTrendingScore(project.kudosCount, project.createdAt),
    };
  }

  const newCount = Math.max(0, project.kudosCount - 1);
  const newTrendingScore = calculateTrendingScore(newCount, project.createdAt);

  await prisma.$transaction([
    prisma.kudos.delete({
      where: { id: existing.id },
    }),
    prisma.project.update({
      where: { id: projectId },
      data: {
        kudosCount: newCount,
        trendingScore: newTrendingScore,
      },
    }),
  ]);

  return {
    given: false,
    kudosCount: newCount,
    trendingScore: newTrendingScore,
  };
}

export async function toggleKudos(
  userId: string,
  projectId: string
): Promise<KudosResult> {
  const existing = await prisma.kudos.findUnique({
    where: {
      userId_projectId: { userId, projectId },
    },
  });

  if (existing) {
    return removeKudos(userId, projectId);
  } else {
    return addKudos(userId, projectId);
  }
}

export async function getProjectKudosStatus(
  projectId: string,
  userId?: string | null
): Promise<{ kudosCount: number; hasGiven: boolean }> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { kudosCount: true },
  });

  if (!project) {
    return { kudosCount: 0, hasGiven: false };
  }

  if (!userId) {
    return { kudosCount: project.kudosCount, hasGiven: false };
  }

  const existing = await prisma.kudos.findUnique({
    where: {
      userId_projectId: { userId, projectId },
    },
  });

  return {
    kudosCount: project.kudosCount,
    hasGiven: Boolean(existing),
  };
}

