"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeroVideo() {
const router = useRouter();

return ( <section className="relative h-screen overflow-hidden"> <video
     autoPlay
     muted={false}
     playsInline
     className="absolute inset-0 h-full w-full object-cover"
   > <source src="/videos/campus.mp4" type="video/mp4" /> </video>

```
  <div className="absolute inset-0 bg-black/55" />

  <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-6">

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="uppercase tracking-[0.4em] text-sm"
    >
      NextCampus
    </motion.p>

    <motion.h1
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="font-serif text-6xl md:text-8xl max-w-5xl"
    >
      Discover Your Dream College
    </motion.h1>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="mt-6 text-lg text-gray-200 max-w-2xl"
    >
      Explore institutions, compare placements,
      evaluate fees, and save your favourites.
    </motion.p>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.3 }}
      className="flex gap-4 mt-8"
    >
      <button
        onClick={() => router.push("/colleges")}
        className="bg-white text-black px-6 py-3 rounded-xl font-medium"
      >
        Explore Colleges
      </button>

      <button
        onClick={() => router.push("/compare")}
        className="border border-white px-6 py-3 rounded-xl flex items-center gap-2"
      >
        Compare
        <ArrowRight size={18} />
      </button>
    </motion.div>
  </div>
</section>

);
}
