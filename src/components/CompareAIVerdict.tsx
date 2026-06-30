"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

export default function CompareAIVerdict({ slugs }: { slugs: string[] }) {
  const [verdict, setVerdict] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const generate = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/ai/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setVerdict(data.verdict);
    } catch (err) {
      console.error("Compare AI failed:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (slugs.length < 2) return null;

  return (
    <div className="mt-6 bg-white border border-[#D6ECFB] rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-[#2EC4F1]" />
          <h3 className="font-sans font-bold text-base">AI Verdict</h3>
          <span className="text-[10px] font-mono uppercase tracking-wide bg-[#5FE3C0]/20 text-[#0E8F6E] px-2 py-0.5 rounded-full">
            Grounded in real data
          </span>
        </div>

        {!verdict && (
          <button
            onClick={generate}
            disabled={loading}
            className="text-sm font-semibold bg-[#2EC4F1] text-white px-4 py-1.5 rounded-full hover:bg-[#2EC4F1]/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Analyzing…" : "Generate verdict"}
          </button>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-3">
          <p className="text-sm text-red-500">
            Couldn't generate a verdict — the AI service may be briefly busy.
          </p>
          <button
            onClick={generate}
            disabled={loading}
            className="text-sm font-semibold text-[#2EC4F1] hover:underline disabled:opacity-50"
          >
            Try again
          </button>
        </div>
      )}

      {verdict && (
        <p className="text-sm text-[#5E7A99] leading-relaxed mt-3">{verdict}</p>
      )}
    </div>
  );
}