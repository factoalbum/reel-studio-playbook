import React from "react";
import { palette as P, shadow, type } from "./tokens";
import { range, usePop } from "../components/motion";

export type Step = { label: string; at: number };

/**
 * Numbered steps in a row ("1 Prompt  2 Code  3 Preview  4 Publish"), so a how-to stays readable while it moves fast.
 * The step whose time has come is lime; earlier steps turn ink with a tick; later ones wait in outline.
 */
export const StepStrip: React.FC<{ t: number; steps: Step[]; top: number; inAt: number; outAt: number; size?: number }> = ({ t, steps, top, inAt, outAt, size = 32 }) => {
  const p = usePop(t, inAt, { damping: 13, stiffness: 170, mass: 0.7 });
  const out = range(t, outAt, outAt + 0.22);
  if (t < inAt || out >= 1) return null;
  let current = -1;
  steps.forEach((s, i) => {
    if (s.at <= t) current = i;
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        width: 960,
        top,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 14,
        opacity: Math.min(1, p * 2) * (1 - out),
        transform: `translateY(${(1 - p) * -30 - out * 30}px)`,
      }}
    >
      {steps.map((s, i) => (
        <StepPill key={s.label} t={t} n={i + 1} step={s} state={i < current ? "done" : i === current ? "active" : "next"} size={size} />
      ))}
    </div>
  );
};

const StepPill: React.FC<{ t: number; n: number; step: Step; state: "done" | "active" | "next"; size: number }> = ({ t, n, step, state, size }) => {
  const pop = usePop(t, step.at, { damping: 9, stiffness: 230, mass: 0.6 });
  const bump = state === "active" ? 1 + 0.14 * Math.sin(Math.min(1, pop) * Math.PI) : 1;
  const bg = state === "active" ? P.lime : state === "done" ? P.ink : P.card;
  const fg = state === "done" ? P.lime : state === "active" ? P.ink : P.ink3;
  const border = state === "next" ? P.lineStrong : P.ink;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.32,
        padding: `${size * 0.22}px ${size * 0.5}px ${size * 0.22}px ${size * 0.22}px`,
        borderRadius: 999,
        background: bg,
        border: `4px solid ${border}`,
        boxShadow: state === "active" ? shadow.hard(6) : "none",
        transform: `scale(${bump})`,
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          width: size * 1.3,
          height: size * 1.3,
          borderRadius: 999,
          background: state === "done" ? P.lime : state === "active" ? P.ink : P.paper2,
          color: state === "done" ? P.ink : state === "active" ? P.lime : P.ink3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...type.display,
          fontSize: size * 0.8,
        }}
      >
        {state === "done" ? "✓" : n}
      </div>
      <span style={{ ...type.display, letterSpacing: "-0.02em", fontSize: size, color: fg }}>{step.label}</span>
    </div>
  );
};
