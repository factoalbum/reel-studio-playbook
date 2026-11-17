import React from "react";
import { Img, random, staticFile } from "remotion";
import { mono, palette as P, shadow, type } from "../brand/tokens";
import { clamp01, eo, lerp, seg } from "../mdh/kit";

/**
 * Props for the Immich reel, all drawn in the Internet Toolbox style. The phone screens are an illustrative
 * rebuild of a photo app (timeline grid, search, people, albums), not screenshots; the photos are generated art.
 * The only third-party artwork is the official Immich logo (public/immich/logo, from the project's own repo).
 */

export const RED = "#E0452B";
export const SKY = "#2F6FDE";

export const centre = (x: number, y: number, k = 1, extra = ""): React.CSSProperties => ({
  position: "absolute",
  left: x,
  top: y,
  transform: `translate(-50%, -50%) scale(${k}) ${extra}`,
});

// ---------------------------------------------------------------------------------------------------------------
// Generated "photos": simple flat scenes, so nothing private or real is shown.

export type SnapKind = "sunset" | "mountain" | "city" | "flower" | "food" | "pet" | "family" | "lake";

const SUNSETS = [
  ["#FF7A3D", "#FFB25B", "#FFD99A"],
  ["#E9507A", "#FF8A5B", "#FFC777"],
  ["#7A4BD0", "#E9608A", "#FFB070"],
  ["#FF5F3A", "#FF9E45", "#FFE0A0"],
  ["#C2417A", "#F2774F", "#FFC46E"],
  ["#5C3FA8", "#D45A8C", "#FFA463"],
];

/** One generated photo. `seed` varies colours and layout; `w`/`h` in px. */
export const Snap: React.FC<{ kind: SnapKind; seed?: number; w: number; h: number; r?: number; style?: React.CSSProperties }> = ({ kind, seed = 0, w, h, r = 10, style }) => {
  const rnd = (n: string) => random(`snap-${kind}-${seed}-${n}`);
  const id = `g-${kind}-${seed}-${Math.round(w)}`;
  let body: React.ReactNode = null;
  if (kind === "sunset" || kind === "lake") {
    const c = SUNSETS[seed % SUNSETS.length];
    const sunX = 30 + rnd("sx") * 40;
    const horizon = kind === "lake" ? 58 : 60 + rnd("hz") * 8;
    const palms = kind === "sunset" && rnd("palm") > 0.35;
    body = (
      <>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c[0]} />
            <stop offset="0.6" stopColor={c[1]} />
            <stop offset="1" stopColor={c[2]} />
          </linearGradient>
        </defs>
        <rect width={100} height={100} fill={`url(#${id})`} />
        <circle cx={sunX} cy={horizon - 2} r={9 + rnd("sr") * 6} fill="#FFF1C4" opacity={0.95} />
        <rect y={horizon} width={100} height={100 - horizon} fill={kind === "lake" ? "#3B4E8C" : "#2C4D86"} />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={sunX - 10 + i * 3} y={horizon + 4 + i * 6} width={20 - i * 6} height={2} rx={1} fill="#FFE6A8" opacity={0.7} />
        ))}
        {kind === "sunset" && <path d={`M0 ${horizon + 22} Q50 ${horizon + 14} 100 ${horizon + 24} L100 100 L0 100 Z`} fill="#E9C48A" />}
        {kind === "lake" && <path d={`M0 ${horizon} L18 ${horizon - 16} L32 ${horizon - 6} L48 ${horizon - 22} L70 ${horizon} Z`} fill="#3A2D55" opacity={0.85} />}
        {palms && (
          <g fill="#2A1B2E">
            <path d={`M${78 + rnd("px") * 10} 100 Q${80 + rnd("px") * 10} 70 ${86 + rnd("px") * 6} ${horizon - 18} L${88 + rnd("px") * 6} ${horizon - 18} Q${84 + rnd("px") * 10} 72 ${82 + rnd("px") * 10} 100 Z`} />
            <path d={`M${87 + rnd("px") * 6} ${horizon - 18} q-14 -2 -20 8 q10 -6 20 -6 q-6 -10 -18 -8 q12 0 18 6 q2 -12 14 -12 q-10 4 -14 12 q10 -4 16 4 q-8 -2 -16 -4 Z`} />
          </g>
        )}
      </>
    );
  } else if (kind === "mountain") {
    body = (
      <>
        <rect width={100} height={100} fill="#BFE3F2" />
        <circle cx={76} cy={22} r={9} fill="#FFF6C9" />
        <path d="M-5 80 L30 30 L52 60 L70 38 L105 80 Z" fill="#5E7F9C" />
        <path d="M30 30 L38 42 L33 40 L27 44 Z M70 38 L76 46 L70 45 L65 47 Z" fill="#FFFFFF" />
        <rect y={78} width={100} height={22} fill="#7FB069" />
      </>
    );
  } else if (kind === "city") {
    body = (
      <>
        <rect width={100} height={100} fill="#2B2F55" />
        {[8, 22, 38, 54, 70, 84].map((x, i) => {
          const hh = 30 + rnd(`b${i}`) * 40;
          return (
            <g key={i}>
              <rect x={x} y={100 - hh} width={13} height={hh} fill={["#4B5394", "#3C4280", "#5A63A8"][i % 3]} />
              {Array.from({ length: 4 }, (_, j) => (
                <rect key={j} x={x + 3 + (j % 2) * 5} y={100 - hh + 5 + Math.floor(j / 2) * 8} width={3} height={3} fill="#FFD66B" opacity={rnd(`w${i}${j}`) > 0.3 ? 1 : 0.2} />
              ))}
            </g>
          );
        })}
        <circle cx={80} cy={18} r={6} fill="#F4F1DA" />
      </>
    );
  } else if (kind === "flower") {
    body = (
      <>
        <rect width={100} height={100} fill="#DDEFC9" />
        <path d="M50 100 L50 52" stroke="#3E7D3A" strokeWidth={4} />
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx={50} cy={36} rx={9} ry={17} fill={["#F27BA6", "#FFB13B", "#E9608A"][seed % 3]} transform={`rotate(${a} 50 48)`} />
        ))}
        <circle cx={50} cy={48} r={8} fill="#FFD84A" />
      </>
    );
  } else if (kind === "food") {
    body = (
      <>
        <rect width={100} height={100} fill="#F6D9B0" />
        <circle cx={50} cy={52} r={34} fill="#FFFFFF" />
        <circle cx={50} cy={52} r={26} fill={["#E7A23B", "#D2553B", "#9BBF4A"][seed % 3]} />
        <circle cx={42} cy={46} r={5} fill="#FFF4D6" opacity={0.8} />
        <circle cx={58} cy={58} r={4} fill="#7C3B1E" opacity={0.6} />
      </>
    );
  } else if (kind === "pet") {
    body = (
      <>
        <rect width={100} height={100} fill="#CFE6F5" />
        <ellipse cx={50} cy={78} rx={30} ry={20} fill="#D99B5B" />
        <circle cx={50} cy={50} r={20} fill="#E2A766" />
        <path d="M34 38 L30 20 L44 32 Z M66 38 L70 20 L56 32 Z" fill="#C3854A" />
        <circle cx={43} cy={48} r={3} fill="#1A1A1A" />
        <circle cx={57} cy={48} r={3} fill="#1A1A1A" />
        <ellipse cx={50} cy={57} rx={4} ry={3} fill="#5A3020" />
      </>
    );
  } else {
    // "family": two simple flat figures (fictional).
    body = (
      <>
        <rect width={100} height={100} fill="#FFE7C2" />
        <circle cx={36} cy={44} r={12} fill="#C98E64" />
        <path d="M24 42 Q36 26 48 42 Q44 32 36 32 Q28 32 24 42 Z" fill="#1E1712" />
        <rect x={22} y={58} width={28} height={42} rx={12} fill={P.teal} />
        <circle cx={64} cy={48} r={11} fill="#E3B08A" />
        <path d="M53 48 Q54 32 64 32 Q76 32 76 50 Q72 40 64 38 Q56 40 53 48 Z" fill="#3A2418" />
        <rect x={51} y={61} width={26} height={39} rx={12} fill={P.pink} />
      </>
    );
  }
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" width={w} height={h} style={{ display: "block", borderRadius: r, overflow: "hidden", ...style }}>
      {body}
    </svg>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Phone and app chrome

/** A phone body; `children` fill the screen. `glow` adds a lime rim. */
export const PhoneShell: React.FC<{ w: number; children?: React.ReactNode; dark?: boolean; glow?: number; style?: React.CSSProperties }> = ({ w, children, dark = false, glow = 0, style }) => {
  const h = w * 2.02;
  return (
    <div
      style={{
        position: "relative",
        width: w,
        height: h,
        borderRadius: w * 0.15,
        background: P.ink,
        border: `6px solid ${P.ink}`,
        boxShadow: `${shadow.soft}${glow > 0 ? `, 0 0 ${60 * glow}px ${16 * glow}px rgba(200,241,105,${0.55 * glow})` : ""}`,
        ...style,
      }}
    >
      <div style={{ position: "absolute", inset: w * 0.035, borderRadius: w * 0.12, background: dark ? "#141414" : P.paper, overflow: "hidden" }}>{children}</div>
      <div style={{ position: "absolute", left: "50%", top: w * 0.055, width: w * 0.26, height: w * 0.06, marginLeft: -w * 0.13, borderRadius: 99, background: P.ink }} />
    </div>
  );
};

/** Top status row of a phone screen (time and battery), sized from the screen width. */
export const StatusRow: React.FC<{ w: number; dark?: boolean }> = ({ w, dark = false }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: `${w * 0.035}px ${w * 0.07}px 0`, ...type.display, fontSize: w * 0.045, color: dark ? P.card : P.ink }}>
    <span>9:41</span>
    <span style={{ width: w * 0.08, height: w * 0.035, borderRadius: 4, border: `2px solid ${dark ? P.card : P.ink}`, display: "inline-block" }} />
  </div>
);

/** A 3-column photo grid. `kinds` loops; `appear` (0 to 1) drops the tiles in one by one. */
export const PhotoGrid: React.FC<{ w: number; rows: number; kinds: SnapKind[]; appear?: number; gap?: number; seed?: number; dim?: number }> = ({ w, rows, kinds, appear = 1, gap = 6, seed = 0, dim = 0 }) => {
  const cell = (w - gap * 2) / 3;
  const n = rows * 3;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(3, ${cell}px)`, gap, width: w }}>
      {Array.from({ length: n }, (_, i) => {
        const k = clamp01(appear * n - i);
        return (
          <div key={i} style={{ opacity: k * (1 - dim), transform: `scale(${lerp(0.6, 1, eo(k))})` }}>
            <Snap kind={kinds[(i + seed) % kinds.length]} seed={i + seed} w={cell} h={cell} r={6} />
          </div>
        );
      })}
    </div>
  );
};

/** The app's search pill. `typed` characters of `text` are shown, with a caret while typing. */
export const SearchPill: React.FC<{ w: number; text: string; typed: number; t: number; active?: number; placeholder?: string }> = ({ w, text, typed, t, active = 0, placeholder = "Search your photos" }) => {
  const n = Math.max(0, Math.min(text.length, Math.floor(typed)));
  const fs = w * 0.065;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: w * 0.03,
        height: w * 0.15,
        borderRadius: 999,
        background: P.card,
        border: `${lerp(3, 5, active)}px solid ${active > 0.5 ? P.ink : P.lineStrong}`,
        boxShadow: active > 0.5 ? shadow.hard(5) : "none",
        padding: `0 ${w * 0.05}px`,
      }}
    >
      <svg width={fs * 1.1} height={fs * 1.1} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
        <circle cx={10} cy={10} r={6.5} fill="none" stroke={P.ink} strokeWidth={2.6} />
        <path d="M15 15 L21 21" stroke={P.ink} strokeWidth={2.8} strokeLinecap="round" />
      </svg>
      {n === 0 ? (
        <span style={{ ...type.body, fontSize: fs, color: P.ink3, whiteSpace: "nowrap" }}>{placeholder}</span>
      ) : (
        <span style={{ ...type.display, fontSize: fs * 1.08, color: P.ink, whiteSpace: "nowrap" }}>{text.slice(0, n)}</span>
      )}
      {active > 0.5 && n < text.length + 1 && <span style={{ width: 4, height: fs * 1.1, background: P.ink, opacity: Math.floor(t * 6) % 2 ? 1 : 0.1, marginLeft: -w * 0.02 }} />}
    </div>
  );
};

/** Bottom tab bar of the illustrated app (Photos, Search, Sharing, Library). */
export const TabBar: React.FC<{ w: number; on?: number }> = ({ w, on = 0 }) => {
  const icons = [
    // photos
    <path key="p" d="M4 6 h16 v12 h-16 Z M7 15 l3 -4 l3 3 l2 -2 l3 3" fill="none" strokeWidth={2.2} strokeLinejoin="round" />,
    // search
    <g key="s" fill="none" strokeWidth={2.4}><circle cx={10} cy={10} r={6} /><path d="M15 15 L20 20" strokeLinecap="round" /></g>,
    // sharing
    <g key="sh" fill="none" strokeWidth={2.2}><circle cx={8} cy={9} r={3} /><circle cx={16} cy={9} r={3} /><path d="M3 19 q5 -6 10 0 M11 19 q5 -6 10 0" /></g>,
    // library
    <path key="l" d="M5 5 h4 v14 h-4 Z M11 5 h4 v14 h-4 Z M17 6 l3 1 l-3 12 l-3 -1 Z" fill="none" strokeWidth={2.2} strokeLinejoin="round" />,
  ];
  const labels = ["Photos", "Search", "Sharing", "Library"];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: w * 0.17, background: P.card, borderTop: `2px solid ${P.line}`, display: "flex", justifyContent: "space-around", alignItems: "center" }}>
      {icons.map((ic, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <div style={{ padding: "2px 14px", borderRadius: 99, background: i === on ? P.limeSoft : "transparent" }}>
            <svg width={w * 0.075} height={w * 0.075} viewBox="0 0 24 24" stroke={i === on ? P.olive : P.ink3}>
              {ic}
            </svg>
          </div>
          <div style={{ ...type.body, fontSize: w * 0.032, color: i === on ? P.olive : P.ink3 }}>{labels[i]}</div>
        </div>
      ))}
    </div>
  );
};

/** The official Immich logo (flower), from the project's design folder. */
export const ImmichLogo: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <Img src={staticFile("immich/logo/immich-logo.svg")} style={{ width: size, height: size, display: "block", ...style }} />
);

/** A small "illustration" tag for demo screens. */
export const DemoTag: React.FC<{ text?: string; style?: React.CSSProperties; dark?: boolean }> = ({ text = "Illustration", style, dark = false }) => (
  <div style={{ position: "absolute", ...type.label, fontSize: 18, letterSpacing: "0.08em", color: dark ? "#D9D6CC" : P.ink3, background: dark ? "rgba(23,23,23,0.7)" : "rgba(255,255,255,0.85)", border: `2px solid ${dark ? "#55534D" : P.line}`, borderRadius: 8, padding: "4px 10px", whiteSpace: "nowrap", ...style }}>
    {text}
  </div>
);

// ---------------------------------------------------------------------------------------------------------------
// Cards and notifications for the subscription problem (no brand names, no prices).

export const PlanCard: React.FC<{ w?: number; press?: number; style?: React.CSSProperties }> = ({ w = 420, press = 0, style }) => (
  <div style={{ width: w, boxSizing: "border-box", background: P.card, border: `5px solid ${P.ink}`, borderRadius: 26, boxShadow: shadow.hard(8), padding: "22px 26px", ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <CloudIcon size={w * 0.12} />
      <div style={{ ...type.label, fontSize: w * 0.045, color: P.ink3 }}>Storage plan</div>
    </div>
    <div style={{ ...type.display, fontSize: w * 0.09, color: P.ink, marginTop: 12, lineHeight: 1.1 }}>Need more space?</div>
    <div style={{ ...type.body, fontSize: w * 0.055, color: P.ink2, marginTop: 6 }}>Subscribe · renews every month</div>
    <div style={{ marginTop: 16, height: w * 0.15, borderRadius: 99, background: SKY, border: `4px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: w * 0.065, color: P.card, transform: `scale(${1 - 0.06 * press})` }}>
      Upgrade storage
    </div>
  </div>
);

export const Notice: React.FC<{ w?: number; title: string; sub: string; tone?: "red" | "ink" | "gold"; style?: React.CSSProperties }> = ({ w = 380, title, sub, tone = "red", style }) => (
  <div style={{ width: w, boxSizing: "border-box", background: P.card, border: `4px solid ${P.ink}`, borderRadius: 20, boxShadow: shadow.hard(6), padding: "14px 18px", display: "flex", gap: 14, alignItems: "center", ...style }}>
    <div style={{ width: w * 0.13, height: w * 0.13, flexShrink: 0, borderRadius: 14, background: tone === "red" ? RED : tone === "gold" ? P.gold : P.ink, border: `3px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: w * 0.08, color: P.card }}>
      {tone === "gold" ? "₹" : "!"}
    </div>
    <div style={{ minWidth: 0 }}>
      <div style={{ ...type.display, fontSize: w * 0.065, color: P.ink, whiteSpace: "nowrap" }}>{title}</div>
      <div style={{ ...type.body, fontSize: w * 0.048, color: P.ink3, whiteSpace: "nowrap" }}>{sub}</div>
    </div>
  </div>
);

/** `stroke` is in viewBox units (100 wide): keep the default for small icons, pass less for big ones. */
export const CloudIcon: React.FC<{ size: number; fill?: string; stroke?: number }> = ({ size, fill = P.limeSoft, stroke = 6 }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 100 70" style={{ display: "block", overflow: "visible" }}>
    <path d="M24 62 C10 62 4 52 4 44 C4 33 13 26 23 27 C25 13 37 5 50 5 C64 5 74 15 76 27 C87 27 96 35 96 45 C96 55 88 62 78 62 Z" fill={fill} stroke={P.ink} strokeWidth={stroke} strokeLinejoin="round" />
  </svg>
);

/** Storage bar: `fill` 0 to 1, red when nearly full. */
export const StorageBar: React.FC<{ w: number; fill: number; label?: string; note?: string }> = ({ w, fill, label = "Storage", note }) => {
  const full = fill > 0.92;
  return (
    <div style={{ width: w }}>
      <div style={{ display: "flex", justifyContent: "space-between", ...type.label, fontSize: w * 0.05, color: P.ink2 }}>
        <span>{label}</span>
        <span style={{ color: full ? RED : P.ink2 }}>{note ?? `${Math.round(fill * 100)}%`}</span>
      </div>
      <div style={{ marginTop: 8, height: w * 0.07, borderRadius: 99, background: P.paper2, border: `3px solid ${P.ink}`, overflow: "hidden" }}>
        <div style={{ width: `${clamp01(fill) * 100}%`, height: "100%", background: full ? RED : P.lime }} />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Server, cloud, terminal, laptop, drives

/** A small home server. `k` (0 to 1) assembles it: case, then drive bays, then lights. */
export const HomeServer: React.FC<{ w: number; k: number; t: number; label?: string }> = ({ w, k, t, label = "Your server" }) => {
  const h = w * 1.05;
  const a = eo(seg(k, 0, 0.4));
  const bays = [0, 1, 2].map((i) => eo(seg(k, 0.3 + i * 0.12, 0.6 + i * 0.12)));
  const lights = seg(k, 0.85, 1);
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: w * 0.09, background: P.ink, border: `6px solid ${P.ink}`, boxShadow: `10px 10px 0 ${P.olive}`, transform: `translateY(${(1 - a) * 160}px) scale(${lerp(0.7, 1, a)})`, opacity: a }}>
        <div style={{ position: "absolute", left: w * 0.08, right: w * 0.08, top: w * 0.08, height: w * 0.1, display: "flex", gap: w * 0.04, alignItems: "center" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: w * 0.06, height: w * 0.06, borderRadius: 99, background: lights > 0 ? (i === 0 ? P.lime : Math.floor(t * 4 + i) % 2 ? P.lime : "#3B5A12") : "#333", opacity: lights > 0 ? 1 : 0.6 }} />
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ ...type.label, fontSize: w * 0.055, color: "#9C9A92" }}>{label}</div>
        </div>
        {bays.map((b, i) => (
          <div key={i} style={{ position: "absolute", left: w * 0.08, right: w * 0.08, top: w * (0.26 + i * 0.24), height: w * 0.19, borderRadius: w * 0.04, background: "#2E2D2A", border: `3px solid #4A4944`, transform: `translateX(${(1 - b) * w * 0.9}px)`, opacity: b, display: "flex", alignItems: "center", padding: `0 ${w * 0.05}px`, gap: w * 0.04 }}>
            <div style={{ width: w * 0.04, height: w * 0.04, borderRadius: 99, background: lights > 0 ? P.lime : "#555" }} />
            <div style={{ flex: 1, height: w * 0.025, borderRadius: 99, background: "#4A4944" }} />
          </div>
        ))}
      </div>
    </div>
  );
};

/** A moving dotted lime line between two points (in the parent's px). `k` draws it, `t` moves the dots. */
export const FlowLine: React.FC<{ from: [number, number]; to: [number, number]; k: number; t: number; bend?: number; width?: number }> = ({ from, to, k, t, bend = -120, width = 10 }) => {
  if (k <= 0) return null;
  const mx = (from[0] + to[0]) / 2;
  const my = (from[1] + to[1]) / 2 + bend;
  const d = `M${from[0]} ${from[1]} Q${mx} ${my} ${to[0]} ${to[1]}`;
  const len = Math.hypot(to[0] - from[0], to[1] - from[1]) * 1.25;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      <path d={d} fill="none" stroke={P.ink} strokeWidth={width + 8} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - k)} />
      <path d={d} fill="none" stroke={P.lime} strokeWidth={width} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - k)} />
      {k >= 1 && <path d={d} fill="none" stroke={P.card} strokeWidth={width * 0.5} strokeLinecap="round" strokeDasharray={`2 ${width * 3}`} strokeDashoffset={-t * 120} />}
    </svg>
  );
};

/** A rack server card for the cloud VM. */
export const VmCard: React.FC<{ w: number; t: number; spin: number }> = ({ w, t, spin }) => (
  <div style={{ width: w, transform: `perspective(900px) rotateY(${spin}deg)`, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 22, boxShadow: shadow.hard(8), padding: "16px 20px", boxSizing: "border-box" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 16, height: 16, borderRadius: 99, background: Math.floor(t * 3) % 2 ? P.lime : P.olive, border: `3px solid ${P.ink}` }} />
      <div style={{ ...type.label, fontSize: w * 0.05, color: P.ink3 }}>Virtual server</div>
    </div>
    {[0, 1].map((i) => (
      <div key={i} style={{ marginTop: 12, height: w * 0.1, borderRadius: 10, background: P.ink, display: "flex", alignItems: "center", gap: 8, padding: "0 12px" }}>
        {[0, 1, 2, 3].map((j) => (
          <div key={j} style={{ width: w * 0.05, height: w * 0.025, borderRadius: 4, background: (Math.floor(t * 5) + i + j) % 3 ? "#4A4944" : P.lime }} />
        ))}
      </div>
    ))}
  </div>
);

/** A round storage gauge: `fill` 0 to 1. */
export const Gauge: React.FC<{ size: number; fill: number; label: string }> = ({ size, fill, label }) => {
  const r = 40;
  const c = Math.PI * r; // half circle
  return (
    <div style={{ width: size, textAlign: "center" }}>
      <svg width={size} height={size * 0.62} viewBox="0 0 100 62">
        <path d="M10 55 A40 40 0 0 1 90 55" fill="none" stroke={P.paper2} strokeWidth={12} strokeLinecap="round" />
        <path d="M10 55 A40 40 0 0 1 90 55" fill="none" stroke={fill > 0.85 ? RED : P.gold} strokeWidth={12} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - clamp01(fill))} />
        <path d="M10 55 A40 40 0 0 1 90 55" fill="none" stroke={P.ink} strokeWidth={2.5} strokeDasharray="1 7" />
        <g transform={`rotate(${-90 + 180 * clamp01(fill)} 50 55)`}>
          <path d="M50 55 L50 22" stroke={P.ink} strokeWidth={4} strokeLinecap="round" />
        </g>
        <circle cx={50} cy={55} r={6} fill={P.ink} />
      </svg>
      <div style={{ ...type.label, fontSize: size * 0.085, color: P.ink }}>{label}</div>
    </div>
  );
};

/** A terminal window that types its lines over `k` (0 to 1). */
export const Terminal: React.FC<{ w: number; lines: string[]; k: number; t: number }> = ({ w, lines, k, t }) => {
  const total = lines.reduce((s, l) => s + l.length, 0);
  let left = Math.floor(total * clamp01(k));
  return (
    <div style={{ width: w, background: "#1B1B1A", border: `5px solid ${P.ink}`, borderRadius: 20, boxShadow: shadow.hard(8), overflow: "hidden" }}>
      <div style={{ display: "flex", gap: 8, padding: "12px 16px", background: "#2C2B28" }}>
        {[RED, P.gold, P.lime].map((c) => (
          <div key={c} style={{ width: 16, height: 16, borderRadius: 99, background: c }} />
        ))}
      </div>
      <div style={{ padding: "14px 18px 18px", fontFamily: mono, fontWeight: 500, fontSize: w * 0.042, lineHeight: 1.5, color: "#E8E6DF", minHeight: w * 0.3 }}>
        {lines.map((l, i) => {
          const n = Math.max(0, Math.min(l.length, left));
          left -= l.length;
          if (n <= 0 && i > 0) return null;
          const typing = n < l.length;
          return (
            <div key={i} style={{ whiteSpace: "pre" }}>
              <span style={{ color: P.lime }}>$ </span>
              {l.slice(0, n)}
              {typing && <span style={{ opacity: Math.floor(t * 6) % 2 ? 1 : 0, background: "#E8E6DF" }}> </span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** A laptop; `children` go on the screen. */
export const Laptop: React.FC<{ w: number; children?: React.ReactNode }> = ({ w, children }) => (
  <div style={{ width: w }}>
    <div style={{ position: "relative", width: w * 0.86, height: w * 0.56, margin: "0 auto", background: P.ink, borderRadius: `${w * 0.03}px ${w * 0.03}px 0 0`, border: `6px solid ${P.ink}`, boxShadow: shadow.soft }}>
      <div style={{ position: "absolute", inset: w * 0.022, borderRadius: w * 0.012, background: P.paper, overflow: "hidden" }}>{children}</div>
    </div>
    <div style={{ height: w * 0.045, background: "#D9D6CC", border: `5px solid ${P.ink}`, borderRadius: `0 0 ${w * 0.03}px ${w * 0.03}px` }} />
  </div>
);

/** A warning triangle. */
export const WarnIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
    <path d="M50 8 L94 88 L6 88 Z" fill={P.gold} stroke={P.ink} strokeWidth={8} strokeLinejoin="round" />
    <path d="M50 36 L50 62" stroke={P.ink} strokeWidth={10} strokeLinecap="round" />
    <circle cx={50} cy={76} r={6} fill={P.ink} />
  </svg>
);

/** A drive holding a fanned stack of photos, with a label. */
export const DriveStack: React.FC<{ w: number; label: string; tone: "lime" | "ink"; seed?: number; logo?: boolean }> = ({ w, label, tone, seed = 0, logo = false }) => (
  <div style={{ width: w, display: "flex", flexDirection: "column", alignItems: "center" }}>
    <div style={{ position: "relative", width: w * 0.8, height: w * 0.62 }}>
      {(["sunset", "family", "mountain", "pet"] as SnapKind[]).map((kind, i) => (
        <div key={i} style={{ position: "absolute", left: w * 0.1 + i * w * 0.08, top: w * 0.02 + (3 - i) * 4, transform: `rotate(${(i - 1.5) * 7}deg)`, border: `4px solid ${P.card}`, borderRadius: 12, boxShadow: "0 6px 14px rgba(0,0,0,0.18)" }}>
          <Snap kind={kind} seed={i + seed} w={w * 0.36} h={w * 0.36} r={8} />
        </div>
      ))}
    </div>
    <div style={{ width: w, height: w * 0.36, borderRadius: w * 0.07, background: tone === "lime" ? P.lime : P.ink, border: `5px solid ${P.ink}`, boxShadow: shadow.hard(7), display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
      {logo && <ImmichLogo size={w * 0.16} />}
      <div style={{ ...type.display, fontSize: w * 0.085, color: tone === "lime" ? P.ink : P.lime, textAlign: "center", lineHeight: 1.05 }}>{label}</div>
    </div>
  </div>
);

/** A fictional cartoon face for the People demo. */
export const FaceChip: React.FC<{ size: number; v: number }> = ({ size, v }) => {
  const skins = ["#E3B08A", "#C98E64", "#B97F58", "#F0C6A0", "#A9714D"];
  const hairs = ["#1E1712", "#3A2418", "#5B5853", "#1C1512", "#7A4A2A"];
  const bgs = [P.limeSoft, "#D6E8F7", "#FBE1C6", "#EBDDF6", "#D7F0E4"];
  const s = skins[v % 5];
  const hr = hairs[(v * 2) % 5];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
      <circle cx={50} cy={50} r={47} fill={bgs[v % 5]} stroke={P.ink} strokeWidth={5} />
      <clipPath id={`fc${v}-${Math.round(size)}`}>
        <circle cx={50} cy={50} r={45} />
      </clipPath>
      <g clipPath={`url(#fc${v}-${Math.round(size)})`}>
        <rect x={22} y={74} width={56} height={40} rx={20} fill={[P.teal, P.pink, P.gold, SKY, P.olive][v % 5]} />
        <circle cx={50} cy={50} r={22} fill={s} />
        {v % 2 === 0 ? <path d="M28 46 Q30 24 50 24 Q70 24 72 46 Q66 34 50 34 Q34 34 28 46 Z" fill={hr} /> : <path d="M26 58 Q24 24 50 22 Q76 24 74 58 Q70 36 50 34 Q30 36 26 58 Z" fill={hr} />}
        <circle cx={42} cy={51} r={3} fill="#1A1A1A" />
        <circle cx={58} cy={51} r={3} fill="#1A1A1A" />
        <path d="M43 60 Q50 65 57 60" fill="none" stroke="#5E1F22" strokeWidth={3} strokeLinecap="round" />
      </g>
    </svg>
  );
};

/** An album folder with a cover photo. */
export const Album: React.FC<{ w: number; name: string; kind: SnapKind; seed?: number; count?: number }> = ({ w, name, kind, seed = 0, count }) => (
  <div style={{ width: w }}>
    <div style={{ position: "relative", width: w, height: w, borderRadius: 18, border: `4px solid ${P.ink}`, overflow: "hidden", boxShadow: shadow.hard(5), background: P.card }}>
      <Snap kind={kind} seed={seed} w={w - 8} h={w - 8} r={0} />
    </div>
    <div style={{ ...type.display, fontSize: w * 0.16, color: P.ink, marginTop: 8 }}>{name}</div>
    {count !== undefined && <div style={{ ...type.body, fontSize: w * 0.11, color: P.ink3 }}>{count} items</div>}
  </div>
);

/** A round progress ring with a tick when done (0 to 1). */
export const UploadRing: React.FC<{ size: number; k: number }> = ({ size, k }) => {
  const c = 2 * Math.PI * 40;
  const done = k >= 1;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx={50} cy={50} r={40} fill={done ? P.lime : P.card} stroke={P.line} strokeWidth={10} />
      <circle cx={50} cy={50} r={40} fill="none" stroke={done ? P.ink : SKY} strokeWidth={10} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - clamp01(k))} transform="rotate(-90 50 50)" />
      {done && <path d="M32 52 L45 64 L69 38" fill="none" stroke={P.ink} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />}
      {!done && <path d="M50 64 L50 36 M38 47 L50 35 L62 47" fill="none" stroke={P.ink} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
};

/** Big lime-on-ink feature label used across the scenes. */
export const BigLabel: React.FC<{ text: string; size: number; tone?: "lime" | "ink" | "card" | "red"; rotate?: number; style?: React.CSSProperties }> = ({ text, size, tone = "ink", rotate = -2, style }) => {
  const bg = tone === "lime" ? P.lime : tone === "card" ? P.card : tone === "red" ? RED : P.ink;
  const fg = tone === "lime" || tone === "card" ? P.ink : tone === "red" ? P.card : P.lime;
  return (
    <div style={{ display: "inline-block", background: bg, color: fg, border: `${Math.max(4, size * 0.07)}px solid ${P.ink}`, borderRadius: size * 0.3, padding: `${size * 0.1}px ${size * 0.34}px`, boxShadow: tone === "ink" ? `${size * 0.1}px ${size * 0.1}px 0 ${P.lime}` : shadow.hard(Math.round(size * 0.1)), transform: `rotate(${rotate}deg)`, ...type.display, fontSize: size, whiteSpace: "nowrap", ...style }}>
      {text}
    </div>
  );
};
