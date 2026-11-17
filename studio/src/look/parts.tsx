// Trial hair, stubble and outfit options for the mascot refresh. Drawn in the same 600 x 1000 box as brand/Avatar.tsx.
import React from "react";
import { random } from "remotion";

export type HairKind = "dome" | "quiff" | "crop" | "curtain" | "messy" | "wavy" | "swept" | "flow";
export type OutfitKind = "overshirt" | "hoodie" | "bomber" | "denim" | "darkhoodie" | "tee";

const INK = "#171717";
const HAIR = "#1C1512";
const HAIR_HI = "#4A3B32";
const HAIR_STROKE = { fill: HAIR, stroke: INK, strokeWidth: 5, strokeLinejoin: "round" as const };
const strand = { fill: "none", stroke: HAIR_HI, strokeWidth: 5, strokeLinecap: "round" as const, opacity: 0.75 };


type P2 = [number, number];
/** One tapered lock of hair from a root on the scalp to a pointed tip; `bend` pushes the middle sideways. */
function lock(r: P2, t: P2, w: number, bend: number) {
  const dx = t[0] - r[0];
  const dy = t[1] - r[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const a: P2 = [r[0] + (nx * w) / 2, r[1] + (ny * w) / 2];
  const b: P2 = [r[0] - (nx * w) / 2, r[1] - (ny * w) / 2];
  const c: P2 = [(r[0] + t[0]) / 2 + nx * bend, (r[1] + t[1]) / 2 + ny * bend];
  return `M${a[0]} ${a[1]} Q${c[0] + nx * w * 0.3} ${c[1] + ny * w * 0.3} ${t[0]} ${t[1]} Q${c[0] - nx * w * 0.3} ${c[1] - ny * w * 0.3} ${b[0]} ${b[1]} Z`;
}
type Lock = [P2, P2, number, number];
// Messy, textured hair: locks fall onto the forehead at different angles, a few flick up over the crown.
const MESSY_TOP: Lock[] = [
  [[300, 112], [258, 46], 46, -18],
  [[336, 110], [366, 40], 46, 16],
  [[384, 122], [442, 78], 42, 12],
  [[236, 126], [186, 82], 42, -12],
  [[408, 150], [470, 136], 36, 8],
];
const MESSY_FRONT: Lock[] = [
  [[180, 168], [146, 286], 50, -12],
  [[206, 132], [174, 252], 62, -22],
  [[246, 112], [222, 266], 70, -14],
  [[288, 104], [276, 258], 70, 12],
  [[326, 104], [330, 250], 70, 20],
  [[364, 112], [384, 258], 66, 22],
  [[402, 130], [432, 244], 60, 22],
  [[430, 166], [458, 284], 48, 12],
];
const MESSY_HI = "M232 150 C228 180 226 204 228 226 M282 138 C280 170 280 196 282 220 M334 136 C338 168 342 196 346 222 M384 152 C392 176 398 198 402 216";

// Swept, layered brown hair (like the owner's references): big curved locks sweep across the forehead to one side,
// choppy tips on top, lighter brown streaks for texture. Positive bend bulges the lock upward when it runs right to left.
const SW_BASE = "#4A2E1E";
const SW_HI = "#8A5E3C";
const SW_STROKE = { fill: SW_BASE, stroke: INK, strokeWidth: 5, strokeLinejoin: "round" as const };
const SWEPT_TOP: Lock[] = [
  [[300, 156], [146, 128], 72, 26],
  [[362, 146], [196, 66], 84, 30],
  [[404, 152], [286, 40], 84, 30],
  [[432, 172], [392, 62], 66, 22],
  [[446, 206], [470, 132], 50, 12],
];
const SWEPT_FRONT: Lock[] = [
  [[300, 124], [146, 206], 70, 30],
  [[424, 176], [170, 266], 84, 34],
  [[396, 146], [206, 254], 84, 40],
  [[362, 130], [246, 240], 78, 36],
  [[438, 206], [306, 240], 60, 22],
  [[196, 206], [142, 304], 48, -16],
  [[422, 214], [464, 306], 48, 16],
];
function streak([r, t, w, bend]: Lock) {
  const dx = t[0] - r[0];
  const dy = t[1] - r[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const e: P2 = [r[0] + dx * 0.66, r[1] + dy * 0.66];
  const c: P2 = [(r[0] + e[0]) / 2 + nx * bend * 0.95 + nx * w * 0.08, (r[1] + e[1]) / 2 + ny * bend * 0.95 + ny * w * 0.08];
  return { d: `M${r[0] + nx * w * 0.12} ${r[1] + ny * w * 0.12} Q${c[0]} ${c[1]} ${e[0]} ${e[1]}`, width: Math.max(4, w * 0.1) };
}
const SweptLock: React.FC<{ l: Lock }> = ({ l }) => {
  const st = streak(l);
  return (
    <g>
      <path {...SW_STROKE} d={lock(l[0], l[1], l[2], l[3])} />
      <path d={st.d} fill="none" stroke={SW_HI} strokeWidth={st.width} strokeLinecap="round" opacity={0.7} />
    </g>
  );
};


// Soft middle-part "curtain" hair with volume (the owner's 3D-avatar reference): two rounded domes meet at a notch
// on top, two curtains drape from the part over the temples, the sides hang past the ears and flick outward.
// Each curtain is one closed shape (dome, side, sideburn, lower edge, part); both are drawn behind and in front of the face.
const FLOW_L =
  "M292 90 C270 54 212 48 172 80 C132 108 104 160 96 214 C92 244 92 270 80 288 Q96 290 110 292 C112 316 122 344 156 372 C162 346 166 316 170 286 Q178 294 188 300 Q190 282 204 270 C218 262 230 254 240 246 C248 226 252 208 256 190 Q278 184 300 188 C296 152 290 118 292 90 Z";
const FLOW_R =
  "M292 90 C312 52 372 40 416 68 C452 88 470 108 478 128 L492 130 Q484 138 486 146 C500 176 508 216 504 250 C502 264 498 274 492 282 L506 290 Q494 292 488 296 C486 322 474 350 446 376 C440 348 436 316 432 286 Q424 294 414 300 Q412 282 400 270 C390 262 382 254 376 246 C364 230 356 210 350 190 Q324 184 300 188 C296 152 290 118 292 90 Z";
const FLOW_HI = "#5E4D42";
/** A leaf-shaped gloss band from a to b, pointed at both ends; `bend` bows it sideways. */
function leaf(a: P2, b: P2, w: number, bend: number) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  return `M${a[0]} ${a[1]} Q${mx + nx * (bend + w)} ${my + ny * (bend + w)} ${b[0]} ${b[1]} Q${mx + nx * (bend - w)} ${my + ny * (bend - w)} ${a[0]} ${a[1]} Z`;
}
// Gloss bands that follow the flow of each curtain: [from, to, half width, bend].
const FLOW_SHINE: Lock[] = [
  [[272, 98], [130, 180], 17, 36],
  [[266, 146], [182, 238], 13, 24],
  [[316, 92], [470, 176], 17, -38],
  [[334, 144], [420, 238], 13, -24],
];

/** Hair drawn behind the face (back and sides). */
export const HairBack: React.FC<{ kind: HairKind }> = ({ kind }) => {
  if (kind === "flow")
    return (
      <g>
        <path {...HAIR_STROKE} d={FLOW_L} />
        <path {...HAIR_STROKE} d={FLOW_R} />
      </g>
    );
  if (kind === "swept")
    return <path {...SW_STROKE} d="M146 336 C122 270 126 196 160 140 C196 84 254 58 312 58 C374 60 428 92 456 150 C482 206 480 272 456 336 C450 314 444 298 434 288 L168 288 C158 300 152 316 146 336 Z" />;
  if (kind === "messy")
    return <path {...HAIR_STROKE} d="M150 330 C130 270 134 200 164 150 C196 98 248 70 304 68 C366 66 420 98 448 150 C474 200 474 270 452 330 C446 310 440 296 432 286 L168 286 C160 296 154 310 150 330 Z" />;
  if (kind === "wavy")
    return <path {...HAIR_STROKE} d="M154 320 C134 262 138 196 168 148 C200 98 250 72 304 70 C364 70 416 100 444 150 C472 198 470 262 448 320 C442 302 436 290 428 282 L172 282 C164 290 158 302 154 320 Z" />;
  if (kind === "quiff")
    return <path {...HAIR_STROKE} d="M160 326 C148 276 150 220 172 178 C198 132 248 108 300 106 C354 106 404 132 428 178 C450 220 452 276 440 326 C434 300 428 282 420 268 C418 252 414 240 408 230 L192 230 C186 240 182 252 180 268 C172 282 166 300 160 326 Z" />;
  if (kind === "crop")
    return <path {...HAIR_STROKE} d="M156 328 C140 270 146 200 178 152 C210 108 256 88 300 88 C346 88 392 108 422 152 C454 200 460 270 444 328 C438 308 432 294 424 284 L176 284 C168 294 162 308 156 328 Z" />;
  // curtain
  return <path {...HAIR_STROKE} d="M158 318 C140 264 144 204 170 156 C198 106 246 74 300 72 C354 74 402 106 430 156 C456 204 460 264 442 318 C436 298 430 284 422 274 L178 274 C170 284 164 298 158 318 Z" />;
};

/** Hair drawn on top of the face (front locks, fringe, quiff). */
export const HairFront: React.FC<{ kind: HairKind }> = ({ kind }) => {
  if (kind === "flow")
    return (
      <g>
        <path {...HAIR_STROKE} d={FLOW_L} />
        <path {...HAIR_STROKE} d={FLOW_R} />
        {/* a loose wisp beside the left curtain */}
        <path d={lock([262, 192], [250, 252], 9, -3)} fill={HAIR} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        {FLOW_SHINE.map(([f, t, w, bend], i) => <path key={i} d={leaf(f, t, w, bend)} fill={FLOW_HI} opacity={0.7} />)}
        <path {...strand} strokeWidth={4} d="M118 236 C114 270 120 304 134 334 M488 246 C488 284 480 318 466 346 M284 112 C262 126 248 150 246 178 M304 110 C328 122 346 148 352 178" />
      </g>
    );
  if (kind === "swept")
    return (
      <g>
        {SWEPT_TOP.map((l, i) => <SweptLock key={`t${i}`} l={l} />)}
        <path d="M166 262 C164 150 240 88 308 84 C366 84 418 116 432 200 L300 214 L210 262 Z" fill={SW_BASE} />
        {SWEPT_FRONT.map((l, i) => <SweptLock key={`f${i}`} l={l} />)}
      </g>
    );
  if (kind === "messy")
    return (
      <g>
        {MESSY_TOP.map(([r, t, w, b], i) => <path key={`t${i}`} {...HAIR_STROKE} d={lock(r, t, w, b)} />)}
        <path d="M176 200 C190 120 250 88 304 86 C362 86 418 118 432 200 Z" fill={HAIR} />
        {MESSY_FRONT.map(([r, t, w, b], i) => <path key={`f${i}`} {...HAIR_STROKE} d={lock(r, t, w, b)} />)}
        <path {...strand} d={MESSY_HI} />
      </g>
    );
  if (kind === "wavy") {
    const clumps: [number, number, number][] = [
      [300, 92, 52], [250, 104, 48], [350, 104, 48], [208, 134, 44], [392, 134, 44],
      [182, 176, 40], [418, 176, 40], [170, 222, 32], [430, 222, 32], [168, 258, 26], [432, 258, 26],
      [226, 202, 38], [268, 198, 40], [314, 196, 40], [358, 202, 38], [396, 214, 32],
    ];
    return (
      <g>
        {clumps.map(([x, y, r], i) => <circle key={`o${i}`} cx={x} cy={y} r={r} fill={HAIR} stroke={INK} strokeWidth={10} />)}
        <ellipse cx={300} cy={160} rx={126} ry={70} fill={HAIR} />
        {clumps.map(([x, y, r], i) => <circle key={`i${i}`} cx={x} cy={y} r={r} fill={HAIR} />)}
        <path {...strand} d="M228 112 C240 98 260 96 272 108 M318 86 C332 74 352 76 362 90 M196 168 C204 154 220 150 232 158 M372 160 C384 150 402 152 410 166 M250 196 C258 184 276 182 286 194 M330 192 C340 182 358 184 364 198" />
      </g>
    );
  }
  if (kind === "quiff")
    return (
      <g>
        {/* faded sides: a soft grey-brown band above the ears */}
        <path d="M166 300 C160 270 162 246 172 228 L190 230 C182 250 178 272 180 300 Z M434 300 C440 270 438 246 428 228 L410 230 C418 250 422 272 420 300 Z" fill="#6B5A50" opacity={0.3} />
        <path {...HAIR_STROKE} d="M182 240 C166 196 174 144 212 106 C248 70 304 46 362 50 C408 54 446 78 458 116 C466 144 458 168 440 182 C450 200 448 218 438 236 C422 216 398 204 370 200 C338 196 310 204 288 218 C260 234 220 244 182 240 Z" />
        <path {...strand} d="M214 206 C228 152 276 104 346 86 M256 216 C274 170 318 130 384 116 M300 208 C326 180 368 160 428 156 M380 70 C410 72 434 88 444 112" />
      </g>
    );
  if (kind === "crop")
    return (
      <g>
        <path {...HAIR_STROKE} d="M166 250 C156 186 184 124 246 98 C298 78 362 82 404 112 C440 138 452 186 444 248 C440 238 432 232 424 236 Q414 252 404 240 Q394 232 384 250 Q370 262 362 240 Q350 230 340 252 Q328 262 318 238 Q306 228 296 248 Q284 258 274 236 Q262 228 252 246 Q238 256 230 234 Q218 228 208 244 Q196 252 190 232 Q178 230 166 250 Z" />
        {/* messy rounded tufts on top */}
        <path {...HAIR_STROKE} d="M206 124 C204 96 228 82 246 96 C250 72 280 64 294 84 C306 62 340 66 346 90 C364 76 392 90 388 116 C404 126 404 146 392 152 L212 152 C198 146 196 132 206 124 Z" />
        <path {...strand} d="M222 220 L236 150 M262 226 L268 140 M304 226 L300 132 M344 228 L334 140 M384 224 L366 150 M412 214 L396 160" />
      </g>
    );
  // curtain: middle part, two soft curtains falling to the temples
  return (
    <g>
      <path {...HAIR_STROKE} d="M302 84 C256 80 208 100 182 142 C162 176 158 222 166 270 C176 248 190 232 206 222 C226 210 246 206 266 200 C288 192 300 170 304 140 Z" />
      <path {...HAIR_STROKE} d="M298 84 C344 80 392 100 418 142 C438 176 442 222 434 270 C424 248 410 232 394 222 C374 210 354 206 334 200 C312 192 300 170 296 140 Z" />
      <path {...strand} d="M282 104 C238 112 198 150 182 214 M268 140 C238 156 214 186 204 230 M318 104 C362 112 402 150 418 214 M332 140 C362 156 386 186 396 230" />
    </g>
  );
};

/** Dotted stubble along the jaw, chin and upper lip. Deterministic, so every frame and every render match. */
export const Stubble: React.FC = () => {
  const dots: React.ReactNode[] = [];
  for (let i = 0; i < 650; i++) {
    const x = 170 + random(`sx${i}`) * 260;
    const y = 360 + random(`sy${i}`) * 145;
    const ex = (x - 300) / 138;
    const ey = (y - 330) / 170;
    const inFace = ex * ex + ey * ey < 0.97;
    if (!inFace) continue;
    const edge = 1 - Math.sqrt(ex * ex + ey * ey);
    const jaw = edge < 0.13 && y > 405;
    const lip = x > 262 && x < 338 && y > 412 && y < 428;
    const chin = Math.abs(x - 300) < 40 && y > 468;
    const mouth = ((x - 300) / 50) ** 2 + ((y - 445) / 22) ** 2 < 1;
    if ((jaw || lip || chin) && !mouth) dots.push(<circle key={i} cx={x} cy={y} r={2} fill="#2B1D16" opacity={0.6} />);
  }
  return <g>{dots}</g>;
};

type Colors = { body: string; hi: string; line: string };
export const OUTFIT: Record<Exclude<OutfitKind, "overshirt">, Colors & { cuff: string; cuffStripe?: string }> = {
  darkhoodie: { body: "#2A2A28", hi: "#45443F", line: INK, cuff: "#3A3A36" },
  tee: { body: "#7A2E3A", hi: "#93424F", line: INK, cuff: "#7A2E3A" },
  hoodie: { body: "#C8F169", hi: "#A9D24A", line: INK, cuff: "#B5DD55" },
  bomber: { body: "#1F1F1D", hi: "#3A3A36", line: INK, cuff: "#C8F169", cuffStripe: INK },
  denim: { body: "#4D6E9C", hi: "#6C8DBB", line: INK, cuff: "#3F5C86" },
};

const BODY = "M300 606 C372 606 428 622 462 660 C488 690 500 740 506 800 L530 1420 L70 1420 L94 800 C100 740 112 690 138 660 C172 622 228 606 300 606 Z";
const SKIN = "#E3B08A";
const SKIN_SHADE = "#C98F69";
const LINE = "#2B1B13";

const ITMark: React.FC<{ y: number; onLime?: boolean }> = ({ y }) => (
  <g transform={`translate(300 ${y})`}>
    <rect x={-34} y={-34} width={68} height={68} rx={15} fill={INK} />
    <rect x={-27} y={-27} width={54} height={54} rx={11} fill="#C8F169" />
    <text y={10} textAnchor="middle" fontFamily="IBM Plex Sans, sans-serif" fontWeight={700} fontSize={28} fill={INK}>
      IT
    </text>
  </g>
);

const Neck: React.FC = () => (
  <>
    <path d="M262 470 L262 612 Q300 660 338 612 L338 470 Z" fill={SKIN} stroke={LINE} strokeWidth={5} />
    <path d="M262 540 Q300 596 338 540 L338 470 L262 470 Z" fill={SKIN_SHADE} opacity={0.55} />
  </>
);


/** Headphones resting round the neck: a band behind, two lime cups on the collarbones. */
export const Headphones: React.FC = () => (
  <g>
    <path d="M214 650 C206 590 250 560 300 560 C350 560 394 590 386 650" fill="none" stroke={INK} strokeWidth={20} strokeLinecap="round" />
    <path d="M214 650 C206 590 250 560 300 560 C350 560 394 590 386 650" fill="none" stroke="#3A3A36" strokeWidth={10} strokeLinecap="round" />
    {[
      [206, 668, -24],
      [394, 668, 24],
    ].map(([x, y, r]) => (
      <g key={x} transform={`translate(${x} ${y}) rotate(${r})`}>
        <rect x={-34} y={-42} width={68} height={84} rx={30} fill="#C8F169" stroke={INK} strokeWidth={6} />
        <rect x={-20} y={-28} width={40} height={56} rx={18} fill="#A9D24A" stroke={INK} strokeWidth={4} />
      </g>
    ))}
  </g>
);

/** Torso for the new outfits (the old overshirt stays in AvatarLook). */
export const Torso: React.FC<{ kind: Exclude<OutfitKind, "overshirt"> }> = ({ kind }) => {
  const c = OUTFIT[kind];
  if (kind === "darkhoodie")
    return (
      <g>
        <path d={BODY} fill={c.body} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
        <path d="M126 760 C134 850 132 930 128 1400 M474 760 C466 850 468 930 472 1400" fill="none" stroke={c.hi} strokeWidth={10} strokeLinecap="round" />
        <path d="M196 650 C196 584 252 562 300 562 C348 562 404 584 404 650 C404 694 360 716 300 716 C240 716 196 694 196 650 Z" fill={c.hi} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <path d="M236 628 C246 596 354 596 364 628 C350 660 250 660 236 628 Z" fill="#1A1A18" />
        <Neck />
        <path d="M232 618 Q300 700 368 618" fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round" />
        <path d="M232 618 Q300 700 368 618" fill="none" stroke={c.body} strokeWidth={13} strokeLinecap="round" />
        <path d="M284 690 C282 724 278 752 276 796 M316 690 C318 724 322 752 324 796" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
        <path d="M284 690 C282 724 278 752 276 796 M316 690 C318 724 322 752 324 796" fill="none" stroke="#C8F169" strokeWidth={4} strokeLinecap="round" />
        <Headphones />
        <ITMark y={880} />
        <path d="M186 1080 L414 1080 L444 1280 L156 1280 Z" fill="none" stroke={c.hi} strokeWidth={8} strokeLinejoin="round" />
      </g>
    );
  if (kind === "tee")
    return (
      <g>
        <path d={BODY} fill={c.body} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
        <path d="M150 820 C152 900 150 1000 148 1400 M450 820 C448 900 450 1000 452 1400" fill="none" stroke={c.hi} strokeWidth={10} strokeLinecap="round" />
        <Neck />
        <path d="M248 600 Q300 660 352 600" fill="none" stroke={INK} strokeWidth={20} strokeLinecap="round" />
        <path d="M248 600 Q300 660 352 600" fill="none" stroke={c.hi} strokeWidth={11} strokeLinecap="round" />
        <ITMark y={790} />
      </g>
    );
  if (kind === "hoodie")
    return (
      <g>
        <path d={BODY} fill={c.body} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
        <path d="M126 760 C134 850 132 930 128 1400 M474 760 C466 850 468 930 472 1400" fill="none" stroke={c.hi} strokeWidth={10} strokeLinecap="round" />
        {/* hood lying around the neck */}
        <path d="M196 650 C196 584 252 562 300 562 C348 562 404 584 404 650 C404 694 360 716 300 716 C240 716 196 694 196 650 Z" fill={c.hi} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <path d="M236 628 C246 596 354 596 364 628 C350 660 250 660 236 628 Z" fill="#7E9E33" />
        <Neck />
        <path d="M232 618 Q300 700 368 618" fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round" />
        <path d="M232 618 Q300 700 368 618" fill="none" stroke={c.body} strokeWidth={13} strokeLinecap="round" />
        {/* drawstrings */}
        <path d="M282 672 C280 712 276 744 274 790 M318 672 C320 712 324 744 326 790" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
        <path d="M282 672 C280 712 276 744 274 790 M318 672 C320 712 324 744 326 790" fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" />
        <ITMark y={866} />
        <path d="M186 1080 L414 1080 L444 1280 L156 1280 Z" fill="none" stroke={c.hi} strokeWidth={8} strokeLinejoin="round" />
      </g>
    );
  if (kind === "bomber")
    return (
      <g>
        <path d={BODY} fill={c.body} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
        {/* white tee in the open front */}
        <path d="M236 610 C264 602 336 602 364 610 L376 1420 L224 1420 Z" fill="#F4F2EC" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <ITMark y={806} />
        {/* lime ribbed collar round the back of the neck, with an ink stripe */}
        <path d="M214 642 C222 600 262 584 300 584 C338 584 378 600 386 642" fill="none" stroke={INK} strokeWidth={32} strokeLinecap="round" />
        <path d="M214 642 C222 600 262 584 300 584 C338 584 378 600 386 642" fill="none" stroke={c.cuff} strokeWidth={23} strokeLinecap="round" />
        <path d="M214 642 C222 600 262 584 300 584 C338 584 378 600 386 642" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
        <Neck />
        <path d="M250 598 Q300 652 350 598" fill="none" stroke={INK} strokeWidth={15} strokeLinecap="round" />
        <path d="M250 598 Q300 652 350 598" fill="none" stroke="#F4F2EC" strokeWidth={8} strokeLinecap="round" />
        <path d="M228 650 L218 1420 M372 650 L382 1420" fill="none" stroke={c.hi} strokeWidth={8} strokeDasharray="5 7" />
        <path d="M126 760 C134 850 132 930 128 1400 M474 760 C466 850 468 930 472 1400" fill="none" stroke={c.hi} strokeWidth={8} strokeLinecap="round" />
      </g>
    );
  // denim jacket over the lime tee
  return (
    <g>
      <path d={BODY} fill={c.body} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <path d="M232 610 C262 600 338 600 368 610 L382 1420 L218 1420 Z" fill="#C8F169" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <ITMark y={806} />
      <Neck />
      <path d="M250 598 Q300 652 350 598" fill="none" stroke={INK} strokeWidth={17} strokeLinecap="round" />
      <path d="M250 598 Q300 652 350 598" fill="none" stroke="#A9D24A" strokeWidth={9} strokeLinecap="round" />
      {/* pointed collar */}
      <path d="M256 598 C230 600 196 612 176 632 L214 716 L252 668 Z" fill={c.hi} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M344 598 C370 600 404 612 424 632 L386 716 L348 668 Z" fill={c.hi} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      {/* chest pockets with flaps and copper buttons */}
      <path d="M122 790 H198 V840 Q160 852 122 840 Z M402 790 H478 V840 Q440 852 402 840 Z" fill={c.hi} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <circle cx={160} cy={834} r={7} fill="#B87333" stroke={INK} strokeWidth={3} />
      <circle cx={440} cy={834} r={7} fill="#B87333" stroke={INK} strokeWidth={3} />
      {/* orange stitching */}
      <path d="M232 720 L222 1420 M368 720 L378 1420 M118 880 C140 872 190 872 214 880 M386 880 C410 872 460 872 482 880" fill="none" stroke="#D9A44E" strokeWidth={4} strokeDasharray="10 8" />
      {[900, 1010].map((y) => (
        <circle key={y} cx={210} cy={y} r={8} fill="#B87333" stroke={INK} strokeWidth={3} />
      ))}
    </g>
  );
};
