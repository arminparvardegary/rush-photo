"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, Lock, User, Loader2 } from "lucide-react";
import { useModal } from "@/hooks/useModal";

const PORTFOLIO_IMAGES = [
  "/images/portfolio/pink-bottle.jpg",
  "/images/portfolio/serum-bottle.jpg",
  "/images/portfolio/black-sprayer.jpg",
  "/images/portfolio/speakers.jpg",
  "/images/portfolio/flowers-table.jpg",
  "/images/portfolio/sneaker.jpg",
];

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/admin";
  const { showModal, ModalComponent } = useModal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % PORTFOLIO_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Client-side validation
    if (!form.name.trim()) {
      showModal({
        title: "Name Required",
        message: "Please enter your name to create an account.",
        type: "warning",
      });
      setLoading(false);
      return;
    }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      showModal({
        title: "Invalid Email",
        message: "Please enter a valid email address.",
        type: "warning",
      });
      setLoading(false);
      return;
    }
    if (form.password.length < 8) {
      showModal({
        title: "Password Too Short",
        message: "Your password must be at least 8 characters long for security.",
        type: "warning",
      });
      setLoading(false);
      return;
    }

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
        callbackUrl: redirectUrl,
        email: form.email,
        password: form.password,
      });

    } catch (err: any) {
      showModal({
        title: "Signup Failed",
        message: err.message || "Something went wrong. Please try again.",
        type: "error",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <ModalComponent />
      <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side: Product Photography Showcase */}
      <div className="relative lg:w-1/2 3xl:w-[45%] h-64 lg:h-screen overflow-hidden bg-gray-900">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={PORTFOLIO_IMAGES[currentImageIndex]}
            alt="Product Photography"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60" />

        {/* Logo and Text Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12 text-white z-10">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="relative w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <img
                src="/rushlogo.PNG"
                alt="Rush"
                className="w-10 h-10 object-contain"
              />
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight">photos</span>
          </Link>
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black leading-tight mb-4">
            Professional Product Photography
          </h1>
          <p className="text-base lg:text-lg text-white/90 max-w-lg font-medium">
            Join hundreds of brands creating stunning product imagery.
          </p>

          {/* Image indicators */}
          <div className="flex gap-2 mt-8">
            {PORTFOLIO_IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-1 rounded-full transition-all ${
                  index === currentImageIndex ? "w-8 bg-white" : "w-1 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Signup Form */}
      <div className="flex-1 lg:w-1/2 3xl:w-[55%] flex items-center justify-center p-6 lg:p-12 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md 3xl:max-w-lg"
        >
          <div className="mb-8">
            <h2 className="text-3xl lg:text-4xl font-black text-rush-dark mb-3">Join Rush</h2>
            <p className="text-rush-gray text-base font-medium">Start your journey with premium photography</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[#E63946]/10 border border-[#E63946]/20 text-[#E63946] text-sm font-bold text-center">
              {error}
            </div>
          )}

          <button
            onClick={() => signIn("google", { callbackUrl: redirectUrl })}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-rush-dark font-bold py-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all mb-6 group shadow-sm"
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
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase font-bold tracking-wider">
              <span className="bg-white px-3 text-rush-gray">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-rush-dark">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rush-gray group-focus-within:text-[#E63946] transition-colors" />
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-4 pl-12 pr-4 text-rush-dark placeholder-rush-gray/50 focus:outline-none focus:border-[#E63946] focus:bg-white transition-all font-medium"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-rush-dark">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rush-gray group-focus-within:text-[#E63946] transition-colors" />
                <input
                  type="email"
                  required
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-4 pl-12 pr-4 text-rush-dark placeholder-rush-gray/50 focus:outline-none focus:border-[#E63946] focus:bg-white transition-all font-medium"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-rush-dark">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rush-gray group-focus-within:text-[#E63946] transition-colors" />
                <input
                  type="password"
                  required
                  minLength={8}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-4 pl-12 pr-4 text-rush-dark placeholder-rush-gray/50 focus:outline-none focus:border-[#E63946] focus:bg-white transition-all font-medium"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <p className="text-xs text-rush-gray font-medium">Must be at least 8 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E63946] hover:bg-[#D62839] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-[#E63946]/25 hover:shadow-xl hover:shadow-[#E63946]/30"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-rush-gray font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-[#E63946] font-bold hover:text-[#D62839] transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
    </>
  );
}
