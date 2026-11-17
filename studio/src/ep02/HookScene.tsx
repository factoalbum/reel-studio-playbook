import React from "react";
import { random } from "remotion";
import { LAYOUT, palette as P, SAFE, sans } from "../brand/tokens";
import { HeroTitle, Headline } from "../brand/Headline";
import { Burst, LabelPill, Mark } from "../brand/Bits";
import { RecapCard } from "../brand/ProofMarks";
import { ToolTile, TOOL_KINDS } from "../brand/ToolTiles";
import type { Rect, Shot } from "../brand/ProofPanel";
import { range, usePop } from "../components/motion";

/** Voice times for the hook (seconds). */
export type HookCues = {
  card: number;
  na: number;
  laugh: number;
  think: number;
  collapse: number;
  title: number;
  kyon: number;
  burst: number;
  tools: number;
  ki: number;
  website: number;
  converge: number;
  gone: number;
};

const RULER_AT: [number, number] = [540, 800];
// Tool tiles land in a 4 x 3 grid in the proof area, clear of the headline and the captions.
const GRID = TOOL_KINDS.map((kind, i) => ({ kind, x: 200 + (i % 4) * 210, y: 655 + Math.floor(i / 4) * 180 }));

/**
 * Hook: last episode's real ruler website comes back ("pichhli reel..."), a laugh, "ek ruler kyon?",
 * then the one ruler bursts into a whole box of tools, which fly into the website reveal at `target`.
 */
export const HookScene: React.FC<{ t: number; cue: HookCues; recap: { shot: Shot; crop: Rect }; part: string; target: [number, number] }> = ({ t, cue, recap, part, target }) => {
  if (t > cue.gone + 0.1) return null;
  return (
    <>
      <PartPill t={t} cue={cue} part={part} />
      <Recap t={t} cue={cue} recap={recap} />
      <BigRuler t={t} cue={cue} />
      <div style={{ position: "absolute", inset: 0, opacity: 1 - range(t, cue.burst - 0.08, cue.burst + 0.12) }}>
        {t >= cue.title - 0.05 && t < cue.burst + 0.15 && (
          <HeroTitle
            t={t}
            at={cue.title}
            top={LAYOUT.headerTop}
            lines={[
              { text: "Ek ruler", size: 100 },
              { text: "kyon?", size: 132, tone: "lime" },
            ]}
          />
        )}
        {t < cue.burst + 0.15 && (
          <>
            <Mark t={t} at={cue.kyon} x={110} y={690} text="?" color={P.gold} size={130} rot={-14} />
            <Mark t={t} at={cue.kyon + 0.12} x={850} y={650} text="?" color={P.lime} size={150} rot={12} />
          </>
        )}
      </div>
      <Burst t={t} at={cue.burst} x={RULER_AT[0]} y={RULER_AT[1]} r={210} />
      {GRID.map((g, i) => (
        <FlyingTile key={g.kind} t={t} cue={cue} i={i} kind={g.kind} to={[g.x, g.y]} target={target} />
      ))}
      <Headline
        t={t}
        top={LAYOUT.headerTop}
        inAt={cue.burst}
        outAt={cue.converge + 0.15}
        lines={[
          {
            size: 92,
            segs: [
              { text: "Poori", at: cue.burst },
              { text: "tools", at: cue.tools, tone: "lime" },
              { text: "ki", at: cue.ki },
            ],
          },
          { size: 100, segs: [{ text: "website!", at: cue.website, tone: "marker" }] },
        ]}
      />
    </>
  );
};

/** "PART 2" in the corner while the recap plays, so the series order is clear. */
const PartPill: React.FC<{ t: number; cue: HookCues; part: string }> = ({ t, cue, part }) => {
  const p = usePop(t, cue.card + 0.2, { damping: 11, stiffness: 190, mass: 0.6 });
  const out = range(t, cue.converge, cue.converge + 0.25);
  if (p <= 0 || out >= 1) return null;
  return (
    <div style={{ position: "absolute", right: 1080 - SAFE.right, top: LAYOUT.brandTop + 6, transformOrigin: "100% 50%", opacity: 1 - out }}>
      <LabelPill text={part} t={t} size={26} pop={p} />
    </div>
  );
};

/** Last episode's real screenshot: over the avatar first, then centre stage, then it folds into one ruler. */
const Recap: React.FC<{ t: number; cue: HookCues; recap: { shot: Shot; crop: Rect } }> = ({ t, cue, recap }) => {
  const pop = usePop(t, cue.card, { damping: 11, stiffness: 150, mass: 0.8 });
  const fold = range(t, cue.collapse, cue.collapse + 0.3);
  if (pop <= 0 || fold >= 1) return null;
  const move = range(t, cue.think, cue.think + 0.5);
  const width = 560;
  const cardW = width + 24 + 10;
  const cardH = (recap.crop.h * width) / recap.crop.w + 24 + 10;
  const top = 336 + (RULER_AT[1] - cardH / 2 - 336) * move;
  const wiggle = t > cue.laugh && t < cue.think ? Math.sin((t - cue.laugh) * 16) * 3 * (1 - range(t, cue.laugh, cue.think)) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: 540 - cardW / 2,
        top,
        transformOrigin: "50% 50%",
        transform: `scale(${(1 + 0.35 * move) * (1 - 0.2 * fold)}, ${(1 + 0.35 * move) * (1 - 0.85 * fold)}) rotate(${wiggle}deg)`,
        opacity: 1 - fold,
      }}
    >
      <RecapCard shot={recap.shot} crop={recap.crop} width={width} label="Part 1" caption="Ruler website" t={t} pop={pop} rotate={-3 + 2 * move} />
      <Mark t={t} at={cue.na} x={cardW - 30} y={-20} text="?" color={P.gold} size={110} rot={14} />
    </div>
  );
};

/** One lime ruler: what the recap card folds into, until it bursts into tools. */
const BigRuler: React.FC<{ t: number; cue: HookCues }> = ({ t, cue }) => {
  const p = usePop(t, cue.collapse + 0.12, { damping: 9, stiffness: 190, mass: 0.7 });
  if (p <= 0 || t > cue.burst + 0.12) return null;
  const flash = range(t, cue.burst - 0.06, cue.burst + 0.1);
  const w = 560;
  const h = 150;
  const ticks: React.ReactNode[] = [];
  for (let i = 0; i <= 50; i++) {
    const x = 26 + i * ((w - 52) / 50);
    const major = i % 10 === 0;
    ticks.push(<line key={i} x1={x} x2={x} y1={6} y2={major ? 62 : i % 5 === 0 ? 44 : 28} stroke={P.ink} strokeWidth={major ? 5 : 3} strokeLinecap="round" />);
    if (major) {
      ticks.push(
        <text key={`n${i}`} x={x} y={108} textAnchor="middle" fontSize={34} fontWeight={700} fill={P.ink} fontFamily={sans}>
          {i / 10}
        </text>,
      );
    }
  }
  return (
    <div
      style={{
        position: "absolute",
        left: RULER_AT[0] - w / 2,
        top: RULER_AT[1] - h / 2 + Math.sin((t - cue.collapse) * 4) * 8,
        transform: `scale(${Math.min(p, 1.1) * (1 + 0.25 * flash)}) rotate(${-4 + 3 * Math.sin((t - cue.collapse) * 3)}deg)`,
        opacity: 1 - flash,
      }}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
        <rect x={10} y={10} width={w} height={h} rx={18} fill={P.ink} />
        <rect x={0} y={0} width={w} height={h} rx={18} fill={P.lime} stroke={P.ink} strokeWidth={7} />
        {ticks}
        <rect x={0} y={0} width={w} height={h} rx={18} fill="#FFFFFF" opacity={flash * 0.9} />
      </svg>
    </div>
  );
};

/** One tool tile: bursts out of the ruler to its grid spot, bobs, then flies into the website panel. */
const FlyingTile: React.FC<{ t: number; cue: HookCues; i: number; kind: (typeof TOOL_KINDS)[number]; to: [number, number]; target: [number, number] }> = ({ t, cue, i, kind, to, target }) => {
  const at = cue.burst + i * 0.035;
  const p = usePop(t, at, { damping: 11, stiffness: 150, mass: 0.7 });
  if (p <= 0) return null;
  const k = Math.min(p, 1.06);
  let x = RULER_AT[0] + (to[0] - RULER_AT[0]) * k;
  let y = RULER_AT[1] + (to[1] - RULER_AT[1]) * k - Math.sin(Math.min(1, p) * Math.PI) * 90;
  y += Math.sin((t - at) * 3 + i) * 6 * Math.min(1, p);
  const c = range(t, cue.converge + i * 0.02, cue.converge + 0.42 + i * 0.02);
  x += (target[0] - x) * c;
  y += (target[1] - y) * c;
  const size = 150;
  const rot = (random(`ep02-tile-${i}`) * 16 - 8) * (1 - c);
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        transform: `scale(${(0.35 + 0.65 * Math.min(p, 1.08)) * (1 - 0.75 * c)}) rotate(${rot}deg)`,
        opacity: Math.min(1, p * 2) * (1 - range(t, cue.converge + 0.25 + i * 0.02, cue.converge + 0.45 + i * 0.02)),
      }}
    >
      <ToolTile kind={kind} size={size} />
    </div>
  );
};
