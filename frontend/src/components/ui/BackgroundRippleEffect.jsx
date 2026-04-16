import React, { useState, useCallback } from "react";
import { cn } from "../../utils/cn";

const ROWS = 20;
const COLS = 40;
const TOTAL = ROWS * COLS;

/**
 * BackgroundRippleEffect Component - Spread Edition
 * Click any cell to trigger a wave that ripples outward to all neighbors.
 * Distance from origin determines animation delay for a real spreading effect.
 */
export const BackgroundRippleEffect = ({ className }) => {
  const [rippling, setRippling] = useState({});

  const handleCellClick = useCallback((index) => {
    const originRow = Math.floor(index / COLS);
    const originCol = index % COLS;

    const newRippling = {};

    for (let i = 0; i < TOTAL; i++) {
      const row = Math.floor(i / COLS);
      const col = i % COLS;

      // Calculate Manhattan distance from origin cell
      const distance = Math.abs(row - originRow) + Math.abs(col - originCol);

      // Only spread up to a radius of 12 cells
      if (distance <= 12) {
        newRippling[i] = distance;
      }
    }

    setRippling(newRippling);

    // Clear after the longest animation completes
    setTimeout(() => setRippling({}), 2000);
  }, []);

  return (
    <div
      className={cn(
        "absolute inset-0 z-0 overflow-hidden pointer-events-auto",
        className
      )}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
      }}
    >
      {Array.from({ length: TOTAL }).map((_, i) => {
        const distance = rippling[i];
        const isRippling = distance !== undefined;

        // Intensity fades with distance: closest cells glow brighter
        const intensity = isRippling
          ? Math.max(0.01, 0.15 - distance * 0.012)
          : 0;

        const delay = isRippling ? `${distance * 50}ms` : "0ms";

        return (
          <div
            key={i}
            onClick={() => handleCellClick(i)}
            className="cursor-pointer transition-all duration-500"
            style={{
              border: "0.5px solid rgba(255,255,255,0.04)",
              backgroundColor: isRippling
                ? `rgba(99, 102, 241, ${intensity})`
                : "transparent",
              boxShadow: isRippling && distance <= 2
                ? `0 0 12px rgba(99, 102, 241, 0.4)`
                : "none",
              transitionDelay: delay,
            }}
          />
        );
      })}
    </div>
  );
};
