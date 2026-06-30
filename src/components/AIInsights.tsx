"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  AlertTriangle,
  Cpu,
  PartyPopper,
  Dumbbell,
  Building2,
  MapPin,
} from "lucide-react";

type Insights = {
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

const SPECULATIVE_SECTIONS: {
  key: keyof Insights["speculative"];
  label: string;
  Icon: typeof Cpu;
}[] = [
  { key: "technicalClubs", label: "Technical clubs", Icon: Cpu },
  { key: "culturalFests", label: "Cultural fests", Icon: PartyPopper },
  { key: "sportsAndFitness", label: "Sports & fitness", Icon: Dumbbell },
  { key: "hostelAndCampusLife", label: "Hostel & campus life", Icon: Building2 },
  { key: "locationNotes", label: "Location notes", Icon: MapPin },
];

export default function AIInsights({ slug }: { slug: string }) {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/ai/insights/${slug}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setInsights(data.insights);
    } catch (err) {
      console.error("Failed to load AI insights:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (loading) {
    return (
      <div className="mt-10 space-y-3">
        <div className="h-6 w-48 bg-[#D6ECFB] rounded animate-pulse" />
        <div className="h-24 bg-white border border-[#D6ECFB] rounded-2xl animate-pulse" />
        <div className="h-24 bg-white border border-[#D6ECFB] rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error || !insights) {
    return (
      <div className="mt-10 text-center py-10 border border-[#D6ECFB] rounded-2xl bg-white">
        <p className="text-sm text-[#5E7A99] mb-3">
          AI Insights couldn't load — the AI service may be briefly busy.
        </p>
        <button
          onClick={fetchInsights}
          className="text-sm font-semibold text-[#2EC4F1] hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-6">
      {/* GROUNDED SECTION */}
      <div>
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Sparkles size={18} className="text-[#2EC4F1]" />
          <h2 className="font-sans font-bold text-2xl">AI Insights</h2>
          <span className="text-[10px] font-mono uppercase tracking-wide bg-[#5FE3C0]/20 text-[#0E8F6E] px-2 py-0.5 rounded-full">
            Grounded in real data
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white border border-[#D6ECFB] rounded-2xl p-5">
            <p className="text-[10px] uppercase tracking-wide font-mono text-[#2EC4F1] mb-2">
              ROI Analysis
            </p>
            <p className="text-sm text-[#5E7A99] leading-relaxed">{insights.roiAnalysis}</p>
          </div>

          <div className="bg-white border border-[#D6ECFB] rounded-2xl p-5">
            <p className="text-[10px] uppercase tracking-wide font-mono text-[#2EC4F1] mb-2">
              Vs. Similar Colleges
            </p>
            <p className="text-sm text-[#5E7A99] leading-relaxed">
              {insights.comparisonToSimilar}
            </p>
          </div>

          <div className="bg-white border border-[#D6ECFB] rounded-2xl p-5">
            <p className="text-[10px] uppercase tracking-wide font-mono text-[#2EC4F1] mb-2">
              Overall Fit
            </p>
            <p className="text-sm text-[#5E7A99] leading-relaxed">{insights.fitSummary}</p>
          </div>
        </div>
      </div>

      {/* SPECULATIVE SECTION — visually distinct, clearly flagged, no fake photos */}
      <div className="bg-[#FFF8EE] border border-[#FFD9A8] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle size={16} className="text-[#D9822B]" />
          <p className="text-sm font-sans font-bold text-[#8A5A1E]">
            Campus & activities — AI-speculated, unverified
          </p>
        </div>
        <p className="text-xs text-[#8A5A1E]/80 mb-5 max-w-3xl">
          The sections below are general, AI-generated inferences about institutions of
          this type, scale, and location — not confirmed facts about this specific
          college's actual clubs, events, or facilities. No real photos exist for this
          section by design, since we don't have verified images of this college's
          specific activities. Treat this as a starting point for your own research,
          not as verified information.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SPECULATIVE_SECTIONS.map(({ key, label, Icon }) => (
            <div
              key={key}
              className="bg-white/60 border border-[#FFD9A8]/60 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-[#FFD9A8]/40 flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-[#8A5A1E]" />
                </div>
                <p className="text-xs uppercase tracking-wide font-mono text-[#8A5A1E]">
                  {label}
                </p>
              </div>
              <p className="text-sm text-[#6B4A1E] leading-relaxed">
                {insights.speculative[key]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}