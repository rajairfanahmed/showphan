import { prisma } from "@/lib/prisma";

const DEFAULT_FALLBACK_TECHNOLOGIES = [
  { id: "tech-nextjs", name: "Next.js", slug: "nextjs", iconColor: "logos:nextjs-icon", iconMono: null },
  { id: "tech-react", name: "React", slug: "react", iconColor: "logos:react", iconMono: null },
  { id: "tech-typescript", name: "TypeScript", slug: "typescript", iconColor: "logos:typescript-icon", iconMono: null },
  { id: "tech-tailwind", name: "Tailwind CSS", slug: "tailwind", iconColor: "logos:tailwindcss-icon", iconMono: null },
  { id: "tech-python", name: "Python", slug: "python", iconColor: "logos:python", iconMono: null },
  { id: "tech-rust", name: "Rust", slug: "rust", iconColor: "logos:rust", iconMono: null },
  { id: "tech-go", name: "Go", slug: "go", iconColor: "logos:go", iconMono: null },
  { id: "tech-bun", name: "Bun", slug: "bun", iconColor: "logos:bun", iconMono: null },
  { id: "tech-docker", name: "Docker", slug: "docker", iconColor: "logos:docker-icon", iconMono: null },
  { id: "tech-nodejs", name: "Node.js", slug: "nodejs", iconColor: "logos:nodejs-icon", iconMono: null },
  { id: "tech-postgresql", name: "PostgreSQL", slug: "postgresql", iconColor: "logos:postgresql", iconMono: null },
  { id: "tech-graphql", name: "GraphQL", slug: "graphql", iconColor: "logos:graphql", iconMono: null },
  { id: "tech-redis", name: "Redis", slug: "redis", iconColor: "logos:redis", iconMono: null },
  { id: "tech-cloudflare", name: "Cloudflare", slug: "cloudflare", iconColor: "logos:cloudflare-icon", iconMono: null },
];

export async function getTechnologies() {
  try {
    const list = await prisma.technology.findMany({
      orderBy: { name: "asc" },
    });
    return list.length > 0 ? list : DEFAULT_FALLBACK_TECHNOLOGIES;
  } catch {
    return DEFAULT_FALLBACK_TECHNOLOGIES;
  }
}
