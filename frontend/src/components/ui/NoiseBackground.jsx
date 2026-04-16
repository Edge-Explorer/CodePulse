import React from "react";
import { cn } from "../../utils/cn";

/**
 * NoiseBackground Component
 * Creates a pixelated noise texture overlay on top of dynamic gradients.
 * Essential for the "Aceternity UI" aesthetic.
 */
export const NoiseBackground = ({
  children,
  className,
  containerClassName,
  gradientColors = [
    "rgb(99, 102, 241)",
    "rgb(168, 85, 247)",
    "rgb(34, 197, 94)",
  ],
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden bg-transparent",
        containerClassName
      )}
    >
      {/* Noise Texture Overlay */}
      <div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Dynamic Gradient Blobs */}
      <div
        className="absolute inset-0 z-1 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${gradientColors.join(", ")})`,
          filter: "blur(40px)",
          opacity: 0.3,
        }}
      ></div>

      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
