"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, ArrowRight, Mail, Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (res?.error) {
        console.error("Login failed");
      } else {
        router.push("/admin");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/admin" });
  };

  return (
    <div className="min-h-screen bg-rush-light flex relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E63946]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rush-gray/5 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Side: Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex flex-col justify-center space-y-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#E63946] rounded-2xl flex items-center justify-center shadow-xl shadow-[#E63946]/20">
                <span className="text-white font-black text-xl">R</span>
              </div>
              <span className="text-3xl font-bold text-rush-dark tracking-tight">Rush Photo</span>
            </div>

            <h1 className="text-5xl font-black text-rush-dark leading-tight">
              Professional <br />
              <span className="text-[#E63946]">Product Photography</span>
            </h1>

            <p className="text-lg text-rush-gray max-w-md font-medium">
              Elevate your brand with cinematic, high-conversion imagery delivered at the speed of business.
            </p>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl shadow-black/5 border border-rush-border relative overflow-hidden">

              <div className="mb-8 text-center lg:text-left">
                <h2 className="text-2xl font-bold text-rush-dark mb-2">Welcome Back</h2>
                <p className="text-rush-gray text-sm font-medium">Sign in to manage your orders</p>
              </div>

              {error && (
                <div className="mb-6 p-3 rounded-xl bg-[#E63946]/10 border border-[#E63946]/20 text-[#E63946] text-sm font-bold text-center">
                  Authentication failed. Please check your credentials.
                </div>
              )}

              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white border border-rush-border text-rush-dark font-bold py-3.5 rounded-xl hover:bg-rush-light transition-all mb-6 group shadow-sm hover:shadow-md"
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
                <span>Continue with Google</span>
              </button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-rush-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase font-bold tracking-wider">
                  <span className="bg-white px-2 text-rush-gray-light">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-rush-dark ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rush-gray group-focus-within:text-[#E63946] transition-colors" />
                    <input
                      type="email"
                      required
                      className="w-full bg-rush-light border border-rush-border rounded-xl py-3 pl-10 pr-4 text-rush-dark placeholder-rush-gray/50 focus:outline-none focus:border-[#E63946] focus:bg-white transition-all text-sm font-medium"
                      placeholder="name@company.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-xs font-bold text-rush-dark">Password</label>
                    <Link href="/forgot-password" className="text-xs font-bold text-[#E63946] hover:text-[#D62839] transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rush-gray group-focus-within:text-[#E63946] transition-colors" />
                    <input
                      type="password"
                      required
                      className="w-full bg-rush-light border border-rush-border rounded-xl py-3 pl-10 pr-4 text-rush-dark placeholder-rush-gray/50 focus:outline-none focus:border-[#E63946] focus:bg-white transition-all text-sm font-medium"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#E63946] hover:bg-[#D62839] text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-[#E63946]/20 hover:shadow-[#E63946]/40"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center bg-rush-light rounded-xl p-4">
                <p className="text-sm text-rush-gray font-medium">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="text-[#E63946] font-bold hover:underline transition-colors">
                    Create free account
                  </Link>
                </p>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
