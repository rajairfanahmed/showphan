import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { ProjectStatus } from "@/generated/prisma/enums";
import { logger } from "@/lib/logger";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://showphan.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/how-it-works`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    // 1. Fetch public developers with >= 1 published project
    const developers = await prisma.user.findMany({
      where: {
        searchVisible: true,
        projects: {
          some: { status: ProjectStatus.PUBLISHED },
        },
      },
      select: {
        slug: true,
        updatedAt: true,
        projects: {
          where: { status: ProjectStatus.PUBLISHED },
          select: { slug: true, updatedAt: true },
        },
      },
    });

    const dynamicRoutes: MetadataRoute.Sitemap = [];

    for (const dev of developers) {
      // Profile route
      dynamicRoutes.push({
        url: `${baseUrl}/${dev.slug}`,
        lastModified: dev.updatedAt,
        changeFrequency: "weekly",
        priority: 0.9,
      });

      // Individual project routes
      for (const proj of dev.projects) {
        dynamicRoutes.push({
          url: `${baseUrl}/${dev.slug}/${proj.slug}`,
          lastModified: proj.updatedAt,
          changeFrequency: "weekly",
          priority: 0.85,
        });
      }
    }

    return [...staticRoutes, ...dynamicRoutes];
  } catch (err) {
    logger.error("Sitemap generation error", { error: err });
    return staticRoutes;
  }
}
