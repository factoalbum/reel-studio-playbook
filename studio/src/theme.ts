import { loadFont } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

export const { fontFamily } = loadFont("normal", { weights: ["600", "800", "900"], subsets: ["latin"] });
export const { fontFamily: monoFamily } = loadMono("normal", { weights: ["500", "700"], subsets: ["latin"] });

export const colors = {
  navy: "#0A1128",
  navy2: "#101C3F",
  navy3: "#16275A",
  cyan: "#22D3EE",
  yellow: "#FACC15",
  white: "#F8FAFC",
  muted: "#94A3B8",
  danger: "#FB7185",
};

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
// Instagram covers roughly the top 250px and bottom 340px, plus the right 130px.
export const SAFE = { top: 250, bottom: 1580, left: 80, right: 950 };
