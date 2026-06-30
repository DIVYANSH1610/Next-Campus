// src/lib/gemini.ts
//
// Thin wrapper around the Gemini API for embeddings + generation.
// Requires GEMINI_API_KEY in your .env file.

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const EMBED_MODEL = "gemini-embedding-001";
const GEN_MODEL = "gemini-flash-latest"; // fast + cheap, good enough for grounded Q&A

/**
 * Shared call helper with automatic retry-with-backoff for transient
 * Gemini errors (503 overloaded, 429 rate limited). Fails fast on
 * anything else (bad request, auth error, etc).
 */
async function callGemini(
  body: Record<string, unknown>,
  retries = 3
): Promise<any> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEN_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (res.ok) {
      return res.json();
    }

    const isTransient = res.status === 503 || res.status === 429;
    if (isTransient && attempt < retries) {
      const delayMs = 800 * Math.pow(2, attempt); // 0.8s, 1.6s, 3.2s
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      continue;
    }

    const errText = await res.text();
    throw new Error(`Gemini request failed (${res.status}): ${errText}`);
  }

  throw new Error("Gemini request failed after retries.");
}

export async function embedText(
  text: string,
  taskType: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY" = "RETRIEVAL_DOCUMENT"
): Promise<number[]> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: `models/${EMBED_MODEL}`,
        content: { parts: [{ text }] },
        taskType,
        outputDimensionality: 768,
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini embedding request failed: ${errText}`);
  }

  const data = await res.json();
  return data.embedding.values as number[];
}

export async function generateAnswer(
  question: string,
  context: string
): Promise<string> {
  const prompt = `You are a helpful college-admissions assistant for NextCampus, an Indian engineering college discovery platform.

Answer the user's question using ONLY the college data provided below. If the data doesn't contain enough information to answer confidently, say so clearly instead of guessing. Be concise (3-5 sentences), specific with numbers (fees, packages, ratings), and mention college names directly so the user knows which colleges you're referring to.

COLLEGE DATA:
${context}

USER QUESTION:
${question}`;

  const data = await callGemini({
    contents: [{ parts: [{ text: prompt }] }],
  });

  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "I couldn't generate a response.";
}

export type CollegeInsights = {
  roiAnalysis: string;
  comparisonToSimilar: string;
  fitSummary: string;
  speculative: {
    technicalClubs: string;
    culturalFests: string;
    sportsAndFitness: string;
    hostelAndCampusLife: string;
    locationNotes: string;
  };
};

/**
 * Generates structured insights for a college detail page.
 *
 * `roiAnalysis`, `comparisonToSimilar`, and `fitSummary` are GROUNDED —
 * the prompt instructs the model to derive these only from the real
 * numbers passed in (fees, packages, rating, similar colleges' stats).
 *
 * `speculative.*` fields are explicitly framed as general, unverified
 * inferences about the *category* of institution, not as specific
 * verified facts about this college. The prompt requires hedging
 * language and the UI must additionally label these as unverified —
 * this function alone is not sufficient to make that clear to a user.
 * These are intentionally NOT paired with AI-generated images, since
 * fabricated photos presented alongside a real, named institution risk
 * being mistaken for real documentation of that college.
 */
export async function generateCollegeInsights(
  college: {
    name: string;
    type: string | null;
    city: string;
    state: string;
    fees: number;
    avgPackage: number;
    highestPackage: number;
    rating: number;
    establishedYear: number | null;
    description: string;
  },
  similarColleges: {
    name: string;
    fees: number;
    avgPackage: number;
    rating: number;
  }[]
): Promise<CollegeInsights> {
  const prompt = `You are generating structured content for a college detail page on NextCampus, an Indian engineering college discovery platform. Output ONLY valid JSON matching this exact shape, no markdown fences, no commentary:

{
  "roiAnalysis": string,
  "comparisonToSimilar": string,
  "fitSummary": string,
  "speculative": {
    "technicalClubs": string,
    "culturalFests": string,
    "sportsAndFitness": string,
    "hostelAndCampusLife": string,
    "locationNotes": string
  }
}

STRICT RULES:
- "roiAnalysis", "comparisonToSimilar", "fitSummary": base these ONLY on the real numeric data given below (fees, avgPackage, highestPackage, rating, establishedYear, and the similar-colleges list). Do not invent specific facts not derivable from these numbers. 2-4 sentences each.
- "speculative.*" fields: these are clearly UNVERIFIED general inferences about the typical pattern for this category/type/scale of institution (e.g. "${college.type ?? "this type of"}" colleges in "${college.state}"), NOT specific verified claims about ${college.name} itself. Each MUST explicitly use hedging language such as "Institutions of this type and scale typically..." or "Without verified student data, a reasonable general expectation is...". Never name a specific club, fest, team, or building as if confirmed to exist at this exact college. Never state these as confirmed facts. Each should be 3-4 sentences, specific to the *category pattern* (e.g. large vs small campus, urban vs rural, IIT vs private) rather than generic filler.
  - "technicalClubs": typical pattern for tech/coding/robotics/entrepreneurship clubs at this category of institution.
  - "culturalFests": typical pattern for annual cultural/tech fests at this category of institution.
  - "sportsAndFitness": typical pattern for sports facilities and culture at this category of institution.
  - "hostelAndCampusLife": typical pattern for hostel/residential life at this category of institution.
  - "locationNotes": general, publicly-known characteristics of the city/region (${college.city}, ${college.state}) relevant to student life — climate, connectivity, cost of living — not anything specific to this college's internal facilities.

REAL DATA for ${college.name}:
- Type: ${college.type ?? "Unknown"}
- Location: ${college.city}, ${college.state}
- Established: ${college.establishedYear ?? "Unknown"}
- Annual fees: ₹${college.fees.toLocaleString("en-IN")}
- Average package: ₹${college.avgPackage.toLocaleString("en-IN")}
- Highest package: ₹${college.highestPackage.toLocaleString("en-IN")}
- Rating: ${college.rating}/5
- Description: ${college.description}

SIMILAR COLLEGES (for comparison, real data):
${similarColleges
  .map(
    (c) =>
      `- ${c.name}: fees ₹${c.fees.toLocaleString("en-IN")}, avg package ₹${c.avgPackage.toLocaleString(
        "en-IN"
      )}, rating ${c.rating}/5`
  )
  .join("\n")}`;

  const data = await callGemini({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" },
  });

  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  return JSON.parse(raw) as CollegeInsights;
}

export async function generateComparisonVerdict(
  colleges: {
    name: string;
    type: string | null;
    city: string;
    state: string;
    fees: number;
    avgPackage: number;
    highestPackage: number;
    rating: number;
    nirfRank: number | null;
  }[]
): Promise<string> {
  const dataBlock = colleges
    .map(
      (c) =>
        `- ${c.name} (${c.type ?? "Unknown"}, ${c.city}, ${c.state}): fees ₹${c.fees.toLocaleString(
          "en-IN"
        )}/yr, avg package ₹${c.avgPackage.toLocaleString(
          "en-IN"
        )}, highest package ₹${c.highestPackage.toLocaleString(
          "en-IN"
        )}, rating ${c.rating}/5, NIRF rank ${c.nirfRank ?? "unranked"}.`
    )
    .join("\n");

  const prompt = `You are comparing colleges for a student on NextCampus. Using ONLY the real data below, write a concise verdict (4-6 sentences) covering: which college offers the best ROI (package relative to fees), which has the strongest outcomes (rating/package/rank), and one practical tradeoff to consider. Be specific with the numbers given. Do not invent any facts not present below.

${dataBlock}`;

  const data = await callGemini({
    contents: [{ parts: [{ text: prompt }] }],
  });

  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ??
    "Couldn't generate a comparison right now."
  );
}