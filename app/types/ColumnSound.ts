// The backend stores only the key; lib/celebrate.ts maps each key to a file
export const COLUMN_SOUND_LABELS = {
  NONE: "No sound",
  RANDOM: "Random",
  TADA: "Tada",
  WOW: "Wow",
  YEAHBOY: "Yeah boy",
} as const;

export type ColumnSound = keyof typeof COLUMN_SOUND_LABELS;

export const COLUMN_SOUND_KEYS = Object.keys(COLUMN_SOUND_LABELS) as ColumnSound[];
