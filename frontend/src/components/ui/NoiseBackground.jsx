import React from 'react';
import { cn } from '../../utils/cn';

export const NoiseBackground = ({
  children,
  className,
  containerClassName,
  gradientColors = ["rgb(255, 100, 150)", "rgb(100, 150, 255)", "rgb(255, 200, 100)"],
  noiseOpacity = 0.05,
}) => {
  return (
    <div className={cn("relative group", containerClassName)}>
      {/* Animated Gradient Border/Background */}
      <div 
        className="absolute -inset-[1px] rounded-full blur-[2px] opacity-20 group-hover:opacity-40 transition duration-500"
        style={{
          background: `linear-gradient(45deg, ${gradientColors.join(', ')})`,
        }}
      />
      
      <div className={cn(
        "relative overflow-hidden rounded-full p-[2px] bg-black/50 backdrop-blur-sm border border-white/10",
        className
      )}>
        {/* The Noise Overlay */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.4]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            filter: 'contrast(150%) brightness(100%)',
          }}
        />

        {/* Gradient Layer */}
        <div 
          className="absolute inset-0 z-1 opacity-30 mix-blend-screen"
          style={{
            background: `radial-gradient(circle at center, ${gradientColors[0]}, ${gradientColors[1]}, transparent)`,
          }}
        />

        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};
