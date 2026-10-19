// The backend stores only the key, so the shades can change without a data migration
export const COLUMN_COLORS = {
  GRAY: "#94A3B8",
  BLUE: "#3B82F6",
  GREEN: "#22C55E",
  AMBER: "#F59E0B",
  RED: "#EF4444",
  PURPLE: "#A855F7",
  PINK: "#EC4899",
  TEAL: "#14B8A6",
} as const;

export type ColumnColor = keyof typeof COLUMN_COLORS;

// Palette order; new columns take the first color that no other column uses
export const COLUMN_COLOR_KEYS = Object.keys(COLUMN_COLORS) as ColumnColor[];

export function firstUnusedColumnColor(usedColors: ColumnColor[]): ColumnColor {
  return (
    COLUMN_COLOR_KEYS.find((color) => !usedColors.includes(color)) ??
    COLUMN_COLOR_KEYS[usedColors.length % COLUMN_COLOR_KEYS.length]
  );
}
