import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * TextHoverEffect Component
 * SVG text that reveals a rainbow gradient stroke when the mouse hovers near it.
 * The glow follows the cursor using a radialGradient mapped to SVG coordinates.
 */
export const TextHoverEffect = ({ text }) => {
  const svgRef = useRef(null);
  const [cursor, setCursor] = useState({ x: 300, y: 75 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();

    // Map screen coordinates to SVG viewBox coordinates (0-600 x, 0-150 y)
    const svgX = ((e.clientX - rect.left) / rect.width) * 600;
    const svgY = ((e.clientY - rect.top) / rect.height) * 150;
    setCursor({ x: svgX, y: svgY });
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 600 150"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="select-none"
    >
      <defs>
        {/* Rainbow gradient for the colorful stroke reveal */}
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="25%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="75%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>

        {/* Radial mask that follows the cursor — mapped to SVG userSpace coordinates */}
        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="120"
          animate={{
            cx: cursor.x,
            cy: cursor.y,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 50 }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>

        <mask id="cursorMask">
          <rect x="0" y="0" width="600" height="150" fill="url(#revealMask)" />
        </mask>
      </defs>

      {/* Layer 1: Dim base outline — always visible */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.4"
        className="font-[Outfit] font-black fill-transparent text-7xl uppercase"
        stroke="rgba(255,255,255,0.08)"
      >
        {text}
      </text>

      {/* Layer 2: Colorful stroke — only visible inside the cursor mask radius */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="1"
        stroke="url(#textGradient)"
        fill="transparent"
        mask="url(#cursorMask)"
        className="font-[Outfit] font-black text-7xl uppercase"
      >
        {text}
      </text>
    </svg>
  );
};
