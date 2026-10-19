import confetti from "canvas-confetti";
import type { ColumnSound } from "@/app/types/ColumnSound";

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

// "weight" is the chance of the sound in a random pick
const sounds: { key: ColumnSound; audio: HTMLAudioElement; weight: number; volume: number }[] = [
  { key: "WOW", audio: new Audio("/sounds/wow.mp3"), weight: 0.2, volume: 0.7 },
  { key: "TADA", audio: new Audio("/sounds/tada.mp3"), weight: 0.6, volume: 0.7 },
  { key: "YEAHBOY", audio: new Audio("/sounds/yeahboy.mp3"), weight: 0.2, volume: 0.7 },
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

export function playColumnSound(sound: ColumnSound) {
  if (sound === "RANDOM") {
    playRandomCelebratoryAudio();
    return;
  }

  const chosen = sounds.find((s) => s.key === sound);
  if (!chosen) return;

  chosen.audio.currentTime = 0;
  chosen.audio.volume = chosen.volume;
  chosen.audio.play().catch(() => {});
}
