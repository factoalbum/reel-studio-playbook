import { spring, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

/** Absolute time in seconds, for a scene that starts at `sceneStart`. */
export function useAbsT(sceneStart: number) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return sceneStart + frame / fps;
}

/** A spring (0 to about 1) that begins at absolute time `at` in seconds. */
export function usePop(absT: number, at: number, opts?: { damping?: number; stiffness?: number; mass?: number }) {
  const { fps } = useVideoConfig();
  const frameNow = Math.round((absT - at) * fps);
  if (frameNow < 0) return 0;
  return spring({ frame: frameNow, fps, config: { damping: opts?.damping ?? 12, stiffness: opts?.stiffness ?? 140, mass: opts?.mass ?? 0.8 } });
}

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const range = (v: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(v, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1) });

export function syllables(word: string): number {
  const m = word.toLowerCase().replace(/[^a-z]/g, "").match(/[aeiouy]+/g);
  return Math.max(1, m ? m.length : 1);
}
