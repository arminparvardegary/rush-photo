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
      <div className="text-center py-4">
        <p className="text-[#E63946] font-bold mb-6">Invalid or missing reset token.</p>
        <Link href="/forgot-password" className="inline-flex items-center justify-center gap-2 w-full bg-rush-dark text-white py-3.5 rounded-xl font-bold hover:bg-rush-dark/90 transition-all">
          Request new link
        </Link>
      </div>
    );
  }

  return (
    <>
      {success ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-teal-500" />
          </div>
          <h3 className="text-xl font-bold text-rush-dark mb-2">Password Reset Successful</h3>
          <p className="text-rush-gray font-medium mb-6">
            You can now login with your new password. Redirecting...
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full bg-rush-dark text-white py-3.5 rounded-xl font-bold hover:bg-rush-dark/90 transition-all"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-[#E63946]/10 border border-[#E63946]/20 text-[#E63946] text-sm font-bold text-center">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-rush-dark ml-1">New Password</label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rush-gray group-focus-within:text-[#E63946] transition-colors" />
              <input
                type="password"
                required
                minLength={8}
                className="w-full bg-rush-light border border-rush-border rounded-xl py-3 pl-10 pr-4 text-rush-dark placeholder-rush-gray/50 focus:outline-none focus:border-[#E63946] focus:bg-white transition-all text-sm font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-rush-dark ml-1">Confirm Password</label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rush-gray group-focus-within:text-[#E63946] transition-colors" />
              <input
                type="password"
                required
                minLength={8}
                className="w-full bg-rush-light border border-rush-border rounded-xl py-3 pl-10 pr-4 text-rush-dark placeholder-rush-gray/50 focus:outline-none focus:border-[#E63946] focus:bg-white transition-all text-sm font-medium"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E63946] hover:bg-[#D62839] text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-[#E63946]/20"
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
    <div className="min-h-screen bg-rush-light flex relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E63946]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rush-gray/5 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-12 h-12 bg-[#E63946] rounded-2xl flex items-center justify-center shadow-xl shadow-[#E63946]/20 group-hover:scale-105 transition-transform">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </Link>
            <h1 className="text-3xl font-black text-rush-dark mb-2">Secure Your Account</h1>
            <p className="text-rush-gray font-medium">Enter your new credentials</p>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-black/5 border border-rush-border relative overflow-hidden">
            <Suspense fallback={<div className="text-center py-4 text-rush-gray font-bold">Loading...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
