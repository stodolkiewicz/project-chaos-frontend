// The backend stores the hex value, so a priority keeps its color even if the palette changes.
// The first three are the colors of the default Low, Medium and High priorities.
export const PRIORITY_COLORS = [
  "#A3BE8C",
  "#EBCB8B",
  "#BF616A",
  "#8FBCBB",
  "#88C0D0",
  "#5E81AC",
  "#B48EAD",
  "#D08770",
] as const;

// New priorities take the first color that no other priority uses
export function firstUnusedPriorityColor(usedColors: string[]): string {
  const used = usedColors.map((color) => color.toUpperCase());
  return (
    PRIORITY_COLORS.find((color) => !used.includes(color)) ??
    PRIORITY_COLORS[usedColors.length % PRIORITY_COLORS.length]
  );
}
