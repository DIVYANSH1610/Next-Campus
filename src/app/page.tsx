"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Compass, GitCompare, Bookmark } from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-[#EAF6FF] text-[#123A5E]">

      {/* ── HERO ── */}
      <section className="relative h-[100svh] min-h-[560px] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/campus-hero.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-[#123A5E]/70 via-[#2EC4F1]/40 to-[#EAF6FF]" />

        <div className="relative z-10 h-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col justify-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/90 font-mono mb-3 sm:mb-4"
          >
            NextCampus · 30+ institutions indexed
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-sans font-extrabold tracking-tight text-white text-4xl sm:text-5xl md:text-7xl leading-[1.05] max-w-2xl"
          >
            Your future,
            <br />
            in orbit.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/90 mt-4 sm:mt-5 max-w-sm sm:max-w-md text-base sm:text-lg"
          >
            Explore colleges, compare outcomes, and find the place where your
            next four years actually take off.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-6 sm:mt-8"
          >
            <Link
              href="/colleges"
              className="bg-[#FF8A5B] hover:bg-[#FF8A5B]/90 text-white font-semibold px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-sm shadow-lg shadow-[#FF8A5B]/30 transition-all hover:scale-105 w-full sm:w-auto text-center"
            >
              Explore colleges →
            </Link>

            <Link
              href="/signup"
              className="bg-white/10 border border-white/30 backdrop-blur text-white font-medium px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-sm hover:bg-white/20 transition-colors w-full sm:w-auto text-center"
            >
              Create an account
            </Link>
          </motion.div>
        </div>

        {/* Scroll cue — hidden on very small screens */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/70 text-xs font-mono tracking-wide flex-col items-center gap-2"
        >
          <span>SCROLL</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ↓
          </motion.span>
        </motion.div>
      </section>

      {/* ── QUICK LINKS ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {[
            {
              title: "Explore",
              desc: "Browse every indexed institution by state, type, and fit.",
              href: "/colleges",
              color: "#2EC4F1",
              Icon: Compass,
            },
            {
              title: "Compare",
              desc: "Line up three colleges side-by-side on fees, ROI, and rating.",
              href: "/compare",
              color: "#FF8A5B",
              Icon: GitCompare,
            },
            {
              title: "Save",
              desc: "Build a shortlist and revisit it anytime from your dashboard.",
              href: "/dashboard",
              color: "#5FE3C0",
              Icon: Bookmark,
            },
          ].map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group bg-white border border-[#D6ECFB] rounded-2xl p-5 sm:p-6 hover:shadow-lg hover:shadow-[#2EC4F1]/10 transition-all flex sm:block items-center gap-4"
            >
              <div
                className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center"
                style={{ backgroundColor: `${card.color}1A` }}
              >
                <card.Icon size={20} color={card.color} strokeWidth={2.25} />
              </div>
              <div>
                <h3 className="font-sans font-bold text-base sm:text-lg group-hover:text-[#2EC4F1] transition-colors sm:mt-4">
                  {card.title}
                </h3>
                <p className="text-[#5E7A99] text-sm mt-1">{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}