"use client";

import { useState } from "react";

export default function BeforeAfter() {
  const [position, setPosition] = useState(50);

  return (
    <section className="py-24 md:py-32 bg-[#1a1a1a] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, #E54A4A 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />
      
      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-[#E54A4A]/20 text-[#E54A4A] text-sm font-semibold rounded-full mb-4">
            The Rush Difference
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Amateur vs <span className="gradient-text">Professional</span>
          </h2>
          <p className="text-white/50 text-lg">
            See how professional photography transforms your product presentation
          </p>
        </div>

        {/* Before/After Slider */}
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl">
            {/* Before Image (Amateur) */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=90"
                alt="Before - Amateur photo"
                className="w-full h-full object-cover filter grayscale brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
            </div>

            {/* After Image (Professional) */}
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            >
              <img
                src="https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=1200&q=60"
                alt="After - Professional photo"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Slider Handle */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
              style={{ left: `${position}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                <span className="text-[#1a1a1a] text-lg">↔</span>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full">
              <span className="text-white/70 text-sm font-medium">Amateur</span>
            </div>
            <div className="absolute bottom-6 right-6 px-4 py-2 bg-[#E54A4A] rounded-full">
              <span className="text-white text-sm font-semibold">Rush Photo</span>
            </div>

            {/* Invisible range input for interaction */}
            <input
              type="range"
              min="0"
              max="100"
              value={position}
              onChange={(e) => setPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
            />
          </div>

          {/* Drag hint */}
          <p className="text-center text-white/40 text-sm mt-4">
            Drag the slider to compare
          </p>
        </div>
      </div>
    </section>
  );
}
