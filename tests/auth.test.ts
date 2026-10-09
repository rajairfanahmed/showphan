import { prisma } from "../src/lib/prisma";
import { auth } from "../src/lib/auth";

async function runBackendVerification() {
  console.log("🔍 Running Backend & Auth Verification Tests...\n");

  try {
    // 1. Verify Database Connection
    console.log("1. Testing Neon PostgreSQL connection via Prisma pg adapter...");
    const userCount = await prisma.user.count();
    console.log(`   ✅ DB connected successfully. Current users in DB: ${userCount}`);

    // 2. Verify Schema Entities
    console.log("2. Testing schema entities (projects & technologies)...");
    const projectCount = await prisma.project.count();
    const techCount = await prisma.technology.count();
    console.log(`   ✅ Tables accessible: ${projectCount} projects, ${techCount} technologies.`);

    // 3. Verify Better Auth Configuration
    console.log("3. Testing Better Auth instance configuration...");
    if (!auth || typeof auth.handler !== "function") {
      throw new Error("Better Auth handler is not properly configured.");
    }
    console.log("   ✅ Better Auth instance and handler configured.");

    console.log("\n🎉 All Ticket 01 backend tests passed successfully!");
  } catch (error) {
    console.error("❌ Backend verification failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runBackendVerification();
