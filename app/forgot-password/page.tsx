"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, ArrowRight, Mail, Loader2, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      // Always show success to prevent enumeration
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-charcoal" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-rush-gray/10 via-transparent to-transparent opacity-30 blur-3xl" />
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
              <div className="w-10 h-10 bg-rush-red rounded-xl flex items-center justify-center shadow-lg shadow-rush-red/20 group-hover:scale-105 transition-transform">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-rush-gray">Enter your email to receive recovery instructions</p>
          </div>

          <div className="glass-panel p-8 md:p-10 rounded-3xl relative overflow-hidden border border-white/5 shadow-2xl shadow-black/50">

            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Check your email</h3>
                <p className="text-rush-gray mb-6">
                  If an account exists with {email}, we have sent password reset instructions.
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
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-rush-gray ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rush-gray group-focus-within:text-rush-red transition-colors" />
                    <input
                      type="email"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-rush-red/50 focus:ring-1 focus:ring-rush-red/50 transition-all text-sm"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      Send Info
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <Link href="/login" className="text-sm text-rush-gray hover:text-white transition-colors">
                    Back to Login
                  </Link>
                </div>
              </form>
            )}

          </div>
        </motion.div>
      </div>
    </div>
  );
}
