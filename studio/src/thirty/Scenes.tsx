import React from "react";
import { Img, staticFile } from "remotion";
import { Burst, Sticker } from "../brand/Bits";
import { BrandMark } from "../brand/Chrome";
import { CommentCard, FollowButton } from "../brand/Cta";
import { Headline, HeroTitle } from "../brand/Headline";
import { palette as P, shadow, type } from "../brand/tokens";
import { Heart, Sparks } from "../bonus/kit";
import { centre, DemoTag } from "../immich/kit";
import { eo, lerp, pop, seg } from "../mdh/kit";
import { pad, type ThirtyEpisode } from "./episode";

/**
 * "30 DAYS. ONE DIGITAL PRODUCT." scenes. Nothing here is episode specific: every time, number and line comes from
 * the episode data (src/episodes/thirty/epNN.json). The kit files are drawn mockups of the real 8 files (labelled
 * so on screen); the Chapter 3 pages are the real free sample pages from the website.
 */

type S = { t: number; ep: ThirtyEpisode };
const mix = (k: number) => Math.min(1, k);
const sc = (k: number) => mix(k) * (k > 1 ? 1 + (k - 1) * 0.3 : 1);
/** 0 before the scene ends, 1 once it is gone (0.25 s exit). */
const leave = (t: number, at: number) => eo(seg(t, at - 0.12, at + 0.13));

// =================================================================================================================
// Product facts (from the website's ebook-data.ts; change here if the kit changes)

export const KIT = { title: ["Ebook", "Launch", "Kit"], sub: "for India", price: "₹99", priceNote: "LAUNCH PRICE · ONE-TIME" };
type Kind = "cover" | "doc" | "prompts" | "wire" | "sheet" | "outline";
type Fmt = "PDF" | "DOCX" | "XLSX";
export const FILES: { name: string; fmt: Fmt; kind: Kind }[] = [
  { name: "Guide", fmt: "PDF", kind: "cover" },
  { name: "Guide", fmt: "DOCX", kind: "doc" },
  { name: "21 prompts", fmt: "PDF", kind: "prompts" },
  { name: "21 prompts", fmt: "DOCX", kind: "prompts" },
  { name: "Templates", fmt: "PDF", kind: "wire" },
  { name: "Templates", fmt: "DOCX", kind: "wire" },
  { name: "Workbook", fmt: "XLSX", kind: "sheet" },
  { name: "Outline", fmt: "DOCX", kind: "outline" },
];

// =================================================================================================================
// Camera and wipes

export const CAM_ORIGIN = "540px 820px";
export const cam = (t: number, ep: ThirtyEpisode) => {
  const c = ep.cues;
  const push = (at: number, amt: number, hold = 0.7) => amt * eo(seg(t, at, at + 0.3)) * (1 - eo(seg(t, at + hold, at + hold + 0.4)));
  return 1 + push(c.days, 0.05, 0.5) + push(c.files, 0.035) + push(c.dayFill, 0.03) + push(c.keyword + 0.45, 0.04);
};

/** Lime and ink bars that sweep across between the big sections. */
export const Wipes: React.FC<S> = ({ t, ep }) => {
  const c = ep.cues;
  const ats = [c.kit, c.tracker, ...(c.lesson !== null ? [c.lesson] : []), c.sample];
  return (
    <>
      {ats.map((at, i) => {
        const k = seg(t, at - 0.22, at + 0.18);
        if (k <= 0 || k >= 1) return null;
        return (
          <div key={i} style={{ position: "absolute", left: -500, top: -100, width: 2080, height: 2120, transform: `translateX(${lerp(-1700, 1700, eo(k))}px) skewX(-14deg)`, display: "flex" }}>
            <div style={{ flex: 1, background: i % 2 ? P.lime : P.ink }} />
            <div style={{ flex: 1, background: i % 2 ? P.ink : P.lime }} />
          </div>
        );
      })}
    </>
  );
};

// =================================================================================================================
// Mockups: the book cover and the eight files

export const BookCover: React.FC<{ w: number; style?: React.CSSProperties }> = ({ w, style }) => {
  const h = w * 1.36;
  const u = w / 300;
  return (
    <div style={{ position: "relative", width: w, height: h, borderRadius: 12 * u, background: "#141414", boxShadow: `${10 * u}px ${12 * u}px 0 ${P.ink}, 0 ${24 * u}px ${50 * u}px rgba(0,0,0,0.25)`, overflow: "hidden", ...style }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 16 * u, background: "linear-gradient(90deg, #000 0%, #2a2a2a 70%, #141414 100%)" }} />
      {[110, 74].map((r) => (
        <div key={r} style={{ position: "absolute", right: -r * 0.45 * u, top: -r * 0.35 * u, width: r * 2 * u, height: r * 2 * u, borderRadius: "50%", border: `${2.5 * u}px solid rgba(200,241,105,0.35)` }} />
      ))}
      <div style={{ position: "absolute", left: 36 * u, top: 30 * u, ...type.label, fontSize: 13 * u, color: P.lime }}>Internet Toolbox</div>
      <div style={{ position: "absolute", left: 34 * u, top: 70 * u, ...type.display, fontSize: 54 * u, lineHeight: 0.98, color: "#fff" }}>
        {KIT.title.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 36 * u, top: 248 * u, width: 92 * u, height: 12 * u, borderRadius: 8 * u, background: P.lime }} />
      <div style={{ position: "absolute", left: 36 * u, top: 272 * u, ...type.body, fontWeight: 600, fontSize: 30 * u, color: P.lime }}>{KIT.sub}</div>
      <div style={{ position: "absolute", left: 36 * u, right: 30 * u, top: 340 * u, borderTop: `${1.5 * u}px solid #3a3a3a`, paddingTop: 10 * u, ...type.body, fontSize: 15 * u, color: "#ddd" }}>
        Guide · 21 prompts · Templates · Workbook
      </div>
    </div>
  );
};

const FMT: Record<Fmt, { bg: string; fg: string }> = { PDF: { bg: P.ink, fg: P.lime }, DOCX: { bg: P.card, fg: P.ink }, XLSX: { bg: P.lime, fg: P.ink } };

const Lines: React.FC<{ n: number; w: number; gap?: number; h?: number; color?: string }> = ({ n, w, gap = 9, h = 7, color = P.line }) => (
  <div style={{ display: "flex", flexDirection: "column", gap }}>
    {Array.from({ length: n }, (_, i) => (
      <div key={i} style={{ width: w * (i % 3 === 2 ? 0.62 : i % 3 === 1 ? 0.86 : 1), height: h, borderRadius: h, background: color }} />
    ))}
  </div>
);

/** A drawn page for one file type (never a screenshot of the paid files). */
const PageArt: React.FC<{ kind: Kind; w: number; h: number }> = ({ kind, w, h }) => {
  const inner = w - 36;
  if (kind === "cover") return <BookCover w={w} style={{ position: "absolute", inset: 0, height: h, boxShadow: "none", borderRadius: 0 }} />;
  const pad = { position: "absolute" as const, left: 18, top: 18, right: 18 };
  if (kind === "doc")
    return (
      <div style={pad}>
        <div style={{ width: inner * 0.8, height: 16, borderRadius: 5, background: P.ink, marginBottom: 12 }} />
        <Lines n={4} w={inner} />
        <div style={{ height: 34, borderRadius: 7, background: P.limeWash, borderLeft: `5px solid ${P.olive}`, margin: "12px 0" }} />
        <Lines n={4} w={inner} />
      </div>
    );
  if (kind === "prompts")
    return (
      <div style={{ ...pad, display: "flex", flexDirection: "column", gap: 10 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ borderRadius: 8, border: `2px solid ${P.lineStrong}`, borderLeft: `6px solid ${P.lime}`, padding: "7px 8px", background: i === 0 ? P.limeWash : P.card }}>
            <div style={{ ...type.label, fontSize: 9, color: P.olive, marginBottom: 5 }}>Prompt {i + 1}</div>
            <Lines n={2} w={inner - 26} h={6} gap={6} />
          </div>
        ))}
      </div>
    );
  if (kind === "wire")
    return (
      <div style={{ ...pad, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ height: 40, borderRadius: 6, border: `2px dashed ${P.lineStrong}`, background: P.paper2 }} />
        <div style={{ display: "flex", gap: 8 }}>
          {[0, 1].map((i) => (
            <div key={i} style={{ flex: 1, height: 44, borderRadius: 6, border: `2px dashed ${P.lineStrong}` }} />
          ))}
        </div>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 14, height: 14, borderRadius: 4, border: `2px solid ${P.ink}`, background: i < 2 ? P.lime : P.card }} />
            <div style={{ flex: 1, height: 6, borderRadius: 6, background: P.line }} />
          </div>
        ))}
      </div>
    );
  if (kind === "sheet") {
    const cols = 4;
    return (
      <div style={{ ...pad, right: 12, left: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, border: `2px solid ${P.lineStrong}` }}>
          {Array.from({ length: cols * 8 }, (_, i) => (
            <div key={i} style={{ height: 15, borderRight: `1px solid ${P.line}`, borderBottom: `1px solid ${P.line}`, background: i < cols ? P.ink : i % cols === 3 && i > cols ? P.limeSoft : P.card }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 3, marginTop: 8 }}>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} style={{ flex: 1, height: 12, borderRadius: "0 0 4px 4px", background: i === 1 ? P.lime : P.paper2, border: `1px solid ${P.lineStrong}` }} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div style={{ ...pad, display: "flex", flexDirection: "column", gap: 9 }}>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 18, height: 18, borderRadius: 9, background: i < 3 ? P.lime : P.paper2, border: `2px solid ${P.ink}`, ...type.label, fontSize: 9, letterSpacing: 0, display: "flex", alignItems: "center", justifyContent: "center", color: P.ink }}>{i + 1}</div>
          <div style={{ flex: 1, height: 7, borderRadius: 7, background: i < 3 ? P.lineStrong : P.line }} />
        </div>
      ))}
    </div>
  );
};

const FileThumb: React.FC<{ f: (typeof FILES)[number]; w: number }> = ({ f, w }) => {
  const h = w * 1.18;
  const c = FMT[f.fmt];
  return (
    <div style={{ width: w, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ position: "relative", width: w, height: h, background: P.card, border: `4px solid ${P.ink}`, borderRadius: 14, boxShadow: shadow.hard(6), overflow: "hidden" }}>
        <PageArt kind={f.kind} w={w - 8} h={h - 8} />
        {f.kind !== "cover" && <div style={{ position: "absolute", right: -2, top: -2, width: 30, height: 30, background: P.paper2, borderLeft: `3px solid ${P.ink}`, borderBottom: `3px solid ${P.ink}`, borderBottomLeftRadius: 8 }} />}
        <div style={{ position: "absolute", left: 8, bottom: 8, ...type.label, fontSize: 17, letterSpacing: "0.06em", background: c.bg, color: c.fg, border: `3px solid ${P.ink}`, borderRadius: 8, padding: "2px 8px" }}>{f.fmt}</div>
      </div>
      <div style={{ ...type.display, fontSize: 28, color: P.ink, whiteSpace: "nowrap" }}>{f.name}</div>
    </div>
  );
};

// =================================================================================================================
// 0. Hook: "30 DAYS. ONE DIGITAL PRODUCT." + day badge

export const HookScene: React.FC<S> = ({ t, ep }) => {
  const c = ep.cues;
  const o = leave(t, c.experiment);
  if (o >= 1) return null;
  const badge = pop(t, c.dayBadge, { damping: 9, stiffness: 230 });
  const peek = pop(t, c.product + 0.35, { damping: 12, stiffness: 160 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o, transform: `translateY(${-o * 60}px)` }}>
      {/* The kit peeks in behind the title, so the product is on screen from the first second. */}
      {peek > 0 && (
        <div style={{ ...centre(lerp(1250, 880, eo(mix(peek))), 1010, 0.62, `rotate(${10 - 4 * mix(peek)}deg)`) }}>
          <BookCover w={300} />
        </div>
      )}
      <HeroTitle t={t} at={c.days} top={330} lines={[{ text: "30 DAYS.", size: 184 }]} />
      <HeroTitle t={t} at={c.product} top={560} lines={[{ text: "ONE DIGITAL", size: 112 }, { text: "PRODUCT.", size: 126, tone: "lime" }]} />
      <Burst t={t} at={c.days} x={540} y={430} r={460} color={P.lime} />
      <Sparks t={t} at={c.product + 0.1} x={760} y={800} />
      {badge > 0 && (
        <div style={{ ...centre(470, 1010, sc(badge), `rotate(${(1 - mix(badge)) * -14 - 3}deg)`) }}>
          <Sticker size={58} tone="ink" rotate={0}>
            DAY {pad(ep.day)} / {ep.totalDays}
          </Sticker>
        </div>
      )}
    </div>
  );
};

// =================================================================================================================
// A. The experiment: three rules

export const ExperimentScene: React.FC<S> = ({ t, ep }) => {
  const c = ep.cues;
  if (t < c.experiment - 0.1) return null;
  const o = leave(t, c.kit);
  if (o >= 1) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <Headline
        t={t}
        top={330}
        inAt={c.experiment}
        outAt={c.kit + 1}
        lines={[{ size: 96, segs: [{ text: "The", at: c.experiment }, { text: "experiment", at: c.experiment + 0.25, tone: "marker" }] }]}
      />
      <div style={{ ...centre(540, 470, mix(pop(t, c.experiment + 0.5, { damping: 13 })) ), ...type.label, fontSize: 26, color: P.ink2, whiteSpace: "nowrap" }}>
        One ₹99 ebook · 30 days · organic only
      </div>
      {ep.rules.map((r, i) => {
        const k = pop(t, c.rules[i] ?? c.experiment + 1 + i, { damping: 11, stiffness: 190 });
        if (k <= 0) return null;
        return (
          <div
            key={r}
            style={{
              position: "absolute",
              left: 120,
              top: 560 + i * 168,
              width: 830,
              height: 136,
              display: "flex",
              alignItems: "center",
              gap: 26,
              padding: "0 30px",
              background: P.card,
              border: `5px solid ${P.ink}`,
              borderRadius: 28,
              boxShadow: shadow.hard(8),
              transform: `translateX(${(1 - mix(k)) * 700}px) rotate(${(i % 2 ? 1 : -1) * (1 - mix(k)) * 6}deg)`,
            }}
          >
            <div style={{ flex: "0 0 76px", height: 76, borderRadius: 38, background: P.lime, border: `4px solid ${P.ink}`, ...type.display, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center", color: P.ink }}>{i + 1}</div>
            <div style={{ ...type.display, fontSize: 46, color: P.ink, lineHeight: 1.05 }}>{r}</div>
          </div>
        );
      })}
    </div>
  );
};

// =================================================================================================================
// B. The kit: cover, then the eight files burst out of it, then the price

const SLOT = (i: number): [number, number] => [540 + ((i % 4) - 1.5) * 205, i < 4 ? 690 : 950];

export const KitScene: React.FC<S> = ({ t, ep }) => {
  const c = ep.cues;
  if (t < c.kit - 0.15) return null;
  const o = leave(t, c.tracker);
  if (o >= 1) return null;
  const cover = pop(t, c.kit + 0.05, { damping: 10, stiffness: 170 });
  const burst = eo(seg(t, c.files - 0.05, c.files + 0.25));
  const count = pop(t, c.files + 0.95, { damping: 9, stiffness: 220 });
  const price = pop(t, c.price, { damping: 8, stiffness: 240 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <Headline
        t={t}
        top={330}
        inAt={c.kit}
        outAt={c.price - 0.15}
        lines={[
          { size: 92, segs: [{ text: "Ebook Launch Kit", at: c.kit + 0.15, tone: "marker" }] },
          { size: 58, segs: [{ text: "for India", at: c.kit + 0.45, tone: "olive" }] },
        ]}
      />
      {price > 0 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 340, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div style={{ transform: `scale(${sc(price)}) rotate(${(1 - mix(price)) * 12 - 3}deg)` }}>
            <Sticker size={110} tone="lime" rotate={0}>
              {KIT.price}
            </Sticker>
          </div>
          <div style={{ ...type.label, fontSize: 26, color: P.ink2, opacity: mix(price) }}>{KIT.priceNote}</div>
        </div>
      )}
      {burst < 1 && cover > 0 && (
        <div style={{ ...centre(540, 820, sc(cover) * (1 - 0.7 * burst), `rotate(${(1 - mix(cover)) * -10 + 3}deg)`), opacity: 1 - burst }}>
          <BookCover w={330} />
        </div>
      )}
      {FILES.map((f, i) => {
        const k = pop(t, c.files + i * 0.09, { damping: 12, stiffness: 170 });
        if (k <= 0) return null;
        const [x, y] = SLOT(i);
        const m = eo(mix(k));
        return (
          <div key={i} style={{ ...centre(lerp(540, x, m), lerp(820, y, m), lerp(0.4, 1, mix(k)) * (k > 1 ? 1 + (k - 1) * 0.25 : 1), `rotate(${(1 - m) * (i % 2 ? 18 : -18)}deg)`) }}>
            <FileThumb f={f} w={168} />
          </div>
        );
      })}
      {count > 0 && (
        <div style={{ ...centre(880, 548, sc(count), "rotate(7deg)") }}>
          <Sticker size={40} tone="ink" rotate={0}>
            8 FILES
          </Sticker>
        </div>
      )}
      {t > c.files + 0.8 && <DemoTag text="Mockups of the real files" style={{ right: 130, top: 1104 }} />}
      <Burst t={t} at={c.price} x={540} y={400} r={330} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// C. The tracker: day grid and the three counters

const Counter: React.FC<{ t: number; at: number; row: ThirtyEpisode["counters"][number] }> = ({ t, at, row }) => {
  const k = pop(t, at, { damping: 10, stiffness: 200 });
  if (k <= 0) return null;
  const roll = eo(seg(t, at + 0.15, at + 0.95));
  const v = Math.round(lerp(row.from, row.to, roll));
  const up = row.to - row.from;
  return (
    <div style={{ position: "relative", width: 255, height: 196, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 26, boxShadow: shadow.hard(8), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, transform: `scale(${sc(k)}) translateY(${(1 - mix(k)) * 40}px)` }}>
      <div style={{ ...type.display, fontSize: 96, lineHeight: 0.9, color: P.ink }}>{v}</div>
      <div style={{ ...type.label, fontSize: 17, letterSpacing: "0.06em", lineHeight: 1.25, color: P.ink2, textAlign: "center", padding: "0 14px" }}>{row.label}</div>
      {up > 0 && roll >= 1 && (
        <div style={{ position: "absolute", right: -14, top: -20, transform: "rotate(8deg)" }}>
          <Sticker size={30} tone="lime" rotate={0}>
            +{up}
          </Sticker>
        </div>
      )}
    </div>
  );
};

export const TrackerScene: React.FC<S> = ({ t, ep }) => {
  const c = ep.cues;
  if (t < c.tracker - 0.15) return null;
  const o = leave(t, c.lesson ?? c.sample);
  if (o >= 1) return null;
  const head = pop(t, c.tracker + 0.05, { damping: 9, stiffness: 220 });
  const bar = eo(seg(t, c.dayFill, c.dayFill + 0.05 * ep.day + 0.3));
  const note = pop(t, c.note, { damping: 13 });
  const cell = 66;
  const gap = 9;
  const gx = 540 - (6 * cell + 5 * gap) / 2;
  const gy = 510;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {head > 0 && (
        <div style={{ ...centre(540, 385, sc(head), `rotate(${(1 - mix(head)) * -10 - 2}deg)`) }}>
          <Sticker size={74} tone="ink" rotate={0}>
            DAY {pad(ep.day)} / {ep.totalDays}
          </Sticker>
        </div>
      )}
      <div style={{ position: "absolute", left: gx, top: 466, width: 6 * cell + 5 * gap, height: 16, borderRadius: 10, border: `3px solid ${P.ink}`, background: P.card, opacity: mix(head) }}>
        <div style={{ width: `${(bar * ep.day * 100) / ep.totalDays}%`, height: "100%", borderRadius: 8, background: P.lime }} />
      </div>
      {Array.from({ length: ep.totalDays }, (_, i) => {
        const d = i + 1;
        const k = pop(t, c.tracker + 0.15 + i * 0.012, { damping: 14, stiffness: 220 });
        if (k <= 0) return null;
        const filled = d <= ep.day && t >= c.dayFill + i * 0.05;
        const today = d === ep.day && filled;
        const x = gx + (i % 6) * (cell + gap);
        const y = gy + Math.floor(i / 6) * (cell + gap);
        const ring = today ? 0.5 + 0.5 * Math.sin((t - c.dayFill) * 6) : 0;
        return (
          <div
            key={d}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: cell,
              height: cell,
              borderRadius: 14,
              ...type.display,
              fontSize: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: today ? P.ink : filled ? P.lime : P.paper,
              color: today ? P.lime : filled ? P.ink : P.lineStrong,
              border: filled ? `4px solid ${P.ink}` : `3px dashed ${P.lineStrong}`,
              boxShadow: today ? `0 0 0 ${6 + ring * 8}px rgba(200,241,105,${0.7 - ring * 0.4})` : filled ? shadow.hard(4) : "none",
              transform: `scale(${mix(k) * (today ? 1.08 : 1)})`,
            }}
          >
            {d}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, width: 1080, top: 905, display: "flex", justifyContent: "center", gap: 20 }}>
        {ep.counters.map((row, i) => (
          <div key={row.label} style={{ width: 255, height: 196 }}>
            <Counter t={t} at={c.counters[i] ?? c.tracker + 2 + i} row={row} />
          </div>
        ))}
      </div>
      {note > 0 && (
        <div style={{ ...centre(540, 1132, mix(note)), ...type.label, fontSize: 21, letterSpacing: "0.05em", color: P.ink2, background: P.paper2, border: `2px solid ${P.line}`, borderRadius: 10, padding: "5px 14px", whiteSpace: "nowrap" }}>
          {ep.note}
        </div>
      )}
    </div>
  );
};

// =================================================================================================================
// D. Optional lesson of the week

export const LessonScene: React.FC<S> = ({ t, ep }) => {
  const c = ep.cues;
  if (c.lesson === null || !ep.lesson || t < c.lesson - 0.15) return null;
  const o = leave(t, c.sample);
  if (o >= 1) return null;
  const k = pop(t, c.lesson + 0.05, { damping: 11, stiffness: 180 });
  const tag = pop(t, c.lesson + 0.3, { damping: 9, stiffness: 230 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <div style={{ position: "absolute", left: 110, top: 470, width: 860, minHeight: 420, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 34, boxShadow: shadow.hard(10), padding: "88px 50px 50px", transform: `scale(${sc(k)}) rotate(${(1 - mix(k)) * 6 - 1}deg)`, ...type.display, fontSize: 60, lineHeight: 1.08, color: P.ink }}>
        {ep.lesson.text}
      </div>
      {tag > 0 && (
        <div style={{ ...centre(330, 470, sc(tag), "rotate(-5deg)") }}>
          <Sticker size={50} tone="lime" rotate={0}>
            {ep.lesson.title}
          </Sticker>
        </div>
      )}
    </div>
  );
};

// =================================================================================================================
// E. Free Chapter 3 sample: the real sample pages, then the comment keyword

const PAGES = ["thirty/sample-page-1.webp", "thirty/sample-page-2.webp", "thirty/sample-page-3.webp"];

export const SampleScene: React.FC<S> = ({ t, ep }) => {
  const c = ep.cues;
  if (t < c.sample - 0.15) return null;
  const o = leave(t, c.outro);
  if (o >= 1) return null;
  const up = eo(seg(t, c.comment - 0.2, c.comment + 0.3));
  const dm = pop(t, c.dm, { damping: 10, stiffness: 210 });
  const real = pop(t, c.sample + 0.9, { damping: 12 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <Headline
        t={t}
        top={330}
        inAt={c.sample}
        outAt={c.outro}
        lines={[
          { size: 96, segs: [{ text: "Free", at: c.sample + 0.1 }, { text: "Chapter 3", at: c.sample + 0.3, tone: "lime" }] },
          { size: 46, segs: [{ text: "No sign-up. Read it before you buy.", at: c.sample + 0.6, tone: "olive" }] },
        ]}
      />
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${-up * 40}px) scale(${1 - up * 0.26})`, transformOrigin: "540px 800px" }}>
        {[0, 2, 1].map((i) => {
          const k = pop(t, c.sample + 0.15 + i * 0.15, { damping: 12, stiffness: 170 });
          if (k <= 0) return null;
          const x = [320, 540, 760][i];
          const r = [-9, 0, 9][i];
          return (
            <div key={i} style={{ ...centre(x, lerp(1300, 800, eo(mix(k))), 1, `rotate(${r * mix(k)}deg)`), width: 290, height: 410, background: P.card, border: `4px solid ${P.ink}`, borderRadius: 10, boxShadow: shadow.hard(7), overflow: "hidden" }}>
              <Img src={staticFile(PAGES[i])} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          );
        })}
        {real > 0 && up < 1 && (
          <div style={{ ...centre(540, 1048, mix(real) * (1 - up)), ...type.label, fontSize: 20, color: P.ink2, background: P.card, border: `2px solid ${P.line}`, borderRadius: 10, padding: "5px 12px", whiteSpace: "nowrap" }}>
            Real pages from the free PDF
          </div>
        )}
      </div>
      <CommentCard t={t} at={c.comment} keyword={ep.keyword} typeAt={c.keyword - 0.05} typeTo={c.keyword + 0.4} sendAt={c.keyword + 0.55} top={940} />
      {dm > 0 && (
        <div style={{ ...centre(540, 1112, sc(dm), "rotate(-2deg)"), ...type.display, fontSize: 38, color: P.ink, background: P.card, border: `4px solid ${P.ink}`, borderRadius: 999, padding: "10px 28px", boxShadow: shadow.hard(6), whiteSpace: "nowrap" }}>
          {ep.dmLine}
        </div>
      )}
      <Burst t={t} at={c.keyword + 0.45} x={540} y={1002} r={380} color={P.lime} />
      <Sparks t={t} at={c.keyword + 0.55} x={880} y={1002} />
    </div>
  );
};

// =================================================================================================================
// F. Branded outro (same end card as every Internet Toolbox reel)

export const EndCard: React.FC<S> = ({ t, ep }) => {
  const at = ep.cues.outro;
  const mark = pop(t, at + 0.05, { damping: 10, stiffness: 190 });
  const handle = pop(t, at + 0.2, { damping: 11, stiffness: 190 });
  if (mark <= 0) return null;
  return (
    <>
      <div style={{ ...centre(540, 560, sc(mark), `rotate(${(1 - mix(mark)) * 20}deg)`) }}>
        <BrandMark size={170} />
      </div>
      {handle > 0 && (
        <div style={{ ...centre(540, 735, mix(handle)), ...type.display, fontSize: 60, color: P.ink, whiteSpace: "nowrap" }}>
          FOLLOW <span style={{ background: P.lime, borderRadius: 12, padding: "0 12px" }}>@INTERNETOOLBOX</span>
        </div>
      )}
      {handle > 0 && <div style={{ ...centre(540, 815, mix(handle)), ...type.label, fontSize: 26, color: P.ink3, whiteSpace: "nowrap" }}>30 days · one digital product · real numbers</div>}
      <FollowButton t={t} at={at + 0.3} tapAt={at + 0.9} top={870} invite />
      {t > at + 0.9 && (
        <div style={{ ...centre(800, 920, mix(pop(t, at + 1.0, { damping: 8 })), `rotate(${12 + Math.sin(t * 5) * 6}deg)`) }}>
          <Heart size={56} />
        </div>
      )}
    </>
  );
};
