"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const STATS = [
    { label: "Products Photographed", value: 15400, suffix: "+" },
    { label: "Happy Brands", value: 500, suffix: "+" },
    { label: "Return on Ad Spend", value: 320, suffix: "%" },
];

const BRANDS = [
    "Sony", "Samsung", "Adidas", "Nike", "Dyson", "Apple", "Canon", "Bose",
    "Peloton", "Fitbit", "Logitech", "Razer", "Asus", "Dell"
];

const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView && ref.current) {
            let start = 0;
            const end = value;
            const duration = 2000;
            const startTime = performance.now();

            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function (easeOutExpo)
                const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

                const current = Math.floor(start + (end - start) * ease);

                if (ref.current) {
                    ref.current.innerText = current.toLocaleString();
                }

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        }
    }, [isInView, value]);

    return (
        <span className="flex items-baseline">
            <span ref={ref} className="text-4xl md:text-6xl font-bold text-white tracking-tighter">0</span>
            <span className="text-2xl md:text-3xl font-bold text-honey">{suffix}</span>
        </span>
    );
};

export default function SocialProof() {
    return (
        <section className="py-24 bg-ink border-y border-white/5 overflow-hidden">
            <div className="container mb-20">
                <div className="grid md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
                    {STATS.map((stat, i) => (
                        <div key={i} className="pt-8 md:pt-0 px-4">
                            <Counter value={stat.value} suffix={stat.suffix} />
                            <p className="text-mist mt-2 font-medium tracking-wide uppercase text-xs">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Marquee */}
            <div className="relative flex overflow-hidden group">
                <div className="flex animate-marquee gap-16 px-8 min-w-max group-hover:[animation-play-state:paused]">
                    {[...BRANDS, ...BRANDS].map((brand, i) => (
                        <span
                            key={i}
                            className="text-4xl md:text-6xl font-serif italic text-white/5 hover:text-white/20 transition-colors cursor-default"
                        >
                            {brand}
                        </span>
                    ))}
                </div>
                <div className="absolute flex animate-marquee2 gap-16 px-8 min-w-max group-hover:[animation-play-state:paused] aria-hidden:true">
                    {[...BRANDS, ...BRANDS].map((brand, i) => (
                        <span
                            key={i}
                            className="text-4xl md:text-6xl font-serif italic text-white/5 hover:text-white/20 transition-colors cursor-default"
                        >
                            {brand}
                        </span>
                    ))}
                </div>

                {/* Gradients */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-ink to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-ink to-transparent z-10" />
            </div>
        </section>
    );
}
