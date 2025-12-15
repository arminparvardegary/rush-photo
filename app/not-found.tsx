import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,166,35,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      
      <div className="text-center relative z-10">
        <div className="mb-8">
          <span className="text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-honey to-teal bg-clip-text text-transparent">
            404
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-white/60 mb-8 max-w-md mx-auto">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. 
          Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-honey to-honey/90 text-black font-semibold rounded-full hover:shadow-lg hover:shadow-honey/20 transition-all"
          >
            Go Home
          </Link>
          <Link
            href="/order"
            className="px-6 py-3 bg-white/10 text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all"
          >
            Start a Project
          </Link>
        </div>
      </div>
    </div>
  );
}
