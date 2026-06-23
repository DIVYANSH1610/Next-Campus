"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const [search, setSearch] = useState("");

  const router = useRouter();

  const handleSearch = () => {
    router.push(`/colleges?search=${search}`);
  };

  return (
    <div className="mb-8 flex gap-3">
      <input
        type="text"
        placeholder="Search colleges..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="flex-1 rounded-lg border px-4 py-3 outline-none"
      />

      <button
        onClick={handleSearch}
        className="rounded-lg bg-black px-6 py-3 text-white"
      >
        Search
      </button>
    </div>
  );
}