// scripts/remove-colleges.ts
//
// Removes specific colleges (and their dependent rows) without wiping
// and reseeding the whole database.
//
// Run with: npx tsx scripts/remove-colleges.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SLUGS_TO_REMOVE = ["iiit-bangalore", "srm-chennai"];

async function main() {
  for (const slug of SLUGS_TO_REMOVE) {
    const college = await prisma.college.findUnique({ where: { slug } });

    if (!college) {
      console.log(`⚠️  No college found with slug "${slug}", skipping.`);
      continue;
    }

    // Delete dependent rows first (foreign key constraints).
    await prisma.review.deleteMany({ where: { collegeId: college.id } });
    await prisma.savedCollege.deleteMany({ where: { collegeId: college.id } });
    await prisma.course.deleteMany({ where: { collegeId: college.id } });

    await prisma.college.delete({ where: { id: college.id } });

    console.log(`✅ Removed "${college.name}" (${slug})`);
  }

  console.log("\nDone.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });