import React from "react";
import { Img, staticFile } from "remotion";
import { palette as P, shadow, type } from "../brand/tokens";
import { BookCover } from "../thirty/Scenes";
import { eo, lerp, seg } from "../mdh/kit";

/**
 * Pieces for the ebook launch reel. Everything shown about the kit is real: page images are rendered from the
 * customer bundle PDFs (public/launch/pages), and the drawn workbook and outline previews use the files' own tab
 * names, column headers and section headings. The 3D box is a marketing mockup of a digital download.
 */

export const mix = (k: number) => Math.min(1, k);
export const sc = (k: number) => mix(k) * (k > 1 ? 1 + (k - 1) * 0.3 : 1);
export const shakeAt = (t: number, at: number, amp = 14, len = 0.4) => (t > at && t < at + len ? Math.sin(t * 95) * amp * (1 - seg(t, at, at + len)) : 0);

/** Keyframed placement: [at, x, y, scale, opacity]. Eases from the previous key over `dur` seconds. */
export type Key = [number, number, number, number, number];
export const track = (t: number, keys: Key[], dur = 0.45) => {
  let i = 0;
  for (let n = 0; n < keys.length; n++) if (keys[n][0] <= t) i = n;
  const b = keys[i];
  const a = i > 0 ? keys[i - 1] : b;
  const k = eo(seg(t, b[0], b[0] + dur));
  return { x: lerp(a[1], b[1], k), y: lerp(a[2], b[2], k), s: lerp(a[3], b[3], k), o: lerp(a[4], b[4], k) };
};

export type Fmt = "PDF" | "DOCX" | "XLSX";
const FMT: Record<Fmt, { bg: string; fg: string }> = { PDF: { bg: P.ink, fg: P.lime }, DOCX: { bg: P.card, fg: P.ink }, XLSX: { bg: P.lime, fg: P.ink } };

export const FmtBadge: React.FC<{ fmt: Fmt; size?: number; style?: React.CSSProperties }> = ({ fmt, size = 18, style }) => (
  <div style={{ ...type.label, fontSize: size, letterSpacing: "0.06em", background: FMT[fmt].bg, color: FMT[fmt].fg, border: `${Math.max(2, size * 0.16)}px solid ${P.ink}`, borderRadius: size * 0.45, padding: `${size * 0.1}px ${size * 0.45}px`, whiteSpace: "nowrap", ...style }}>
    {fmt}
  </div>
);

export const Chip: React.FC<{ text: React.ReactNode; tone?: "lime" | "ink" | "card"; size?: number; style?: React.CSSProperties }> = ({ text, tone = "card", size = 30, style }) => {
  const bg = tone === "lime" ? P.lime : tone === "ink" ? P.ink : P.card;
  const fg = tone === "ink" ? "#fff" : P.ink;
  return <div style={{ ...type.display, fontSize: size, color: fg, background: bg, border: `4px solid ${P.ink}`, borderRadius: 99, padding: `${size * 0.22}px ${size * 0.7}px`, whiteSpace: "nowrap", boxShadow: tone === "ink" ? `5px 5px 0 ${P.lime}` : shadow.hard(5), ...style }}>{text}</div>;
};

// =================================================================================================================
// The product box: the website's cover on the front, a dark spine and top, a moving sheen.

export const ProductBox: React.FC<{ w: number; t: number; yaw?: number; pitch?: number; glow?: number }> = ({ w, t, yaw = -24, pitch = -8, glow = 0 }) => {
  const h = w * 1.36;
  const d = w * 0.3;
  const u = w / 300;
  const sweep = ((t * 0.45) % 1.8) - 0.4;
  const face: React.CSSProperties = { position: "absolute", backfaceVisibility: "hidden", border: `${3 * u}px solid ${P.ink}`, boxSizing: "border-box" };
  return (
    <div style={{ position: "relative", width: w, height: h, perspective: 1700 * u }}>
      {glow > 0 && <div style={{ position: "absolute", left: -w * 0.5, top: -h * 0.3, width: w * 2, height: h * 1.6, borderRadius: "50%", background: `radial-gradient(circle, rgba(200,241,105,${0.55 * glow}) 0%, rgba(200,241,105,0) 62%)` }} />}
      <div style={{ position: "absolute", left: -w * 0.1, right: -w * 0.25, bottom: -h * 0.09, height: h * 0.14, borderRadius: "50%", background: "rgba(23,23,23,0.22)", filter: `blur(${10 * u}px)` }} />
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateX(${pitch}deg) rotateY(${yaw}deg)` }}>
        {/* top */}
        <div style={{ ...face, left: 0, top: (h - d) / 2, width: w, height: d, background: "linear-gradient(90deg, #2b2b2b, #3a3a3a)", transform: `rotateX(90deg) translateZ(${h / 2}px)` }}>
          <div style={{ position: "absolute", left: 18 * u, right: 18 * u, top: d / 2 - 4 * u, height: 8 * u, borderRadius: 8 * u, background: P.lime, opacity: 0.9 }} />
        </div>
        {/* right side: the spine */}
        <div style={{ ...face, left: (w - d) / 2, top: 0, width: d, height: h, background: "linear-gradient(90deg, #0c0c0c, #1f1f1f)", transform: `rotateY(90deg) translateZ(${w / 2}px)`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <div style={{ transform: "rotate(90deg)", whiteSpace: "nowrap", ...type.label, fontSize: 15 * u, color: P.lime }}>Ebook Launch Kit · Internet Toolbox</div>
        </div>
        {/* left side */}
        <div style={{ ...face, left: (w - d) / 2, top: 0, width: d, height: h, background: "#111", transform: `rotateY(-90deg) translateZ(${w / 2}px)` }} />
        {/* front: the cover */}
        <div style={{ position: "absolute", inset: 0, transform: `translateZ(${d / 2}px)`, backfaceVisibility: "hidden", overflow: "hidden", borderRadius: 4 * u, border: `${3 * u}px solid ${P.ink}`, boxSizing: "border-box" }}>
          <BookCover w={w - 6 * u} style={{ boxShadow: "none", borderRadius: 0, width: "100%", height: "100%" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${sweep * 100}%`, width: "28%", background: "linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0) 100%)" }} />
        </div>
      </div>
    </div>
  );
};

// =================================================================================================================
// Pages

/** A real page image (820 x 1160 renders of the bundle PDFs). */
export const RealPage: React.FC<{ src: string; w: number; style?: React.CSSProperties }> = ({ src, w, style }) => (
  <div style={{ position: "relative", width: w, height: (w * 1160) / 820, background: P.card, border: `4px solid ${P.ink}`, borderRadius: 8, overflow: "hidden", boxShadow: shadow.hard(6), ...style }}>
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
  </div>
);

const Paper: React.FC<{ w: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ w, children, style }) => (
  <div style={{ position: "relative", width: w, height: (w * 1160) / 820, background: P.card, border: `4px solid ${P.ink}`, borderRadius: 8, overflow: "hidden", boxShadow: shadow.hard(6), boxSizing: "border-box", ...style }}>{children}</div>
);

/** Companion Workbook (XLSX): the real tab names and the Idea Scorecard headers, rows left blank as in the file. */
export const XLSX_TABS = ["Start Here", "Idea Scorecard", "Competitor Research", "Validation Decision", "7-Day Content Plan", "Launch Metrics Tracker"];
const XLSX_COLS = ["Product idea", "Problem clarity 1–5", "Audience access 1–5", "Total / 30"];
export const XlsxPage: React.FC<{ w: number; style?: React.CSSProperties }> = ({ w, style }) => {
  const u = w / 300;
  const colW = [0.34, 0.24, 0.24, 0.18];
  return (
    <Paper w={w} style={{ background: "#fbfbf8", ...style }}>
      <div style={{ height: 30 * u, background: "#1d6b3f", display: "flex", alignItems: "center", padding: `0 ${10 * u}px`, ...type.label, letterSpacing: "0.04em", fontSize: 11 * u, color: "#fff" }}>Companion Workbook.xlsx</div>
      <div style={{ ...type.display, fontSize: 15 * u, color: P.ink, padding: `${8 * u}px ${10 * u}px ${6 * u}px` }}>Idea Scorecard</div>
      <div style={{ margin: `0 ${8 * u}px`, border: `${1.5 * u}px solid ${P.lineStrong}` }}>
        <div style={{ display: "flex", background: P.ink }}>
          {XLSX_COLS.map((c, i) => (
            <div key={c} style={{ width: `${colW[i] * 100}%`, ...type.body, fontWeight: 700, fontSize: 9.5 * u, lineHeight: 1.15, color: P.lime, padding: `${4 * u}px ${4 * u}px`, borderRight: i < 3 ? `${1 * u}px solid #444` : "none" }}>
              {c}
            </div>
          ))}
        </div>
        {Array.from({ length: 9 }, (_, r) => (
          <div key={r} style={{ display: "flex", height: 17 * u, borderTop: `${1 * u}px solid ${P.line}`, background: r % 2 ? "#f4f6ef" : "#fff" }}>
            {colW.map((cw, i) => (
              <div key={i} style={{ width: `${cw * 100}%`, borderRight: i < 3 ? `${1 * u}px solid ${P.line}` : "none", background: i === 3 ? P.limeWash : undefined }} />
            ))}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", flexWrap: "wrap", gap: 3 * u, padding: `${5 * u}px ${6 * u}px`, background: "#ecebe6", borderTop: `${1.5 * u}px solid ${P.lineStrong}` }}>
        {XLSX_TABS.map((tab) => (
          <div key={tab} style={{ ...type.body, fontWeight: 600, fontSize: 9 * u, color: P.ink, background: tab === "Idea Scorecard" ? P.lime : "#fff", border: `${1 * u}px solid ${P.lineStrong}`, borderRadius: 3 * u, padding: `${1.5 * u}px ${4 * u}px`, whiteSpace: "nowrap" }}>
            {tab}
          </div>
        ))}
      </div>
    </Paper>
  );
};

/** Ebook Outline Worksheet (DOCX): the real section headings. */
export const OUTLINE_SECTIONS = ["A. My reader", "B. My outcome promise", "C. Brain dump and sort", "D. Left out for a later edition", "E. My outline (6 to 10 sections)", "F. Limits", "G. Final check"];
export const OutlinePage: React.FC<{ w: number; style?: React.CSSProperties }> = ({ w, style }) => {
  const u = w / 300;
  return (
    <Paper w={w} style={{ padding: `${16 * u}px ${16 * u}px`, ...style }}>
      <div style={{ ...type.display, fontSize: 17 * u, lineHeight: 1.1, color: P.ink }}>Ebook Outline Worksheet</div>
      <div style={{ ...type.body, fontSize: 10 * u, color: P.ink3, marginTop: 3 * u }}>Blank copy</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 * u, marginTop: 10 * u }}>
        {OUTLINE_SECTIONS.map((s, i) => (
          <div key={s}>
            <div style={{ ...type.body, fontWeight: 700, fontSize: 11 * u, color: P.olive }}>{s}</div>
            {i < 6 ? (
              <div style={{ height: 1.5 * u, background: P.lineStrong, marginTop: 9 * u }} />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 * u, marginTop: 4 * u }}>
                {[0, 1].map((n) => (
                  <div key={n} style={{ display: "flex", alignItems: "center", gap: 5 * u }}>
                    <div style={{ width: 9 * u, height: 9 * u, border: `${1.5 * u}px solid ${P.ink}`, borderRadius: 2 * u }} />
                    <div style={{ flex: 1, height: 1.5 * u, background: P.line }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Paper>
  );
};

/** Template 2 · Landing-page wireframe (from the Launch Templates file), blocks dropping in one by one. */
export const WIRE_SECTIONS = ["Hero", "Problem", "How it works", "Included items", "Preview", "Price", "Proof", "FAQ", "Checkout", "Trust information"];
export const WireframePage: React.FC<{ w: number; t: number; at: number; step?: number }> = ({ w, t, at, step = 0.08 }) => {
  const u = w / 300;
  return (
    <Paper w={w} style={{ padding: `${12 * u}px ${14 * u}px` }}>
      <div style={{ ...type.label, letterSpacing: "0.04em", fontSize: 9.5 * u, color: P.olive }}>Template 2 · Landing-page wireframe</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 * u, marginTop: 8 * u }}>
        {WIRE_SECTIONS.map((s, i) => {
          const k = eo(seg(t, at + i * step, at + i * step + 0.22));
          return (
            <div
              key={s}
              style={{
                height: (i === 0 ? 58 : 27) * u,
                border: `${2 * u}px dashed ${i === 0 ? P.olive : P.lineStrong}`,
                borderRadius: 5 * u,
                background: i === 0 ? P.limeWash : i === 5 || i === 8 ? P.limeSoft : P.paper2,
                display: "flex",
                alignItems: "center",
                justifyContent: i === 0 ? "center" : "flex-start",
                padding: `0 ${8 * u}px`,
                ...type.label,
                letterSpacing: "0.05em",
                fontSize: (i === 0 ? 14 : 10.5) * u,
                color: P.ink,
                opacity: k,
                transform: `translateY(${(1 - k) * -40 * u}px)`,
              }}
            >
              {s}
            </div>
          );
        })}
      </div>
    </Paper>
  );
};

/** Small file icon: page corner fold and format badge. */
export const FileIcon: React.FC<{ fmt: Fmt; name: string; w?: number }> = ({ fmt, name, w = 84 }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: w }}>
    <div style={{ position: "relative", width: w * 0.78, height: w, background: P.card, border: `4px solid ${P.ink}`, borderRadius: 8, boxShadow: shadow.hard(4) }}>
      <div style={{ position: "absolute", right: -3, top: -3, width: w * 0.24, height: w * 0.24, background: P.paper2, borderLeft: `3px solid ${P.ink}`, borderBottom: `3px solid ${P.ink}`, borderBottomLeftRadius: 6 }} />
      <div style={{ position: "absolute", left: w * 0.1, right: w * 0.12, top: w * 0.32, display: "flex", flexDirection: "column", gap: w * 0.07 }}>
        {[1, 0.8, 0.9].map((f, i) => (
          <div key={i} style={{ width: `${f * 100}%`, height: w * 0.05, borderRadius: 4, background: P.line }} />
        ))}
      </div>
      <FmtBadge fmt={fmt} size={w * 0.16} style={{ position: "absolute", left: "50%", bottom: w * 0.08, transform: "translateX(-50%)" }} />
    </div>
    <div style={{ ...type.label, letterSpacing: "0.02em", fontSize: w * 0.15, color: P.ink2, whiteSpace: "nowrap" }}>{name}</div>
  </div>
);
