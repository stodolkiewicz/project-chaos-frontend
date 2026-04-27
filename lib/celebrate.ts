import confetti from "canvas-confetti";
import type { ColumnDTO } from "@/app/types/ColumnDTO";

const STANDARD_BURST: confetti.Options = {
  particleCount: 120,
  spread: 120,
  startVelocity: 30,
  ticks: 180, 
  colors: ["#E63946", "#F77F00", "#FCBF49", "#06A77D", "#118AB2", "#9D4EDD"],
  disableForReducedMotion: true,
};

const FALLBACK_ORIGIN = { x: 0.5, y: 0.6 };

export function celebrate(origin?: { x: number; y: number }): void {
  void confetti({
    ...STANDARD_BURST,
    origin: origin ?? FALLBACK_ORIGIN,
  });
}

export function isLastColumn(
  columnId: string,
  columns: ColumnDTO[]
): boolean {
  return columns[columns.length - 1].id === columnId;
}
