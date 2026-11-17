import React from "react";
import { AbsoluteFill } from "remotion";
import { Avatar, type AvatarKey } from "./Avatar";
import { BrandMark } from "./Chrome";
import { LabelPill, Sticker } from "./Bits";
import { Subtitles } from "./Subtitles";
import { CommentCard, FollowButton } from "./Cta";
import { LAYOUT, palette as P, type } from "./tokens";

/** One-page style guide, drawn with the real components so it can never drift from the reels. */
const POSES: (Omit<AvatarKey, "at"> & { label: string; level?: number })[] = [
  { pose: "rest", expr: "talk", label: "Talk" },
  { pose: "surprised", expr: "surprised", label: "Hook" },
  { pose: "point", aim: -70, expr: "talk", level: 0.7, look: [0.5, -0.8], label: "Show" },
  { pose: "wave", expr: "happy", label: "Call to action" },
];
const SWATCHES: [string, string, string][] = [
  ["Paper", P.paper, "background"],
  ["Ink", P.ink, "text, outlines"],
  ["Lime", P.lime, "accent, tags"],
  ["Olive", P.olive, "accent text"],
  ["Card", P.card, "cards, subtitles"],
  ["Line", P.line, "quiet borders"],
  ["Gold", P.gold, "coins, confetti"],
  ["Pink", P.pink, "confetti"],
];
const RULES = [
  "Paper background, ink text, one lime accent.",
  "Show the real website as proof, never a mock-up.",
  "No income numbers. Disclaimer always on screen.",
  "Subtitles come from the real voice, word by word.",
  "Same avatar, outfit, subtitles and CTA every reel.",
];

const Label: React.FC<{ y: number; children: React.ReactNode }> = ({ y, children }) => (
  <div style={{ position: "absolute", left: 60, top: y, ...type.label, fontSize: 22, color: P.olive }}>{children}</div>
);

export const StyleGuide: React.FC = () => {
  const k = 140 / 1080;
  const box = (top: number, h: number, left: number, w: number, style: React.CSSProperties) => (
    <div style={{ position: "absolute", top: top * k, height: h * k, left: left * k, width: w * k, borderRadius: 3, ...style }} />
  );
  return (
    <AbsoluteFill style={{ background: P.paper }}>
      <div style={{ position: "absolute", left: 60, top: 50, display: "flex", alignItems: "center", gap: 20 }}>
        <BrandMark size={76} />
        <div>
          <div style={{ ...type.display, fontSize: 54, color: P.ink }}>Internet Toolbox reels</div>
          <div style={{ ...type.label, fontSize: 20, color: P.ink2, marginTop: 6 }}>Series style guide · v4</div>
        </div>
      </div>

      <Label y={180}>The avatar</Label>
      {POSES.map((c, i) => (
        <div key={i} style={{ position: "absolute", left: i * 270, top: 214, width: 270, height: 380, overflow: "hidden" }}>
          <Avatar keys={[{ at: -10, ...c }]} places={[{ at: -10, x: 135, y: 150, s: 0.42 }]} env={[c.level ?? 0]} blinks={[]} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, textAlign: "center", ...type.label, fontSize: 17, color: P.ink2 }}>{c.label}</div>
        </div>
      ))}

      <Label y={612}>Palette (from the website)</Label>
      {SWATCHES.map(([name, hex, use], i) => (
        <div key={name} style={{ position: "absolute", left: 60 + (i % 4) * 245, top: 648 + Math.floor(i / 4) * 86, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 62, height: 62, borderRadius: 12, background: hex, border: `3px solid ${P.ink}` }} />
          <div>
            <div style={{ ...type.display, fontSize: 24, color: P.ink }}>{name}</div>
            <div style={{ ...type.label, letterSpacing: "0.04em", fontSize: 15, color: P.ink2 }}>{hex}</div>
            <div style={{ ...type.body, fontSize: 15, color: P.ink3 }}>{use}</div>
          </div>
        </div>
      ))}

      <Label y={838}>Type and tags (IBM Plex Sans + Plex Mono)</Label>
      <div style={{ position: "absolute", left: 60, top: 872, display: "flex", alignItems: "center", gap: 26 }}>
        <span style={{ ...type.display, fontSize: 76, color: P.ink }}>Ruler website</span>
        <Sticker size={62}>se paisa?!</Sticker>
      </div>
      <div style={{ position: "absolute", left: 60, top: 990, display: "flex", alignItems: "center", gap: 22 }}>
        <LabelPill text="Real website" t={0.5} size={24} />
        <Sticker size={40} tone="ink" rotate={-4}>
          Part 2
        </Sticker>
        <Sticker size={40} rotate={2}>
          Online ruler
        </Sticker>
        <span style={{ position: "relative", ...type.display, fontSize: 44, color: P.ink }}>
          <span style={{ position: "absolute", left: "-0.08em", right: "-0.08em", top: "0.2em", bottom: "0.04em", background: P.lime, borderRadius: "0.12em", transform: "skewX(-6deg)" }} />
          <span style={{ position: "relative" }}>Traffic</span>
        </span>
      </div>

      <Label y={1094}>Subtitles: grey until spoken, key words on lime</Label>
      <Subtitles top={1132} captions={[{ start: -1, end: 99, words: [["Comment", -1], ["LEARN", -1], ["aur", 99], ["follow", 99], ["karo.", 99]], hi: ["LEARN", "follow"] }]} />

      <Label y={1286}>Call to action</Label>
      <CommentCard t={20} at={0} keyword="LEARN" typeAt={0} typeTo={0.1} sendAt={99} top={1322} />
      <FollowButton t={20} at={0} tapAt={10} top={1478} />

      <Label y={1606}>Layout rhythm and rules</Label>
      <div style={{ position: "absolute", left: 60, top: 1642, width: 1080 * k, height: 1920 * k, background: P.paper2, border: `3px solid ${P.ink}`, borderRadius: 10, overflow: "hidden" }}>
        {box(0, 250, 0, 1080, { background: "#00000014", borderRadius: 0 })}
        {box(1580, 340, 0, 1080, { background: "#00000014", borderRadius: 0 })}
        {box(326, 175, 60, 960, { background: `${P.lime}AA` })}
        {box(540, 545, 80, 870, { background: P.card, border: `2px solid ${P.ink}` })}
        {box(1170, 118, 150, 780, { background: P.card, border: `2px solid ${P.ink}` })}
        <div style={{ position: "absolute", left: (250 - 170) * k, top: (1440 - 120) * k, width: 340 * k, height: 340 * k, borderRadius: 999, background: P.limeSoft, border: `2px solid ${P.lime}` }} />
      </div>
      <div style={{ position: "absolute", left: 60 + 140 + 18, top: 1642, ...type.label, letterSpacing: "0.04em", fontSize: 14, lineHeight: 1.55, color: P.ink2 }}>
        <div>Headline y {LAYOUT.headerTop}</div>
        <div>Proof panel y 540</div>
        <div>Subtitles y {LAYOUT.captionTop}</div>
        <div>Avatar corner</div>
        <div>Grey: Instagram UI</div>
      </div>
      <div style={{ position: "absolute", left: 400, top: 1640, width: 640 }}>
        {RULES.map((r) => (
          <div key={r} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ width: 14, height: 14, marginTop: 9, borderRadius: 4, background: P.lime, border: `2px solid ${P.ink}`, flexShrink: 0 }} />
            <div style={{ ...type.body, fontSize: 24, lineHeight: 1.3, color: P.ink }}>{r}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
