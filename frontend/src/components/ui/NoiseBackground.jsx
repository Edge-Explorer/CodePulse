import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const NoiseBackground = ({
  children,
  className,
  containerClassName,
  gradientColors = ["rgb(99, 102, 241)", "rgb(168, 85, 247)", "rgb(236, 72, 153)"],
}) => {
  return (
    <div className={cn("relative group p-[2px] rounded-full overflow-hidden", containerClassName)}>
      
      {/* Flowing Light Layer (Rotating Gradient) */}
      <motion.div 
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-[-100%] z-0"
        style={{
          background: `conic-gradient(from 0deg, transparent, ${gradientColors[0]}, ${gradientColors[1]}, ${gradientColors[2]}, transparent)`,
        }}
      />

      {/* Thicker Outer Glow */}
      <div 
        className="absolute -inset-1 z-0 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition duration-500"
        style={{
          background: `linear-gradient(45deg, ${gradientColors.join(', ')})`,
        }}
      />
      
      <div className={cn(
        "relative z-10 overflow-hidden rounded-full bg-black/90 backdrop-blur-md border border-white/5",
        className
      )}>
        {/* The Noise Overlay */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.6] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Inner Subtle Glow */}
        <div 
          className="absolute inset-0 z-1 opacity-20"
          style={{
            background: `radial-gradient(circle at center, ${gradientColors[0]}, transparent 70%)`,
          }}
        />

        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};
