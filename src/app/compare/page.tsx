"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CompareAIVerdict from "@/components/CompareAIVerdict";

type College = {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  type: string | null;
  rating: number;
  avgPackage: number;
  highestPackage: number;
  fees: number;
};

function formatINR(value: number) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function ComparePage() {
  const searchParams = useSearchParams();
  const [colleges, setColleges] = useState<College[]>([]);
  const [selected, setSelected] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await fetch("/api/colleges?limit=30");
        const json = await res.json();
        const list: College[] = json?.data ?? [];
        setColleges(list);

        // Pre-select a college if arriving via ?add=slug from a detail page.
        const addSlug = searchParams.get("add");
        if (addSlug) {
          const match = list.find((c) => c.slug === addSlug);
          if (match) setSelected([match]);
        }
      } catch (err) {
        console.error("Failed to fetch colleges:", err);
        setColleges([]);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSelect = (college: College) => {
    if (selected.find((c) => c.id === college.id)) {
      setSelected(selected.filter((c) => c.id !== college.id));
    } else if (selected.length < 3) {
      setSelected([...selected, college]);
    }
  };

  const rows: { label: string; render: (c: College) => React.ReactNode }[] = [
    { label: "City", render: (c) => `${c.city}, ${c.state}` },
    { label: "Type", render: (c) => c.type ?? "—" },
    { label: "Fees / yr", render: (c) => formatINR(c.fees) },
    { label: "Rating", render: (c) => `★ ${c.rating.toFixed(1)}` },
    { label: "Avg package", render: (c) => formatINR(c.avgPackage) },
    { label: "Highest package", render: (c) => formatINR(c.highestPackage) },
  ];

  return (
    <div className="min-h-screen bg-[#EAF6FF] text-[#123A5E]">
      <header className="border-b border-[#D6ECFB] bg-[#EAF6FF]/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#FF8A5B] font-mono mb-1">
            Side-by-side
          </p>
          <h1 className="font-sans font-extrabold text-3xl md:text-4xl tracking-tight">
            Compare colleges
          </h1>
          <p className="text-sm text-[#5E7A99] mt-1">
            Pick up to 3 institutions to line up their numbers.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Selection grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 border border-[#D6ECFB] rounded-xl bg-white animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto pr-1">
            {colleges.map((c) => {
              const isSelected = !!selected.find((s) => s.id === c.id);
              const disabled = !isSelected && selected.length >= 3;
              return (
                <button
                  key={c.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => toggleSelect(c)}
                  className={`text-left p-3 border rounded-xl transition-colors ${
                    isSelected
                      ? "bg-[#2EC4F1] border-[#2EC4F1] text-white"
                      : disabled
                      ? "bg-white border-[#D6ECFB] opacity-40 cursor-not-allowed"
                      : "bg-white border-[#D6ECFB] hover:border-[#FF8A5B]"
                  }`}
                >
                  <h2 className="font-sans font-semibold text-sm leading-snug">{c.name}</h2>
                  <p className={`text-xs mt-1 ${isSelected ? "text-white/80" : "text-[#5E7A99]"}`}>
                    {c.city}
                  </p>
                </button>
              );
            })}
          </div>
        )}

        <p className="text-xs text-[#5E7A99] font-mono mt-2">
          {selected.length} / 3 selected
        </p>

        {/* Comparison table */}
        {selected.length > 0 ? (
          <div className="mt-8 overflow-x-auto border border-[#D6ECFB] rounded-2xl bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#D6ECFB]">
                  <th className="text-left p-3 font-mono text-[10px] uppercase text-[#5E7A99] tracking-wide">
                    Feature
                  </th>
                  {selected.map((c) => (
                    <th key={c.id} className="text-left p-3 font-sans font-bold text-base">
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? "bg-[#EAF6FF]/60" : ""}>
                    <td className="p-3 font-mono text-[11px] uppercase text-[#5E7A99] tracking-wide border-t border-[#D6ECFB]">
                      {row.label}
                    </td>
                    {selected.map((c) => (
                      <td key={c.id} className="p-3 font-mono border-t border-[#D6ECFB]">
                        {row.render(c)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <CompareAIVerdict slugs={selected.map((c) => c.slug)} />
          </div>
        ) : (
          <div className="mt-8 text-center py-16 border border-[#D6ECFB] rounded-2xl bg-white">
            <p className="font-sans font-bold text-lg">No colleges selected</p>
            <p className="text-sm text-[#5E7A99] mt-1">
              Tap up to three colleges above to compare them here.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}