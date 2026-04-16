import React, { useState } from "react";
import { cn } from "../../utils/cn";

/**
 * BackgroundRippleEffect Component
 * Generates an interactive grid of translucent boxes. 
 * Triggers a ripple animation on mouse hover. 👸🏿✨
 */
export const BackgroundRippleEffect = ({ className }) => {
  // Generate a 40x20 grid of boxes (enough to fill a modern screen)
  const rows = new Array(20).fill(1);
  const cols = new Array(40).fill(1);

  return (
    <div
      className={cn(
        "absolute inset-0 z-0 grid grid-cols-[repeat(40,minmax(0,1fr))] grid-rows-[repeat(20,minmax(0,1fr))] p-4 opacity-[0.15] pointer-events-auto",
        className
      )}
    >
      {rows.map((_, i) => (
        <React.Fragment key={`row-${i}`}>
          {cols.map((_, j) => (
            <div
              key={`col-${j}`}
              className={cn(
                "h-20 border-[0.5px] border-white/5",
                "hover:bg-indigo-500/20 hover:ripple-effect transition-all duration-300"
              )}
            ></div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};
