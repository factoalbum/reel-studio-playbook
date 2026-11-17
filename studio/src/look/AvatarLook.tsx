// The refreshed mascot. It started as a copy of brand/Avatar.tsx for trying new looks; since 15 Nov 2026
// brand/Avatar.tsx draws this one with the approved settings (AVATAR_LOOK), so every reel uses it.
import React from "react";
import { random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { palette as P, sans } from "../brand/tokens";
import { HairBack, HairFront, OUTFIT, Stubble, Torso, type HairKind, type OutfitKind } from "./parts";

/**
 * The Internet Toolbox avatar: the series presenter, drawn from the owner's own look
 * (soft side-parted black hair, slim face, light moustache and chin hair, warm smile, silver watch).
 * The outfit is fixed for every reel: charcoal overshirt with rolled sleeves over the lime IT tee.
 * Drawn in a 600 x 1000 box (face centre 300,330). Poses, expressions and placement are keyframed
 * per episode; the mouth follows the voiceover loudness (one value per frame).
 */
const AVATAR = {
  skin: "#E3B08A",
  skinShade: "#C98F69",
  line: "#2B1B13",
  hair: "#1C1512",
  hairHi: "#4A3B32",
  beard: "#2B1D16",
  shirt: "#2C2B28",
  shirtHi: "#45443F",
  tee: P.lime,
  teeShade: P.limeDeep,
  outline: P.ink,
  white: "#FFFFFF",
  mouth: "#5E1F22",
  tongue: "#D96B64",
  lip: "#B5645A",
  blush: "#E58F7A",
  iris: "#3A2416",
  watch: "#CDD1D6",
  watchFace: "#22211F",
};

type V = [number, number];
export type Hand = "open" | "point" | "palm" | "thumb" | "fist";
export type PoseName = "rest" | "surprised" | "point" | "explain" | "oneMore" | "thumbs" | "think" | "wave";
// "annoyed" and "skeptic" were added for the Immich reel (Nov 2026); the first five are unchanged.
export type Expr = "talk" | "happy" | "surprised" | "excited" | "thinking" | "annoyed" | "skeptic";
/** `aim` is the pointing direction in degrees (0 = right, -90 = up). `look` is where the eyes go, -1..1. `tilt` adds a head tilt in degrees. */
export type AvatarKey = { at: number; pose: PoseName; expr: Expr; aim?: number; look?: V; jump?: boolean; tilt?: number };
/** Screen position of the face centre and the scale (1 = 600 px wide figure). */
export type AvatarPlace = { at: number; x: number; y: number; s: number };

const SL: V = [150, 705];
const SR: V = [450, 705];
const L1 = 150;
const L2 = 140;
// The head sits this much lower than its drawing coordinates, for a shorter neck.
const HEAD_DROP = 66;

type Elbow = "out" | "down";
type Arm = { h: V; elbow: Elbow; hand: Hand; rot?: number };
type Pose = { L: Arm; R: Arm; lean: number; tilt: number };

const rad = (d: number) => (d * Math.PI) / 180;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const along = (E: V, H: V, k: number): V => [lerp(E[0], H[0], k), lerp(E[1], H[1], k)];
const seg = (a: V, b: V) => `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`;

function poseOf(k: AvatarKey): Pose {
  const restL: Arm = { h: [184, 985], elbow: "out", hand: "open" };
  const restR: Arm = { h: [416, 985], elbow: "out", hand: "open" };
  switch (k.pose) {
    case "surprised":
      return { L: { h: [112, 456], elbow: "out", hand: "palm", rot: -16 }, R: { h: [488, 456], elbow: "out", hand: "palm", rot: 16 }, lean: 0, tilt: 0 };
    case "point": {
      const a = rad(k.aim ?? -60);
      return { L: restL, R: { h: [SR[0] + 280 * Math.cos(a), SR[1] + 280 * Math.sin(a)], elbow: "down", hand: "point" }, lean: -2, tilt: -3 };
    }
    case "explain":
      return { L: restL, R: { h: [530, 776], elbow: "down", hand: "open", rot: -24 }, lean: -1, tilt: -2 };
    case "oneMore":
      return { L: { h: [228, 900], elbow: "out", hand: "fist" }, R: { h: [490, 452], elbow: "out", hand: "point", rot: -90 }, lean: 2, tilt: 4 };
    case "thumbs":
      return { L: restL, R: { h: [502, 640], elbow: "down", hand: "thumb" }, lean: 0, tilt: 3 };
    case "think":
      return { L: { h: [318, 716], elbow: "down", hand: "fist" }, R: { h: [326, 556], elbow: "down", hand: "fist" }, lean: -2, tilt: -6 };
    case "wave":
      return { L: restL, R: { h: [542, 432], elbow: "out", hand: "palm", rot: 12 }, lean: 1, tilt: 4 };
    default:
      return { L: restL, R: restR, lean: 0, tilt: 0 };
  }
}

/** Two-bone arm: shoulder S to hand target T. Picks the elbow side that matches `elbow`. */
function ik(S: V, T: V, elbow: Elbow, side: "L" | "R") {
  const dx = T[0] - S[0];
  const dy = T[1] - S[1];
  const d = Math.min(L1 + L2 - 0.5, Math.max(Math.abs(L1 - L2) + 0.5, Math.hypot(dx, dy)));
  const base = Math.atan2(dy, dx);
  const a = Math.acos((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d));
  const cands = [base + a, base - a].map((a1) => [S[0] + L1 * Math.cos(a1), S[1] + L1 * Math.sin(a1)] as V);
  const score = (E: V) => (elbow === "down" ? E[1] : side === "R" ? E[0] : -E[0]);
  const E = score(cands[0]) >= score(cands[1]) ? cands[0] : cands[1];
  const H: V = [S[0] + d * Math.cos(base), S[1] + d * Math.sin(base)];
  return { E, H, theta: (Math.atan2(H[1] - E[1], H[0] - E[0]) * 180) / Math.PI };
}

const skin = { fill: AVATAR.skin, stroke: AVATAR.line, strokeWidth: 5, strokeLinejoin: "round" as const };

/** Hands are drawn at the wrist. Forearm-aligned shapes rotate with the arm; `mirror` flips the thumb side. */
const HandShape: React.FC<{ kind: Hand; H: V; theta: number; rot: number; mirror: boolean }> = ({ kind, H, theta, rot, mirror }) => {
  const m = mirror ? -1 : 1;
  if (kind === "palm") {
    return (
      <g transform={`translate(${H[0]} ${H[1]}) rotate(${rot}) scale(${m} 1)`}>
        {[
          [-27, 40],
          [-12, 48],
          [3, 46],
          [17, 38],
        ].map(([x, h], i) => (
          <rect key={i} x={x} y={-26 - h} width={14} height={h + 12} rx={7} {...skin} />
        ))}
        <path d="M24 -4 C40 -14 50 -30 45 -38 C40 -45 30 -37 20 -24" {...skin} />
        <path d="M-29 -6 C-31 -30 -24 -38 0 -38 C24 -38 30 -30 28 -6 C26 16 14 26 0 26 C-14 26 -27 16 -29 -6 Z" {...skin} />
        <path d="M-10 4 Q0 10 10 4" fill="none" stroke={AVATAR.skinShade} strokeWidth={4} strokeLinecap="round" />
      </g>
    );
  }
  if (kind === "thumb") {
    return (
      <g transform={`translate(${H[0]} ${H[1]}) rotate(${rot}) scale(${m} 1)`}>
        <rect x={-14} y={-78} width={26} height={56} rx={13} {...skin} />
        <rect x={-30} y={-34} width={62} height={60} rx={20} {...skin} />
        <path d="M-22 -14 H22 M-22 2 H22 M-22 16 H20" stroke={AVATAR.line} strokeWidth={3.5} strokeLinecap="round" />
      </g>
    );
  }
  if (kind === "fist") {
    return (
      <g transform={`translate(${H[0]} ${H[1]}) rotate(${theta}) scale(1 ${m})`}>
        <rect x={-8} y={-28} width={58} height={56} rx={22} {...skin} />
        <path d="M30 -16 V16 M40 -12 V12" stroke={AVATAR.line} strokeWidth={3.5} strokeLinecap="round" />
        <path d="M4 -26 C12 -40 32 -38 34 -24" {...skin} />
      </g>
    );
  }
  if (kind === "point") {
    const r = rot !== 0 ? rot : theta;
    return (
      <g transform={`translate(${H[0]} ${H[1]}) rotate(${r}) scale(1 ${m})`}>
        <rect x={34} y={-26} width={66} height={21} rx={10.5} {...skin} />
        <rect x={-8} y={-26} width={56} height={54} rx={22} {...skin} />
        <path d="M26 -2 H46 M24 11 H44" stroke={AVATAR.line} strokeWidth={3.5} strokeLinecap="round" />
        <path d="M4 -24 C12 -38 30 -36 32 -24" {...skin} />
      </g>
    );
  }
  // open: relaxed mitten hand along the forearm, thumb on top
  return (
    <g transform={`translate(${H[0]} ${H[1]}) rotate(${theta + rot}) scale(1 ${m})`}>
      <path d="M-6 -22 C22 -28 52 -26 66 -12 C76 -2 74 14 62 20 C46 28 18 28 -6 22 Z" {...skin} />
      <path d="M44 0 H66" stroke={AVATAR.line} strokeWidth={3.5} strokeLinecap="round" />
      <path d="M6 -20 C12 -40 32 -44 40 -34 C46 -26 36 -18 26 -14" {...skin} />
    </g>
  );
};

/** Rolled overshirt sleeve over a bare forearm. The silver watch sits on the left wrist (the screen-right arm). */
const ArmShape: React.FC<{ S: V; arm: Arm; side: "L" | "R"; wave: number; outfit: OutfitKind }> = ({ S, arm, side, wave, outfit }) => {
  const { E, H, theta } = ik(S, arm.h, arm.elbow, side);
  if (outfit === "tee") {
    const c = OUTFIT.tee;
    const armPath = `M${S[0]} ${S[1]} L${E[0]} ${E[1]} L${H[0]} ${H[1]}`;
    const sleeveEnd = along(S, E, 0.62);
    const sleeve = `M${S[0]} ${S[1]} L${sleeveEnd[0]} ${sleeveEnd[1]}`;
    return (
      <g>
        <path d={armPath} fill="none" stroke={AVATAR.outline} strokeWidth={58} strokeLinecap="round" strokeLinejoin="round" />
        <path d={armPath} fill="none" stroke={AVATAR.skin} strokeWidth={47} strokeLinecap="round" strokeLinejoin="round" />
        <path d={sleeve} fill="none" stroke={AVATAR.outline} strokeWidth={84} strokeLinecap="round" />
        <path d={sleeve} fill="none" stroke={c.body} strokeWidth={72} strokeLinecap="round" />
        {side === "R" && (
          <g>
            <path d={seg(along(E, H, 0.78), along(E, H, 0.93))} stroke={AVATAR.outline} strokeWidth={58} />
            <path d={seg(along(E, H, 0.805), along(E, H, 0.905))} stroke={AVATAR.watch} strokeWidth={49} />
            <circle cx={along(E, H, 0.855)[0]} cy={along(E, H, 0.855)[1]} r={14} fill={AVATAR.watchFace} stroke={AVATAR.watch} strokeWidth={4} />
          </g>
        )}
        <HandShape kind={arm.hand} H={H} theta={theta} rot={(arm.rot ?? 0) + wave} mirror={side === "L"} />
      </g>
    );
  }
  if (outfit !== "overshirt") {
    const c = OUTFIT[outfit];
    const end = along(E, H, 0.8);
    const full = `M${S[0]} ${S[1]} L${E[0]} ${E[1]} L${end[0]} ${end[1]}`;
    return (
      <g>
        <path d={seg(along(E, H, 0.7), H)} stroke={AVATAR.outline} strokeWidth={58} strokeLinecap="round" />
        <path d={seg(along(E, H, 0.7), H)} stroke={AVATAR.skin} strokeWidth={47} strokeLinecap="round" />
        <path d={full} fill="none" stroke={AVATAR.outline} strokeWidth={76} strokeLinecap="round" strokeLinejoin="round" />
        <path d={full} fill="none" stroke={c.body} strokeWidth={64} strokeLinecap="round" strokeLinejoin="round" />
        <path d={seg(along(E, H, 0.7), along(E, H, 0.84))} stroke={AVATAR.outline} strokeWidth={72} />
        <path d={seg(along(E, H, 0.72), along(E, H, 0.82))} stroke={c.cuff} strokeWidth={62} />
        {c.cuffStripe && <path d={seg(along(E, H, 0.765), along(E, H, 0.775))} stroke={c.cuffStripe} strokeWidth={62} />}
        <HandShape kind={arm.hand} H={H} theta={theta} rot={(arm.rot ?? 0) + wave} mirror={side === "L"} />
      </g>
    );
  }
  const fore = seg(along(E, H, 0.36), H);
  const sleeveEnd = along(E, H, 0.42);
  const sleeve = `M${S[0]} ${S[1]} L${E[0]} ${E[1]} L${sleeveEnd[0]} ${sleeveEnd[1]}`;
  return (
    <g>
      <path d={fore} stroke={AVATAR.outline} strokeWidth={58} strokeLinecap="round" />
      <path d={fore} stroke={AVATAR.skin} strokeWidth={47} strokeLinecap="round" />
      <path d={sleeve} fill="none" stroke={AVATAR.outline} strokeWidth={76} strokeLinecap="round" strokeLinejoin="round" />
      <path d={sleeve} fill="none" stroke={AVATAR.shirt} strokeWidth={64} strokeLinecap="round" strokeLinejoin="round" />
      {/* rolled cuff: a slightly wider, lighter band */}
      <path d={seg(along(E, H, 0.3), along(E, H, 0.49))} stroke={AVATAR.outline} strokeWidth={82} />
      <path d={seg(along(E, H, 0.33), along(E, H, 0.46))} stroke={AVATAR.shirtHi} strokeWidth={70} />
      {side === "R" && (
        <g>
          <path d={seg(along(E, H, 0.78), along(E, H, 0.93))} stroke={AVATAR.outline} strokeWidth={58} />
          <path d={seg(along(E, H, 0.805), along(E, H, 0.905))} stroke={AVATAR.watch} strokeWidth={49} />
          <circle cx={along(E, H, 0.855)[0]} cy={along(E, H, 0.855)[1]} r={14} fill={AVATAR.watchFace} stroke={AVATAR.watch} strokeWidth={4} />
          <circle cx={along(E, H, 0.855)[0] - 4} cy={along(E, H, 0.855)[1] - 4} r={3.5} fill="#FFFFFF" opacity={0.6} />
        </g>
      )}
      <HandShape kind={arm.hand} H={H} theta={theta} rot={(arm.rot ?? 0) + wave} mirror={side === "L"} />
    </g>
  );
};

type Face = { liftL: number; liftR: number; archL: number; archR: number; innerL: number; innerR: number; eye: number; smile: number };
const FACES: Record<Expr, Face> = {
  talk: { liftL: 0, liftR: 0, archL: 3, archR: 3, innerL: 0, innerR: 0, eye: 1, smile: 0.2 },
  happy: { liftL: -5, liftR: -5, archL: 6, archR: 6, innerL: 0, innerR: 0, eye: 0.95, smile: 0.75 },
  surprised: { liftL: -12, liftR: -12, archL: 8, archR: 8, innerL: -2, innerR: -2, eye: 1.2, smile: 0 },
  excited: { liftL: -11, liftR: -11, archL: 7, archR: 7, innerL: 0, innerR: 0, eye: 1.08, smile: 0.45 },
  thinking: { liftL: -12, liftR: 3, archL: 7, archR: 0, innerL: 0, innerR: 7, eye: 1, smile: 0 },
  // Brows down and pulled together (bills piling up).
  annoyed: { liftL: 7, liftR: 7, archL: -1, archR: -1, innerL: 11, innerR: 11, eye: 0.86, smile: 0 },
  // One brow up with a half smile ("dekhna hai?").
  skeptic: { liftL: -15, liftR: 5, archL: 9, archR: 0, innerL: 0, innerR: 5, eye: 1, smile: 0.35 },
};

/** Thick, slightly arched brows, heavier at the inner end. */
function brow(side: "L" | "R", lift: number, arch: number, inner: number) {
  const m = (x: number) => (side === "L" ? x : 600 - x);
  const o = [196, 284 + lift];
  const c = [232, 264 + lift - arch];
  const i = [268, 272 + lift + inner];
  return `M${m(o[0])} ${o[1]} Q${m(c[0])} ${c[1]} ${m(i[0])} ${i[1]} L${m(i[0] + 1)} ${i[1] + 15} Q${m(c[0])} ${c[1] + 14} ${m(o[0] + 3)} ${o[1] + 7} Z`;
}

/** Almond eye. `smile` raises the lower lid (smiling eyes). */
const Eye: React.FC<{ cx: number; open: number; scale: number; smile: number; look: V; id: string }> = ({ cx, open, scale, smile, look, id }) => {
  const cy = 330;
  const w = 33;
  const up = Math.max(1.5, 30 * scale * open);
  const lo = Math.max(1.5, 18 * scale * open * (1 - 0.45 * smile));
  const d = `M${cx - w} ${cy} C${cx - w * 0.45} ${cy - up} ${cx + w * 0.45} ${cy - up} ${cx + w} ${cy} C${cx + w * 0.45} ${cy + lo} ${cx - w * 0.45} ${cy + lo} ${cx - w} ${cy} Z`;
  const ix = cx + look[0] * 11;
  const iy = cy - 1 + look[1] * 6;
  return (
    <g>
      <clipPath id={id}>
        <path d={d} />
      </clipPath>
      <path d={d} fill={AVATAR.white} />
      <g clipPath={`url(#${id})`}>
        <circle cx={ix} cy={iy} r={15.5 * Math.min(scale, 1.06)} fill={AVATAR.iris} />
        <circle cx={ix} cy={iy} r={scale > 1.1 ? 6.5 : 8} fill="#0E0907" />
        <circle cx={ix + 5.5} cy={iy - 5.5} r={4.6} fill="#FFFFFF" />
        <circle cx={ix - 4.5} cy={iy + 6} r={2} fill="#FFFFFF" opacity={0.7} />
      </g>
      <path
        d={`M${cx - w - 3} ${cy + 1} C${cx - w * 0.45} ${cy - up - 1} ${cx + w * 0.45} ${cy - up - 1} ${cx + w + 4} ${cy - 2}`}
        fill="none"
        stroke={AVATAR.line}
        strokeWidth={6}
        strokeLinecap="round"
      />
      <path d={`M${cx - w * 0.7} ${cy + lo * 0.5} Q${cx} ${cy + lo * 1.05} ${cx + w * 0.7} ${cy + lo * 0.5}`} fill="none" stroke={AVATAR.line} strokeWidth={2.5} strokeLinecap="round" opacity={0.45} />
      {smile > 0.3 && <path d={`M${cx - 20} ${cy + 26} Q${cx} ${cy + 31 - 6 * smile} ${cx + 20} ${cy + 26}`} fill="none" stroke={AVATAR.skinShade} strokeWidth={3.5} strokeLinecap="round" opacity={smile} />}
    </g>
  );
};

const Mouth: React.FC<{ open: number; wide: number; expr: Expr; id: string }> = ({ open, wide, expr, id }) => {
  const y = 442;
  if (open < 0.06) {
    if (expr === "surprised") return <ellipse cx={300} cy={y + 6} rx={13} ry={17} fill={AVATAR.mouth} stroke={AVATAR.line} strokeWidth={5} />;
    if (expr === "thinking") return <path d={`M276 ${y + 6} Q300 ${y + 2} 326 ${y - 4}`} fill="none" stroke={AVATAR.line} strokeWidth={5.5} strokeLinecap="round" />;
    if (expr === "annoyed") return <path d={`M272 ${y + 8} Q300 ${y - 4} 328 ${y + 8}`} fill="none" stroke={AVATAR.line} strokeWidth={5.5} strokeLinecap="round" />;
    if (expr === "excited" || expr === "happy") {
      const s = expr === "excited" ? 1 : 0.8;
      return (
        <g>
          <path d={`M${300 - 44 * s} ${y - 8} Q300 ${y + 48 * s} ${300 + 44 * s} ${y - 12} Q300 ${y + 2} ${300 - 44 * s} ${y - 8} Z`} fill={AVATAR.mouth} stroke={AVATAR.line} strokeWidth={5} strokeLinejoin="round" />
          <path d={`M${300 - 36 * s} ${y - 5} Q300 ${y + 5} ${300 + 36 * s} ${y - 8} L${300 + 33 * s} ${y + 2} Q300 ${y + 12} ${300 - 33 * s} ${y + 3} Z`} fill={AVATAR.white} />
        </g>
      );
    }
    // the owner's warm closed smile, a little higher on one side
    return (
      <g>
        <path d={`M264 ${y - 5} C282 ${y + 13} 318 ${y + 13} 338 ${y - 10}`} fill="none" stroke={AVATAR.line} strokeWidth={5.5} strokeLinecap="round" />
        <path d={`M289 ${y + 13} Q300 ${y + 17} 311 ${y + 13}`} fill="none" stroke={AVATAR.lip} strokeWidth={4} strokeLinecap="round" opacity={0.6} />
        <path d={`M342 ${y - 17} Q346 ${y - 10} 341 ${y - 4}`} fill="none" stroke={AVATAR.skinShade} strokeWidth={3.5} strokeLinecap="round" />
      </g>
    );
  }
  const w = 62 + 24 * wide - 12 * open * (1 - wide);
  const h = 9 + 40 * open;
  const x0 = 300 - w / 2;
  const x1 = 300 + w / 2;
  const top = y - 6;
  const shape = `M${x0} ${top} Q300 ${top - 6 + 3 * open} ${x1} ${top - 2} Q300 ${top + 2 * h} ${x0} ${top} Z`;
  return (
    <g>
      <clipPath id={id}>
        <path d={shape} />
      </clipPath>
      <path d={shape} fill={AVATAR.mouth} />
      <g clipPath={`url(#${id})`}>
        <rect x={x0} y={top - 8} width={w} height={8 + Math.min(12, h * 0.3)} fill={AVATAR.white} />
        <ellipse cx={300} cy={top + h * 1.6} rx={w * 0.27} ry={h * 0.36} fill={AVATAR.tongue} />
      </g>
      <path d={shape} fill="none" stroke={AVATAR.line} strokeWidth={5} strokeLinejoin="round" />
    </g>
  );
};

const BODY = "M300 606 C372 606 428 622 462 660 C488 690 500 740 506 800 L530 1420 L70 1420 L94 800 C100 740 112 690 138 660 C172 622 228 606 300 606 Z";
// Soft, voluminous hair with a side part at x 260. The back mass gives the height and covers the ear tops;
// two locks in front meet at the part: a small one falls left, a big one sweeps right to the temple.
const HAIR_BACK = "M156 334 C134 286 132 220 156 168 C182 112 236 76 300 70 C370 64 432 96 460 154 C482 204 478 270 450 334 C444 316 438 302 430 292 L170 292 C166 304 160 318 156 334 Z";
const LOCK_R =
  "M258 100 C276 64 344 50 404 74 C452 94 478 148 472 210 C468 256 462 296 458 324 C450 306 442 296 434 290 C418 262 388 236 348 226 C342 230 338 232 334 236 C322 216 290 206 262 206 C254 172 250 136 258 100 Z";
const LOCK_L = "M258 104 C222 100 184 120 164 158 C146 192 142 250 148 290 C146 300 142 310 138 318 C150 312 160 304 168 298 C184 262 214 226 244 210 C250 207 256 206 262 206 C254 172 250 136 258 104 Z";
const HAIR_SHEEN = "M292 92 C340 66 404 72 440 112 C404 92 350 86 300 106 Z";
const FACE = "M300 158 C388 158 440 222 440 312 C440 368 428 412 404 448 C380 484 342 502 300 502 C258 502 220 484 196 448 C172 412 160 368 160 312 C160 222 212 158 300 158 Z";

/** Lime disc with rings behind the avatar, like the website's hero illustration, with a little confetti. */
const Halo: React.FC<{ x: number; y: number; s: number; t: number }> = ({ x, y, s, t }) => {
  const bits = [
    { a: -150, r: 372, w: 26, h: 9, c: P.gold, rot: -24 },
    { a: -112, r: 392, w: 14, h: 14, c: P.teal, rot: 0 },
    { a: -64, r: 380, w: 14, h: 14, c: P.oliveSoft, rot: 0 },
    { a: -28, r: 360, w: 26, h: 9, c: P.pink, rot: 30 },
    { a: -196, r: 352, w: 26, h: 9, c: P.pink, rot: 18 },
    { a: 14, r: 372, w: 26, h: 9, c: P.gold, rot: -40 },
  ];
  return (
    <svg viewBox="-420 -420 840 840" width={840} height={840} style={{ position: "absolute", left: x - 420, top: y - 420, overflow: "visible", transform: `scale(${s})` }}>
      <circle r={330} fill={P.limeSoft} />
      <circle r={268} fill="none" stroke={P.lime} strokeWidth={5} />
      <circle r={206} fill="none" stroke={P.lime} strokeWidth={5} opacity={0.75} />
      {bits.map((b, i) => {
        const a = rad(b.a + 4 * Math.sin(t * 0.8 + i));
        const r = b.r + 6 * Math.sin(t * 1.3 + i * 2);
        return <rect key={i} x={Math.cos(a) * r - b.w / 2} y={Math.sin(a) * r - b.h / 2} width={b.w} height={b.h} rx={b.h / 2} fill={b.c} transform={`rotate(${b.rot + 10 * Math.sin(t + i)} ${Math.cos(a) * r} ${Math.sin(a) * r})`} />;
      })}
    </svg>
  );
};

export const AvatarLook: React.FC<{ keys: AvatarKey[]; places: AvatarPlace[]; env: number[]; blinks: number[]; halo?: boolean; head?: number; eye?: number; hair?: HairKind; outfit?: OutfitKind; stubble?: boolean }> = ({ keys, places, env, blinks, halo = true, head = 1, eye = 1, hair = "dome", outfit = "overshirt", stubble = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Unique ids so several avatars can share a page (contact sheets) without sharing clip paths.
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const t = frame / fps;
  const sp = (at: number, cfg: { damping: number; stiffness: number; mass: number }) =>
    t < at ? 0 : spring({ frame: Math.round((t - at) * fps), fps, config: cfg });

  // Placement: springs from the previous place to the current one (the first one rises in from below).
  let pi = 0;
  for (let i = 0; i < places.length; i++) if (places[i].at <= t) pi = i;
  const pCur = places[pi];
  const pPrev = pi > 0 ? places[pi - 1] : { ...pCur, y: pCur.y + 1500 };
  const pk = sp(pCur.at, { damping: 15, stiffness: 120, mass: 0.9 });
  const px = lerp(pPrev.x, pCur.x, pk);
  const py = lerp(pPrev.y, pCur.y, pk);
  const ps = lerp(pPrev.s, pCur.s, pk);
  if (t < pCur.at && pi === 0) return null;

  // Pose and expression.
  let ki = 0;
  for (let i = 0; i < keys.length; i++) if (keys[i].at <= t) ki = i;
  const kCur = keys[ki];
  const kPrev = ki > 0 ? keys[ki - 1] : kCur;
  const k = sp(kCur.at, { damping: 13, stiffness: 170, mass: 0.7 });
  const a = poseOf(kPrev);
  const b = poseOf(kCur);
  const mix = (p: V, q: V): V => [lerp(p[0], q[0], k), lerp(p[1], q[1], k)];
  const fk = clamp01((t - kCur.at) / 0.16);
  const fa = FACES[kPrev.expr];
  const fb = FACES[kCur.expr];
  const face = Object.fromEntries(Object.keys(fb).map((n) => [n, lerp(fa[n as keyof Face], fb[n as keyof Face], fk)])) as Face;
  const lookA = kPrev.look ?? [0, 0];
  const lookB = kCur.look ?? [0, 0];
  const look: V = [lerp(lookA[0], lookB[0], fk), lerp(lookA[1], lookB[1], fk)];

  // Voice-driven mouth and head motion.
  const e = (i: number) => env[Math.max(0, Math.min(env.length - 1, i))] ?? 0;
  const level = (e(frame - 1) + 2 * e(frame) + e(frame + 1)) / 4;
  const open = Math.pow(clamp01((level - 0.1) / 0.72), 0.85);
  const wide = random(`mouth-${Math.floor(frame / 3)}`);
  const breath = Math.sin(t * 2.3);
  const talkBob = -7 * open;
  const jump = kCur.jump ? -46 * Math.sin(Math.PI * clamp01((t - kCur.at) / 0.38)) : 0;
  const tilt = lerp(a.tilt + (kPrev.tilt ?? 0), b.tilt + (kCur.tilt ?? 0), k) + 2 * Math.sin(t * 1.6) + 2.5 * open * Math.sin(frame / 4);
  const lean = lerp(a.lean, b.lean, k);

  // Gestures layered on top of the pose.
  const R = { ...b.R, h: mix(a.R.h, b.R.h) };
  const L = { ...b.L, h: mix(a.L.h, b.L.h) };
  if (k < 0.5) {
    R.hand = a.R.hand;
    L.hand = a.L.hand;
  }
  let waveR = 0;
  if (kCur.pose === "wave") waveR = 16 * Math.sin((t - kCur.at) * 11);
  if (kCur.pose === "explain") R.h = [R.h[0], R.h[1] - 22 * open];
  if (kCur.pose === "surprised") {
    const shake = Math.max(0, 1 - (t - kCur.at) / 0.6) * 4 * Math.sin(t * 60);
    L.h = [L.h[0] + shake, L.h[1]];
    R.h = [R.h[0] - shake, R.h[1]];
  }

  // Blinks (skipped while surprised: eyes stay wide).
  let eyeOpen = 1;
  if (kCur.expr !== "surprised") for (const bt of blinks) eyeOpen = Math.min(eyeOpen, clamp01(Math.abs(t - bt) / 0.07));

  return (
    <>
      {halo && <Halo x={px} y={py + 104 * ps} s={ps} t={t} />}
      <svg
        viewBox="0 0 600 1000"
        width={600}
        height={1000}
        style={{
          position: "absolute",
          left: px - 300,
          top: py - 330,
          overflow: "visible",
          transform: `translateY(${jump}px) scale(${ps}) rotate(${lean}deg)`,
          transformOrigin: "300px 330px",
          filter: "drop-shadow(0 18px 26px rgba(23,23,23,0.20))",
        }}
      >
        <g transform={`translate(0 ${breath * 2}) scale(1 ${1 + breath * 0.006})`} style={{ transformOrigin: "300px 1000px" }}>
          {outfit !== "overshirt" ? <Torso kind={outfit} /> : (<>
          {/* overshirt */}
          <path d={BODY} fill={AVATAR.shirt} stroke={AVATAR.outline} strokeWidth={7} strokeLinejoin="round" />
          <path d="M126 760 C134 850 132 930 128 1400 M474 760 C466 850 468 930 472 1400" fill="none" stroke={AVATAR.shirtHi} strokeWidth={10} strokeLinecap="round" />
          <path d="M396 746 H462 V816 Q429 828 396 816 Z M396 764 H462" fill="none" stroke={AVATAR.shirtHi} strokeWidth={5} strokeLinejoin="round" />
          {/* lime tee in the open front, with the website's IT mark */}
          <path d="M232 610 C262 600 338 600 368 610 L382 1420 L218 1420 Z" fill={AVATAR.tee} stroke={AVATAR.outline} strokeWidth={6} strokeLinejoin="round" />
          <g transform="translate(300 806)">
            <rect x={-34} y={-34} width={68} height={68} rx={15} fill={P.ink} />
            <rect x={-27} y={-27} width={54} height={54} rx={11} fill={P.lime} />
            <text y={10} textAnchor="middle" fontFamily={sans} fontWeight={700} fontSize={28} fill={P.ink}>
              IT
            </text>
          </g>
          {[772, 884, 996].map((y, i) => (
            <circle key={y} cx={208 - i * 2} cy={y} r={7} fill={AVATAR.shirtHi} stroke={AVATAR.outline} strokeWidth={3} />
          ))}
          {/* neck and the tee's ribbed collar */}
          <path d="M262 470 L262 612 Q300 660 338 612 L338 470 Z" fill={AVATAR.skin} stroke={AVATAR.line} strokeWidth={5} />
          <path d="M262 540 Q300 596 338 540 L338 470 L262 470 Z" fill={AVATAR.skinShade} opacity={0.55} />
          <path d="M250 598 Q300 652 350 598" fill="none" stroke={AVATAR.outline} strokeWidth={17} strokeLinecap="round" />
          <path d="M250 598 Q300 652 350 598" fill="none" stroke={AVATAR.teeShade} strokeWidth={9} strokeLinecap="round" />
          {/* overshirt collar */}
          <path d="M262 598 C238 602 210 612 192 628 L234 706 C240 676 248 640 262 598 Z" fill={AVATAR.shirtHi} stroke={AVATAR.outline} strokeWidth={5} strokeLinejoin="round" />
          <path d="M338 598 C362 602 390 612 408 628 L366 706 C360 676 352 640 338 598 Z" fill={AVATAR.shirtHi} stroke={AVATAR.outline} strokeWidth={5} strokeLinejoin="round" />
          </>)}
        </g>

        {/* head */}
        <g transform={`translate(0 ${HEAD_DROP + talkBob + breath * 2.5}) rotate(${tilt} 300 520) translate(300 480) scale(${head}) translate(-300 -480)`}>
          <ellipse cx={162} cy={350} rx={21} ry={33} fill={AVATAR.skin} stroke={AVATAR.line} strokeWidth={5} />
          <ellipse cx={438} cy={350} rx={21} ry={33} fill={AVATAR.skin} stroke={AVATAR.line} strokeWidth={5} />
          <path d="M168 334 Q156 350 168 368 M432 334 Q444 350 432 368" fill="none" stroke={AVATAR.skinShade} strokeWidth={5} strokeLinecap="round" />
          {hair === "dome" ? <path d={HAIR_BACK} fill={AVATAR.hair} stroke={AVATAR.outline} strokeWidth={5} strokeLinejoin="round" /> : <HairBack kind={hair} />}
          <path d={FACE} fill={AVATAR.skin} stroke={AVATAR.line} strokeWidth={5.5} />
          <path d="M174 392 C196 466 250 498 300 498 C350 498 404 466 426 392 C402 450 356 476 300 478 C244 476 198 450 174 392 Z" fill={AVATAR.skinShade} opacity={0.28} />
          {/* light moustache and chin hair */}
          <path d="M268 423 C280 415 292 414 300 418 C308 414 320 415 332 422 C320 425 310 426 300 424 C290 426 280 426 268 423 Z" fill={AVATAR.beard} opacity={0.42} />
          <ellipse cx={300} cy={463} rx={7} ry={4.5} fill={AVATAR.beard} opacity={0.34} />
          <path d="M274 474 C284 494 316 494 326 474 C316 482 284 482 274 474 Z" fill={AVATAR.beard} opacity={0.22} />
          {stubble && <Stubble />}
          {hair === "dome" ? (
            <>
          {/* the two front locks, meeting at the side part */}
          <path d={LOCK_L} fill={AVATAR.hair} stroke={AVATAR.outline} strokeWidth={5} strokeLinejoin="round" />
          <path d={LOCK_R} fill={AVATAR.hair} stroke={AVATAR.outline} strokeWidth={5} strokeLinejoin="round" />
          <path d={HAIR_SHEEN} fill={AVATAR.hairHi} opacity={0.55} />
          <path d="M286 128 C338 108 412 124 444 182 M290 170 C338 160 398 182 428 232 M244 126 C206 132 176 162 166 206" fill="none" stroke={AVATAR.hairHi} strokeWidth={5} strokeLinecap="round" opacity={0.7} />
          <path d="M300 70 C306 56 320 50 334 52" fill="none" stroke={AVATAR.outline} strokeWidth={6} strokeLinecap="round" />
            </>
          ) : (
            <HairFront kind={hair} />
          )}
          {/* brows, eyes, nose, cheeks, mouth */}
          <path d={brow("L", face.liftL, face.archL, face.innerL)} fill={AVATAR.hair} stroke={AVATAR.hair} strokeWidth={3} strokeLinejoin="round" />
          <path d={brow("R", face.liftR, face.archR, face.innerR)} fill={AVATAR.hair} stroke={AVATAR.hair} strokeWidth={3} strokeLinejoin="round" />
          <g transform={`translate(240 330) scale(${eye}) translate(-240 -330)`}><Eye cx={240} open={eyeOpen} scale={face.eye} smile={face.smile} look={look} id={`eyeL${uid}`} /></g>
          <g transform={`translate(360 330) scale(${eye}) translate(-360 -330)`}><Eye cx={360} open={eyeOpen} scale={face.eye} smile={face.smile} look={look} id={`eyeR${uid}`} /></g>
          <path d="M294 340 C298 362 306 378 310 390 C312 398 304 403 293 401" fill="none" stroke={AVATAR.line} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx={212} cy={398} rx={22} ry={11} fill={AVATAR.blush} opacity={0.22} />
          <ellipse cx={388} cy={398} rx={22} ry={11} fill={AVATAR.blush} opacity={0.22} />
          <Mouth open={open} wide={wide} expr={kCur.expr} id={`mouth${uid}`} />
        </g>

        {/* arms in front of the body */}
        <ArmShape S={SL} arm={L} side="L" wave={0} outfit={outfit} />
        <ArmShape S={SR} arm={R} side="R" wave={waveR} outfit={outfit} />
      </svg>
    </>
  );
};
