import React from "react";
import { FiGithub } from "react-icons/fi";
import { NoiseBackground } from "./NoiseBackground";
import { cn } from "../../utils/cn";

/**
 * AuthButton Component - Pixel-Perfect Edition 
 * Matches the Aceternity UI Screenshot Exactly: 
 * - Thick Pill Shape (px-12, py-5)
 * - Massive Neon Glow Shadow
 * - Clean GitHub Branding
 */
export const AuthButton = ({ onClick, className }) => {
  return (
    <div className={cn("flex justify-center items-center w-full", className)}>
      <NoiseBackground
        containerClassName="p-[2.5px] rounded-full shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_60px_rgba(168,85,247,0.5)] transition-all duration-500"
        gradientColors={[
          "#6366f1", // Indigo
          "#a855f7", // Purple
          "#ec4899", // Pink (matching your screenshot)
        ]}
      >
        <button
          onClick={onClick}
          className={cn(
            "relative flex items-center justify-center gap-4",
            "px-12 py-5 rounded-full z-20", // Thick Pill
            "bg-zinc-950 text-white font-extrabold text-xl", // Bold Text
            "transition-all duration-300",
            "active:scale-[0.95]"
          )}
        >
          <FiGithub size={26} className="text-white" />
          <span className="tracking-tight">Continue with GitHub</span>
          
          {/* Subtle Inner Glow - Top Beam */}
          <div className="absolute inset-x-10 h-px w-1/2 mx-auto -top-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
          
          {/* Subtle Glass Reflection */}
          <div className="absolute inset-0 rounded-full opacity-5 bg-gradient-to-b from-white to-transparent pointer-events-none" />
        </button>
      </NoiseBackground>
    </div>
  );
};
