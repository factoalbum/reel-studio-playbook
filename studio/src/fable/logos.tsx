import React from "react";
import { Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/SpaceGrotesk";
import { mono, palette as P } from "../brand/tokens";

/**
 * Official brand marks for the Fable × Higgsfield reel. Every file in public/fable/logos was taken from the
 * brand's own site on 11 Nov 2026 and only recoloured with the brand's own colours, never redrawn:
 * - claude-logo-color*.svg: the Claude lockup from claude.com's header (ClaudeWordmark), spark in Claude's #D97757
 *   (the colour of claude.com/icon.svg). claude-spark.svg = claude.com/icon.svg.
 * - anthropic-wordmark*.svg: the Anthropic wordmark from anthropic.com's header.
 * - higgsfield-glyph.svg: the hf-logo glyph from higgsfield.ai's header; tile #D1FE17 and glyph #1a1a1a match
 *   higgsfield.ai/icon.png and the site CSS; the word "Higgsfield" is set in Space Grotesk, the font the site
 *   uses for its own wordmark (.hfnav-wordmark).
 * MCP has no official logo here: a neutral, labelled connection icon is used instead.
 */
const { fontFamily: grotesk } = loadFont("normal", { weights: ["600", "700"], subsets: ["latin"] });

export const CLAY = "#D97757";
export const HF_LIME = "#D1FE17";
export const HF_INK = "#1a1a1a";

/** Claude lockup (spark + wordmark), aspect 573:125. */
export const ClaudeLogo: React.FC<{ h: number; light?: boolean; style?: React.CSSProperties }> = ({ h, light = false, style }) => (
  <Img src={staticFile(`fable/logos/claude-logo-color${light ? "-light" : ""}.svg`)} style={{ height: h, width: (h * 573) / 125, display: "block", ...style }} />
);

/** Claude spark alone (claude.com/icon.svg). */
export const ClaudeSpark: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <Img src={staticFile("fable/logos/claude-spark.svg")} style={{ width: size, height: size, display: "block", ...style }} />
);

/** Anthropic wordmark, aspect 570:64. */
export const AnthropicLogo: React.FC<{ h: number; light?: boolean; style?: React.CSSProperties }> = ({ h, light = false, style }) => (
  <Img src={staticFile(`fable/logos/anthropic-wordmark${light ? "-light" : ""}.svg`)} style={{ height: h, width: (h * 570) / 64, display: "block", ...style }} />
);

/** Higgsfield app tile: lime rounded square with the official glyph. */
export const HiggsTile: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.25, background: HF_LIME, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto", ...style }}>
    <Img src={staticFile("fable/logos/higgsfield-glyph.svg")} style={{ width: size * 0.8, height: size * 0.8, display: "block" }} />
  </div>
);

/** Higgsfield lockup: tile + wordmark. */
export const HiggsLogo: React.FC<{ h: number; light?: boolean; style?: React.CSSProperties }> = ({ h, light = false, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: h * 0.28, ...style }}>
    <HiggsTile size={h} />
    <div style={{ fontFamily: grotesk, fontWeight: 600, fontSize: h * 0.78, letterSpacing: "-0.03em", lineHeight: 1, color: light ? "#FAFAFA" : HF_INK, whiteSpace: "nowrap" }}>Higgsfield</div>
  </div>
);

/** Neutral MCP connector icon (not an official logo), always labelled "MCP". */
export const McpBadge: React.FC<{ size: number; dark?: boolean; label?: boolean; glow?: number }> = ({ size, dark = false, label = true, glow = 0 }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: size * 0.08 }}>
    <div style={{ width: size, height: size, borderRadius: size * 0.28, background: dark ? P.ink : P.card, border: `${Math.max(3, size * 0.05)}px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: glow > 0 ? `0 0 ${size * 0.6 * glow}px ${P.lime}` : undefined }}>
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 48 48" fill="none" stroke={dark ? P.lime : P.ink} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round">
        {/* two plug halves meeting: a generic "connector" sign */}
        <path d="M6 24h8M34 24h8" />
        <path d="M14 15h6a9 9 0 0 1 0 18h-6z" />
        <path d="M34 15h-6a9 9 0 0 0 0 18h6z" />
        <path d="M14 19.5h-3M14 28.5h-3" />
      </svg>
    </div>
    {label && <div style={{ fontFamily: mono, fontWeight: 700, fontSize: size * 0.3, letterSpacing: "0.1em", color: dark ? "#F4F2EA" : P.ink }}>MCP</div>}
  </div>
);
