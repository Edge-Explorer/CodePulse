import React from "react";
import { FiGithub } from "react-icons/fi";
import { NoiseBackground } from "./NoiseBackground";
import { cn } from "../../utils/cn";

/**
 * AuthButton Component
 * Premium button using NoiseBackground and stylized shadows.
 * Acts as the primary GitHub OAuth entry point.
 */
export const AuthButton = ({ onClick, className }) => {
  return (
    <div className={cn("flex justify-center items-center w-full", className)}>
      <NoiseBackground
        containerClassName="p-[1px] rounded-full"
        gradientColors={[
          "rgba(99, 102, 241, 0.6)",
          "rgba(168, 85, 247, 0.6)",
          "rgba(34, 197, 94, 0.6)",
        ]}
      >
        <button
          onClick={onClick}
          className={cn(
            "relative flex items-center justify-center gap-3",
            "px-8 py-3.5 rounded-full z-20",
            "bg-zinc-950 text-white font-bold",
            "border border-white/5",
            "hover:bg-zinc-900 transition-all duration-300",
            "shadow-[0_0_20px_rgba(99,102,241,0.2)]",
            "active:scale-[0.98]"
          )}
        >
          <FiGithub size={20} className="text-indigo-400" />
          <span className="tracking-wide">Continue with GitHub</span>
          
          {/* Subtle Inner Glow */}
          <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-2xl bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </button>
      </NoiseBackground>
    </div>
  );
};
