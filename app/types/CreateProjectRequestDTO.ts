import { ColumnColor } from "./ColumnColor";

export type CreateProjectRequestDTO = {
  name: string;
  description: string;
  columns: { name: string; color: ColumnColor }[];
};
