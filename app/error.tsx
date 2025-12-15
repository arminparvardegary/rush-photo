"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service in production
    if (process.env.NODE_ENV === "production") {
      // Could integrate with Sentry, LogRocket, etc.
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      
      <div className="text-center relative z-10">
        <div className="w-20 h-20 mx-auto mb-8 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center">
          <span className="text-red-400 text-4xl font-bold">!</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Something went wrong
        </h1>
        <p className="text-white/60 mb-8 max-w-md mx-auto">
          We apologize for the inconvenience. Please try again or contact us if the problem persists.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-gradient-to-r from-honey to-honey/90 text-black font-semibold rounded-full hover:shadow-lg hover:shadow-honey/20 transition-all"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-white/10 text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
