"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, ArrowRight, Lock, Loader2, CheckCircle } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Reset failed");
      }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-rush-red mb-4">Invalid or missing reset token.</p>
        <Link href="/forgot-password" className="text-white underline">
          Request new link
        </Link>
      </div>
    );
  }

  return (
    <>
      {success ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Password Reset Successful</h3>
          <p className="text-rush-gray mb-6">
            You can now login with your new password. Redirecting...
          </p>
          <Link
            href="/login"
            className="text-rush-red font-medium hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-rush-red/10 border border-rush-red/20 text-rush-red text-sm font-medium text-center">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-rush-gray ml-1">New Password</label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rush-gray group-focus-within:text-rush-red transition-colors" />
              <input
                type="password"
                required
                minLength={8}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-rush-red/50 focus:ring-1 focus:ring-rush-red/50 transition-all text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-rush-gray ml-1">Confirm Password</label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rush-gray group-focus-within:text-rush-red transition-colors" />
              <input
                type="password"
                required
                minLength={8}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-rush-red/50 focus:ring-1 focus:ring-rush-red/50 transition-all text-sm"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
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
                Set New Password
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-ink flex relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-charcoal" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-rush-red/10 via-transparent to-transparent opacity-30 blur-3xl" />
      </div>

      <div className="container relative z-10 flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 bg-rush-red rounded-xl flex items-center justify-center shadow-lg shadow-rush-red/20 group-hover:scale-105 transition-transform">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">Secure Your Account</h1>
            <p className="text-rush-gray">Enter your new credential details</p>
          </div>

          <div className="glass-panel p-8 md:p-10 rounded-3xl relative overflow-hidden border border-white/5 shadow-2xl shadow-black/50">
            <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
