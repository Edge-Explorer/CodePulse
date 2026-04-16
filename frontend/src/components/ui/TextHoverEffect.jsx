import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

/**
 * TextHoverEffect Component
 * Creates a massive SVG text effect that "lights up" gracefully on mouse hover.
 * Based on the premium Aceternity UI design. 🤴🏿✨
 */
export const TextHoverEffect = ({ text, duration }) => {
  const svgRef = useRef(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskSize, setMaskSize] = useState(0);

  useEffect(() => {
    if (svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      setMaskSize(Math.max(svgRect.width, svgRect.height));
    }
  }, []);

  const handleMouseMove = (e) => {
    if (svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      setCursor({
        x: e.clientX - svgRect.left,
        y: e.clientY - svgRect.top,
      });
    }
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="select-none"
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
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
          r="20%"
          animate={
            hovered
              ? {
                  cx: `${(cursor.x / (svgRef.current?.clientWidth || 1)) * 100}%`,
                  cy: `${(cursor.y / (svgRef.current?.clientHeight || 1)) * 100}%`,
                }
              : { cx: "50%", cy: "50%" }
          }
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
            stroke="white"
            strokeWidth="0.3"
            className="font-[Outfit] font-black text-6xl uppercase"
          >
            {text}
          </text>
        </mask>
      </defs>

      {/* Base Dark Text Stroke */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="font-[Outfit] font-black fill-transparent stroke-white/10 text-6xl uppercase"
      >
        {text}
      </text>

      {/* Reveal Overlay - This is what "lights up" */}
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        stroke="url(#textGradient)"
        mask="url(#textMask)"
        className="font-[Outfit] font-black fill-transparent text-6xl uppercase opacity-0"
        animate={{ opacity: hovered ? 1 : 0 }}
      >
        {text}
      </motion.text>

      {/* The Glow Beam */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#revealMask)"
        strokeWidth="0.5"
        fill="transparent"
        className="font-[Outfit] font-black text-6xl uppercase"
      >
        {text}
      </text>
    </svg>
  );
};
