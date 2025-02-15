import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const extractASize = (str: string): number => {
  const match = str.match(/A(\d+)/i);
  return match?.[1] ? parseInt(match[1]) : Infinity;
};