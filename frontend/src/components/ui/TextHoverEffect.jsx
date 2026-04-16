import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

/**
 * TextHoverEffect Component - Panoramic Edition 
 * Widened viewbox (800x200) to support long words like "CODEPULSE" without clipping.
 * Enhanced mouse tracking for smoother light follow. 🤴🏿✨
 */
export const TextHoverEffect = ({ text, duration }) => {
  const svgRef = useRef(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const x = ((e.clientX - svgRect.left) / svgRect.width) * 100;
      const y = ((e.clientY - svgRect.top) / svgRect.height) * 100;
      setCursor({ x, y });
    }
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 600 150" // Widened from 300 to 600
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="select-none overflow-visible"
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="50%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="25%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="75%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#10b981" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="25%"
          animate={{
            cx: hovered ? `${cursor.x}%` : "50%",
            cy: hovered ? `${cursor.y}%` : "50%",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 40 }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="transparent" />
        </motion.radialGradient>

        <mask id="textMask">
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="font-[Outfit] font-black text-8xl uppercase fill-white"
          >
            {text}
          </text>
        </mask>
      </defs>

      {/* Base Gray Text Stroke */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.5"
        className="font-[Outfit] font-black fill-transparent stroke-white/10 text-8xl uppercase pointer-events-none"
      >
        {text}
      </text>

      {/* Reveal Overlay - Glowing Colors */}
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.5"
        stroke="url(#textGradient)"
        mask="url(#textMask)"
        className="font-[Outfit] font-black fill-transparent text-8xl uppercase opacity-0 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
      >
        {text}
      </motion.text>

      {/* The Glow Beam Torch */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#revealMask)"
        strokeWidth="1.5"
        fill="transparent"
        className="font-[Outfit] font-black text-8xl uppercase pointer-events-none"
      >
        {text}
      </text>
    </svg>
  );
};
