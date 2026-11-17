import React from "react";
import { colors, fontFamily } from "../theme";
import { range, usePop } from "../components/motion";
import { KineticHeader } from "../components/KineticHeader";

/** CTA (from 13.95 s): "Comment LEARN aur follow karo. Part 2 mein banake dikhaunga!" */
export const CtaScene: React.FC<{ t: number }> = ({ t }) => {
  if (t < 13.95) return null;
  return (
    <>
      <KineticHeader
        t={t}
        top={326}
        inAt={14.43}
        outAt={99}
        lines={[
          { size: 84, segs: [{ text: "COMMENT", at: 14.43 }, { text: "“LEARN”", at: 14.77, color: colors.yellow }] },
          { size: 78, segs: [{ text: "FOLLOW FOR", at: 15.49, color: colors.cyan }, { text: "PART 2", at: 16.22, color: colors.yellow }] },
        ]}
      />
      <CommentBox t={t} />
      <FollowButton t={t} />
      <Burst t={t} at={16.22} x={800} y={452} color={colors.yellow} />
    </>
  );
};

const CommentBox: React.FC<{ t: number }> = ({ t }) => {
  const p = usePop(t, 14.02, { damping: 13, stiffness: 150, mass: 0.7 });
  const word = "LEARN";
  const n = Math.floor(range(t, 14.77, 15.1) * word.length + 0.0001);
  const send = usePop(t, 15.18, { damping: 7, stiffness: 260, mass: 0.5 });
  const sent = t >= 15.2;
  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        top: 640,
        width: 820,
        height: 124,
        borderRadius: 64,
        background: colors.white,
        border: `6px solid ${colors.navy}`,
        boxShadow: `0 0 50px ${colors.cyan}66, 0 24px 50px #00000088`,
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 22,
        transform: `translateY(${(1 - p) * 260}px) scale(${0.8 + 0.2 * p})`,
        opacity: Math.min(1, p * 1.6),
      }}
    >
      <div style={{ width: 86, height: 86, borderRadius: 86, background: colors.cyan, display: "flex", alignItems: "center", justifyContent: "center", fontFamily, fontWeight: 900, fontSize: 36, color: colors.navy, flexShrink: 0 }}>
        IT
      </div>
      <div style={{ flex: 1, fontFamily, display: "flex", alignItems: "center" }}>
        {n === 0 ? (
          <span style={{ fontWeight: 600, fontSize: 40, color: "#94A3B8" }}>Add a comment…</span>
        ) : (
          <span style={{ fontWeight: 900, fontSize: 60, color: colors.navy, letterSpacing: 2 }}>{word.slice(0, n)}</span>
        )}
        {!sent && n > 0 && <span style={{ width: 6, height: 58, marginLeft: 6, background: colors.navy, opacity: Math.floor(t * 6) % 2 ? 1 : 0.15 }} />}
      </div>
      <div
        style={{
          width: 94,
          height: 94,
          borderRadius: 94,
          background: sent ? colors.yellow : colors.cyan,
          border: `5px solid ${colors.navy}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transform: `scale(${t >= 15.18 && t < 15.26 ? 0.84 : 1 + 0.1 * Math.sin(Math.min(1, send) * Math.PI)})`,
        }}
      >
        <svg width={50} height={50} viewBox="0 0 50 50">
          <path d="M5 24 L45 6 L33 45 L24 29 Z M24 29 L45 6" fill={colors.navy} stroke={colors.navy} strokeWidth={4} strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

const FollowButton: React.FC<{ t: number }> = ({ t }) => {
  const p = usePop(t, 15.4, { damping: 11, stiffness: 170, mass: 0.7 });
  const tap = usePop(t, 15.68, { damping: 7, stiffness: 260, mass: 0.5 });
  if (p <= 0) return null;
  const on = t >= 15.68;
  return (
    <>
      <div style={{ position: "absolute", left: 0, width: 1030, top: 880, display: "flex", justifyContent: "center", opacity: Math.min(1, p * 1.6) }}>
        <div
          style={{
            transform: `scale(${p * (t >= 15.62 && t < 15.7 ? 0.9 : 1 + 0.08 * Math.sin(Math.min(1, tap) * Math.PI))})`,
            width: 470,
            height: 110,
            borderRadius: 60,
            background: on ? colors.navy2 : colors.cyan,
            border: `6px solid ${on ? colors.cyan : colors.navy}`,
            boxShadow: `0 0 50px ${colors.cyan}88, 0 20px 40px #00000077`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily,
            fontWeight: 900,
            fontSize: 54,
            color: on ? colors.cyan : colors.navy,
            letterSpacing: 1,
          }}
        >
          {on ? "FOLLOWING ✓" : "+ FOLLOW"}
        </div>
      </div>
      <TapCursor t={t} />
      <Burst t={t} at={15.68} x={515} y={935} color={colors.cyan} />
    </>
  );
};

const TapCursor: React.FC<{ t: number }> = ({ t }) => {
  if (t < 15.42 || t > 16.1) return null;
  const k = range(t, 15.42, 15.62);
  const x = 900 + (600 - 900) * k;
  const y = 1150 + (930 - 1150) * k;
  const press = t >= 15.62 && t < 15.72 ? 0.82 : 1;
  const fade = range(t, 15.9, 16.1);
  return (
    <svg width={64} height={78} viewBox="0 0 64 78" style={{ position: "absolute", left: x, top: y, transform: `scale(${press})`, transformOrigin: "0 0", opacity: 1 - fade, filter: "drop-shadow(0 6px 10px #00000088)" }}>
      <path d="M4 4 L4 62 L19 48 L30 73 L42 68 L31 43 L52 43 Z" fill="#FFFFFF" stroke={colors.navy} strokeWidth={5} strokeLinejoin="round" />
    </svg>
  );
};

/** Short radial burst of lines. */
export const Burst: React.FC<{ t: number; at: number; x: number; y: number; color: string; r?: number }> = ({ t, at, x, y, color, r = 150 }) => {
  const k = range(t, at, at + 0.5);
  if (t < at || k >= 1) return null;
  return (
    <svg width={r * 4} height={r * 4} viewBox={`${-r * 2} ${-r * 2} ${r * 4} ${r * 4}`} style={{ position: "absolute", left: x - r * 2, top: y - r * 2, opacity: 1 - k }}>
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const r0 = r * (0.55 + 0.6 * k);
        const r1 = r * (0.85 + 0.9 * k);
        return <line key={i} x1={Math.cos(a) * r0} y1={Math.sin(a) * r0} x2={Math.cos(a) * r1} y2={Math.sin(a) * r1} stroke={color} strokeWidth={12} strokeLinecap="round" />;
      })}
    </svg>
  );
};
