"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "Explore", href: "/colleges" },
  { label: "Compare", href: "/compare" },
  { label: "Dashboard", href: "/dashboard" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, [pathname]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    router.push("/");
  };

  const navigate = (href: string) => {
    setMenuOpen(false);
    router.push(href);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[#D6ECFB] bg-white/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="font-sans font-extrabold text-lg sm:text-xl tracking-tight text-[#123A5E] flex items-center gap-1.5 shrink-0"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#2EC4F1]" />
          NextCampus
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <button
                key={link.href}
                onClick={() => navigate(link.href)}
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
                onClick={() => navigate("/login")}
                className="text-sm font-medium px-3.5 py-1.5 rounded-full text-[#5E7A99] hover:text-[#123A5E] hover:bg-[#EAF6FF] transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="text-sm font-medium px-4 py-1.5 rounded-full bg-[#FF8A5B] text-white hover:bg-[#FF8A5B]/90 transition-colors"
              >
                Sign up
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg text-[#123A5E] hover:bg-[#EAF6FF] transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#D6ECFB] bg-white/95 backdrop-blur px-4 py-4 space-y-1">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <button
                key={link.href}
                onClick={() => navigate(link.href)}
                className={`w-full text-left text-sm font-medium px-4 py-2.5 rounded-xl transition-colors ${
                  active
                    ? "bg-[#2EC4F1] text-white"
                    : "text-[#5E7A99] hover:text-[#123A5E] hover:bg-[#EAF6FF]"
                }`}
              >
                {link.label}
              </button>
            );
          })}

          <div className="h-px bg-[#D6ECFB] my-2" />

          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full text-left text-sm font-medium px-4 py-2.5 rounded-xl text-[#5E7A99] hover:text-[#123A5E] hover:bg-[#EAF6FF] transition-colors"
            >
              Logout
            </button>
          ) : (
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => navigate("/login")}
                className="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl border border-[#D6ECFB] text-[#123A5E] hover:bg-[#EAF6FF] transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl bg-[#FF8A5B] text-white hover:bg-[#FF8A5B]/90 transition-colors"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}