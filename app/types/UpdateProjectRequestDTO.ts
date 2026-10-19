import { ColumnColor } from "./ColumnColor";

export type UpdateColumnRequestDTO = {
  // A missing id means a new column
  id?: string;
  name: string;
  // The backend uses it only for a new column
  color: ColumnColor;
};

// The order of the columns sets their order on the board
export type UpdateProjectRequestDTO = {
  description: string;
  columns: UpdateColumnRequestDTO[];
};
