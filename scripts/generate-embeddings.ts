// scripts/generate-embeddings.ts
//
// Generates a vector embedding for every college (based on its name,
// type, location, description, and key stats) and stores it in the
// `embedding` column via raw SQL, since Prisma can't type pgvector
// columns natively yet.
//
// Run with: npx tsx scripts/generate-embeddings.ts
// Re-run any time college data changes — it's safe to run repeatedly,
// it just overwrites each college's embedding.

import { PrismaClient } from "@prisma/client";
import { embedText } from "../src/lib/gemini";

const prisma = new PrismaClient();

function buildEmbeddingText(college: {
  name: string;
  type: string | null;
  city: string;
  state: string;
  description: string;
  fees: number;
  avgPackage: number;
  highestPackage: number;
  rating: number;
  exams: string[];
}) {
  return `
College: ${college.name}
Type: ${college.type ?? "Unknown"}
Location: ${college.city}, ${college.state}
Annual fees: ₹${college.fees.toLocaleString("en-IN")}
Average package: ₹${college.avgPackage.toLocaleString("en-IN")}
Highest package: ₹${college.highestPackage.toLocaleString("en-IN")}
Rating: ${college.rating} / 5
Entrance exams: ${college.exams.join(", ")}
Description: ${college.description}
  `.trim();
}

async function main() {
  const colleges = await prisma.college.findMany();
  console.log(`Generating embeddings for ${colleges.length} colleges...\n`);

  for (const college of colleges) {
    const text = buildEmbeddingText(college);

    try {
      const vector = await embedText(text, "RETRIEVAL_DOCUMENT");

      // pgvector expects the literal format '[0.1,0.2,...]'::vector
      const vectorLiteral = `[${vector.join(",")}]`;

      await prisma.$executeRawUnsafe(
        `UPDATE "College" SET embedding = $1::vector WHERE id = $2`,
        vectorLiteral,
        college.id
      );

      console.log(`✅ ${college.slug}`);
    } catch (err) {
      console.error(`⚠️  Failed for ${college.slug}:`, err);
    }

    // Be polite to the API rate limit.
    await new Promise((resolve) => setTimeout(resolve, 200));
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