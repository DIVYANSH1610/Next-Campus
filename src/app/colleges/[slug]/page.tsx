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
    include: {
      courses: true,
      reviews: true,
    },
  });

  if (!college) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#EAF6FF] text-[#123A5E]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* BACK */}
        <Link
          href="/colleges"
          className="text-sm text-[#5E7A99] hover:text-[#123A5E]"
        >
          ← Back to Explore
        </Link>

        {/* HERO IMAGE */}
        {college.imageUrl && (
          <div className="mt-6 mb-6 h-72 w-full overflow-hidden rounded-2xl border border-[#D6ECFB] bg-[#D6ECFB]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={college.imageUrl}
              className="w-full h-full object-cover"
              alt={college.name}
            />
          </div>
        )}

        {/* HEADER */}
        <div className="border-b border-[#D6ECFB] pb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            {college.type && (
              <p className="text-[11px] uppercase font-mono text-[#FF8A5B]">
                {college.type}
              </p>
            )}

            <h1 className="font-sans font-extrabold text-4xl mt-2 tracking-tight">
              {college.name}
            </h1>

            <p className="text-[#5E7A99] mt-1">
              {college.city}, {college.state}
              {college.establishedYear && (
                <span className="text-[#5E7A99]/70"> · est. {college.establishedYear}</span>
              )}
            </p>
          </div>

          {college.nirfRank && (
            <div className="bg-[#123A5E] text-white text-xs font-mono px-3 py-1.5 rounded-full">
              NIRF #{college.nirfRank}
            </div>
          )}
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {/* OVERVIEW */}
          <div className="md:col-span-2 bg-white border border-[#D6ECFB] rounded-2xl p-6">
            <h2 className="font-sans font-bold text-xl mb-3">Overview</h2>
            <p className="text-[#5E7A99] leading-relaxed">{college.description}</p>

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

          {/* STATS */}
          <div className="bg-white border border-[#D6ECFB] rounded-2xl p-6">
            <h2 className="font-sans font-bold text-xl mb-4">Stats</h2>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-[11px] font-mono text-[#5E7A99]">Rating</p>
                <p className="font-mono">★ {college.rating.toFixed(1)}</p>
              </div>

              <div>
                <p className="text-[11px] font-mono text-[#5E7A99]">Avg package</p>
                <p className="font-mono">{formatINR(college.avgPackage)}</p>
              </div>

              <div>
                <p className="text-[11px] font-mono text-[#5E7A99]">Highest package</p>
                <p className="font-mono">{formatINR(college.highestPackage)}</p>
              </div>

              <div>
                <p className="text-[11px] font-mono text-[#5E7A99]">Fees / yr</p>
                <p className="font-mono">{formatINR(college.fees)}</p>
              </div>

              {college.exams?.length > 0 && (
                <div>
                  <p className="text-[11px] font-mono text-[#5E7A99]">Exams</p>
                  <p>{college.exams.join(", ")}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COURSES */}
        {college.courses?.length > 0 && (
          <div className="mt-10">
            <h2 className="font-sans font-bold text-2xl mb-4">Courses</h2>

            <div className="grid md:grid-cols-3 gap-4">
              {college.courses.map((course) => (
                <div key={course.id} className="bg-white border border-[#D6ECFB] rounded-2xl p-4">
                  <p className="font-medium">{course.name}</p>
                  <p className="text-sm text-[#5E7A99]">{course.duration}</p>
                  <p className="font-mono mt-2">{formatINR(course.fees)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVIEWS */}
        {college.reviews?.length > 0 && (
          <div className="mt-10">
            <h2 className="font-sans font-bold text-2xl mb-4">Reviews</h2>

            <div className="grid md:grid-cols-2 gap-4">
              {college.reviews.map((review) => (
                <div key={review.id} className="bg-white border border-[#D6ECFB] rounded-2xl p-4">
                  <p className="font-mono text-sm">★ {review.rating.toFixed(1)}</p>
                  <p className="text-sm text-[#5E7A99] mt-1">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 flex gap-3">
          <Link
            href={`/compare?add=${college.slug}`}
            className="bg-[#2EC4F1] text-white px-6 py-3 text-sm font-semibold rounded-full hover:bg-[#2EC4F1]/90 transition-colors"
          >
            Compare college
          </Link>

          <SaveButtonClient collegeId={college.id} />
        </div>
      </div>
    </main>
  );
}