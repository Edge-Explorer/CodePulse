import React from "react";
import { FiGithub } from "react-icons/fi";
import { NoiseBackground } from "./NoiseBackground";
import { cn } from "../../utils/cn";

export const AuthButton = ({ onClick, className }) => {
  return (
    <div className={cn("flex justify-center items-center w-full", className)}>
      <NoiseBackground
        containerClassName="w-fit p-1.5 rounded-full mx-auto"
        gradientColors={[
          "rgb(99, 102, 241)", // Indigo
          "rgb(168, 85, 247)", // Purple
          "rgb(236, 72, 153)", // Pink
        ]}
      >
        <button
          onClick={onClick}
          className={cn(
            "group relative flex items-center justify-center gap-3",
            "h-full w-full cursor-pointer rounded-full px-12 py-5",
            "transition-all duration-100 active:scale-95",
            // Premium Black Aesthetic
            "bg-zinc-950 text-white shadow-[0px_1px_0px_0px_var(--color-neutral-800)_inset]",
            "hover:bg-black transition-colors"
          )}
        >
          <FiGithub size={22} className="text-white opacity-80 group-hover:opacity-100 transition-opacity" />
          <span className="font-extrabold tracking-tight text-xl uppercase italic">Continue with GitHub</span>
          <span className="ml-1 text-indigo-400 group-hover:translate-x-1 group-hover:opacity-100 transition-all font-bold text-2xl">
            &rarr;
          </span>

          {/* Top Beam Polish */}
          <div className="absolute inset-x-12 h-px -top-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
        </button>
      </NoiseBackground>
    </div>
  );
};
