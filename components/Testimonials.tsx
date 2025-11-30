"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Founder, Luxe Skincare",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    text: "Rush transformed our product photos completely. Sales increased 40% after updating our website with their images. The quality is simply unmatched!",
    rating: 5,
    result: "+40% Sales",
  },
  {
    name: "Mike Johnson",
    role: "CEO, TechGear Co",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    text: "The quality is unmatched. Fast turnaround and the team really understands what makes products look amazing. Our Amazon listings are now performing better than ever.",
    rating: 5,
    result: "2x Conversions",
  },
  {
    name: "Emily Rodriguez",
    role: "Brand Manager, Fit+",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    text: "Best investment we made for our brand. The lifestyle shots especially helped us connect with our audience. Rush understood our vision perfectly.",
    rating: 5,
    result: "+65% Engagement",
  },
  {
    name: "David Kim",
    role: "Founder, Minimal Watch Co",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    text: "We've worked with many photography studios but Rush is on another level. The attention to detail and quick delivery made our product launch seamless.",
    rating: 5,
    result: "Sold Out Launch",
  },
  {
    name: "Jessica Park",
    role: "Marketing Director, BeautyBox",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    text: "The ROI on Rush photos has been incredible. Our social media engagement tripled and we're seeing way more click-throughs on our ads.",
    rating: 5,
    result: "3x Social ROI",
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-white to-[#fff5eb] relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-20 right-20 text-[200px] font-bold text-[#E54A4A]/5 select-none pointer-events-none">
        <Quote className="w-48 h-48" />
      </div>
      
      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-[#E54A4A]/10 text-[#E54A4A] text-sm font-semibold rounded-full mb-4">
            Success Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
            Loved by <span className="gradient-text">500+ brands</span>
          </h2>
          <p className="text-[#1a1a1a]/60">
            See why leading brands trust Rush for their product photography
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E54A4A]/10 to-transparent rounded-full blur-2xl" />
            
            <div className="relative">
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-xl md:text-2xl text-[#1a1a1a] mb-8 leading-relaxed">
                &ldquo;{testimonials[activeIndex].text}&rdquo;
              </p>
              
              {/* Author & Result */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={testimonials[activeIndex].image}
                    alt={testimonials[activeIndex].name}
                    className="w-14 h-14 rounded-full object-cover ring-4 ring-[#E54A4A]/20"
                  />
                  <div>
                    <div className="font-bold text-[#1a1a1a] text-lg">{testimonials[activeIndex].name}</div>
                    <div className="text-[#1a1a1a]/50">{testimonials[activeIndex].role}</div>
                  </div>
                </div>
                
                <div className="px-4 py-2 bg-gradient-to-r from-[#E54A4A]/10 to-[#ff9966]/10 rounded-full">
                  <span className="text-[#E54A4A] font-bold">{testimonials[activeIndex].result}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={goToPrev}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-[#E54A4A] hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setActiveIndex(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeIndex === index 
                      ? 'bg-[#E54A4A] w-8' 
                      : 'bg-[#1a1a1a]/20 hover:bg-[#1a1a1a]/40'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={goToNext}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-[#E54A4A] hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mini testimonials */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={index}
              className={`bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-[#E54A4A]/5 cursor-pointer ${
                activeIndex === index ? 'ring-2 ring-[#E54A4A]' : ''
              }`}
              onClick={() => {
                setIsAutoPlaying(false);
                setActiveIndex(index);
              }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-[#1a1a1a]/70 text-sm mb-4 line-clamp-3">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-[#1a1a1a] text-sm">{testimonial.name}</div>
                  <div className="text-xs text-[#1a1a1a]/50">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
