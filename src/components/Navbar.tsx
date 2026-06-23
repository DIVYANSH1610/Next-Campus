"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const LINKS = [
  { label: "Explore", href: "/colleges" },
  { label: "Compare", href: "/compare" },
  { label: "Dashboard", href: "/dashboard" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[#D6ECFB] bg-white/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <button
          onClick={() => router.push("/")}
          className="font-sans font-extrabold text-xl tracking-tight text-[#123A5E] flex items-center gap-1.5"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#2EC4F1]" />
          NextCampus
        </button>

        <div className="flex items-center gap-1">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <button
                key={link.href}
                onClick={() => router.push(link.href)}
                className={`text-sm font-medium px-3.5 py-1.5 rounded-full transition-colors ${
                  active
                    ? "bg-[#2EC4F1] text-white"
                    : "text-[#5E7A99] hover:text-[#123A5E] hover:bg-[#EAF6FF]"
                }`}
              >
                {link.label}
              </button>
            );
          })}

          <div className="w-px h-5 bg-[#D6ECFB] mx-2" />

          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="text-sm font-medium px-3.5 py-1.5 rounded-full text-[#5E7A99] hover:text-[#123A5E] hover:bg-[#EAF6FF] transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push("/login")}
                className="text-sm font-medium px-3.5 py-1.5 rounded-full text-[#5E7A99] hover:text-[#123A5E] hover:bg-[#EAF6FF] transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="text-sm font-medium px-4 py-1.5 rounded-full bg-[#FF8A5B] text-white hover:bg-[#FF8A5B]/90 transition-colors"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}