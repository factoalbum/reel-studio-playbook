import React from "react";
import { AbsoluteFill } from "remotion";
import { range, useAbsT } from "./motion";

/** Wraps a scene: a short fade/slide/blur in at `start`, and out just after `end` (scenes overlap by 0.2 s). */
export const SceneShell: React.FC<{ start: number; end: number; first?: boolean; children: React.ReactNode }> = ({ start, end, first, children }) => {
  const t = useAbsT(start);
  const enter = first ? 1 : range(t, start, start + 0.22);
  const exit = range(t, end, end + 0.2);
  return (
    <AbsoluteFill style={{ opacity: enter * (1 - exit), transform: `translateY(${(1 - enter) * 50}px)`, filter: `blur(${(1 - enter) * 8 + exit * 8}px)` }}>{children}</AbsoluteFill>
  );
};
