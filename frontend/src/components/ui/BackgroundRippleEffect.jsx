import React, { useRef, useCallback, useEffect } from "react";
import { cn } from "../../utils/cn";

const ROWS = 10;
const COLS = 30;

/**
 * BackgroundRippleEffect Component - CSS Animation Edition
 * Uses a GLOBAL window click listener so the ripple fires everywhere,
 * regardless of what element is on top. No z-index battles needed.
 */
export const BackgroundRippleEffect = ({ className }) => {
  const gridRef = useRef(null);

  const triggerRipple = useCallback((e) => {
    const grid = gridRef.current;
    if (!grid) return;

    const rect = grid.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Calculate which cell was clicked
    const cellWidth = rect.width / COLS;
    const cellHeight = rect.height / ROWS;
    const originCol = Math.floor(clickX / cellWidth);
    const originRow = Math.floor(clickY / cellHeight);

    const cells = grid.children;

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      const row = Math.floor(i / COLS);
      const col = i % COLS;

      // Euclidean distance for a smoother circular spread
      const distance = Math.sqrt(
        Math.pow(row - originRow, 2) + Math.pow(col - originCol, 2)
      );

      if (distance <= 15) {
        const delay = distance * 60; // 60ms per unit of distance
        const duration = 400 + distance * 20;

        // Remove animation class, force reflow, re-add
        cell.classList.remove("ripple-active");
        cell.style.setProperty("--delay", `${delay}ms`);
        cell.style.setProperty("--duration", `${duration}ms`);

        // Force reflow before re-adding class
        void cell.offsetWidth;
        cell.classList.add("ripple-active");
      }
    }
  }, []);

  // Listen on the WINDOW so clicks on ANY element trigger the ripple
  useEffect(() => {
    window.addEventListener("click", triggerRipple);
    return () => window.removeEventListener("click", triggerRipple);
  }, [triggerRipple]);

  return (
    <div
      ref={gridRef}
      className={cn(
        "absolute inset-0 z-0 overflow-hidden pointer-events-none",
        className
      )}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
      }}
    >
      {Array.from({ length: ROWS * COLS }).map((_, i) => (
        <div
          key={i}
          className="ripple-cell"
          style={{
            border: "0.5px solid rgba(255,255,255,0.04)",
            backgroundColor: "transparent",
          }}
        />
      ))}
    </div>
  );
};
