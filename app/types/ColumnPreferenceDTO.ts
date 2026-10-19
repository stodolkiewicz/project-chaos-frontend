import { ColumnSound } from "./ColumnSound";

// What the current user hears and sees after dropping a task into the column
export interface ColumnPreferenceDTO {
  columnId: string;
  sound: ColumnSound;
  confetti: boolean;
}
