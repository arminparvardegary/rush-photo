"use client";

export default function CTA() {
  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E54A4A] via-[#ff7f7f] to-[#ff9966]" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white/20 rounded-full" />
        <div className="absolute bottom-10 right-10 w-48 h-48 border-2 border-white/10 rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full mb-6">
            Ready to start?
          </span>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Let&apos;s make your products look amazing
          </h2>
          
          <p className="text-xl text-white/80 mb-10">
            Join 500+ brands who trust Rush for stunning product photography.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/order"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#E54A4A] font-bold rounded-full hover:shadow-xl transition-all hover:-translate-y-1"
            >
              Start Your Project
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="tel:973-427-9393"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border-2 border-white/30 hover:bg-white/20 transition-all"
            >
              Call 973-427-9393
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
