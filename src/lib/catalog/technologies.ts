export interface TechnologyCatalogItem {
  id: string;
  name: string;
  slug: string;
  category:
    | "Languages"
    | "Frontend"
    | "Backend"
    | "Databases"
    | "AI & Data"
    | "Mobile & Desktop"
    | "Cloud & DevOps";
  iconColor: string;
  iconMono?: string | null;
  description?: string;
}

export const CATALOG_TECHNOLOGIES: TechnologyCatalogItem[] = [
  // --- Languages (22) ---
  { id: "tech-javascript", name: "JavaScript", slug: "javascript", category: "Languages", iconColor: "logos:javascript", iconMono: "simple-icons:javascript" },
  { id: "tech-typescript", name: "TypeScript", slug: "typescript", category: "Languages", iconColor: "logos:typescript-icon", iconMono: "simple-icons:typescript" },
  { id: "tech-python", name: "Python", slug: "python", category: "Languages", iconColor: "logos:python", iconMono: "simple-icons:python" },
  { id: "tech-java", name: "Java", slug: "java", category: "Languages", iconColor: "logos:java", iconMono: null },
  { id: "tech-c", name: "C", slug: "c", category: "Languages", iconColor: "logos:c", iconMono: "simple-icons:c" },
  { id: "tech-cplusplus", name: "C++", slug: "cplusplus", category: "Languages", iconColor: "logos:c-plusplus", iconMono: "simple-icons:cplusplus" },
  { id: "tech-csharp", name: "C#", slug: "csharp", category: "Languages", iconColor: "logos:c-sharp", iconMono: "simple-icons:csharp" },
  { id: "tech-go", name: "Go", slug: "go", category: "Languages", iconColor: "logos:go", iconMono: "simple-icons:go" },
  { id: "tech-rust", name: "Rust", slug: "rust", category: "Languages", iconColor: "logos:rust", iconMono: "simple-icons:rust" },
  { id: "tech-php", name: "PHP", slug: "php", category: "Languages", iconColor: "logos:php", iconMono: "simple-icons:php" },
  { id: "tech-kotlin", name: "Kotlin", slug: "kotlin", category: "Languages", iconColor: "logos:kotlin-icon", iconMono: "simple-icons:kotlin" },
  { id: "tech-swift", name: "Swift", slug: "swift", category: "Languages", iconColor: "logos:swift", iconMono: "simple-icons:swift" },
  { id: "tech-dart", name: "Dart", slug: "dart", category: "Languages", iconColor: "logos:dart", iconMono: "simple-icons:dart" },
  { id: "tech-ruby", name: "Ruby", slug: "ruby", category: "Languages", iconColor: "logos:ruby", iconMono: "simple-icons:ruby" },
  { id: "tech-scala", name: "Scala", slug: "scala", category: "Languages", iconColor: "logos:scala", iconMono: "simple-icons:scala" },
  { id: "tech-elixir", name: "Elixir", slug: "elixir", category: "Languages", iconColor: "simple-icons:elixir", iconMono: "simple-icons:elixir" },
  { id: "tech-lua", name: "Lua", slug: "lua", category: "Languages", iconColor: "logos:lua", iconMono: "simple-icons:lua" },
  { id: "tech-haskell", name: "Haskell", slug: "haskell", category: "Languages", iconColor: "logos:haskell-icon", iconMono: "simple-icons:haskell" },
  { id: "tech-julia", name: "Julia", slug: "julia", category: "Languages", iconColor: "logos:julia", iconMono: "simple-icons:julia" },
  { id: "tech-perl", name: "Perl", slug: "perl", category: "Languages", iconColor: "logos:perl", iconMono: "simple-icons:perl" },
  { id: "tech-clojure", name: "Clojure", slug: "clojure", category: "Languages", iconColor: "logos:clojure", iconMono: "simple-icons:clojure" },
  { id: "tech-solidity", name: "Solidity", slug: "solidity", category: "Languages", iconColor: "simple-icons:solidity", iconMono: "simple-icons:solidity" },

  // --- Frontend (22) ---
  { id: "tech-html5", name: "HTML5", slug: "html5", category: "Frontend", iconColor: "logos:html-5", iconMono: "simple-icons:html5" },
  { id: "tech-css3", name: "CSS3", slug: "css3", category: "Frontend", iconColor: "logos:css-3", iconMono: "simple-icons:css3" },
  { id: "tech-react", name: "React", slug: "react", category: "Frontend", iconColor: "logos:react", iconMono: "simple-icons:react" },
  { id: "tech-nextjs", name: "Next.js", slug: "nextjs", category: "Frontend", iconColor: "logos:nextjs-icon", iconMono: "simple-icons:nextdotjs" },
  { id: "tech-vuejs", name: "Vue.js", slug: "vuejs", category: "Frontend", iconColor: "logos:vue", iconMono: "simple-icons:vuedotjs" },
  { id: "tech-angular", name: "Angular", slug: "angular", category: "Frontend", iconColor: "logos:angular-icon", iconMono: "simple-icons:angular" },
  { id: "tech-svelte", name: "Svelte", slug: "svelte", category: "Frontend", iconColor: "logos:svelte-icon", iconMono: "simple-icons:svelte" },
  { id: "tech-tailwind", name: "Tailwind CSS", slug: "tailwindcss", category: "Frontend", iconColor: "logos:tailwindcss-icon", iconMono: "simple-icons:tailwindcss" },
  { id: "tech-bootstrap", name: "Bootstrap", slug: "bootstrap", category: "Frontend", iconColor: "logos:bootstrap", iconMono: "simple-icons:bootstrap" },
  { id: "tech-vite", name: "Vite", slug: "vite", category: "Frontend", iconColor: "logos:vitejs", iconMono: "simple-icons:vite" },
  { id: "tech-redux", name: "Redux", slug: "redux", category: "Frontend", iconColor: "logos:redux", iconMono: "simple-icons:redux" },
  { id: "tech-astro", name: "Astro", slug: "astro", category: "Frontend", iconColor: "logos:astro-icon", iconMono: "simple-icons:astro" },
  { id: "tech-remix", name: "Remix", slug: "remix", category: "Frontend", iconColor: "logos:remix-icon", iconMono: "simple-icons:remix" },
  { id: "tech-nuxt", name: "Nuxt", slug: "nuxt", category: "Frontend", iconColor: "logos:nuxt-icon", iconMono: "simple-icons:nuxt" },
  { id: "tech-gatsby", name: "Gatsby", slug: "gatsby", category: "Frontend", iconColor: "logos:gatsby", iconMono: "simple-icons:gatsby" },
  { id: "tech-sass", name: "Sass", slug: "sass", category: "Frontend", iconColor: "logos:sass", iconMono: "simple-icons:sass" },
  { id: "tech-less", name: "Less", slug: "less", category: "Frontend", iconColor: "logos:less", iconMono: "simple-icons:less" },
  { id: "tech-solidjs", name: "SolidJS", slug: "solidjs", category: "Frontend", iconColor: "logos:solidjs-icon", iconMono: "simple-icons:solid" },
  { id: "tech-qwik", name: "Qwik", slug: "qwik", category: "Frontend", iconColor: "logos:qwik-icon", iconMono: "simple-icons:qwik" },
  { id: "tech-chakraui", name: "Chakra UI", slug: "chakraui", category: "Frontend", iconColor: "simple-icons:chakraui", iconMono: "simple-icons:chakraui" },
  { id: "tech-mui", name: "Material UI", slug: "mui", category: "Frontend", iconColor: "logos:material-ui", iconMono: "simple-icons:mui" },
  { id: "tech-storybook", name: "Storybook", slug: "storybook", category: "Frontend", iconColor: "logos:storybook-icon", iconMono: "simple-icons:storybook" },

  // --- Backend (17) ---
  { id: "tech-nodejs", name: "Node.js", slug: "nodejs", category: "Backend", iconColor: "logos:nodejs-icon", iconMono: "simple-icons:nodedotjs" },
  { id: "tech-express", name: "Express", slug: "express", category: "Backend", iconColor: "logos:express", iconMono: "simple-icons:express" },
  { id: "tech-nestjs", name: "NestJS", slug: "nestjs", category: "Backend", iconColor: "logos:nestjs", iconMono: "simple-icons:nestjs" },
  { id: "tech-django", name: "Django", slug: "django", category: "Backend", iconColor: "logos:django-icon", iconMono: "simple-icons:django" },
  { id: "tech-flask", name: "Flask", slug: "flask", category: "Backend", iconColor: "logos:flask", iconMono: "simple-icons:flask" },
  { id: "tech-fastapi", name: "FastAPI", slug: "fastapi", category: "Backend", iconColor: "logos:fastapi-icon", iconMono: "simple-icons:fastapi" },
  { id: "tech-laravel", name: "Laravel", slug: "laravel", category: "Backend", iconColor: "logos:laravel", iconMono: "simple-icons:laravel" },
  { id: "tech-springboot", name: "Spring Boot", slug: "springboot", category: "Backend", iconColor: "logos:spring-icon", iconMono: "simple-icons:springboot" },
  { id: "tech-rails", name: "Ruby on Rails", slug: "rails", category: "Backend", iconColor: "logos:rails", iconMono: "simple-icons:rubyonrails" },
  { id: "tech-graphql", name: "GraphQL", slug: "graphql", category: "Backend", iconColor: "logos:graphql", iconMono: "simple-icons:graphql" },
  { id: "tech-apollo", name: "Apollo GraphQL", slug: "apollo", category: "Backend", iconColor: "logos:apollostack", iconMono: "simple-icons:apollographql" },
  { id: "tech-grpc", name: "gRPC", slug: "grpc", category: "Backend", iconColor: "logos:grpc", iconMono: null },
  { id: "tech-bun", name: "Bun", slug: "bun", category: "Backend", iconColor: "logos:bun", iconMono: "simple-icons:bun" },
  { id: "tech-deno", name: "Deno", slug: "deno", category: "Backend", iconColor: "logos:deno", iconMono: "simple-icons:deno" },
  { id: "tech-fastify", name: "Fastify", slug: "fastify", category: "Backend", iconColor: "logos:fastify-icon", iconMono: "simple-icons:fastify" },
  { id: "tech-koa", name: "Koa", slug: "koa", category: "Backend", iconColor: "logos:koa", iconMono: "simple-icons:koa" },
  { id: "tech-phoenix", name: "Phoenix", slug: "phoenix", category: "Backend", iconColor: "logos:phoenix", iconMono: "simple-icons:phoenixframework" },

  // --- Databases & Storage (16) ---
  { id: "tech-postgresql", name: "PostgreSQL", slug: "postgresql", category: "Databases", iconColor: "logos:postgresql", iconMono: "simple-icons:postgresql" },
  { id: "tech-mysql", name: "MySQL", slug: "mysql", category: "Databases", iconColor: "logos:mysql", iconMono: "simple-icons:mysql" },
  { id: "tech-mongodb", name: "MongoDB", slug: "mongodb", category: "Databases", iconColor: "logos:mongodb-icon", iconMono: "simple-icons:mongodb" },
  { id: "tech-sqlite", name: "SQLite", slug: "sqlite", category: "Databases", iconColor: "logos:sqlite", iconMono: "simple-icons:sqlite" },
  { id: "tech-redis", name: "Redis", slug: "redis", category: "Databases", iconColor: "logos:redis", iconMono: "simple-icons:redis" },
  { id: "tech-supabase", name: "Supabase", slug: "supabase", category: "Databases", iconColor: "logos:supabase-icon", iconMono: "simple-icons:supabase" },
  { id: "tech-firebase", name: "Firebase", slug: "firebase", category: "Databases", iconColor: "logos:firebase", iconMono: "simple-icons:firebase" },
  { id: "tech-prisma", name: "Prisma", slug: "prisma", category: "Databases", iconColor: "logos:prisma", iconMono: "simple-icons:prisma" },
  { id: "tech-dynamodb", name: "DynamoDB", slug: "dynamodb", category: "Databases", iconColor: "logos:aws-dynamodb", iconMono: "simple-icons:amazondynamodb" },
  { id: "tech-cassandra", name: "Cassandra", slug: "cassandra", category: "Databases", iconColor: "logos:cassandra", iconMono: "simple-icons:apachecassandra" },
  { id: "tech-neo4j", name: "Neo4j", slug: "neo4j", category: "Databases", iconColor: "logos:neo4j", iconMono: "simple-icons:neo4j" },
  { id: "tech-elasticsearch", name: "Elasticsearch", slug: "elasticsearch", category: "Databases", iconColor: "logos:elasticsearch", iconMono: "simple-icons:elasticsearch" },
  { id: "tech-meilisearch", name: "Meilisearch", slug: "meilisearch", category: "Databases", iconColor: "logos:meilisearch", iconMono: "simple-icons:meilisearch" },
  { id: "tech-influxdb", name: "InfluxDB", slug: "influxdb", category: "Databases", iconColor: "logos:influxdb", iconMono: "simple-icons:influxdb" },
  { id: "tech-mariadb", name: "MariaDB", slug: "mariadb", category: "Databases", iconColor: "logos:mariadb-icon", iconMono: "simple-icons:mariadb" },
  { id: "tech-planetscale", name: "PlanetScale", slug: "planetscale", category: "Databases", iconColor: "logos:planetscale", iconMono: "simple-icons:planetscale" },

  // --- AI & Data (11) ---
  { id: "tech-openai", name: "OpenAI", slug: "openai", category: "AI & Data", iconColor: "logos:openai-icon", iconMono: "simple-icons:openai" },
  { id: "tech-pytorch", name: "PyTorch", slug: "pytorch", category: "AI & Data", iconColor: "logos:pytorch-icon", iconMono: "simple-icons:pytorch" },
  { id: "tech-tensorflow", name: "TensorFlow", slug: "tensorflow", category: "AI & Data", iconColor: "logos:tensorflow", iconMono: "simple-icons:tensorflow" },
  { id: "tech-huggingface", name: "Hugging Face", slug: "huggingface", category: "AI & Data", iconColor: "logos:hugging-face-icon", iconMono: "simple-icons:huggingface" },
  { id: "tech-pandas", name: "Pandas", slug: "pandas", category: "AI & Data", iconColor: "logos:pandas-icon", iconMono: "simple-icons:pandas" },
  { id: "tech-numpy", name: "NumPy", slug: "numpy", category: "AI & Data", iconColor: "logos:numpy", iconMono: "simple-icons:numpy" },
  { id: "tech-jupyter", name: "Jupyter", slug: "jupyter", category: "AI & Data", iconColor: "logos:jupyter", iconMono: "simple-icons:jupyter" },
  { id: "tech-keras", name: "Keras", slug: "keras", category: "AI & Data", iconColor: "simple-icons:keras", iconMono: "simple-icons:keras" },
  { id: "tech-opencv", name: "OpenCV", slug: "opencv", category: "AI & Data", iconColor: "logos:opencv", iconMono: "simple-icons:opencv" },
  { id: "tech-spark", name: "Apache Spark", slug: "spark", category: "AI & Data", iconColor: "logos:spark", iconMono: "simple-icons:apachespark" },
  { id: "tech-kafka", name: "Apache Kafka", slug: "kafka", category: "AI & Data", iconColor: "logos:kafka-icon", iconMono: "simple-icons:apachekafka" },

  // --- Mobile & Desktop (7) ---
  { id: "tech-reactnative", name: "React Native", slug: "reactnative", category: "Mobile & Desktop", iconColor: "logos:react", iconMono: "simple-icons:react" },
  { id: "tech-flutter", name: "Flutter", slug: "flutter", category: "Mobile & Desktop", iconColor: "logos:flutter", iconMono: "simple-icons:flutter" },
  { id: "tech-electron", name: "Electron", slug: "electron", category: "Mobile & Desktop", iconColor: "logos:electron", iconMono: "simple-icons:electron" },
  { id: "tech-tauri", name: "Tauri", slug: "tauri", category: "Mobile & Desktop", iconColor: "logos:tauri", iconMono: "simple-icons:tauri" },
  { id: "tech-android", name: "Android", slug: "android", category: "Mobile & Desktop", iconColor: "logos:android-icon", iconMono: "simple-icons:android" },
  { id: "tech-ios", name: "iOS / Apple", slug: "ios", category: "Mobile & Desktop", iconColor: "logos:apple", iconMono: "simple-icons:apple" },
  { id: "tech-ionic", name: "Ionic", slug: "ionic", category: "Mobile & Desktop", iconColor: "logos:ionic-icon", iconMono: "simple-icons:ionic" },

  // --- Cloud & DevOps & Tools (22) ---
  { id: "tech-docker", name: "Docker", slug: "docker", category: "Cloud & DevOps", iconColor: "logos:docker-icon", iconMono: "simple-icons:docker" },
  { id: "tech-kubernetes", name: "Kubernetes", slug: "kubernetes", category: "Cloud & DevOps", iconColor: "logos:kubernetes", iconMono: "simple-icons:kubernetes" },
  { id: "tech-aws", name: "AWS", slug: "aws", category: "Cloud & DevOps", iconColor: "logos:aws", iconMono: "simple-icons:amazonwebservices" },
  { id: "tech-gcp", name: "Google Cloud", slug: "gcp", category: "Cloud & DevOps", iconColor: "logos:google-cloud", iconMono: "simple-icons:googlecloud" },
  { id: "tech-azure", name: "Microsoft Azure", slug: "azure", category: "Cloud & DevOps", iconColor: "logos:azure-icon", iconMono: "simple-icons:microsoftazure" },
  { id: "tech-cloudflare", name: "Cloudflare", slug: "cloudflare", category: "Cloud & DevOps", iconColor: "logos:cloudflare-icon", iconMono: "simple-icons:cloudflare" },
  { id: "tech-vercel", name: "Vercel", slug: "vercel", category: "Cloud & DevOps", iconColor: "logos:vercel-icon", iconMono: "simple-icons:vercel" },
  { id: "tech-netlify", name: "Netlify", slug: "netlify", category: "Cloud & DevOps", iconColor: "logos:netlify-icon", iconMono: "simple-icons:netlify" },
  { id: "tech-git", name: "Git", slug: "git", category: "Cloud & DevOps", iconColor: "logos:git-icon", iconMono: "simple-icons:git" },
  { id: "tech-github", name: "GitHub", slug: "github", category: "Cloud & DevOps", iconColor: "logos:github-icon", iconMono: "simple-icons:github" },
  { id: "tech-gitlab", name: "GitLab", slug: "gitlab", category: "Cloud & DevOps", iconColor: "logos:gitlab", iconMono: "simple-icons:gitlab" },
  { id: "tech-bitbucket", name: "Bitbucket", slug: "bitbucket", category: "Cloud & DevOps", iconColor: "logos:bitbucket", iconMono: "simple-icons:bitbucket" },
  { id: "tech-linux", name: "Linux", slug: "linux", category: "Cloud & DevOps", iconColor: "logos:linux-tux", iconMono: "simple-icons:linux" },
  { id: "tech-ubuntu", name: "Ubuntu", slug: "ubuntu", category: "Cloud & DevOps", iconColor: "logos:ubuntu", iconMono: "simple-icons:ubuntu" },
  { id: "tech-nginx", name: "Nginx", slug: "nginx", category: "Cloud & DevOps", iconColor: "logos:nginx", iconMono: "simple-icons:nginx" },
  { id: "tech-terraform", name: "Terraform", slug: "terraform", category: "Cloud & DevOps", iconColor: "logos:terraform-icon", iconMono: "simple-icons:terraform" },
  { id: "tech-ansible", name: "Ansible", slug: "ansible", category: "Cloud & DevOps", iconColor: "logos:ansible", iconMono: "simple-icons:ansible" },
  { id: "tech-figma", name: "Figma", slug: "figma", category: "Cloud & DevOps", iconColor: "logos:figma", iconMono: "simple-icons:figma" },
  { id: "tech-postman", name: "Postman", slug: "postman", category: "Cloud & DevOps", iconColor: "logos:postman-icon", iconMono: "simple-icons:postman" },
  { id: "tech-jest", name: "Jest", slug: "jest", category: "Cloud & DevOps", iconColor: "logos:jest", iconMono: "simple-icons:jest" },
  { id: "tech-cypress", name: "Cypress", slug: "cypress", category: "Cloud & DevOps", iconColor: "logos:cypress-icon", iconMono: "simple-icons:cypress" },
  { id: "tech-playwright", name: "Playwright", slug: "playwright", category: "Cloud & DevOps", iconColor: "logos:playwright", iconMono: "simple-icons:playwright" },
];

export const TECH_CATEGORIES = [
  "All",
  "Languages",
  "Frontend",
  "Backend",
  "Databases",
  "AI & Data",
  "Mobile & Desktop",
  "Cloud & DevOps",
] as const;

// Quick lookup map: slug / normalized name -> iconColor
export const TECH_ICON_MAP: Record<string, string> = {};

CATALOG_TECHNOLOGIES.forEach((tech) => {
  TECH_ICON_MAP[tech.slug.toLowerCase()] = tech.iconColor;
  TECH_ICON_MAP[tech.name.toLowerCase()] = tech.iconColor;
  // Also register stripped alphanumeric versions (e.g. "next.js" -> "nextjs")
  const stripped = tech.name.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (stripped) {
    TECH_ICON_MAP[stripped] = tech.iconColor;
  }
});

// Add extra popular aliases
TECH_ICON_MAP["next"] = "logos:nextjs-icon";
TECH_ICON_MAP["next.js"] = "logos:nextjs-icon";
TECH_ICON_MAP["nextjs"] = "logos:nextjs-icon";
TECH_ICON_MAP["tailwind"] = "logos:tailwindcss-icon";
TECH_ICON_MAP["tailwindcss"] = "logos:tailwindcss-icon";
TECH_ICON_MAP["ts"] = "logos:typescript-icon";
TECH_ICON_MAP["js"] = "logos:javascript";
TECH_ICON_MAP["py"] = "logos:python";
TECH_ICON_MAP["rb"] = "logos:ruby";
TECH_ICON_MAP["golang"] = "logos:go";
TECH_ICON_MAP["cpp"] = "logos:c-plusplus";
TECH_ICON_MAP["c#"] = "logos:c-sharp";
TECH_ICON_MAP["cs"] = "logos:c-sharp";
TECH_ICON_MAP["vue"] = "logos:vue";
TECH_ICON_MAP["postgres"] = "logos:postgresql";
TECH_ICON_MAP["mongo"] = "logos:mongodb-icon";
TECH_ICON_MAP["k8s"] = "logos:kubernetes";
TECH_ICON_MAP["gh"] = "logos:github-icon";

/**
 * Resolves an icon name for a technology by slug, name, or alias.
 */
export function getTechIcon(nameOrSlug?: string | null): string | undefined {
  if (!nameOrSlug) return undefined;
  const key = nameOrSlug.toLowerCase().trim();
  if (TECH_ICON_MAP[key]) return TECH_ICON_MAP[key];
  const stripped = key.replace(/[^a-z0-9]/g, "");
  return TECH_ICON_MAP[stripped];
}
