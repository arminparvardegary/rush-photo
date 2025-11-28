"use client";

import { useState } from "react";

const styles = [
  {
    id: 1,
    name: "Top Down",
    tagline: "Perfect flat-lays",
    description: "Bird's-eye view shots perfect for flat-lay compositions and showcasing product design from above.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    color: "#E54A4A",
  },
  {
    id: 2,
    name: "Product",
    tagline: "Clean & crisp",
    description: "Clean, professional studio shots with perfect lighting that highlight every detail.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    color: "#ff7f7f",
  },
  {
    id: 3,
    name: "Diagonal",
    tagline: "Dynamic angles",
    description: "Dynamic angled perspectives that add depth and visual interest to your products.",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
    color: "#ff9966",
  },
  {
    id: 4,
    name: "Lifestyle",
    tagline: "In context",
    description: "In-context shots showing your product in real-world scenarios that connect with customers.",
    image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80",
    color: "#E54A4A",
  },
];

export default function PhotoStyles() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="work" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#fff5eb] to-transparent" />
      
      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-[#E54A4A]/10 text-[#E54A4A] text-sm font-semibold rounded-full mb-4">
            Our Styles
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
            Four ways to <span className="gradient-text">shine</span>
          </h2>
          <p className="text-[#1a1a1a]/60 text-lg">
            Each style crafted to perfection. Choose your favorite or get all four!
          </p>
        </div>

        {/* Styles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {styles.map((style, index) => (
            <div
              key={style.id}
              onClick={() => setActiveIndex(index)}
              className={`group cursor-pointer rounded-3xl overflow-hidden transition-all duration-500 ${
                activeIndex === index 
                  ? 'ring-4 ring-[#E54A4A] shadow-2xl shadow-[#E54A4A]/20 scale-[1.02]' 
                  : 'hover:shadow-xl hover:scale-[1.01]'
              }`}
            >
              {/* Image */}
              <div className="aspect-[4/5] relative overflow-hidden">
                <img
                  src={style.image}
                  alt={style.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-2"
                    style={{ backgroundColor: style.color }}
                  >
                    {style.tagline}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">{style.name}</h3>
                  <p className="text-white/80 text-sm line-clamp-2">{style.description}</p>
                </div>
                
                {/* Number */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-white font-bold">0{style.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/order"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1a1a1a] text-white font-semibold rounded-full hover:bg-[#E54A4A] transition-colors"
          >
            Get All 4 Styles
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
