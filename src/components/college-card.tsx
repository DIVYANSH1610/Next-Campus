"use client";

import Link from "next/link";
import { useState } from "react";

type College = {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  type?: string;
  rating: number;
  avgPackage: number;
  fees: number;
  imageUrl?: string | null;
};

function formatINR(value: number) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function CollegeCard({ college }: { college: College }) {
  return (
    <Link href={`/colleges/${college.slug}`}>
      <div className="border border-[#E4DFD3] bg-white p-5 cursor-pointer hover:border-[#D98E32] transition">

        {/* IMAGE */}
        <div className="h-40 bg-[#F3F0E8] mb-4 overflow-hidden">
          {college.imageUrl ? (
            <img
              src={college.imageUrl}
              className="w-full h-full object-cover"
              alt={college.name}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* TYPE */}
        {college.type && (
          <p className="text-[10px] uppercase font-mono text-[#D98E32]">
            {college.type}
          </p>
        )}

        {/* NAME */}
        <h2 className="font-serif text-lg mt-1">
          {college.name}
        </h2>

        {/* LOCATION */}
        <p className="text-sm text-[#5C6470]">
          {college.city}, {college.state}
        </p>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#E4DFD3] text-sm">
          <div>
            <p className="text-[10px] font-mono text-gray-500">Rating</p>
            <p className="font-mono">★ {college.rating.toFixed(1)}</p>
          </div>

          <div>
            <p className="text-[10px] font-mono text-gray-500">Avg</p>
            <p className="font-mono">{formatINR(college.avgPackage)}</p>
          </div>

          <div>
            <p className="text-[10px] font-mono text-gray-500">Fees</p>
            <p className="font-mono">{formatINR(college.fees)}</p>
          </div>
        </div>

      </div>
    </Link>
  );
}