"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SaveButtonClient({ collegeId }: { collegeId: string }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/saved/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ collegeId }),
      });

      if (!res.ok) throw new Error("Save failed");

      setSaved(true);
    } catch (err) {
      console.error("Failed to save college:", err);
      setError("Couldn't save right now.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleSave}
        disabled={saving || saved}
        className="border border-[#D6ECFB] bg-white px-6 py-3 text-sm font-semibold rounded-full hover:border-[#FF8A5B] hover:text-[#FF8A5B] transition-colors disabled:opacity-60"
      >
        {saved ? "Saved ✓" : saving ? "Saving…" : "Save college"}
      </button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}