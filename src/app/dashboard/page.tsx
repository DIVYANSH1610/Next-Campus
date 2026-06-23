"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type SavedItem = {
  id: string;
  college: {
    id: string;
    name: string;
    slug: string;
    city: string;
    state: string;
    type: string | null;
  };
};

type UserPayload = {
  email?: string;
  userId?: string;
};

export default function DashboardPage() {
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [user, setUser] = useState<UserPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setUser(payload);
        } catch {
          setUser(null);
        }
      }

      try {
        const res = await fetch("/api/saved/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        setSaved(json?.data ?? (Array.isArray(json) ? json : []));
      } catch (err) {
        console.error("Failed to fetch saved colleges:", err);
        setSaved([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#EAF6FF] text-[#123A5E]">
      <header className="border-b border-[#D6ECFB] bg-[#EAF6FF]/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#FF8A5B] font-mono mb-1">
            Your account
          </p>
          <h1 className="font-sans font-extrabold text-3xl md:text-4xl tracking-tight">
            Dashboard
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* User + stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-[#D6ECFB] rounded-2xl bg-white p-5 md:col-span-2">
            <p className="text-[10px] uppercase tracking-wide font-mono text-[#5E7A99] mb-2">
              Signed in as
            </p>
            <p className="font-sans font-semibold text-lg">{user?.email ?? "—"}</p>
            <p className="text-xs text-[#5E7A99] font-mono mt-1">
              ID: {user?.userId ?? "—"}
            </p>
          </div>
          <div className="border border-[#D6ECFB] rounded-2xl bg-gradient-to-br from-[#2EC4F1] to-[#123A5E] text-white p-5">
            <p className="text-[10px] uppercase tracking-wide font-mono text-white/70 mb-2">
              Saved colleges
            </p>
            <p className="font-mono text-3xl">{saved.length}</p>
          </div>
        </div>

        {/* Saved colleges */}
        <div>
          <h2 className="font-sans font-bold text-xl mb-3">Saved colleges</h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-28 border border-[#D6ECFB] rounded-2xl bg-white animate-pulse" />
              ))}
            </div>
          ) : saved.length === 0 ? (
            <div className="text-center py-16 border border-[#D6ECFB] rounded-2xl bg-white">
              <p className="font-sans font-bold text-lg">Nothing saved yet</p>
              <p className="text-sm text-[#5E7A99] mt-1">
                Browse colleges and save the ones you're considering.
              </p>
              <Link
                href="/colleges"
                className="inline-block mt-4 text-sm font-medium text-[#2EC4F1] hover:underline"
              >
                Explore colleges →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {saved.map((item) => (
                <Link
                  key={item.id}
                  href={`/colleges/${item.college.slug}`}
                  className="border border-[#D6ECFB] rounded-2xl bg-white p-4 hover:border-[#2EC4F1] hover:shadow-md hover:shadow-[#2EC4F1]/10 transition-all"
                >
                  <p className="text-[10px] uppercase tracking-wide font-mono text-[#FF8A5B]">
                    {item.college.type ?? "—"}
                  </p>
                  <h3 className="font-sans font-semibold text-base mt-1">{item.college.name}</h3>
                  <p className="text-sm text-[#5E7A99] mt-1">{item.college.city}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}