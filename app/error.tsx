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
    <div className="min-h-screen bg-gradient-to-br from-[#FFFAF5] via-[#fff5eb] to-[#ffe8d6] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f] rounded-2xl flex items-center justify-center">
          <span className="text-white text-4xl font-bold">!</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-4">
          Something went wrong
        </h1>
        <p className="text-[#1a1a1a]/60 mb-8 max-w-md mx-auto">
          We apologize for the inconvenience. Please try again or contact us if the problem persists.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white font-semibold rounded-full hover:shadow-lg transition-all"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-white text-[#1a1a1a] font-semibold rounded-full border-2 border-[#1a1a1a]/10 hover:border-[#E54A4A] hover:text-[#E54A4A] transition-all"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}

