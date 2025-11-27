"use client";

const brands = [
  "Nike", "Apple", "Samsung", "Adidas", "Sony", "Puma", "Canon", "LG", 
  "Bose", "Dyson", "Beats", "GoPro", "Fitbit", "JBL", "Philips", "Logitech"
];

export default function Marquee() {
  return (
    <section className="py-12 bg-[#1a1a1a] overflow-hidden">
      <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
        {[...brands, ...brands].map((brand, index) => (
          <div key={index} className="flex items-center gap-8">
            <span className="text-white/30 text-lg font-semibold uppercase tracking-widest">
              {brand}
            </span>
            <span className="text-[#E54A4A]">✦</span>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}

