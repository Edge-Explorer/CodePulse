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
            "h-full w-full cursor-pointer rounded-full px-10 py-4",
            "transition-all duration-100 active:scale-95",
            // The "Start publishing" aesthetic
            "bg-gradient-to-r from-neutral-100 via-neutral-100 to-white text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)]",
            "dark:from-black dark:via-black dark:to-neutral-900 dark:text-white dark:shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)]"
          )}
        >
          <FiGithub size={20} className="text-current opacity-70 group-hover:opacity-100 transition-opacity" />
          <span className="font-bold tracking-tight text-lg">Continue with GitHub</span>
          <span className="ml-1 opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition-all">
            &rarr;
          </span>
        </button>
      </NoiseBackground>
    </div>
  );
};
