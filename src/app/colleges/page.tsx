"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, X, SlidersHorizontal } from "lucide-react";

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
  const [filtersOpen, setFiltersOpen] = useState(false);

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

  const hasFilters = search || state || type;

  return (
    <div className="min-h-screen bg-[#EAF6FF] text-[#123A5E]">

      {/* ── HEADER ── */}
      <header className="border-b border-[#D6ECFB] bg-[#EAF6FF]/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#FF8A5B] font-mono mb-1">
              NextCampus Registry
            </p>
            <h1 className="font-sans font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-tight">
              Find a college
            </h1>
          </div>
          <p className="hidden sm:block text-sm text-[#5E7A99] font-mono shrink-0">
            {total.toLocaleString("en-IN")} indexed
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ── SEARCH BAR ── */}
        <form onSubmit={handleFilterSubmit}>
          <div className="border border-[#D6ECFB] bg-white rounded-2xl p-3 sm:p-4 shadow-sm">

            {/* Search row */}
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 border border-[#D6ECFB] rounded-xl px-3 py-2 bg-[#EAF6FF] focus-within:ring-2 focus-within:ring-[#2EC4F1]">
                <Search size={15} className="text-[#5E7A99] shrink-0" />
                <input
                  placeholder="Search colleges…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-[#5E7A99]/60 min-w-0"
                />
                {search && (
                  <button type="button" onClick={() => setSearch("")}>
                    <X size={13} className="text-[#5E7A99]" />
                  </button>
                )}
              </div>

              {/* Filter toggle on mobile */}
              <button
                type="button"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`sm:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${
                  filtersOpen || state
                    ? "bg-[#2EC4F1] text-white border-[#2EC4F1]"
                    : "border-[#D6ECFB] text-[#5E7A99]"
                }`}
              >
                <SlidersHorizontal size={15} />
              </button>

              <button
                type="submit"
                className="hidden sm:block bg-[#2EC4F1] text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-[#2EC4F1]/90 transition-colors"
              >
                Search
              </button>
            </div>

            {/* State filter — always visible on desktop, toggleable on mobile */}
            <div className={`mt-2 gap-2 flex ${filtersOpen ? "flex" : "hidden sm:flex"}`}>
              <input
                placeholder="Filter by state (e.g. Tamil Nadu)"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="flex-1 border border-[#D6ECFB] rounded-xl px-3 py-2 text-sm bg-[#EAF6FF] focus:outline-none focus:ring-2 focus:ring-[#2EC4F1] placeholder:text-[#5E7A99]/60"
              />
              <button
                type="submit"
                className="sm:hidden bg-[#2EC4F1] text-white text-sm font-semibold px-5 py-2 rounded-xl"
              >
                Go
              </button>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-[#5E7A99] px-3 py-2 hover:text-[#123A5E] transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </form>

        {/* ── TYPE PILLS ── */}
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

        {/* ── RESULTS ── */}
        <div className="mt-6 sm:mt-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border border-[#D6ECFB] rounded-2xl h-64 bg-white animate-pulse" />
              ))}
            </div>
          ) : errored ? (
            <div className="text-center py-16 border border-[#D6ECFB] rounded-2xl bg-white">
              <p className="font-sans font-bold text-lg">Couldn't load the registry</p>
              <p className="text-sm text-[#5E7A99] mt-1">Check that the API is running, then try again.</p>
              <button onClick={() => fetchColleges()} className="mt-4 text-sm font-medium text-[#2EC4F1] hover:underline">
                Retry
              </button>
            </div>
          ) : colleges.length === 0 ? (
            <div className="text-center py-16 border border-[#D6ECFB] rounded-2xl bg-white">
              <p className="font-sans font-bold text-lg">No colleges match these filters</p>
              <p className="text-sm text-[#5E7A99] mt-1">Try a different state, type, or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              {colleges.map((c) => (
                <Link key={c.id} href={`/colleges/${c.slug}`} className="group block">
                  <article className="relative border border-[#D6ECFB] rounded-2xl bg-white overflow-hidden hover:border-[#2EC4F1] hover:shadow-lg hover:shadow-[#2EC4F1]/10 transition-all h-full flex flex-col">

                    {/* Thumbnail */}
                    <div className="h-32 sm:h-36 w-full bg-[#D6ECFB] overflow-hidden shrink-0">
                      {c.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.imageUrl}
                          alt={c.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#5E7A99] text-sm">
                          No image
                        </div>
                      )}
                    </div>

                    {c.nirfRank && (
                      <div className="absolute top-3 right-3 bg-[#123A5E] text-white text-[10px] font-mono px-2 py-1 rounded-full">
                        NIRF #{c.nirfRank}
                      </div>
                    )}

                    <div className="p-4 sm:p-5 flex-1 flex flex-col">
                      <p className="text-[10px] uppercase tracking-[0.15em] font-mono text-[#FF8A5B]">
                        {c.type ?? "—"}
                      </p>
                      <h2 className="font-sans font-bold text-base sm:text-lg leading-snug mt-1 mb-1 group-hover:text-[#2EC4F1] transition-colors">
                        {c.name}
                      </h2>
                      <p className="text-sm text-[#5E7A99]">
                        {c.city}, {c.state}
                      </p>

                      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#D6ECFB] text-sm">
                        <div>
                          <p className="text-[10px] uppercase text-[#5E7A99] font-mono">Fees / yr</p>
                          <p className="font-mono text-xs sm:text-sm">{formatINR(c.fees)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-[#5E7A99] font-mono">Rating</p>
                          <p className="font-mono text-xs sm:text-sm">★ {c.rating.toFixed(1)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-[#5E7A99] font-mono">Avg pkg</p>
                          <p className="font-mono text-xs sm:text-sm">{formatINR(c.avgPackage)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-[#5E7A99] font-mono">Highest</p>
                          <p className="font-mono text-xs sm:text-sm">{formatINR(c.highestPackage)}</p>
                        </div>
                      </div>

                      {c.exams?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {c.exams.slice(0, 3).map((exam) => (
                            <span
                              key={exam}
                              className="text-[10px] font-mono bg-[#EAF6FF] border border-[#D6ECFB] rounded-full px-2 py-0.5 text-[#5E7A99]"
                            >
                              {exam}
                            </span>
                          ))}
                          {c.exams.length > 3 && (
                            <span className="text-[10px] font-mono text-[#5E7A99]">
                              +{c.exams.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ── PAGINATION ── */}
        {!loading && !errored && colleges.length > 0 && (
          <div className="flex items-center justify-between mt-8 border-t border-[#D6ECFB] pt-5 gap-4">
            <p className="text-xs sm:text-sm text-[#5E7A99] font-mono">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="text-sm px-4 py-2 border border-[#D6ECFB] rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#2EC4F1] transition-colors"
              >
                ← Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="text-sm px-4 py-2 border border-[#D6ECFB] rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#2EC4F1] transition-colors"
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