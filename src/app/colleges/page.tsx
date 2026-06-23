"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type College = {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  type: string | null;
  fees: number;
  rating: number;
  avgPackage: number;
  highestPackage: number;
  nirfRank: number | null;
  exams: string[];
  imageUrl?: string | null;
};

type ApiResponse = {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: College[];
};

const TYPES = ["IIT", "NIT", "IIIT", "Private", "Govt"];

function formatINR(value: number) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errored, setErrored] = useState(false);

  const fetchColleges = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (state) params.append("state", state);
    if (type) params.append("type", type);
    params.append("page", String(page));
    params.append("limit", "9");

    setLoading(true);
    setErrored(false);

    try {
      const res = await fetch(`/api/colleges?${params.toString()}`);
      if (!res.ok) throw new Error("Request failed");
      const json: ApiResponse = await res.json();

      setColleges(json.data ?? []);
      setTotalPages(json.totalPages ?? 1);
      setTotal(json.total ?? 0);
    } catch (err) {
      console.error("Failed to fetch colleges:", err);
      setColleges([]);
      setErrored(true);
    } finally {
      setLoading(false);
    }
  }, [search, state, type, page]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setState("");
    setType("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#EAF6FF] text-[#123A5E]">
      {/* Header */}
      <header className="border-b border-[#D6ECFB] bg-[#EAF6FF]/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#FF8A5B] font-mono mb-1">
              NextCampus Registry
            </p>
            <h1 className="font-sans font-extrabold text-3xl md:text-4xl tracking-tight">
              Find a college
            </h1>
          </div>
          <p className="hidden md:block text-sm text-[#5E7A99] font-mono">
            {total.toLocaleString("en-IN")} institutions indexed
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Filter bar */}
        <form
          onSubmit={handleFilterSubmit}
          className="border border-[#D6ECFB] bg-white rounded-2xl p-4 md:p-5 flex flex-col md:flex-row gap-3 md:items-center shadow-sm"
        >
          <input
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-[#D6ECFB] rounded-xl px-3 py-2 text-sm bg-[#EAF6FF] focus:outline-none focus:ring-2 focus:ring-[#2EC4F1] focus:border-transparent placeholder:text-[#5E7A99]/60"
          />
          <input
            placeholder="State (e.g. Tamil Nadu)"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="md:w-56 border border-[#D6ECFB] rounded-xl px-3 py-2 text-sm bg-[#EAF6FF] focus:outline-none focus:ring-2 focus:ring-[#2EC4F1] focus:border-transparent placeholder:text-[#5E7A99]/60"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-[#2EC4F1] text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-[#2EC4F1]/90 transition-colors"
            >
              Search
            </button>
            {(search || state || type) && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-[#5E7A99] px-3 py-2 hover:text-[#123A5E] transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Type pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => {
                setType(type === t ? "" : t);
                setPage(1);
              }}
              className={`text-xs font-mono uppercase tracking-wide px-3 py-1.5 rounded-full border transition-colors ${
                type === t
                  ? "bg-[#FF8A5B] text-white border-[#FF8A5B]"
                  : "bg-white text-[#5E7A99] border-[#D6ECFB] hover:border-[#FF8A5B]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="border border-[#D6ECFB] rounded-2xl h-64 bg-white animate-pulse"
                />
              ))}
            </div>
          ) : errored ? (
            <div className="text-center py-16 border border-[#D6ECFB] rounded-2xl bg-white">
              <p className="font-sans font-bold text-lg">Couldn't load the registry</p>
              <p className="text-sm text-[#5E7A99] mt-1">
                Check that the API is running, then try again.
              </p>
              <button
                onClick={() => fetchColleges()}
                className="mt-4 text-sm font-medium text-[#2EC4F1] hover:underline"
              >
                Retry
              </button>
            </div>
          ) : colleges.length === 0 ? (
            <div className="text-center py-16 border border-[#D6ECFB] rounded-2xl bg-white">
              <p className="font-sans font-bold text-lg">No colleges match these filters</p>
              <p className="text-sm text-[#5E7A99] mt-1">
                Try a different state, type, or search term.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {colleges.map((c) => (
                <Link key={c.id} href={`/colleges/${c.slug}`} className="group block">
                  <article className="relative border border-[#D6ECFB] rounded-2xl bg-white overflow-hidden hover:border-[#2EC4F1] hover:shadow-lg hover:shadow-[#2EC4F1]/10 transition-all h-full flex flex-col">
                    {/* Thumbnail */}
                    <div className="h-36 w-full bg-[#D6ECFB] overflow-hidden">
                      {c.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.imageUrl}
                          alt={c.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#5E7A99] font-sans text-sm">
                          No image
                        </div>
                      )}
                    </div>

                    {c.nirfRank && (
                      <div className="absolute top-3 right-3 bg-[#123A5E] text-white text-[10px] font-mono px-2 py-1 rounded-full">
                        NIRF #{c.nirfRank}
                      </div>
                    )}

                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-[10px] uppercase tracking-[0.15em] font-mono text-[#FF8A5B]">
                        {c.type ?? "—"}
                      </p>
                      <h2 className="font-sans font-bold text-lg leading-snug mt-1 mb-1 group-hover:text-[#2EC4F1] transition-colors">
                        {c.name}
                      </h2>
                      <p className="text-sm text-[#5E7A99]">
                        {c.city}, {c.state}
                      </p>

                      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#D6ECFB] text-sm">
                        <div>
                          <p className="text-[10px] uppercase text-[#5E7A99] font-mono">Fees / yr</p>
                          <p className="font-mono">{formatINR(c.fees)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-[#5E7A99] font-mono">Rating</p>
                          <p className="font-mono">★ {c.rating.toFixed(1)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-[#5E7A99] font-mono">Avg pkg</p>
                          <p className="font-mono">{formatINR(c.avgPackage)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-[#5E7A99] font-mono">Highest</p>
                          <p className="font-mono">{formatINR(c.highestPackage)}</p>
                        </div>
                      </div>

                      {c.exams?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {c.exams.map((exam) => (
                            <span
                              key={exam}
                              className="text-[10px] font-mono bg-[#EAF6FF] border border-[#D6ECFB] rounded-full px-2 py-0.5 text-[#5E7A99]"
                            >
                              {exam}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && !errored && colleges.length > 0 && (
          <div className="flex items-center justify-between mt-8 border-t border-[#D6ECFB] pt-5">
            <p className="text-sm text-[#5E7A99] font-mono">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="text-sm px-3.5 py-1.5 border border-[#D6ECFB] rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#2EC4F1] transition-colors"
              >
                ← Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="text-sm px-3.5 py-1.5 border border-[#D6ECFB] rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#2EC4F1] transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}