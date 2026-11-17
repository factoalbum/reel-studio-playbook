import React from "react";
import { AbsoluteFill } from "remotion";
import { Avatar, isClassicMascot, type AvatarKey, type Expr } from "./Avatar";
import { Pointer } from "./Bits";
import { Backdrop, BrandMark } from "./Chrome";
import { mono, palette as P, shadow, type } from "./tokens";

/**
 * Brand identity set: the profile picture and the channel banners (X, YouTube, Facebook).
 * Same avatar, palette and type as the reels. Every banner puts the avatar in its lime disc on the right,
 * with four orbit badges for the pillars, and the name on the left, clear of where each platform
 * crops the image or lays the profile picture over it.
 */
const SITE = "internetoolbox.com";
const PILLARS = ["AI", "Websites", "Tools", "Online Growth"];
// The website's light lime (illustrations).
const LIME_LIGHT = "#D8F68F";

/** Square profile picture: the avatar's head and shoulders on lime, readable down to comment size. */
export const ProfilePicture: React.FC<{ expr?: Expr }> = ({ expr = "happy" }) => {
  // The refreshed mascot has a larger head and a chest badge: a little smaller and lower, so the hair clears
  // the circle crop at the top and the whole badge shows. The first look keeps its own numbers.
  const classic = isClassicMascot();
  const s = classic ? 1.3 : 1.12;
  const face = { x: 540, y: classic ? 456 : 466 };
  return (
    <AbsoluteFill style={{ background: P.lime }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <circle cx={face.x} cy={face.y} r={360} fill={LIME_LIGHT} />
        <circle cx={face.x} cy={face.y} r={440} fill="none" stroke={P.limeDeep} strokeWidth={8} />
      </svg>
      <Avatar keys={[{ at: -10, pose: "rest", expr, tilt: -4 }]} places={[{ at: -10, x: face.x, y: face.y - 66 * s, s }]} env={[0]} blinks={[]} halo={false} />
    </AbsoluteFill>
  );
};

type Spec = {
  w: number;
  h: number;
  /** The lime disc holding the avatar: centre and radius. */
  disc: { cx: number; cy: number; r: number };
  /** Text block: left edge, vertical centre, name size. */
  text: { x: number; cy: number; size: number };
  /** Where the badges sit on the orbit (degrees, 0 = right, 90 = down), in the order AI, Websites, Tools, Growth. */
  angles: number[];
  /** Check overlay only: the area every device shows, and where the platform puts the profile picture. */
  safe: [number, number, number, number];
  avoid: [number, number, number][];
};

export const BANNERS = {
  // 1500 x 500. The profile picture covers the bottom left; in the phone app, round buttons sit over the
  // middle of both ends (back on the left, search and more on the right), so the face and text stay between them.
  x: { w: 1500, h: 500, disc: { cx: 1025, cy: 252, r: 172 }, text: { x: 205, cy: 212, size: 70 }, angles: [-122, -48, 48, 122], safe: [0, 60, 1500, 380], avoid: [[216, 520, 185], [122, 266, 62], [1206, 266, 62], [1378, 266, 62]] },
  // 2560 x 1440. Phones show only the middle 1546 x 423; computers show the full width of that band; TVs show everything.
  youtube: { w: 2560, h: 1440, disc: { cx: 1785, cy: 720, r: 180 }, text: { x: 600, cy: 720, size: 100 }, angles: [-150, -30, 30, 150], safe: [507, 508, 1546, 423], avoid: [] },
  // 1640 x 624. Phones cut the sides (keep to the middle 1120); the profile picture overlaps the bottom left.
  facebook: { w: 1640, h: 624, disc: { cx: 1120, cy: 300, r: 176 }, text: { x: 318, cy: 252, size: 66 }, angles: [-120, -60, 60, 120], safe: [260, 0, 1120, 624], avoid: [[150, 600, 120], [470, 640, 180]] },
} satisfies Record<string, Spec>;

const ink = { stroke: P.ink, strokeWidth: 6, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const sparkle = (x: number, y: number, r: number) => {
  const k = r * 0.2;
  return `M${x} ${y - r} Q${x + k} ${y - k} ${x + r} ${y} Q${x + k} ${y + k} ${x} ${y + r} Q${x - k} ${y + k} ${x - r} ${y} Q${x - k} ${y - k} ${x} ${y - r} Z`;
};

/** The four pillars as icons, drawn in a 100 x 100 box around 0,0. */
const ICONS = {
  ai: (
    <>
      <path d={sparkle(-6, 6, 36)} fill={P.lime} {...ink} />
      <path d={sparkle(27, -27, 13)} fill={P.ink} {...ink} strokeWidth={3} />
    </>
  ),
  web: (
    <>
      <rect x={-38} y={-30} width={76} height={60} rx={10} fill={P.card} />
      <path d="M-38 -12 V-20 Q-38 -30 -28 -30 H28 Q38 -30 38 -20 V-12 Z" fill={P.lime} />
      <circle cx={-27} cy={-21} r={3.5} fill={P.ink} />
      <circle cx={-17} cy={-21} r={3.5} fill={P.ink} />
      <path d="M-38 -12 H38" {...ink} strokeWidth={5} />
      <rect x={-38} y={-30} width={76} height={60} rx={10} fill="none" {...ink} />
      <path d="M-11 -2 L-21 8 L-11 18 M11 -2 L21 8 L11 18 M5 -5 L-5 21" fill="none" {...ink} strokeWidth={5} />
    </>
  ),
  tools: (
    <>
      <path d="M-14 -14 V-24 Q-14 -32 -6 -32 H6 Q14 -32 14 -24 V-14" fill="none" {...ink} />
      <rect x={-40} y={-14} width={80} height={46} rx={9} fill={P.lime} {...ink} />
      <path d="M-40 4 H40" {...ink} strokeWidth={5} />
      <rect x={-9} y={-3} width={18} height={15} rx={3} fill={P.card} {...ink} strokeWidth={5} />
    </>
  ),
  growth: (
    <>
      <path d="M-38 16 L-12 -10 L6 8 L34 -22 V30 H-38 Z" fill={P.lime} />
      <path d="M-38 16 L-12 -10 L6 8 L34 -22 M14 -22 H34 V-2" fill="none" {...ink} />
      <path d="M-42 30 H40" {...ink} />
    </>
  ),
};
const BADGES = ["ai", "web", "tools", "growth"] as const;

const Badge: React.FC<{ icon: (typeof BADGES)[number]; x: number; y: number; d: number; tilt: number }> = ({ icon, x, y, d, tilt }) => (
  <div
    style={{
      position: "absolute",
      left: x - d / 2,
      top: y - d / 2,
      width: d,
      height: d,
      borderRadius: d,
      background: P.card,
      border: `${Math.max(3, Math.round(d * 0.055))}px solid ${P.ink}`,
      boxShadow: shadow.hard(Math.max(3, Math.round(d * 0.06))),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <svg viewBox="-50 -50 100 100" width={d * 0.66} height={d * 0.66} style={{ overflow: "visible", transform: `rotate(${tilt}deg)` }}>
      {ICONS[icon]}
    </svg>
  </div>
);

const BANNER_POSE: AvatarKey = { at: -10, pose: "wave", expr: "happy" };

/** The avatar in its lime disc, with the website's rings and the four pillar badges on a dotted orbit. */
const DiscPortrait: React.FC<{ cx: number; cy: number; r: number; w: number; angles: number[] }> = ({ cx, cy, r, w, angles }) => {
  const s = r / 360;
  const orbit = r * 1.3;
  // Above the disc centre the avatar may pass the edge (hair, waving hand); below it the disc cuts the body.
  const clip = `path("M0 0 H${w} V${cy} H${cx + r} A${r} ${r} 0 0 1 ${cx - r} ${cy} H0 Z")`;
  // The outer rings fade out before they reach the text.
  const fade = `linear-gradient(90deg, transparent ${cx - r * 2.2}px, black ${cx - r * 1.3}px)`;
  return (
    <>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", maskImage: fade, WebkitMaskImage: fade }}>
        {[1.75, 2.35].map((k, i) => (
          <circle key={k} cx={cx} cy={cy} r={r * k} fill="none" stroke={P.lime} strokeWidth={r * 0.022} opacity={0.55 - i * 0.2} />
        ))}
      </svg>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
        <circle cx={cx} cy={cy} r={orbit} fill="none" stroke={P.ink2} strokeOpacity={0.4} strokeWidth={Math.max(2, r * 0.018)} strokeDasharray={`0 ${r * 0.075}`} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={r} fill={P.limeSoft} />
        <circle cx={cx} cy={cy} r={r * 0.8} fill="none" stroke={P.lime} strokeWidth={r * 0.028} />
        <circle cx={cx} cy={cy} r={r * 0.6} fill="none" stroke={P.lime} strokeWidth={r * 0.028} opacity={0.75} />
      </svg>
      <AbsoluteFill style={{ clipPath: clip }}>
        <Avatar keys={[BANNER_POSE]} places={[{ at: -10, x: cx, y: cy - (isClassicMascot() ? 170 : 144) * s, s }]} env={[0]} blinks={[]} halo={false} />
      </AbsoluteFill>
      {BADGES.map((k, i) => {
        const a = (angles[i] * Math.PI) / 180;
        return <Badge key={k} icon={k} x={cx + Math.cos(a) * orbit} y={cy + Math.sin(a) * orbit} d={r * 0.44} tilt={[-6, 5, -4, 6][i]} />;
      })}
    </>
  );
};

const Pillars: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.45, ...type.body, fontWeight: 600, fontSize: size, color: P.ink2, whiteSpace: "nowrap", ...style }}>
    {PILLARS.map((p, i) => (
      <React.Fragment key={p}>
        {i > 0 && <span style={{ width: size * 0.32, height: size * 0.32, borderRadius: size, background: P.lime, border: `${Math.max(2, size * 0.07)}px solid ${P.ink}`, flexShrink: 0 }} />}
        <span>{p}</span>
      </React.Fragment>
    ))}
  </div>
);

/** The site address (or one of its pages) as a browser bar, with the cursor on it. */
export const SiteBar: React.FC<{ size: number; text?: string; style?: React.CSSProperties }> = ({ size, text = SITE, style }) => (
  <div
    style={{
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: size * 0.55,
      padding: `${size * 0.42}px ${size * 1.1}px ${size * 0.42}px ${size * 0.6}px`,
      background: P.card,
      border: `${Math.max(3, Math.round(size * 0.11))}px solid ${P.ink}`,
      borderRadius: 999,
      boxShadow: shadow.hard(Math.max(3, Math.round(size * 0.16))),
      ...style,
    }}
  >
    <div style={{ display: "flex", gap: size * 0.22 }}>
      {[P.pink, P.gold, P.lime].map((c) => (
        <span key={c} style={{ width: size * 0.42, height: size * 0.42, borderRadius: size, background: c, border: `${Math.max(1.5, size * 0.06)}px solid ${P.ink}` }} />
      ))}
    </div>
    <span style={{ fontFamily: mono, fontWeight: 600, fontSize: size, lineHeight: 1, color: P.ink }}>{text}</span>
    <div style={{ position: "absolute", left: "100%", top: "50%", marginLeft: -size * 0.75, transform: `scale(${size / 46})`, transformOrigin: "0 0" }}>
      <Pointer />
    </div>
  </div>
);

const TextBlock: React.FC<{ x: number; cy: number; size: number }> = ({ x, cy, size }) => (
  <div style={{ position: "absolute", left: x, top: cy, transform: "translateY(-50%)", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.24 }}>
      <BrandMark size={size * 1.04} />
      <div style={{ ...type.display, fontSize: size, color: P.ink, whiteSpace: "nowrap" }}>Internet Toolbox</div>
    </div>
    <Pillars size={size * 0.42} style={{ marginTop: size * 0.32 }} />
    <SiteBar size={size * 0.32} style={{ marginTop: size * 0.4 }} />
  </div>
);

const Guides: React.FC<{ b: Spec }> = ({ b }) => (
  <AbsoluteFill>
    <div style={{ position: "absolute", left: b.safe[0], top: b.safe[1], width: b.safe[2], height: b.safe[3], outline: "4px dashed #E5484D", outlineOffset: -4 }} />
    {b.avoid.map(([x, y, r], i) => (
      <div key={i} style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r, background: "rgba(229,72,77,0.3)" }} />
    ))}
  </AbsoluteFill>
);

/** Channel banner. `guides` overlays the platform's crop and profile-picture areas (for checking only). */
export const Banner: React.FC<{ spec: keyof typeof BANNERS; guides?: boolean }> = ({ spec, guides = false }) => {
  const b: Spec = BANNERS[spec];
  return (
    <AbsoluteFill>
      <Backdrop />
      <DiscPortrait {...b.disc} w={b.w} angles={b.angles} />
      <TextBlock {...b.text} />
      {guides && <Guides b={b} />}
    </AbsoluteFill>
  );
};

/** Preview only: the profile picture as a circle at profile, feed and comment sizes, on light and dark apps. */
export const ProfileSizes: React.FC = () => (
  <AbsoluteFill>
    {["#FFFFFF", "#000000"].map((bg, row) => (
      <div key={bg} style={{ position: "absolute", left: 0, right: 0, top: row * 420, height: 420, background: bg, display: "flex", alignItems: "center", justifyContent: "center", gap: 70 }}>
        {(["happy", "talk"] as const).map((expr) => (
          <div key={expr} style={{ display: "flex", alignItems: "center", gap: 36 }}>
            {[320, 110, 40].map((d) => (
              <div key={d} style={{ width: d, height: d, borderRadius: d, overflow: "hidden", position: "relative", flexShrink: 0 }}>
                <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1080, transform: `scale(${d / 1080})`, transformOrigin: "0 0" }}>
                  <ProfilePicture expr={expr} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    ))}
  </AbsoluteFill>
);
