import React from "react";
import { mono, palette as P, shadow, type } from "./tokens";
import { range, usePop } from "../components/motion";

/**
 * An AI prompt being typed and sent, in the brand's card style (same family as CommentCard).
 * The text must be the exact prompt that was really used; the card is ours, not an imitation of any chat app.
 */
export const PromptCard: React.FC<{ t: number; at: number; label: string; source: string; text: string; typeFrom: number; typeTo: number; sendAt: number; outAt: number; top: number }> = ({
  t,
  at,
  label,
  source,
  text,
  typeFrom,
  typeTo,
  sendAt,
  outAt,
  top,
}) => {
  const p = usePop(t, at, { damping: 13, stiffness: 150, mass: 0.7 });
  const send = usePop(t, sendAt, { damping: 7, stiffness: 260, mass: 0.5 });
  const out = range(t, outAt, outAt + 0.25);
  if (p <= 0 || out >= 1) return null;
  const n = Math.floor(range(t, typeFrom, typeTo) * text.length + 0.0001);
  const sent = t >= sendAt + 0.02;
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        top,
        width: 870,
        boxSizing: "border-box",
        borderRadius: 34,
        background: P.card,
        border: `5px solid ${P.ink}`,
        boxShadow: shadow.hard(8),
        padding: "26px 30px 26px",
        transform: `translateY(${(1 - p) * 260 - out * 160}px) scale(${(0.8 + 0.2 * p) * (1 - 0.1 * out)})`,
        opacity: Math.min(1, p * 1.6) * (1 - out),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ ...type.label, fontSize: 24, color: P.paper, background: P.ink, borderRadius: 999, padding: "8px 18px 9px" }}>{label}</div>
        <div style={{ fontFamily: mono, fontWeight: 600, fontSize: 26, color: P.ink3 }}>{source}</div>
      </div>
      <div style={{ ...type.body, fontSize: 44, lineHeight: 1.26, color: P.ink, minHeight: 168 }}>
        {text.slice(0, n)}
        {!sent && (
          <span style={{ display: "inline-block", width: 5, height: 46, marginLeft: 4, verticalAlign: "-8px", background: P.ink, opacity: Math.floor(t * 6) % 2 ? 1 : 0.15 }} />
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
        <div
          style={{
            width: 86,
            height: 86,
            borderRadius: 86,
            background: sent ? P.ink : P.lime,
            border: `5px solid ${P.ink}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${t >= sendAt - 0.06 && t < sendAt + 0.04 ? 0.84 : 1 + 0.12 * Math.sin(Math.min(1, send) * Math.PI)})`,
          }}
        >
          <svg width={44} height={44} viewBox="0 0 50 50">
            <path d="M25 42 V9 M11 22 L25 8 L39 22" fill="none" stroke={sent ? P.lime : P.ink} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};
