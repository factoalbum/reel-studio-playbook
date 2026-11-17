import React from "react";
import { palette as P, shadow, type } from "./tokens";
import { BrandMark } from "./Chrome";
import { Burst, ClickRing, Pointer } from "./Bits";
import { range, usePop } from "../components/motion";

/** Comment box that types the keyword and sends it. Same look in every reel's call to action. */
export const CommentCard: React.FC<{ t: number; at: number; keyword: string; typeAt: number; typeTo: number; sendAt: number; top: number }> = ({
  t,
  at,
  keyword,
  typeAt,
  typeTo,
  sendAt,
  top,
}) => {
  const p = usePop(t, at, { damping: 13, stiffness: 150, mass: 0.7 });
  const send = usePop(t, sendAt, { damping: 7, stiffness: 260, mass: 0.5 });
  if (p <= 0) return null;
  const n = Math.floor(range(t, typeAt, typeTo) * keyword.length + 0.0001);
  const sent = t >= sendAt + 0.02;
  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        top,
        width: 820,
        height: 124,
        borderRadius: 64,
        background: P.card,
        border: `5px solid ${P.ink}`,
        boxShadow: shadow.hard(8),
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 22,
        transform: `translateY(${(1 - p) * 260}px) scale(${0.8 + 0.2 * p})`,
        opacity: Math.min(1, p * 1.6),
      }}
    >
      <BrandMark size={86} round />
      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
        {n === 0 ? (
          <span style={{ ...type.body, fontSize: 40, color: P.ink3 }}>Add a comment…</span>
        ) : (
          <span style={{ ...type.display, fontSize: 62, letterSpacing: "0.02em", color: P.ink }}>{keyword.slice(0, n)}</span>
        )}
        {!sent && n > 0 && <span style={{ width: 6, height: 58, marginLeft: 6, background: P.ink, opacity: Math.floor(t * 6) % 2 ? 1 : 0.15 }} />}
      </div>
      <div
        style={{
          width: 94,
          height: 94,
          borderRadius: 94,
          background: sent ? P.ink : P.lime,
          border: `5px solid ${P.ink}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transform: `scale(${t >= sendAt && t < sendAt + 0.08 ? 0.84 : 1 + 0.1 * Math.sin(Math.min(1, send) * Math.PI)})`,
        }}
      >
        <svg width={50} height={50} viewBox="0 0 50 50">
          <path d="M5 24 L45 6 L33 45 L24 29 Z M24 29 L45 6" fill={sent ? P.lime : P.ink} stroke={sent ? P.lime : P.ink} strokeWidth={4} strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

/**
 * Follow button that gets tapped and turns into "Following".
 * With `invite` it stays "+ Follow" and only pulses at `tapAt` (no pointer), for reels that must not claim a follow.
 */
export const FollowButton: React.FC<{ t: number; at: number; tapAt: number; top: number; invite?: boolean }> = ({ t, at, tapAt, top, invite = false }) => {
  const p = usePop(t, at, { damping: 11, stiffness: 170, mass: 0.7 });
  const tap = usePop(t, tapAt, { damping: 7, stiffness: 260, mass: 0.5 });
  if (p <= 0) return null;
  const on = !invite && t >= tapAt;
  const press = t >= tapAt - 0.06 && t < tapAt + 0.02 ? 0.9 : 1 + 0.08 * Math.sin(Math.min(1, tap) * Math.PI);
  return (
    <>
      <div style={{ position: "absolute", left: 0, width: 1030, top, display: "flex", justifyContent: "center", opacity: Math.min(1, p * 1.6) }}>
        <div
          style={{
            transform: `scale(${p * press})`,
            width: 470,
            height: 110,
            borderRadius: 60,
            background: on ? P.ink : P.lime,
            border: `5px solid ${P.ink}`,
            boxShadow: on ? `8px 8px 0 ${P.lime}` : shadow.hard(8),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...type.display,
            fontSize: 54,
            color: on ? P.lime : P.ink,
          }}
        >
          {on ? "Following ✓" : "+ Follow"}
        </div>
      </div>
      {!invite && <TapPointer t={t} from={[900, 1150]} to={[600, top + 50]} at={at + 0.02} tapAt={tapAt} />}
      <Burst t={t} at={tapAt} x={515} y={top + 55} color={invite ? P.lime : undefined} />
    </>
  );
};

/** Pointer that glides to a point and taps it at `tapAt`. */
export const TapPointer: React.FC<{ t: number; from: [number, number]; to: [number, number]; at: number; tapAt: number }> = ({ t, from, to, at, tapAt }) => {
  if (t < at || t > tapAt + 0.45) return null;
  const k = range(t, at, tapAt - 0.06);
  const x = from[0] + (to[0] - from[0]) * k;
  const y = from[1] + (to[1] - from[1]) * k;
  const press = t >= tapAt - 0.06 && t < tapAt + 0.04 ? 0.82 : 1;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: 1 - range(t, tapAt + 0.22, tapAt + 0.42) }}>
      {t >= tapAt && <ClickRing k={range(t, tapAt, tapAt + 0.25)} />}
      <Pointer press={press} />
    </div>
  );
};
