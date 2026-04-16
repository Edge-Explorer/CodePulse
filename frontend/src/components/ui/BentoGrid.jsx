import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { cn } from "../../utils/cn";
import { Button } from "./Button";

const BentoGrid = ({ children, className }) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-6",
        className
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}) => (
  <Link
    to={href}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-3xl",
      "bg-black border border-white/10",
      "transform-gpu transition-all duration-500",
      "hover:border-indigo-500/50 hover:shadow-[0_0_40px_rgba(99,102,241,0.15)] hover:scale-[1.01]",
      className
    )}
  >
    <div className="absolute inset-0 z-0 opacity-40">{background}</div>
    
    <div className="relative z-10 p-8 flex flex-col justify-between h-full bg-gradient-to-t from-black via-black/40 to-transparent">
        <div className="pointer-events-none flex transform-gpu flex-col gap-2 transition-all duration-300 group-hover:-translate-y-6">
            <h3 className="text-2xl font-bold tracking-tight text-white/90 group-hover:text-white">
                {name}
            </h3>
            <p className="max-w-xs text-zinc-500 text-sm md:text-base leading-relaxed">{description}</p>
        </div>

        <div className="pointer-events-none flex w-full translate-y-10 transform-gpu flex-row items-center opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex items-center text-indigo-400 font-semibold text-sm">
                {cta}
                <ArrowRightIcon className="ms-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
        </div>
    </div>

    {/* Subtle Glass Noise Overlay */}
    <div className="pointer-events-none absolute inset-0 opacity-[0.03] transition-opacity group-hover:opacity-[0.05]" 
         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} 
    />
  </Link>
);

export { BentoCard, BentoGrid };
