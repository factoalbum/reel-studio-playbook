import React from "react";
import { random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "../theme";

/**
 * The Internet Toolbox guide: a reusable 2D presenter character for every episode.
 * Drawn in a 600 x 1000 box (head centre at 300,330). Poses, expressions and placement
 * are keyframed per episode; the mouth follows the voiceover loudness (one value per frame).
 */

const C = {
  skin: "#C98A5C",
  skinShade: "#A86D45",
  line: "#2A170C",
  hair: "#16100C",
  hairHi: "#3D2F27",
  hoodie: "#2546AB",
  hoodieShade: "#1B3588",
  outline: "#07102A",
  cyan: "#22D3EE",
  white: "#F8FAFC",
  yellow: "#FACC15",
  orange: "#FB923C",
  mouth: "#5A1620",
  tongue: "#E06A6A",
  blush: "#E0786A",
  iris: "#3B2214",
  cup: "#0D1736",
};

type V = [number, number];
export type Hand = "open" | "point" | "palm" | "thumb" | "fist";
export type PoseName = "rest" | "surprised" | "point" | "explain" | "oneMore" | "thumbs" | "think" | "wave";
export type Expr = "talk" | "happy" | "surprised" | "excited" | "thinking";
/** `aim` is the pointing direction in degrees (0 = right, -90 = up). `look` is where the eyes go, -1..1. */
export type GuideKey = { at: number; pose: PoseName; expr: Expr; aim?: number; look?: V; jump?: boolean };
/** Screen position of the head centre and the scale (1 = 600 px wide figure). */
export type GuidePlace = { at: number; x: number; y: number; s: number };

const SL: V = [150, 705];
const SR: V = [450, 705];
const L1 = 150;
const L2 = 140;
// The head sits this much lower than its drawing coordinates, for a shorter neck.
const HEAD_DROP = 26;

type Elbow = "out" | "down";
type Arm = { h: V; elbow: Elbow; hand: Hand; rot?: number };
type Pose = { L: Arm; R: Arm; lean: number; tilt: number };

const rad = (d: number) => (d * Math.PI) / 180;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

function poseOf(k: GuideKey): Pose {
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
      return { L: restL, R: { h: [522, 438], elbow: "out", hand: "palm", rot: 12 }, lean: 1, tilt: 4 };
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

const skin = { fill: C.skin, stroke: C.line, strokeWidth: 5, strokeLinejoin: "round" as const };

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
        <path d="M-10 4 Q0 10 10 4" fill="none" stroke={C.skinShade} strokeWidth={4} strokeLinecap="round" />
      </g>
    );
  }
  if (kind === "thumb") {
    return (
      <g transform={`translate(${H[0]} ${H[1]}) rotate(${rot}) scale(${m} 1)`}>
        <rect x={-14} y={-78} width={26} height={56} rx={13} {...skin} />
        <rect x={-30} y={-34} width={62} height={60} rx={20} {...skin} />
        <path d="M-22 -14 H22 M-22 2 H22 M-22 16 H20" stroke={C.line} strokeWidth={3.5} strokeLinecap="round" />
      </g>
    );
  }
  if (kind === "fist") {
    return (
      <g transform={`translate(${H[0]} ${H[1]}) rotate(${theta}) scale(1 ${m})`}>
        <rect x={-8} y={-28} width={58} height={56} rx={22} {...skin} />
        <path d="M30 -16 V16 M40 -12 V12" stroke={C.line} strokeWidth={3.5} strokeLinecap="round" />
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
        <path d="M26 -2 H46 M24 11 H44" stroke={C.line} strokeWidth={3.5} strokeLinecap="round" />
        <path d="M4 -24 C12 -38 30 -36 32 -24" {...skin} />
      </g>
    );
  }
  // open: relaxed hand, fingers along the forearm
  return (
    <g transform={`translate(${H[0]} ${H[1]}) rotate(${theta + rot}) scale(1 ${m})`}>
      <path d="M-6 -24 C20 -30 54 -28 70 -16 C80 -8 80 8 70 16 C54 27 20 29 -6 24 Z" {...skin} />
      <path d="M46 -8 H72 M46 4 H74 M46 15 H68" stroke={C.line} strokeWidth={3.5} strokeLinecap="round" />
      <path d="M8 -22 C14 -46 36 -52 44 -42 C50 -34 38 -24 28 -18" {...skin} />
    </g>
  );
};

const ArmShape: React.FC<{ S: V; arm: Arm; side: "L" | "R"; wave: number }> = ({ S, arm, side, wave }) => {
  const { E, H, theta } = ik(S, arm.h, arm.elbow, side);
  const cuff: V = [lerp(E[0], H[0], 0.8), lerp(E[1], H[1], 0.8)];
  const d = `M${S[0]} ${S[1]} L${E[0]} ${E[1]} L${H[0]} ${H[1]}`;
  return (
    <g>
      <path d={d} fill="none" stroke={C.outline} strokeWidth={74} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={C.hoodie} strokeWidth={62} strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M${cuff[0]} ${cuff[1]} L${H[0]} ${H[1]}`} fill="none" stroke={C.cyan} strokeWidth={62} />
      <HandShape kind={arm.hand} H={H} theta={theta} rot={(arm.rot ?? 0) + wave} mirror={side === "L"} />
    </g>
  );
};

type Face = { liftL: number; liftR: number; archL: number; archR: number; innerL: number; innerR: number; eye: number };
const FACES: Record<Expr, Face> = {
  talk: { liftL: 0, liftR: 0, archL: 2, archR: 2, innerL: 0, innerR: 0, eye: 1 },
  happy: { liftL: -7, liftR: -7, archL: 5, archR: 5, innerL: 0, innerR: 0, eye: 1 },
  surprised: { liftL: -16, liftR: -16, archL: 9, archR: 9, innerL: -2, innerR: -2, eye: 1.14 },
  excited: { liftL: -16, liftR: -16, archL: 7, archR: 7, innerL: 0, innerR: 0, eye: 1.07 },
  thinking: { liftL: -16, liftR: 4, archL: 8, archR: 0, innerL: 0, innerR: 8, eye: 1 },
};

function brow(side: "L" | "R", lift: number, arch: number, inner: number) {
  // Outer end, control, inner end (left side); the right brow mirrors it.
  const pts = [
    [204, 266 + lift],
    [236, 248 + lift - arch],
    [270, 258 + lift + inner],
  ];
  const m = (x: number) => (side === "L" ? x : 600 - x);
  return `M${m(pts[0][0])} ${pts[0][1]} Q${m(pts[1][0])} ${pts[1][1]} ${m(pts[2][0])} ${pts[2][1]}`;
}

const Eye: React.FC<{ cx: number; open: number; scale: number; look: V; id: string }> = ({ cx, open, scale, look, id }) => {
  const cy = 318;
  const rx = 30 * scale;
  const ry = Math.max(1.5, 36 * scale * open);
  return (
    <g>
      <clipPath id={id}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
      </clipPath>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={C.white} />
      <g clipPath={`url(#${id})`}>
        <circle cx={cx + look[0] * 9} cy={cy + 3 + look[1] * 8} r={17 * Math.min(scale, 1.05)} fill={C.iris} />
        <circle cx={cx + look[0] * 9} cy={cy + 3 + look[1] * 8} r={scale > 1.1 ? 7.5 : 9.5} fill="#0B0705" />
        <circle cx={cx + look[0] * 9 + 6} cy={cy - 4 + look[1] * 8} r={5.5} fill={C.white} />
        <circle cx={cx + look[0] * 9 - 5} cy={cy + 9 + look[1] * 8} r={2.4} fill={C.white} opacity={0.8} />
      </g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={C.line} strokeWidth={5} />
      <path d={`M${cx - rx - 2} ${cy - ry * 0.3} Q${cx} ${cy - ry - 12} ${cx + rx + 2} ${cy - ry * 0.3}`} fill="none" stroke={C.line} strokeWidth={6} strokeLinecap="round" />
    </g>
  );
};

const Mouth: React.FC<{ open: number; wide: number; expr: Expr; id: string }> = ({ open, wide, expr, id }) => {
  const y = 424;
  if (open < 0.06) {
    if (expr === "surprised") return <ellipse cx={300} cy={y + 8} rx={15} ry={19} fill={C.mouth} stroke={C.line} strokeWidth={5} />;
    if (expr === "thinking") return <path d={`M272 ${y + 8} Q300 ${y + 4} 328 ${y - 2}`} fill="none" stroke={C.line} strokeWidth={6} strokeLinecap="round" />;
    if (expr === "excited")
      return (
        <g>
          <path d={`M252 ${y - 6} Q300 ${y + 52} 348 ${y - 6} Q300 ${y + 6} 252 ${y - 6} Z`} fill={C.mouth} stroke={C.line} strokeWidth={5} strokeLinejoin="round" />
          <path d={`M262 ${y - 2} Q300 ${y + 8} 338 ${y - 2} L336 ${y + 6} Q300 ${y + 16} 264 ${y + 6} Z`} fill={C.white} />
        </g>
      );
    return <path d={`M258 ${y - 4} Q300 ${y + 30} 342 ${y - 4}`} fill="none" stroke={C.line} strokeWidth={6.5} strokeLinecap="round" />;
  }
  const w = 70 + 26 * wide - 14 * open * (1 - wide);
  const h = 10 + 44 * open;
  const x0 = 300 - w / 2;
  const x1 = 300 + w / 2;
  const top = y - 6;
  const shape = `M${x0} ${top} Q300 ${top - 6 + 3 * open} ${x1} ${top} Q300 ${top + 2 * h} ${x0} ${top} Z`;
  return (
    <g>
      <clipPath id={id}>
        <path d={shape} />
      </clipPath>
      <path d={shape} fill={C.mouth} />
      <g clipPath={`url(#${id})`}>
        <rect x={x0} y={top - 8} width={w} height={8 + Math.min(13, h * 0.32)} fill={C.white} />
        <ellipse cx={300} cy={top + h * 1.6} rx={w * 0.27} ry={h * 0.36} fill={C.tongue} />
      </g>
      <path d={shape} fill="none" stroke={C.line} strokeWidth={5} strokeLinejoin="round" />
    </g>
  );
};

export const Guide: React.FC<{ keys: GuideKey[]; places: GuidePlace[]; env: number[]; blinks: number[] }> = ({ keys, places, env, blinks }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Unique ids so several guides can share a page (contact sheets) without sharing clip paths.
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
  const tilt = lerp(a.tilt, b.tilt, k) + 2 * Math.sin(t * 1.6) + 2.5 * open * Math.sin(frame / 4);
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
  const eyeScale = face.eye;

  return (
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
        filter: `drop-shadow(0 0 22px ${C.cyan}44) drop-shadow(0 24px 30px #00000066)`,
      }}
    >
      <g transform={`translate(0 ${breath * 2}) scale(1 ${1 + breath * 0.006})`} style={{ transformOrigin: "300px 1000px" }}>
        {/* headphone band behind the neck */}
        <path d="M216 648 C204 560 396 560 384 648" fill="none" stroke={C.cup} strokeWidth={24} strokeLinecap="round" />
        <path d="M216 648 C204 560 396 560 384 648" fill="none" stroke={C.cyan} strokeWidth={10} strokeLinecap="round" />
        {/* neck */}
        <path d="M262 470 L262 612 Q300 642 338 612 L338 470 Z" fill={C.skin} stroke={C.line} strokeWidth={5} />
        <path d="M262 512 Q300 572 338 512 L338 470 L262 470 Z" fill={C.skinShade} opacity={0.65} />
        {/* hoodie body */}
        <path
          d="M300 606 C372 606 428 622 462 660 C488 690 500 740 506 800 L530 1420 L70 1420 L94 800 C100 740 112 690 138 660 C172 622 228 606 300 606 Z"
          fill={C.hoodie}
          stroke={C.outline}
          strokeWidth={7}
          strokeLinejoin="round"
        />
        <path d="M126 760 C134 850 132 930 128 1400 M474 760 C466 850 468 930 472 1400" fill="none" stroke={C.hoodieShade} strokeWidth={12} strokeLinecap="round" />
        <path d="M188 936 C240 914 360 914 412 936" fill="none" stroke={C.hoodieShade} strokeWidth={7} strokeLinecap="round" />
        {/* hood rim with cyan lining, white tee */}
        <path d="M194 652 C194 598 246 576 300 576 C354 576 406 598 406 652 C382 632 344 624 300 624 C256 624 218 632 194 652 Z" fill={C.hoodieShade} stroke={C.outline} strokeWidth={6} strokeLinejoin="round" />
        <path d="M214 644 C232 630 262 625 300 625 C338 625 368 630 386 644" fill="none" stroke={C.cyan} strokeWidth={8} strokeLinecap="round" />
        <path d="M252 616 C262 652 338 652 348 616 C334 628 266 628 252 616 Z" fill={C.white} stroke={C.outline} strokeWidth={4} />
        {/* drawstrings with cyan tips */}
        <path d="M270 640 C268 690 264 730 262 768 M330 640 C332 690 336 730 338 768" fill="none" stroke={C.white} strokeWidth={7} strokeLinecap="round" />
        <path d="M262 770 L261 794 M338 770 L339 794" stroke={C.cyan} strokeWidth={10} strokeLinecap="round" />
        {/* brand badge: the small yellow accent */}
        <rect x={372} y={758} width={62} height={62} rx={15} fill={C.yellow} stroke={C.outline} strokeWidth={4} transform="rotate(-6 403 789)" />
        <text x={403} y={801} textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize={31} fill="#0A1128" transform="rotate(-6 403 789)">
          IT
        </text>
        {/* headphone cups resting on the collar */}
        {[214, 386].map((x, i) => (
          <g key={x} transform={`rotate(${i ? 14 : -14} ${x} 650)`}>
            <ellipse cx={x} cy={650} rx={30} ry={38} fill={C.cup} stroke={C.outline} strokeWidth={5} />
            <ellipse cx={x} cy={650} rx={17} ry={23} fill="none" stroke={C.cyan} strokeWidth={6} />
            <circle cx={x} cy={622} r={5} fill={C.orange} />
          </g>
        ))}
      </g>

      {/* head */}
      <g transform={`translate(0 ${HEAD_DROP + talkBob + breath * 2.5}) rotate(${tilt} 300 520)`}>
        <ellipse cx={153} cy={342} rx={24} ry={36} fill={C.skin} stroke={C.line} strokeWidth={5} />
        <ellipse cx={447} cy={342} rx={24} ry={36} fill={C.skin} stroke={C.line} strokeWidth={5} />
        <path d="M160 324 Q146 342 160 362 M440 324 Q454 342 440 362" fill="none" stroke={C.skinShade} strokeWidth={6} strokeLinecap="round" />
        <path d="M300 168 C392 168 446 232 446 322 C446 418 392 498 300 498 C208 498 154 418 154 322 C154 232 208 168 300 168 Z" fill={C.skin} stroke={C.line} strokeWidth={6} />
        <path d="M168 380 C190 468 248 496 300 496 C352 496 410 468 432 380 C406 446 360 474 300 476 C240 474 194 446 168 380 Z" fill={C.skinShade} opacity={0.32} />
        {/* hair: short sides, swept-up quiff */}
        <path
          d="M150 338 C136 262 150 196 196 158 C236 124 290 112 338 116 C398 112 452 146 458 214 C462 258 456 300 450 338 C444 290 432 246 414 218 C392 224 352 226 318 214 C298 226 262 230 232 222 C208 218 188 232 178 254 C166 282 156 312 150 338 Z"
          fill={C.hair}
          stroke={C.hair}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <path d="M196 170 C214 106 286 74 354 84 C412 92 454 124 468 170 C472 188 468 202 460 216 C448 184 420 162 386 158 C352 152 318 162 296 152 C262 138 222 148 196 170 Z" fill={C.hair} stroke={C.hair} strokeWidth={4} strokeLinejoin="round" />
        <path d="M238 132 C278 102 340 94 392 108 M262 150 C300 130 350 128 396 140" fill="none" stroke={C.hairHi} strokeWidth={9} strokeLinecap="round" opacity={0.9} />
        {/* brows, eyes, nose, cheeks, mouth */}
        <path d={brow("L", face.liftL, face.archL, face.innerL)} fill="none" stroke={C.hair} strokeWidth={14} strokeLinecap="round" />
        <path d={brow("R", face.liftR, face.archR, face.innerR)} fill="none" stroke={C.hair} strokeWidth={14} strokeLinecap="round" />
        <Eye cx={242} open={eyeOpen} scale={eyeScale} look={look} id={`eyeL${uid}`} />
        <Eye cx={358} open={eyeOpen} scale={eyeScale} look={look} id={`eyeR${uid}`} />
        <path d="M298 330 Q318 368 302 382 Q294 386 284 381" fill="none" stroke={C.line} strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx={204} cy={398} rx={25} ry={13} fill={C.blush} opacity={0.3} />
        <ellipse cx={396} cy={398} rx={25} ry={13} fill={C.blush} opacity={0.3} />
        <Mouth open={open} wide={wide} expr={kCur.expr} id={`mouth${uid}`} />
      </g>

      {/* arms in front of the body */}
      <ArmShape S={SL} arm={L} side="L" wave={0} />
      <ArmShape S={SR} arm={R} side="R" wave={waveR} />
    </svg>
  );
};
