import React from "react";
import { cn } from "../../utils/cn";

export const Button = ({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) => {
  const Comp = asChild ? "span" : "button";
  
  const variants = {
    default: "bg-white text-black hover:bg-zinc-200",
    link: "text-white underline-offset-4 hover:underline !bg-transparent !p-0",
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3 text-xs",
    lg: "h-11 rounded-md px-8",
  };

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
};
