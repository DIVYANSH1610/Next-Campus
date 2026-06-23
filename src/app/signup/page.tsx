"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login");
      } else {
        setError(data.error || "Signup failed. Try again.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EAF6FF] text-[#123A5E] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-[#FF8A5B] font-mono mb-1 text-center">
          NextCampus
        </p>
        <h1 className="font-sans font-extrabold text-3xl tracking-tight text-center mb-6">
          Create your account
        </h1>

        <div className="border border-[#D6ECFB] rounded-2xl bg-white p-6 space-y-4 shadow-sm">
          <div>
            <label className="text-[10px] uppercase tracking-wide font-mono text-[#5E7A99]">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 border border-[#D6ECFB] rounded-xl px-3 py-2 text-sm bg-[#EAF6FF] focus:outline-none focus:ring-2 focus:ring-[#2EC4F1] focus:border-transparent"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wide font-mono text-[#5E7A99]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 border border-[#D6ECFB] rounded-xl px-3 py-2 text-sm bg-[#EAF6FF] focus:outline-none focus:ring-2 focus:ring-[#2EC4F1] focus:border-transparent"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wide font-mono text-[#5E7A99]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 border border-[#D6ECFB] rounded-xl px-3 py-2 text-sm bg-[#EAF6FF] focus:outline-none focus:ring-2 focus:ring-[#2EC4F1] focus:border-transparent"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-[#2EC4F1] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#2EC4F1]/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </div>

        <p className="text-sm text-[#5E7A99] text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-[#FF8A5B] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}