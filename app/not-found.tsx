import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFAF5] via-[#fff5eb] to-[#ffe8d6] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <span className="text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] bg-clip-text text-transparent">
            404
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-4">
          Page Not Found
        </h1>
        <p className="text-[#1a1a1a]/60 mb-8 max-w-md mx-auto">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. 
          Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white font-semibold rounded-full hover:shadow-lg transition-all"
          >
            Go Home
          </Link>
          <Link
            href="/order"
            className="px-6 py-3 bg-white text-[#1a1a1a] font-semibold rounded-full border-2 border-[#1a1a1a]/10 hover:border-[#E54A4A] hover:text-[#E54A4A] transition-all"
          >
            Start a Project
          </Link>
        </div>
      </div>
    </div>
  );
}

