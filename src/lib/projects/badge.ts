import { prisma } from "@/lib/prisma";
import { ProjectStatus } from "@/generated/prisma/enums";

export interface DeveloperBadgeData {
  name: string;
  displayName: string;
  slug: string;
  avatarUrl?: string | null;
  publishedCount: number;
  totalKudos: number;
  topTechnologies: string[];
}

export function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function getDeveloperBadgeData(
  slug: string
): Promise<DeveloperBadgeData | null> {
  const user = await prisma.user.findUnique({
    where: { slug: slug.toLowerCase() },
    select: {
      id: true,
      name: true,
      displayName: true,
      slug: true,
      avatarUrl: true,
      projects: {
        where: { status: ProjectStatus.PUBLISHED },
        select: {
          id: true,
          kudosCount: true,
          technologies: {
            select: {
              technology: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  const publishedCount = user.projects.length;
  const totalKudos = user.projects.reduce(
    (acc, p) => acc + (p.kudosCount || 0),
    0
  );

  // Frequency count of technologies across published projects
  const techCounts = new Map<string, number>();
  for (const project of user.projects) {
    for (const t of project.technologies) {
      const name = t.technology.name;
      techCounts.set(name, (techCounts.get(name) || 0) + 1);
    }
  }

  const topTechnologies = Array.from(techCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);

  return {
    name: user.name || "Developer",
    displayName: user.displayName || user.name || "Developer",
    slug: user.slug,
    avatarUrl: user.avatarUrl,
    publishedCount,
    totalKudos,
    topTechnologies,
  };
}

export function renderBadgeSvg(data: DeveloperBadgeData): string {
  const displayName = escapeXml(data.displayName);
  const slug = escapeXml(data.slug);
  const initial = escapeXml((data.displayName || data.name || "D")[0]?.toUpperCase() || "D");
  const avatarUrl = data.avatarUrl ? escapeXml(data.avatarUrl) : null;
  const publishedText = `${data.publishedCount} ${data.publishedCount === 1 ? "Project" : "Projects"}`;
  const kudosText = `${data.totalKudos} Kudos`;

  // Calculate tech badge widths and positions
  let techX = 238;
  const techBadgesSvg = data.topTechnologies
    .map((tech) => {
      const escapedTech = escapeXml(tech);
      const width = Math.max(50, escapedTech.length * 7 + 16);
      const pill = `
        <rect x="${techX}" y="76" width="${width}" height="26" rx="6" fill="#18181b" stroke="#27272a" stroke-width="1"/>
        <text x="${techX + width / 2}" y="93" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="500" fill="#d4d4d8">${escapedTech}</text>
      `;
      techX += width + 6;
      return pill;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="160" viewBox="0 0 480 160" fill="none">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="480" y2="160" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#090d16" />
      <stop offset="100%" stop-color="#121722" />
    </linearGradient>
    <radialGradient id="glowGrad" cx="100%" cy="0%" r="80%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#090d16" stop-opacity="0" />
    </radialGradient>
    <clipPath id="avatar-clip">
      <circle cx="48" cy="48" r="24" />
    </clipPath>
  </defs>

  <!-- Background Card -->
  <rect width="480" height="160" rx="14" fill="url(#bgGrad)" stroke="#27272a" stroke-width="1.5" />
  <rect width="480" height="160" rx="14" fill="url(#glowGrad)" />

  <!-- Avatar Container -->
  <circle cx="48" cy="48" r="24" fill="#f59e0b" fill-opacity="0.12" stroke="#f59e0b" stroke-opacity="0.3" stroke-width="1.5" />
  ${
    avatarUrl
      ? `<image href="${avatarUrl}" x="24" y="24" width="48" height="48" clip-path="url(#avatar-clip)" preserveAspectRatio="xMidYMid slice" />`
      : `<text x="48" y="55" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="bold" fill="#f59e0b">${initial}</text>`
  }

  <!-- Developer Identity -->
  <text x="84" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="#f4f4f5">${displayName}</text>
  <text x="84" y="60" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="12" fill="#a1a1aa">@${slug}</text>

  <!-- Proof of Work Pill -->
  <rect x="330" y="26" width="126" height="22" rx="11" fill="#f59e0b" fill-opacity="0.12" stroke="#f59e0b" stroke-opacity="0.35" stroke-width="1" />
  <text x="393" y="41" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" fill="#f59e0b" letter-spacing="0.5">★ PROOF-OF-WORK</text>

  <!-- Stats Pills -->
  <rect x="24" y="76" width="102" height="26" rx="6" fill="#18181b" stroke="#27272a" stroke-width="1" />
  <text x="75" y="93" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#f4f4f5">⚡ ${publishedText}</text>

  <rect x="132" y="76" width="98" height="26" rx="6" fill="#f59e0b" fill-opacity="0.1" stroke="#f59e0b" stroke-opacity="0.25" stroke-width="1" />
  <text x="181" y="93" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#f59e0b">★ ${kudosText}</text>

  <!-- Top Technologies -->
  ${techBadgesSvg}

  <!-- Footer Divider & GitHub Star CTA Banner -->
  <line x1="20" y1="120" x2="460" y2="120" stroke="#27272a" stroke-width="1" />
  <text x="240" y="141" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#a1a1aa" letter-spacing="0.4">Showphan Proof-of-Work • ⭐ Star on GitHub</text>
</svg>`;
}
