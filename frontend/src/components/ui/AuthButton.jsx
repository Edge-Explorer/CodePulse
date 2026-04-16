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
    <div className={cn("flex justify-center", className)}>
      <NoiseBackground
        containerClassName="w-fit p-[2px] rounded-full mx-auto"
        gradientColors={[
          "rgba(99, 102, 241, 0.5)",
          "rgba(168, 85, 247, 0.5)",
          "rgba(34, 197, 94, 0.5)",
        ]}
      >
        <button
          onClick={onClick}
          className={cn(
            "h-full w-full cursor-pointer rounded-full px-6 py-3",
            "bg-gradient-to-r from-neutral-100 via-neutral-100 to-white dark:from-black dark:via-black dark:to-neutral-900",
            "text-black dark:text-white font-semibold flex items-center gap-3",
            "shadow-[0px_2px_0px_0px_rgba(255,255,255,0.1)_inset,0px_1px_2px_rgba(0,0,0,0.5)]",
            "transition-all duration-100 active:scale-95 hover:brightness-110"
          )}
        >
          <FiGithub size={20} />
          <span>Continue with GitHub</span>
        </button>
      </NoiseBackground>
    </div>
  );
};
