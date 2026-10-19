// Share of the label color in the chip background; the rest is --label-background-base (white in the light theme)
const LABEL_BACKGROUND_COLOR_PERCENT = 15;
// Share of the label color in the chip text; the rest is --label-text-base (black in the light theme)
const LABEL_TEXT_COLOR_PERCENT = 45;

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

// Returns a background and a text color derived from the label color; both follow the current theme
export function getLabelColors(labelColor: string): { background: string; color: string } {
  return {
    background: `color-mix(in srgb, ${labelColor} ${LABEL_BACKGROUND_COLOR_PERCENT}%, var(--label-background-base))`,
    color: `color-mix(in srgb, ${labelColor} ${LABEL_TEXT_COLOR_PERCENT}%, var(--label-text-base))`,
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
