"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
}

export function ProgressBar({ progress, className = "" }: ProgressBarProps) {
  return (
    <div className={`h-1 bg-rush-gray/10 overflow-hidden ${className}`}>
      <motion.div
        className="h-full bg-gradient-to-r from-[#E63946] to-[#D62839]"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
}

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function StepProgress({ currentStep, totalSteps, className = "" }: StepProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={`fixed top-0 left-0 right-0 z-[100] ${className}`}>
      <ProgressBar progress={progress} />
    </div>
  );
}
