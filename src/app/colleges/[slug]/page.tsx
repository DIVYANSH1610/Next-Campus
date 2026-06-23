import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SaveButtonClient from "./SaveButtonClient";

function formatINR(value: number) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export default async function CollegePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const college = await prisma.college.findUnique({
    where: { slug },
    include: { courses: true, reviews: true },
  });

  if (!college) notFound();

  return (
    <main className="min-h-screen bg-[#EAF6FF] text-[#123A5E]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* ── BACK ── */}
        <Link
          href="/colleges"
          className="inline-flex items-center gap-1 text-sm text-[#5E7A99] hover:text-[#123A5E] transition-colors mb-4 sm:mb-6"
        >
          ← Back to Explore
        </Link>

        {/* ── HERO IMAGE ── */}
        {college.imageUrl && (
          <div className="mb-6 h-48 sm:h-64 md:h-72 w-full overflow-hidden rounded-2xl border border-[#D6ECFB] bg-[#D6ECFB]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={college.imageUrl}
              className="w-full h-full object-cover"
              alt={college.name}
            />
          </div>
        )}

        {/* ── HEADER ── */}
        <div className="border-b border-[#D6ECFB] pb-5 sm:pb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            {college.type && (
              <p className="text-[11px] uppercase font-mono text-[#FF8A5B]">
                {college.type}
              </p>
            )}
            <h1 className="font-sans font-extrabold text-2xl sm:text-3xl md:text-4xl mt-1 sm:mt-2 tracking-tight leading-tight">
              {college.name}
            </h1>
            <p className="text-[#5E7A99] mt-1 text-sm sm:text-base">
              {college.city}, {college.state}
              {college.establishedYear && (
                <span className="text-[#5E7A99]/70"> · est. {college.establishedYear}</span>
              )}
            </p>
          </div>

          {college.nirfRank && (
            <div className="self-start bg-[#123A5E] text-white text-xs font-mono px-3 py-1.5 rounded-full whitespace-nowrap">
              NIRF #{college.nirfRank}
            </div>
          )}
        </div>

        {/* ── OVERVIEW + STATS GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">

          {/* Overview */}
          <div className="md:col-span-2 bg-white border border-[#D6ECFB] rounded-2xl p-5 sm:p-6">
            <h2 className="font-sans font-bold text-lg sm:text-xl mb-3">Overview</h2>
            <p className="text-[#5E7A99] leading-relaxed text-sm sm:text-base">
              {college.description}
            </p>
            {college.website && (
              <a
                href={college.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-sm text-[#2EC4F1] hover:underline"
              >
                Visit official website →
              </a>
            )}
          </div>

          {/* Stats */}
          <div className="bg-white border border-[#D6ECFB] rounded-2xl p-5 sm:p-6">
            <h2 className="font-sans font-bold text-lg sm:text-xl mb-4">Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4 text-sm">
              {[
                { label: "Rating", value: `★ ${college.rating.toFixed(1)}` },
                { label: "Avg package", value: formatINR(college.avgPackage) },
                { label: "Highest package", value: formatINR(college.highestPackage) },
                { label: "Fees / yr", value: formatINR(college.fees) },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-[11px] font-mono text-[#5E7A99] uppercase tracking-wide">{stat.label}</p>
                  <p className="font-mono mt-0.5">{stat.value}</p>
                </div>
              ))}
              {college.exams?.length > 0 && (
                <div className="col-span-2 md:col-span-1">
                  <p className="text-[11px] font-mono text-[#5E7A99] uppercase tracking-wide">Exams</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {college.exams.map((exam) => (
                      <span key={exam} className="text-[10px] font-mono bg-[#EAF6FF] border border-[#D6ECFB] rounded-full px-2 py-0.5 text-[#5E7A99]">
                        {exam}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── COURSES ── */}
        {college.courses?.length > 0 && (
          <div className="mt-8 sm:mt-10">
            <h2 className="font-sans font-bold text-xl sm:text-2xl mb-4">Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {college.courses.map((course) => (
                <div key={course.id} className="bg-white border border-[#D6ECFB] rounded-2xl p-4">
                  <p className="font-medium text-sm sm:text-base">{course.name}</p>
                  <p className="text-sm text-[#5E7A99] mt-1">{course.duration}</p>
                  <p className="font-mono mt-2 text-sm">{formatINR(course.fees)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── REVIEWS ── */}
        {college.reviews?.length > 0 && (
          <div className="mt-8 sm:mt-10">
            <h2 className="font-sans font-bold text-xl sm:text-2xl mb-4">Reviews</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {college.reviews.map((review) => (
                <div key={review.id} className="bg-white border border-[#D6ECFB] rounded-2xl p-4">
                  <p className="font-mono text-sm">★ {review.rating.toFixed(1)}</p>
                  <p className="text-sm text-[#5E7A99] mt-1">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CTA ── */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-3">
          <Link
            href={`/compare?add=${college.slug}`}
            className="bg-[#2EC4F1] text-white px-6 py-3 text-sm font-semibold rounded-full hover:bg-[#2EC4F1]/90 transition-colors text-center"
          >
            Compare college
          </Link>
          <SaveButtonClient collegeId={college.id} />
        </div>
      </div>
    </main>
  );
}