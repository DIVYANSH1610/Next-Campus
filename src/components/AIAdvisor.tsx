"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Sparkles, X, Send } from "lucide-react";

type Source = {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
};

type Message = {
  role: "user" | "assistant";
  text: string;
  sources?: Source[];
};

export default function AIAdvisor() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi! Ask me anything about colleges in the registry — fees, placements, exams, or \"which college fits my budget.\"",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const handleAsk = async () => {
    const question = input.trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer ?? "Something went wrong — try again.",
          sources: data.sources,
        },
      ]);
    } catch (err) {
      console.error("AI Advisor request failed:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Couldn't reach the AI Advisor right now. Try again shortly." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 bg-[#2EC4F1] hover:bg-[#2EC4F1]/90 text-white rounded-full p-3.5 sm:p-4 shadow-lg shadow-[#2EC4F1]/30 transition-transform hover:scale-105 flex items-center gap-2"
        >
          <Sparkles size={20} />
          <span className="text-sm font-semibold pr-1 hidden sm:inline">Ask AI</span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed inset-x-3 bottom-3 top-16 sm:inset-x-auto sm:top-auto sm:bottom-6 sm:right-6 z-50 sm:w-[380px] sm:max-h-[70vh] bg-white border border-[#D6ECFB] rounded-2xl shadow-xl shadow-[#123A5E]/10 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2EC4F1] to-[#123A5E] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={18} />
              <span className="font-sans font-bold text-sm">College AI Advisor</span>
            </div>
            <button onClick={() => setOpen(false)} className="hover:opacity-70 transition-opacity">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#EAF6FF]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                  msg.role === "user"
                    ? "bg-[#123A5E] text-white ml-auto"
                    : "bg-white border border-[#D6ECFB] text-[#123A5E]"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {msg.sources && msg.sources.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-[#D6ECFB]">
                    {msg.sources.map((s) => (
                      <Link
                        key={s.id}
                        href={`/colleges/${s.slug}`}
                        className="text-[10px] font-mono bg-[#EAF6FF] border border-[#D6ECFB] rounded-full px-2 py-0.5 text-[#2EC4F1] hover:bg-[#2EC4F1] hover:text-white transition-colors"
                      >
                        {s.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="bg-white border border-[#D6ECFB] rounded-2xl px-3.5 py-2.5 text-sm text-[#5E7A99] w-fit">
                Thinking…
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-[#D6ECFB] p-3 flex gap-2 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              placeholder="Ask about fees, placements, exams…"
              className="flex-1 border border-[#D6ECFB] rounded-xl px-3 py-2 text-sm bg-[#EAF6FF] focus:outline-none focus:ring-2 focus:ring-[#2EC4F1]"
            />
            <button
              onClick={handleAsk}
              disabled={loading || !input.trim()}
              className="bg-[#2EC4F1] text-white rounded-xl px-3 disabled:opacity-40 hover:bg-[#2EC4F1]/90 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}