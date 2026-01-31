"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronsLeftRight } from "lucide-react";

export default function BeforeAfterShowcase() {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (event: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        if (!containerRef.current) return;

        const { left, width } = containerRef.current.getBoundingClientRect();
        const clientX = 'touches' in event ? event.touches[0].clientX : (event as MouseEvent).clientX;
        const position = ((clientX - left) / width) * 100;

        setSliderPosition(Math.min(Math.max(position, 0), 100));
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    useEffect(() => {
        const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
            if (isDragging) handleMove(e);
        };

        const handleGlobalUp = () => setIsDragging(false);

        window.addEventListener("mousemove", handleGlobalMove);
        window.addEventListener("mouseup", handleGlobalUp);
        window.addEventListener("touchmove", handleGlobalMove);
        window.addEventListener("touchend", handleGlobalUp);

        return () => {
            window.removeEventListener("mousemove", handleGlobalMove);
            window.removeEventListener("mouseup", handleGlobalUp);
            window.removeEventListener("touchmove", handleGlobalMove);
            window.removeEventListener("touchend", handleGlobalUp);
        };
    }, [isDragging]);

    return (
        <section className="py-32 bg-white relative overflow-hidden">
            <div className="container relative z-10">
                <div className="text-center mb-16">
                    <span className="text-[#E63946] font-bold tracking-widest uppercase text-xs mb-4 block">Retouching Magic</span>
                    <h2 className="text-4xl md:text-6xl font-bold text-rush-dark mb-6">
                        The <span className="font-serif italic text-rush-gray">Details</span> Matter
                    </h2>
                    <p className="text-rush-gray max-w-2xl mx-auto">
                        See how our expert retouching transforms raw photos into studio-perfect images.
                    </p>
                </div>

                <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden border-2 border-gray-200 shadow-2xl">
                    <div
                        ref={containerRef}
                        className="relative aspect-[16/9] md:aspect-[21/9] cursor-ew-resize select-none overflow-hidden group bg-gray-100"
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleMouseDown}
                    >
                        {/* After Image (Background) - Retouched */}
                        <img
                            src="/images/portfolio/sneaker.jpg"
                            alt="After - Retouched"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute top-8 right-8 bg-[#E63946]/90 backdrop-blur-md px-4 py-2 rounded-full text-white font-bold text-sm shadow-lg">
                            After Retouch
                        </div>

                        {/* Before Image (Clipped) - Raw with realistic imperfections */}
                        <div
                            className="absolute inset-0 w-full h-full overflow-hidden"
                            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                        >
                            <img
                                src="/images/portfolio/sneaker.jpg"
                                alt="Before - Original"
                                className="absolute inset-0 w-full h-full object-cover brightness-90 contrast-95 saturate-75"
                                style={{ filter: 'brightness(0.9) contrast(0.95) saturate(0.75) blur(0.3px)' }}
                            />
                            <div className="absolute top-8 left-8 bg-gray-900/80 backdrop-blur-md px-4 py-2 rounded-full text-white font-bold text-sm shadow-lg">
                                Before Retouch
                            </div>
                        </div>

                        {/* Slider Handle */}
                        <div
                            className="absolute top-0 bottom-0 w-1 bg-[#E63946] cursor-ew-resize shadow-lg"
                            style={{ left: `${sliderPosition}%` }}
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white border-4 border-[#E63946] rounded-full shadow-xl flex items-center justify-center text-[#E63946] transition-transform group-hover:scale-110">
                                <ChevronsLeftRight className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
