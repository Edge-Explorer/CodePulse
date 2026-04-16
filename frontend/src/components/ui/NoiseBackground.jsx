import React from "react";
import { cn } from "../../utils/cn";

/**
 * NoiseBackground Component - Pro Edition
 * Creates an animated luminous border and a high-grain noise overlay. 
 * Essential for the "Aceternity UI" aesthetic. 🤴🏿✨
 */
export const NoiseBackground = ({
  children,
  className,
  containerClassName,
  gradientColors = [
    "#6366f1",
    "#a855f7", 
    "#ec4899"
  ],
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden h-fit transition-all duration-300",
        containerClassName
      )}
    >
      {/* Moving Animated Gradient Rim */}
      <div
        className="absolute inset-[-200%] z-0 animate-[spin_8s_linear_infinite]"
        style={{
          background: `conic-gradient(from 0deg, transparent, ${gradientColors.join(", ")}, transparent)`,
          maskImage: "radial-gradient(circle at center, transparent 72%, black 72.5%)",
          WebkitMaskImage: "radial-gradient(circle at center, transparent 72%, black 72.5%)"
        }}
      ></div>

      {/* Noise Texture Layer */}
      <div
        className="absolute inset-0 z-1 opacity-[0.08] pointer-events-none grayscale"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className={cn("relative z-10 w-full h-full", className)}>{children}</div>
    </div>
  );
};
