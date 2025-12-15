"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  rotation: number;
  color: string;
  size: number;
  duration: number;
}

const colors = ["#f5a623", "#2dd4bf", "#a855f7", "#3b82f6", "#ef4444"];

export default function SuccessConfetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const newPieces: ConfettiPiece[] = [];
    for (let i = 0; i < 50; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        duration: Math.random() * 2 + 2,
      });
    }
    setPieces(newPieces);

    // Clean up after animation
    const timeout = setTimeout(() => setPieces([]), 4000);
    return () => clearTimeout(timeout);
  }, []);

  if (pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ 
            y: -20, 
            x: `${piece.x}vw`, 
            opacity: 1,
            rotate: 0,
            scale: 0,
          }}
          animate={{ 
            y: "110vh",
            opacity: [1, 1, 0],
            rotate: piece.rotation * 4,
            scale: [0, 1, 1],
          }}
          transition={{ 
            duration: piece.duration,
            delay: piece.delay,
            ease: "easeOut",
          }}
          className="absolute"
          style={{
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}

