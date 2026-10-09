import "dotenv/config";
import { prisma } from "../src/lib/prisma";

export const STARTER_TECHNOLOGIES = [
  // Languages
  { name: "JavaScript", slug: "javascript", iconColor: "logos:javascript", iconMono: "simple-icons:javascript" },
  { name: "TypeScript", slug: "typescript", iconColor: "logos:typescript-icon", iconMono: "simple-icons:typescript" },
  { name: "Python", slug: "python", iconColor: "logos:python", iconMono: "simple-icons:python" },
  { name: "Java", slug: "java", iconColor: "logos:java", iconMono: "simple-icons:java" },
  { name: "C", slug: "c", iconColor: "logos:c", iconMono: "simple-icons:c" },
  { name: "C++", slug: "cplusplus", iconColor: "logos:c-plusplus", iconMono: "simple-icons:cplusplus" },
  { name: "C#", slug: "csharp", iconColor: "logos:c-sharp", iconMono: "simple-icons:csharp" },
  { name: "Go", slug: "go", iconColor: "logos:go", iconMono: "simple-icons:go" },
  { name: "Rust", slug: "rust", iconColor: "logos:rust", iconMono: "simple-icons:rust" },
  { name: "PHP", slug: "php", iconColor: "logos:php", iconMono: "simple-icons:php" },
  { name: "Kotlin", slug: "kotlin", iconColor: "logos:kotlin-icon", iconMono: "simple-icons:kotlin" },
  { name: "Swift", slug: "swift", iconColor: "logos:swift", iconMono: "simple-icons:swift" },
  { name: "Dart", slug: "dart", iconColor: "logos:dart", iconMono: "simple-icons:dart" },
  { name: "Ruby", slug: "ruby", iconColor: "logos:ruby", iconMono: "simple-icons:ruby" },

  // Frontend
  { name: "HTML5", slug: "html5", iconColor: "logos:html-5", iconMono: "simple-icons:html5" },
  { name: "CSS3", slug: "css3", iconColor: "logos:css-3", iconMono: "simple-icons:css3" },
  { name: "React", slug: "react", iconColor: "logos:react", iconMono: "simple-icons:react" },
  { name: "Next.js", slug: "nextjs", iconColor: "logos:nextjs-icon", iconMono: "simple-icons:nextdotjs" },
  { name: "Vue.js", slug: "vuejs", iconColor: "logos:vue", iconMono: "simple-icons:vuedotjs" },
  { name: "Angular", slug: "angular", iconColor: "logos:angular-icon", iconMono: "simple-icons:angular" },
  { name: "Svelte", slug: "svelte", iconColor: "logos:svelte-icon", iconMono: "simple-icons:svelte" },
  { name: "Tailwind CSS", slug: "tailwindcss", iconColor: "logos:tailwindcss-icon", iconMono: "simple-icons:tailwindcss" },
  { name: "Bootstrap", slug: "bootstrap", iconColor: "logos:bootstrap", iconMono: "simple-icons:bootstrap" },
  { name: "Vite", slug: "vite", iconColor: "logos:vitejs", iconMono: "simple-icons:vite" },
  { name: "Redux", slug: "redux", iconColor: "logos:redux", iconMono: "simple-icons:redux" },

  // Backend
  { name: "Node.js", slug: "nodejs", iconColor: "logos:nodejs-icon", iconMono: "simple-icons:nodedotjs" },
  { name: "Express", slug: "express", iconColor: "logos:express", iconMono: "simple-icons:express" },
  { name: "NestJS", slug: "nestjs", iconColor: "logos:nestjs", iconMono: "simple-icons:nestjs" },
  { name: "Django", slug: "django", iconColor: "logos:django-icon", iconMono: "simple-icons:django" },
  { name: "Flask", slug: "flask", iconColor: "logos:flask", iconMono: "simple-icons:flask" },
  { name: "FastAPI", slug: "fastapi", iconColor: "logos:fastapi-icon", iconMono: "simple-icons:fastapi" },
  { name: "Laravel", slug: "laravel", iconColor: "logos:laravel", iconMono: "simple-icons:laravel" },
  { name: "Spring Boot", slug: "springboot", iconColor: "logos:spring-icon", iconMono: "simple-icons:springboot" },

  // Databases
  { name: "MongoDB", slug: "mongodb", iconColor: "logos:mongodb-icon", iconMono: "simple-icons:mongodb" },
  { name: "PostgreSQL", slug: "postgresql", iconColor: "logos:postgresql", iconMono: "simple-icons:postgresql" },
  { name: "MySQL", slug: "mysql", iconColor: "logos:mysql", iconMono: "simple-icons:mysql" },
  { name: "SQLite", slug: "sqlite", iconColor: "logos:sqlite", iconMono: "simple-icons:sqlite" },
  { name: "Redis", slug: "redis", iconColor: "logos:redis", iconMono: "simple-icons:redis" },
  { name: "Firebase", slug: "firebase", iconColor: "logos:firebase", iconMono: "simple-icons:firebase" },
  { name: "Supabase", slug: "supabase", iconColor: "logos:supabase-icon", iconMono: "simple-icons:supabase" },
  { name: "Prisma", slug: "prisma", iconColor: "logos:prisma", iconMono: "simple-icons:prisma" },

  // Mobile
  { name: "React Native", slug: "reactnative", iconColor: "logos:react", iconMono: "simple-icons:react" },
  { name: "Flutter", slug: "flutter", iconColor: "logos:flutter", iconMono: "simple-icons:flutter" },

  // Tools & Hosting
  { name: "Git", slug: "git", iconColor: "logos:git-icon", iconMono: "simple-icons:git" },
  { name: "GitHub", slug: "github", iconColor: "logos:github-icon", iconMono: "simple-icons:github" },
  { name: "Docker", slug: "docker", iconColor: "logos:docker-icon", iconMono: "simple-icons:docker" },
  { name: "Vercel", slug: "vercel", iconColor: "logos:vercel-icon", iconMono: "simple-icons:vercel" },
  { name: "Netlify", slug: "netlify", iconColor: "logos:netlify-icon", iconMono: "simple-icons:netlify" },
  { name: "Cloudflare", slug: "cloudflare", iconColor: "logos:cloudflare-icon", iconMono: "simple-icons:cloudflare" },
  { name: "AWS", slug: "aws", iconColor: "logos:aws", iconMono: "simple-icons:amazonwebservices" },
  { name: "Figma", slug: "figma", iconColor: "logos:figma", iconMono: "simple-icons:figma" },
];

async function seed() {
  console.log("🌱 Seeding Technologies into Neon Database...");

  for (const tech of STARTER_TECHNOLOGIES) {
    await prisma.technology.upsert({
      where: { slug: tech.slug },
      update: {
        name: tech.name,
        iconColor: tech.iconColor,
        iconMono: tech.iconMono,
      },
      create: {
        name: tech.name,
        slug: tech.slug,
        iconColor: tech.iconColor,
        iconMono: tech.iconMono,
      },
    });
  }

  const count = await prisma.technology.count();
  console.log(`✅ Seeding complete. Total technologies in database: ${count}`);
}

seed()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
