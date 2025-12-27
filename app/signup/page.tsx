"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, ArrowRight, Mail, Lock, User, Loader2, Check } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // Login immediately after signup
      await signIn("credentials", {
        redirect: true,
        callbackUrl: "/admin",
        email: form.email,
        password: form.password,
      });

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-charcoal" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-rush-red/5 via-transparent to-transparent opacity-50 blur-3xl" />
      </div>

      <div className="container relative z-10 flex items-center justify-center min-h-screen px-4 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 bg-rush-red rounded-xl flex items-center justify-center shadow-lg shadow-rush-red/20 group-hover:scale-105 transition-transform">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">Join Rush Studios</h1>
            <p className="text-rush-gray">Start your journey with premium photography</p>
          </div>

          <div className="glass-panel p-8 md:p-10 rounded-3xl relative overflow-hidden border border-white/5 shadow-2xl shadow-black/50">

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-rush-red/10 border border-rush-red/20 text-rush-red text-sm font-medium text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-rush-gray ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rush-gray group-focus-within:text-rush-red transition-colors" />
                  <input
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-rush-red/50 focus:ring-1 focus:ring-rush-red/50 transition-all text-sm"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-rush-gray ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rush-gray group-focus-within:text-rush-red transition-colors" />
                  <input
                    type="email"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-rush-red/50 focus:ring-1 focus:ring-rush-red/50 transition-all text-sm"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-rush-gray ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rush-gray group-focus-within:text-rush-red transition-colors" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-rush-red/50 focus:ring-1 focus:ring-rush-red/50 transition-all text-sm"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
                <p className="text-[10px] text-rush-gray ml-1">Must be at least 8 characters</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rush-red hover:bg-red-600 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-rush-red/20"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-white/5">
              <p className="text-sm text-rush-gray mb-6">Or continue with</p>
              <button
                onClick={() => signIn("google", { callbackUrl: "/admin" })}
                className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium py-3 rounded-xl transition-all mb-6"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>

              <p className="text-sm text-rush-gray">
                Already have an account?{" "}
                <Link href="/login" className="text-white font-medium hover:text-rush-red transition-colors">
                  Sign in
                </Link>
              </p>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
