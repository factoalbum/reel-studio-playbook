import { loadFont } from "@remotion/google-fonts/IBMPlexSans";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";

/**
 * Internet Toolbox reel identity. Every value here comes from the website itself
 * (internet-toolbox/app/globals.css and its illustrations), so the reels and the site look like one brand.
 * Change a colour here and every reel follows.
 */

// Same type families as the website: IBM Plex Sans for words, IBM Plex Mono for small labels.
export const { fontFamily: sans } = loadFont("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });
export const { fontFamily: mono } = loadMono("normal", { weights: ["500", "600"], subsets: ["latin"] });

export const palette = {
  // Website design tokens.
  paper: "#FAF9F6",
  paper2: "#F3F1EB",
  card: "#FFFFFF",
  ink: "#171717",
  ink2: "#57564F",
  ink3: "#6B6A63",
  line: "#E4E1D9",
  lineStrong: "#C9C5BB",
  lime: "#C8F169",
  limeDeep: "#B9E35A",
  olive: "#3F5F12",
  // Website illustration colours (hero glow, rings, confetti).
  limeSoft: "#EAF6CF",
  limeWash: "#F5FAE8",
  oliveSoft: "#58731D",
  teal: "#0F5A4F",
  gold: "#E8B84A",
  pink: "#E58FA1",
};

export const radius = { sm: 12, md: 18, lg: 26, pill: 999 };

/** Stickers use the website's hard ink shadow; large cards use its soft shadow. */
export const shadow = {
  hard: (n = 6) => `${n}px ${n}px 0 ${palette.ink}`,
  soft: "0 28px 56px rgba(23,23,23,0.16), 0 4px 10px rgba(23,23,23,0.08)",
};

export const type = {
  /** Headlines and captions: Plex Sans Bold, tight tracking, sentence case. */
  display: { fontFamily: sans, fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.02 },
  /** Small labels: Plex Mono, uppercase, wide tracking (the website's eyebrow style). */
  label: { fontFamily: mono, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const },
  body: { fontFamily: sans, fontWeight: 500 },
};

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
// Instagram covers roughly the top 250px and bottom 340px, plus the right 130px.
export const SAFE = { top: 250, bottom: 1580, left: 80, right: 950 };

/** Layout rhythm shared by every reel: where the brand, headline, proof panel, captions and avatar sit. */
export const LAYOUT = {
  brandTop: 258,
  headerTop: 326,
  panel: { x: 80, y: 540, w: 870, h: 545 },
  captionTop: 1170,
  // Big and centred for the hook and a twist, bottom-left while showing things. Faces stay clear of the captions.
  avatar: {
    hero: { x: 540, y: 870, s: 1.25 },
    twist: { x: 540, y: 900, s: 1.15 },
    corner: { x: 250, y: 1440, s: 0.7 },
  },
};
