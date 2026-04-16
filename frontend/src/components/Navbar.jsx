import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub } from 'react-icons/fi';
import { cn } from '../utils/cn';
import { NoiseBackground } from './ui/NoiseBackground';

const Navbar = ({ onConnect }) => {
  const navItems = ['Features', 'Architecture', 'Docs'];

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-8 inset-x-0 z-[50] flex justify-center px-4"
    >
      <NoiseBackground
        containerClassName="rounded-full p-[1.5px] shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:shadow-[0_0_50px_rgba(99,102,241,0.4)] transition-shadow duration-700"
        gradientColors={["#6366f1", "#a855f7", "#6366f1"]}
      >
        <div className={cn(
          "relative rounded-full bg-zinc-950/90 backdrop-blur-xl px-1 sm:px-2 py-1.5",
          "flex items-center gap-2 sm:gap-6 min-w-fit"
        )}>
          {/* Subtle Inner Highlight */}
          <div className="absolute inset-x-12 h-px w-2/3 mx-auto -top-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          {/* Links */}
          <div className="flex items-center gap-1 sm:gap-4 pl-3 sm:pl-6">
            {navItems.map((name) => (
              <a
                key={name}
                href={`#${name.toLowerCase()}`}
                className="px-3 py-1.5 text-[13px] font-medium text-zinc-400 hover:text-white transition-all duration-300 rounded-full hover:bg-white/5"
              >
                {name}
              </a>
            ))}
          </div>

          <div className="h-4 w-px bg-zinc-800 mx-1 sm:mx-2" />

          {/* Action Button */}
          <button
            onClick={onConnect}
            className={cn(
            "group relative flex items-center gap-2 px-5 py-2 rounded-full",
            "bg-white text-black text-[12px] font-bold transition-all duration-300",
            "hover:bg-zinc-200 active:scale-[0.96]"
          )}>
            <FiGithub className="w-3.5 h-3.5" />
            <span>Connect</span>
            
            {/* Hover Glow for button */}
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 blur-md transition-opacity" />
          </button>
        </div>
      </NoiseBackground>
    </motion.div>
  );
};

export default Navbar;
