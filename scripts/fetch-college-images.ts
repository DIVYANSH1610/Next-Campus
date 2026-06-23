// scripts/fetch-college-images.ts
//
// Fetches each college's real photo from Wikipedia's official API
// (which always returns a verified, currently-existing image) and
// updates the imageUrl field in the database.
//
// Run with: npx tsx scripts/fetch-college-images.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Manual overrides for colleges where the automated media-list search
// failed, returned no usable image, or grabbed something wrong
// (a logo, a person's portrait, etc). These are verified real campus
// photos pulled directly from Wikimedia Commons via Special:FilePath,
// which redirects to the actual hosted file without needing the hash.
const MANUAL_OVERRIDES: Record<string, string> = {
  "iit-guwahati":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Beautiful%20IIT%20Guwahati%20Campus%2CAssam%2CIndia.jpg?width=1280",
  "nit-surathkal":
    "https://commons.wikimedia.org/wiki/Special:FilePath/NITK%20surathkal.jpg?width=1280",
  "nit-warangal":
    "https://commons.wikimedia.org/wiki/Special:FilePath/NITW%20Campus.JPG?width=1280",
  "iiit-hyderabad":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Buildings%20in%20IIIT%20Hyderabad%2002.jpg?width=1280",
};


const WIKI_TITLES: Record<string, string> = {
  "iit-delhi": "Indian_Institute_of_Technology_Delhi",
  "iit-bombay": "Indian_Institute_of_Technology_Bombay",
  "iit-madras": "Indian_Institute_of_Technology_Madras",
  "iit-kanpur": "Indian_Institute_of_Technology_Kanpur",
  "iit-kharagpur": "Indian_Institute_of_Technology_Kharagpur",
  "iit-roorkee": "Indian_Institute_of_Technology_Roorkee",
  "iit-guwahati": "Indian_Institute_of_Technology_Guwahati",
  "bits-pilani": "BITS_Pilani,_Pilani_Campus",
  "vit-vellore": "Vellore_Institute_of_Technology",
  "nit-trichy": "National_Institute_of_Technology,_Tiruchirappalli",
  "nit-surathkal": "National_Institute_of_Technology_Karnataka",
  "nit-warangal": "National_Institute_of_Technology,_Warangal",
  "dtu-delhi": "Delhi_Technological_University",
  "nsut-delhi": "Netaji_Subhas_University_of_Technology",
  "iiit-hyderabad": "International_Institute_of_Information_Technology,_Hyderabad",
  "iiit-bangalore": "International_Institute_of_Information_Technology,_Bangalore",
  "manipal-institute-of-technology": "Manipal_Institute_of_Technology",
  "srm-chennai": "SRM_Institute_of_Science_and_Technology",
  "thapar-patiala": "Thapar_Institute_of_Engineering_and_Technology",
  "bit-mesra": "Birla_Institute_of_Technology,_Mesra",
  "jadavpur-university": "Jadavpur_University",
  "jamia-millia-islamia": "Jamia_Millia_Islamia",
  "aligarh-muslim-university": "Aligarh_Muslim_University",
  "psg-college-of-technology": "PSG_College_of_Technology",
  "cop-pune": "College_of_Engineering,_Pune",
  "vjti-mumbai": "Veermata_Jijabai_Technological_Institute",
  "pes-university": "PES_University",
  "rvce-bangalore": "R._V._College_of_Engineering",
  "msrit-bangalore": "M._S._Ramaiah_Institute_of_Technology",
  "svnit-surat": "Sardar_Vallabhbhai_National_Institute_of_Technology,_Surat",
  "manit-bhopal": "Maulana_Azad_National_Institute_of_Technology",
  "mnnit-allahabad": "Motilal_Nehru_National_Institute_of_Technology_Allahabad",
  "anna-university": "Anna_University",
};

async function fetchWikiImage(title: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/media-list/${title}`
    );
    if (!res.ok) return null;
    const data = await res.json();

    const items = data?.items ?? [];

    // Skip logos, seals, crests, coats of arms, and maps —
    // keep actual building/campus photographs.
    const EXCLUDE = /logo|seal|crest|coat[_-]?of[_-]?arms|emblem|map|locator|stamp|portrait|\.svg$/i;

    const candidates = items.filter((item: any) => {
      const title = item?.title || item?.titles?.canonical || "";
      return (
        item.type === "image" &&
        !EXCLUDE.test(title) &&
        item.srcset?.length > 0
      );
    });

    if (candidates.length === 0) return null;

    // Prefer images with "campus", "building", "main", or "view" in the name.
    const PREFERRED = /campus|building|main|view|gate|library|hostel/i;
    const best =
      candidates.find((item: any) =>
        PREFERRED.test(item.title || item.titles?.canonical || "")
      ) || candidates[0];

    // Pick the largest available source from the srcset.
    const srcset = best.srcset;
    const largest = srcset[srcset.length - 1];
    return largest?.src?.startsWith("http")
      ? largest.src
      : `https:${largest.src}`;
  } catch (err) {
    console.error(`Failed to fetch image for ${title}:`, err);
    return null;
  }
}

async function main() {
  let updated = 0;
  let skipped = 0;

  for (const [slug, title] of Object.entries(WIKI_TITLES)) {
    // Prefer a verified manual override if we have one for this college.
    if (MANUAL_OVERRIDES[slug]) {
      try {
        await prisma.college.update({
          where: { slug },
          data: { imageUrl: MANUAL_OVERRIDES[slug] },
        });
        console.log(`✅ ${slug} → (manual override)`);
        updated++;
      } catch {
        console.log(`⚠️  College with slug "${slug}" not found in DB, skipping.`);
        skipped++;
      }
      continue;
    }

    const imageUrl = await fetchWikiImage(title);

    if (!imageUrl) {
      console.log(`⚠️  No image found for ${slug} (${title})`);
      skipped++;
      continue;
    }

    try {
      await prisma.college.update({
        where: { slug },
        data: { imageUrl },
      });
      console.log(`✅ ${slug} → ${imageUrl}`);
      updated++;
    } catch (err) {
      console.log(`⚠️  College with slug "${slug}" not found in DB, skipping.`);
      skipped++;
    }

    // Be polite to Wikipedia's API — small delay between requests.
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });