import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * The "Secret Sauce" for Aceternity UI and professional Tailwind components.
 * It merges Tailwind classes gracefully without conflicts (e.g., matching padding-4 with padding-6).
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
