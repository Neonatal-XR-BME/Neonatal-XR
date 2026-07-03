// Derives the human "state" label each card shows, from a value and a safe
// range. Thresholds reflect the copy already in the cards (core 36.5-36.7,
// humidity 30-50). Adjust to match your clinical thresholds.

export type Band = "normal" | "low" | "high";

export function bandFor(value: number | null, min: number, max: number): Band {
  if (value == null || Number.isNaN(value)) return "normal";
  if (value < min) return "low";
  if (value > max) return "high";
  return "normal";
}

export const CORE_RANGE = { min: 34.5, max: 36.7 };
export const AMBIENT_RANGE = { min: 22, max: 26 };
export const HUMIDITY_RANGE = { min: 50, max: 80 };

// Format a possibly-null number to a fixed value, with a 0 fallback.
export function fmt(value: number | null, digits = 1): number {
  if (value == null || Number.isNaN(value)) return 0;
  return Number(value.toFixed(digits));
}
