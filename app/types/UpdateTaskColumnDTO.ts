export interface UpdateTaskColumnDTO {
  targetColumnId: string; // UUID jako string
  positionInColumn: number; // Double jako number
  nearestNeighboursPositionInColumn: number[]; // List<Double> jako number[]
}
