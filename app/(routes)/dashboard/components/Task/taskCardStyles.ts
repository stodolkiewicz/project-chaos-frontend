// Share of white mixed into the label color for the chip background
const LABEL_BACKGROUND_WHITE_RATIO = 0.85;
// Share of the label color kept for the chip text; the rest is black
const LABEL_TEXT_COLOR_RATIO = 0.45;

// Avatar backgrounds; each one keeps white initials readable
const AVATAR_COLORS = [
  "#2b7fff",
  "#0f766e",
  "#7c3aed",
  "#c2410c",
  "#be185d",
  "#15803d",
  "#1953bf",
  "#a16207",
];

function hexToRgb(hexColor: string): [number, number, number] {
  const hex = hexColor.replace("#", "");
  return [
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16),
  ];
}

function rgb([r, g, b]: number[]): string {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

// Returns a light background and a dark text color derived from the label color
export function getLabelColors(labelColor: string): { background: string; color: string } {
  const channels = hexToRgb(labelColor);
  return {
    background: rgb(channels.map((c) => c + (255 - c) * LABEL_BACKGROUND_WHITE_RATIO)),
    color: rgb(channels.map((c) => c * LABEL_TEXT_COLOR_RATIO)),
  };
}

// The same email always gets the same color
export function getAvatarColor(email: string): string {
  let hash = 0;
  for (const char of email) {
    hash = (hash * 31 + char.charCodeAt(0)) | 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// Takes first letters of the first two parts of the email local part, e.g. "jan.kowalski" -> "JK"
export function getInitials(email: string): string {
  const localPart = email.split("@")[0];
  const parts = localPart.split(/[._-]+/).filter(Boolean);
  const initials = parts.length >= 2
    ? parts[0][0] + parts[1][0]
    : localPart.substring(0, 2);
  return initials.toUpperCase();
}
