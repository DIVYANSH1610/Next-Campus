import { PrismaClient } from "@prisma/client";
import { colleges } from "./data/colleges";
import { exams } from "./data/exams";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Cleaning database...");

  await prisma.review.deleteMany();
  await prisma.savedCollege.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.exam.deleteMany();

  console.log("📦 Seeding colleges...");
  await prisma.college.createMany({
    data: colleges,
  });

  console.log("📘 Seeding exams...");
  await prisma.exam.createMany({
    data: exams,
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });