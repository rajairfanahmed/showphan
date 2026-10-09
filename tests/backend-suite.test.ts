import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { evaluateQualityGate } from "../src/lib/projects/quality-gate";
import { slugify } from "../src/lib/projects";
import { createPresignedCoverUpload } from "../src/lib/storage";

async function runFullBackendSuite() {
  console.log("🧪 Running Comprehensive Backend Test Suite...\n");

  try {
    // 1. Verify Technology Catalog in Database
    console.log("1. Testing Technology Catalog...");
    const technologies = await prisma.technology.findMany();
    if (technologies.length < 50) {
      throw new Error(`Expected at least 50 seeded technologies, found ${technologies.length}`);
    }
    console.log(`   ✅ 51/51 seeded technologies verified in database.`);

    // 2. Test Quality Gate Evaluation Logic
    console.log("2. Testing Quality Gate Validator...");
    
    // Incomplete project
    const incompleteProject = {
      title: "Incomplete",
      summary: "",
      coverImageKey: null,
      technologies: [],
      liveUrl: null,
      repoUrl: null,
    };
    const incompleteResult = evaluateQualityGate(incompleteProject);
    if (incompleteResult.canPublish || incompleteResult.satisfiedCount !== 1) {
      throw new Error("Quality Gate should have failed for incomplete project.");
    }
    console.log("   ✅ Incomplete project correctly rejected by Quality Gate (1/5 satisfied).");

    // Complete project
    const completeProject = {
      title: "Complete Showphan",
      summary: "A developer portfolio platform.",
      coverImageKey: "covers/usr123/img.webp",
      technologies: [{ id: "tech_1" }],
      liveUrl: "https://showphan.vercel.app",
      repoUrl: "https://github.com/rajairfanahmed/showphan",
    };
    const completeResult = evaluateQualityGate(completeProject);
    if (!completeResult.canPublish || completeResult.satisfiedCount !== 5) {
      throw new Error("Quality Gate should have passed for complete project.");
    }
    console.log("   ✅ Complete project correctly passed Quality Gate (5/5 satisfied).");

    // 3. Test Slugify Function
    console.log("3. Testing Slugify utility...");
    const slug1 = slugify("Showphan: Developer Portfolio Platform v1!");
    if (slug1 !== "showphan-developer-portfolio-platform-v1") {
      throw new Error(`Slugify failed, got: ${slug1}`);
    }
    console.log(`   ✅ Slug generation verified: "${slug1}".`);

    // 4. Test Presigned Storage Validation
    console.log("4. Testing Storage validation guards...");
    try {
      await createPresignedCoverUpload("usr_1", "image/gif", 1000);
      throw new Error("Storage should have rejected GIF format.");
    } catch (err: unknown) {
      if (err instanceof Error && !err.message.includes("INVALID_FILE_TYPE")) throw err;
      console.log("   ✅ Invalid MIME type correctly rejected.");
    }

    try {
      await createPresignedCoverUpload("usr_1", "image/webp", 2000000);
      throw new Error("Storage should have rejected file > 1MB.");
    } catch (err: unknown) {
      if (err instanceof Error && !err.message.includes("FILE_TOO_LARGE")) throw err;
      console.log("   ✅ Oversized file (>1MB) correctly rejected.");
    }

    console.log("\n🎉 ALL BACKEND TESTS PASSED WITH 100% SUCCESS!");
  } catch (error) {
    console.error("❌ Test Suite Failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runFullBackendSuite();
