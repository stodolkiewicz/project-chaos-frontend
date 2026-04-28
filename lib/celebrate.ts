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

const sounds = [
  { audio: new Audio("/sounds/wow.mp3"), weight: 0.15, volume: 0.7 },
  { audio: new Audio("/sounds/tada.mp3"), weight: 0.6, volume: 0.7 },
  { audio: new Audio("/sounds/yeahboy.mp3"), weight: 0.15, volume: 0.7 },
  { audio: new Audio("/sounds/sogood.mp3"), weight: 0.1, volume: 1.0 },
];

sounds.forEach(s => s.audio.preload = "auto");

export function playRandomCelebratoryAudio(clone = false) {
  let r = Math.random();

  for (const { audio, weight, volume } of sounds) {
    if (r < weight) {
      const a = clone
        ? (audio.cloneNode(true) as HTMLAudioElement)
        : audio;

      if (!clone) a.currentTime = 0;

      a.volume = volume;
      a.play().catch(() => {});
      return;
    }
    r -= weight;
  }
}