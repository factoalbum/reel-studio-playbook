import React from "react";
import { mono, palette as P, shadow, type } from "../brand/tokens";
import { eo, lerp, seg } from "../mdh/kit";

/**
 * Pieces for the "Fable 5.2: 3 things to try" reel: an original fictional mascot drawn in code with 3D-style
 * shading (always labelled illustrative, never presented as an AI output), a month grid for the sample 2027
 * plan, a terminal window and a pipeline step. Nothing here copies a real product screen.
 */

/** Original fictional mascot: a small fox-like creature with a lime scarf. `id` keeps gradient ids unique. */
export const Mascot: React.FC<{ size: number; t: number; id?: string }> = ({ size, t, id = "m" }) => {
  const blink = (t * 0.45) % 1 > 0.93;
  const wag = Math.sin(t * 5) * 9;
  const ear = Math.sin(t * 3) * 3;
  const u = (n: string) => `url(#${id}${n})`;
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 400 440" style={{ overflow: "visible", display: "block" }}>
      <defs>
        <radialGradient id={`${id}Fur`} cx="0.35" cy="0.28" r="0.85">
          <stop offset="0" stopColor="#FFC98A" />
          <stop offset="0.55" stopColor="#F28A3C" />
          <stop offset="1" stopColor="#A94C17" />
        </radialGradient>
        <radialGradient id={`${id}Cream`} cx="0.4" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#EBD6BC" />
        </radialGradient>
        <radialGradient id={`${id}Dark`} cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#6B4A3A" />
          <stop offset="1" stopColor="#2A1A14" />
        </radialGradient>
        <radialGradient id={`${id}Eye`} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#4A3528" />
          <stop offset="1" stopColor="#120B08" />
        </radialGradient>
        <linearGradient id={`${id}Scarf`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#DDFB8E" />
          <stop offset="1" stopColor="#8FBF2E" />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="420" rx="135" ry="17" fill="#000" opacity="0.2" />
      {/* tail */}
      <g transform={`rotate(${wag} 262 350)`}>
        <path d="M255 372 C345 372 392 300 356 214 C344 262 306 302 248 318 Z" fill={u("Fur")} />
        <path d="M356 214 C372 252 368 286 350 312 C348 282 344 262 334 246 Z" fill={u("Cream")} />
      </g>
      {/* body */}
      <ellipse cx="200" cy="332" rx="90" ry="86" fill={u("Fur")} />
      <ellipse cx="200" cy="350" rx="54" ry="58" fill={u("Cream")} />
      <ellipse cx="158" cy="408" rx="36" ry="20" fill={u("Dark")} />
      <ellipse cx="242" cy="408" rx="36" ry="20" fill={u("Dark")} />
      <ellipse cx="118" cy="322" rx="24" ry="46" fill={u("Fur")} transform="rotate(18 118 322)" />
      <ellipse cx="282" cy="322" rx="24" ry="46" fill={u("Fur")} transform={`rotate(${-18 - Math.sin(t * 4) * 6} 282 300)`} />
      {/* ears */}
      <g transform={`rotate(${-ear} 120 120)`}>
        <path d="M82 150 C70 86 88 40 112 22 C140 44 166 82 172 118 Z" fill={u("Fur")} />
        <path d="M100 132 C94 96 102 66 114 50 C130 68 144 92 150 114 Z" fill={u("Dark")} />
      </g>
      <g transform={`rotate(${ear} 280 120)`}>
        <path d="M318 150 C330 86 312 40 288 22 C260 44 234 82 228 118 Z" fill={u("Fur")} />
        <path d="M300 132 C306 96 298 66 286 50 C270 68 256 92 250 114 Z" fill={u("Dark")} />
      </g>
      {/* head */}
      <ellipse cx="200" cy="176" rx="128" ry="108" fill={u("Fur")} />
      <ellipse cx="128" cy="212" rx="54" ry="40" fill={u("Cream")} />
      <ellipse cx="272" cy="212" rx="54" ry="40" fill={u("Cream")} />
      <ellipse cx="200" cy="222" rx="48" ry="36" fill={u("Cream")} />
      <ellipse cx="146" cy="108" rx="48" ry="20" fill="#fff" opacity="0.28" transform="rotate(-22 146 108)" />
      {/* eyes */}
      {[146, 254].map((x) =>
        blink ? (
          <path key={x} d={`M${x - 22} 176 q22 14 44 0`} fill="none" stroke="#1B110C" strokeWidth="7" strokeLinecap="round" />
        ) : (
          <g key={x}>
            <ellipse cx={x} cy="172" rx="24" ry="27" fill={u("Eye")} />
            <circle cx={x - 8} cy="162" r="9" fill="#fff" />
            <circle cx={x + 8} cy="182" r="4" fill="#fff" opacity="0.8" />
          </g>
        ),
      )}
      <ellipse cx="108" cy="214" rx="18" ry="10" fill="#FF9E8A" opacity="0.55" />
      <ellipse cx="292" cy="214" rx="18" ry="10" fill="#FF9E8A" opacity="0.55" />
      <ellipse cx="200" cy="206" rx="15" ry="10" fill={u("Dark")} />
      <ellipse cx="195" cy="203" rx="5" ry="3" fill="#fff" opacity="0.6" />
      <path d="M200 216 v10 M200 226 q-14 14 -26 4 M200 226 q14 14 26 4" fill="none" stroke="#2A1A14" strokeWidth="5" strokeLinecap="round" />
      {/* scarf */}
      <path d="M112 262 C150 292 250 292 288 262 C296 278 294 292 284 302 C246 326 154 326 116 302 C106 292 104 278 112 262 Z" fill={u("Scarf")} stroke="#5E8516" strokeWidth="3" />
      <path d="M236 304 l34 58 l-36 -8 l-18 -44 z" fill={u("Scarf")} stroke="#5E8516" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
};

/** Dots flying from one point to another (the "answers become a mascot" moment). k from 0 to 1. */
export const Particles: React.FC<{ from: [number, number]; to: [number, number]; k: number; n?: number }> = ({ from, to, k, n = 26 }) => {
  if (k <= 0 || k >= 1) return null;
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const r = (Math.sin(i * 91.7) * 43758.5) % 1;
        const a = Math.abs(r);
        const d = a * 0.45;
        const q = eo(Math.max(0, Math.min(1, (k - d) / (1 - 0.45))));
        if (q <= 0 || q >= 1) return null;
        const bend = Math.sin(q * Math.PI) * (140 * (a - 0.5) * 2);
        const x = lerp(from[0] + (a - 0.5) * 260, to[0], q);
        const y = lerp(from[1] + (((i * 37) % 200) - 100), to[1], q) + bend;
        const s = 10 + (i % 4) * 5;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: i % 3 ? 99 : 4, background: i % 2 ? P.lime : "#F28A3C", border: `2px solid ${P.ink}`, transform: `rotate(${q * 300}deg)`, opacity: Math.sin(q * Math.PI) }} />;
      })}
    </>
  );
};

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const TASKS = ["Pick 1 goal", "Learn basics", "First draft", "Launch v1", "Feedback", "Improve", "Post weekly", "Review", "Version 2", "Grow", "Refine", "Year review"];

/** A 4 x 3 month grid that fills month by month from `at`, one month every `step` seconds. Sample content only. */
export const MonthGrid: React.FC<{ t: number; at: number; step: number; w: number }> = ({ t, at, step, w }) => {
  const gap = 12;
  const cw = (w - gap * 3) / 4;
  return (
    <div style={{ width: w, display: "flex", flexWrap: "wrap", gap }}>
      {MONTHS.map((m, i) => {
        const k = eo(seg(t, at + i * step, at + i * step + 0.22));
        const on = k > 0;
        return (
          <div key={m} style={{ width: cw, height: 118, boxSizing: "border-box", borderRadius: 16, border: `4px solid ${P.ink}`, background: on ? (i % 4 === 3 ? P.lime : P.card) : P.paper2, boxShadow: on ? shadow.hard(5) : "none", padding: "10px 12px", transform: `scale(${on ? lerp(1.18, 1, k) : 1})`, display: "flex", flexDirection: "column", gap: 6, overflow: "hidden" }}>
            <div style={{ ...type.label, fontSize: 22, color: on ? P.ink : P.ink3 }}>{m}</div>
            <div style={{ height: 8, borderRadius: 4, background: P.line, overflow: "hidden" }}>
              <div style={{ width: `${(k * 100).toFixed(1)}%`, height: "100%", background: P.ink }} />
            </div>
            <div style={{ ...type.body, fontWeight: 600, fontSize: 19, lineHeight: 1.1, color: P.ink, opacity: k, whiteSpace: "nowrap" }}>{TASKS[i]}</div>
          </div>
        );
      })}
    </div>
  );
};

const TERM_BG = "#1F1E1D";
const TERM_FG = "#F4F2EA";
export type TLine = { text: string; at: number; to?: number; tone?: "cmd" | "out" | "ok" | "clay" | "dim" | "you" };
const TONE: Record<string, string> = { cmd: TERM_FG, out: "#BDBAB0", ok: P.lime, clay: "#D97757", dim: "#8C897F", you: TERM_FG };

/** A dark terminal window that prints its lines on time (an illustration of the CLI, not a recording). */
export const Term: React.FC<{ t: number; w: number; lines: TLine[]; fs?: number; minH?: number; title?: string }> = ({ t, w, lines, fs = 26, minH = 0, title }) => (
  <div style={{ width: w, background: TERM_BG, border: `5px solid ${P.ink}`, borderRadius: 20, boxShadow: shadow.hard(8), overflow: "hidden" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 16px", background: "#2C2B28" }}>
      {["#E0452B", P.gold, P.lime].map((c) => (
        <div key={c} style={{ width: 15, height: 15, borderRadius: 99, background: c }} />
      ))}
      {title && <div style={{ marginLeft: 10, fontFamily: mono, fontSize: 18, color: "#9C998F", whiteSpace: "nowrap" }}>{title}</div>}
    </div>
    <div style={{ padding: "14px 20px 18px", fontFamily: mono, fontWeight: 500, fontSize: fs, lineHeight: 1.45, color: TERM_FG, minHeight: minH }}>
      {lines.map((l, i) => {
        if (t < l.at) return null;
        const n = l.to ? Math.floor(seg(t, l.at, l.to) * l.text.length + 0.0001) : l.text.length;
        const typing = l.to !== undefined && n < l.text.length;
        const pre = l.tone === "cmd" ? "$ " : l.tone === "you" ? "> " : l.tone === "ok" ? "✓ " : "";
        return (
          <div key={i} style={{ whiteSpace: "pre-wrap", opacity: Math.min(1, (t - l.at) / 0.12), color: TONE[l.tone ?? "out"] }}>
            {pre && <span style={{ color: l.tone === "you" ? "#D97757" : P.lime }}>{pre}</span>}
            {l.text.slice(0, n)}
            {typing && <span style={{ opacity: Math.floor(t * 6) % 2 ? 1 : 0, background: TERM_FG }}> </span>}
          </div>
        );
      })}
    </div>
  </div>
);

/** One step of the reel pipeline: dim until `k` > 0, lime while it is the current step. */
export const PipeStep: React.FC<{ label: string; n: number; k: number; hot: boolean; w: number }> = ({ label, n, k, hot, w }) => (
  <div style={{ width: w, boxSizing: "border-box", borderRadius: 16, border: `4px solid ${P.ink}`, background: k > 0 ? (hot ? P.lime : P.card) : P.paper2, boxShadow: k > 0 ? shadow.hard(5) : "none", padding: "10px 0 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, transform: `scale(${k > 0 ? lerp(1.2, 1, eo(Math.min(1, k))) : 1})`, opacity: k > 0 ? 1 : 0.55 }}>
    <div style={{ ...type.label, fontSize: 16, color: P.ink3 }}>{`0${n}`}</div>
    <div style={{ ...type.display, fontSize: 30, color: P.ink, whiteSpace: "nowrap" }}>{label}</div>
  </div>
);
