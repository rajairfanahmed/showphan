import { prisma } from "@/lib/prisma";
import { ProjectStatus } from "@/generated/prisma/enums";

export interface ExploreFilterOptions {
  tab?: "trending" | "newest" | "kudos";
  techSlug?: string;
  query?: string;
  limit?: number;
  offset?: number;
  userId?: string;
}

export async function getExploreProjects(options: ExploreFilterOptions = {}) {
  const {
    tab = "trending",
    techSlug,
    query,
    limit = 24,
    offset = 0,
    userId,
  } = options;

  // Base where clause: all published projects in community feed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    status: ProjectStatus.PUBLISHED,
  };

  if (techSlug) {
    where.technologies = {
      some: {
        technology: {
          slug: techSlug.toLowerCase(),
        },
      },
    };
  }

  if (query && query.trim().length > 0) {
    const q = query.trim();
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { summary: { contains: q, mode: "insensitive" } },
      { user: { displayName: { contains: q, mode: "insensitive" } } },
      { user: { slug: { contains: q, mode: "insensitive" } } },
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = [{ trendingScore: "desc" }, { kudosCount: "desc" }];
  if (tab === "newest") {
    orderBy = { createdAt: "desc" };
  } else if (tab === "kudos") {
    orderBy = [{ kudosCount: "desc" }, { createdAt: "desc" }];
  }

  const [projects, totalCount, popularTechnologies] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        coverImageKey: true,
        liveUrl: true,
        repoUrl: true,
        kudosCount: true,
        viewsCount: true,
        trendingScore: true,
        sandboxEnabled: true,
        createdAt: true,
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
          select: {
            technology: {
              select: {
                id: true,
                name: true,
                slug: true,
                iconColor: true,
                iconMono: true,
              },
            },
          },
        },
      },
    }),
    prisma.project.count({ where }),
    prisma.technology.findMany({
      take: 20,
      orderBy: {
        projects: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        iconColor: true,
        _count: {
          select: { projects: true },
        },
      },
    }),
  ]);

  // Fetch kudos given by this user for the projects in view
  let givenKudosProjectIds: string[] = [];
  if (userId && projects.length > 0) {
    const userKudos = await prisma.kudos.findMany({
      where: {
        userId,
        projectId: { in: projects.map((p) => p.id) },
      },
      select: { projectId: true },
    });
    givenKudosProjectIds = userKudos.map((k) => k.projectId);
  }

  // Project of the day is the top project in trending feed
  const projectOfTheDay =
    tab === "trending" && !techSlug && !query && projects.length > 0
      ? projects[0]
      : null;

  return {
    projects,
    totalCount,
    popularTechnologies,
    projectOfTheDay,
    givenKudosProjectIds,
  };
}
