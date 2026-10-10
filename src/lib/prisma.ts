import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  dbSchemaSynced?: boolean;
};

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Self-healing schema sync for missing Neon DB columns & tables
let syncPromise: Promise<void> | null = null;
export async function ensureDatabaseSchema() {
  if (globalForPrisma.dbSchemaSynced || !connectionString) return;
  if (!syncPromise) {
    syncPromise = (async () => {
      try {
        const client = await pool.connect();
        try {
          await client.query(`
            ALTER TABLE IF EXISTS "projects" ADD COLUMN IF NOT EXISTS "kudosCount" INTEGER DEFAULT 0;
            ALTER TABLE IF EXISTS "projects" ADD COLUMN IF NOT EXISTS "viewsCount" INTEGER DEFAULT 0;
            ALTER TABLE IF EXISTS "projects" ADD COLUMN IF NOT EXISTS "trendingScore" DOUBLE PRECISION DEFAULT 0;
            ALTER TABLE IF EXISTS "projects" ADD COLUMN IF NOT EXISTS "sandboxUrl" TEXT;
            ALTER TABLE IF EXISTS "projects" ADD COLUMN IF NOT EXISTS "sandboxEnabled" BOOLEAN DEFAULT false;
            ALTER TABLE IF EXISTS "projects" ADD COLUMN IF NOT EXISTS "isFeatured" BOOLEAN DEFAULT false;
            ALTER TABLE IF EXISTS "projects" ADD COLUMN IF NOT EXISTS "position" INTEGER DEFAULT 0;
            ALTER TABLE IF EXISTS "projects" ADD COLUMN IF NOT EXISTS "role" TEXT;
            ALTER TABLE IF EXISTS "projects" ADD COLUMN IF NOT EXISTS "learnings" TEXT;
            ALTER TABLE IF EXISTS "projects" ADD COLUMN IF NOT EXISTS "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

            CREATE TABLE IF NOT EXISTS "kudos" (
              "id" TEXT PRIMARY KEY,
              "userId" TEXT NOT NULL,
              "projectId" TEXT NOT NULL,
              "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              CONSTRAINT "kudos_userId_projectId_key" UNIQUE ("userId", "projectId")
            );

            CREATE TABLE IF NOT EXISTS "bookmarks" (
              "id" TEXT PRIMARY KEY,
              "userId" TEXT NOT NULL,
              "projectId" TEXT NOT NULL,
              "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              CONSTRAINT "bookmarks_userId_projectId_key" UNIQUE ("userId", "projectId")
            );
          `);
          globalForPrisma.dbSchemaSynced = true;
        } finally {
          client.release();
        }
      } catch (e) {
        console.warn("Database schema auto-sync notice:", e);
      }
    })();
  }
  return syncPromise;
}

// Auto-run on module initialization if connection string exists
if (connectionString) {
  ensureDatabaseSchema().catch(() => {});
}

export default prisma;
