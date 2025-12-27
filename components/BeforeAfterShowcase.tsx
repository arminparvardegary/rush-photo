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
        <section className="py-32 bg-ink relative overflow-hidden">
            <div className="container relative z-10">
                <div className="text-center mb-16">
                    <span className="text-honey font-bold tracking-widest uppercase text-xs mb-4 block">Retouching Magic</span>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        The <span className="font-serif italic text-white/50">Details</span> Matter
                    </h2>
                    <p className="text-mist max-w-2xl mx-auto">
                        See how our expert retouching elevates your visuals from standard to studio-perfection.
                    </p>
                </div>

                <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                    <div
                        ref={containerRef}
                        className="relative aspect-[16/9] md:aspect-[21/9] cursor-ew-resize select-none overflow-hidden group"
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleMouseDown}
                    >
                        {/* After Image (Background) */}
                        <img
                            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&h=900&fit=crop&q=95"
                            alt="After"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute top-8 right-8 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white font-bold text-sm">
                            Retouched
                        </div>

                        {/* Before Image (Clipped) */}
                        <div
                            className="absolute inset-0 w-full h-full overflow-hidden"
                            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&h=900&fit=crop&q=95&sat=-50&bri=-10" /* Simulated 'Before' using params */
                                alt="Before"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute top-8 left-8 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white font-bold text-sm">
                                Original
                            </div>
                        </div>

                        {/* Slider Handle */}
                        <div
                            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
                            style={{ left: `${sliderPosition}%` }}
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center justify-center text-ink transition-transform group-hover:scale-110">
                                <ChevronsLeftRight className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
