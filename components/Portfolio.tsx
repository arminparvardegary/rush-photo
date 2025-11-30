"use client";

import { useState } from "react";

const categories = ["All", "Top Down", "Product", "Diagonal", "Lifestyle"];

const images = [
  // Top Down - Professional flat-lay shots
  { src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80", category: "Top Down", alt: "Makeup flat lay" },
  { src: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80", category: "Top Down", alt: "Skincare flat lay" },
  { src: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80", category: "Top Down", alt: "Perfume flat lay" },
  // Product - Clean studio shots
  { src: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80", category: "Product", alt: "Headphones studio" },
  { src: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&q=80", category: "Product", alt: "Cosmetics studio" },
  { src: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", category: "Product", alt: "Bag studio" },
  // Diagonal - Dynamic angles
  { src: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80", category: "Diagonal", alt: "Sunglasses angle" },
  { src: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80", category: "Diagonal", alt: "Camera angle" },
  { src: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600&q=80", category: "Diagonal", alt: "Perfume bottle" },
  // Lifestyle - In-context shots
  { src: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80", category: "Lifestyle", alt: "Shoes lifestyle" },
  { src: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=600&q=80", category: "Lifestyle", alt: "Backpack lifestyle" },
  { src: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80", category: "Lifestyle", alt: "Sneakers lifestyle" },
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const filteredImages = activeCategory === "All" 
    ? images 
    : images.filter(img => img.category === activeCategory);

  return (
    <section className="py-24 md:py-32 bg-[#1a1a1a] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, #E54A4A 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />
      
      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-4 py-2 bg-[#E54A4A]/20 text-[#E54A4A] text-sm font-semibold rounded-full mb-4">
            Our Work
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Portfolio <span className="gradient-text">showcase</span>
          </h2>
          <p className="text-white/50 text-lg">
            Browse our recent work and see the quality you can expect
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-[#E54A4A] text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ${
                hoveredIndex === index ? 'scale-[1.02] z-10' : ''
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  hoveredIndex === index ? 'scale-110' : ''
                }`}
              />
              
              {/* Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t from-[#E54A4A] to-transparent transition-opacity duration-300 ${
                hoveredIndex === index ? 'opacity-80' : 'opacity-0'
              }`} />
              
              {/* Category label */}
              <div className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${
                hoveredIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                  {image.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/order"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white font-semibold rounded-full hover:shadow-xl hover:shadow-[#E54A4A]/30 transition-all hover:-translate-y-1"
          >
            Get Photos Like These
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

