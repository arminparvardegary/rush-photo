"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

export default function VideoTestimonial() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <section className="relative h-[80vh] min-h-[600px] w-full bg-ink overflow-hidden group">
            {/* Video Background */}
            <div className="absolute inset-0">
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover opacity-60"
                    loop
                    muted
                    playsInline
                    poster="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1600&h=900&fit=crop&q=90"
                >
                    {/* Placeholder video URL */}
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-photographer-taking-photos-of-a-model-344-large.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 container flex flex-col items-center justify-center text-center z-10 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center mx-auto mb-8 cursor-pointer hover:bg-white/10 hover:scale-110 transition-all backdrop-blur-md" onClick={togglePlay}>
                        {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white ml-1" />}
                    </div>

                    <h2 className="text-4xl md:text-6xl font-serif italic text-white mb-6 leading-tight">
                        "They didn't just take photos.<br />
                        They built our brand visual identity."
                    </h2>

                    <div className="flex items-center justify-center gap-4">
                        <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=90"
                            alt="Founder"
                            className="w-12 h-12 rounded-full border-2 border-white/20"
                        />
                        <div className="text-left">
                            <p className="text-white font-bold text-lg">Marcus Thorne</p>
                            <p className="text-mist text-sm">Founder, Thorne & Co.</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-8 right-8 flex gap-4 z-20">
                <button
                    onClick={toggleMute}
                    className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-colors"
                >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
            </div>
        </section>
    );
}
