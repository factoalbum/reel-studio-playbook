import React from "react";
import { LAYOUT } from "../brand/tokens";
import { Headline } from "../brand/Headline";
import { Coin } from "../brand/Bits";
import { toFrame, type Rect } from "../brand/ProofPanel";
import { BrowserProof, camPath, keyAt, viewOf, type CamKey } from "../brand/BrowserProof";
import { Cursor, Highlight, PopSticker, RealPill } from "../brand/ProofMarks";
import { range } from "../components/motion";

/** Voice times for the GST demo (seconds). `keys` are the four key presses of "1000". */
export type GstCues = {
  intro: number;
  gstWord: number;
  calcWord: number;
  show: number;
  amount: number;
  keys: [number, number, number, number];
  rateWord: number;
  hover: number;
  pick: number;
  result: number;
  resultWord: number;
  ready: number;
  out: number;
};
/** Real screenshots of the GST calculator after each key press and click, and the boxes we point at (page pixels). */
export type GstCapture = { shot: { width: number; height: number }; amount: Rect; rate18: Rect; total: Rect; states: { name: string; file: string }[] };

const PANEL = LAYOUT.panel;

/**
 * The real GST calculator: the amount is typed (1, 10, 100, 1000), 18% is clicked, and the real total shows ₹1,180.00.
 * Every frame of the page is a screenshot of www.internetoolbox.com in that exact state.
 */
export const GstScene: React.FC<{ t: number; cue: GstCues; gst: GstCapture }> = ({ t, cue, gst }) => {
  if (t < cue.intro || t > cue.out + 0.3) return null;
  const view = viewOf(PANEL);
  const file = (name: string) => gst.states.find((s) => s.name === name)?.file ?? gst.states[0].file;
  const shotFile = keyAt(
    [
      [0, file("empty")],
      [cue.keys[0], file("type1")],
      [cue.keys[1], file("type2")],
      [cue.keys[2], file("type3")],
      [cue.keys[3], file("type4")],
      [cue.hover, file("hover18")],
      [cue.pick, file("rate18")],
    ],
    t,
  );
  const cam: CamKey[] = [
    [cue.show, { cx: 640, cy: 350, z: 0.68 }],
    [cue.amount - 0.5, { cx: 572, cy: 1120, z: 0.86 }, 0.5],
    [cue.result, { cx: 735, cy: 1250, z: 1.3 }, 0.5],
  ];
  const c = camPath(cam, t);
  const map = (u: number, v: number) => toFrame(view, u, v, c);
  const out = range(t, cue.out, cue.out + 0.25);
  const centre = (r: Rect): [number, number] => [r.x + r.w / 2, r.y + r.h / 2];
  const [ax, ay] = centre(gst.amount);
  const [rx, ry] = centre(gst.rate18);
  const [tx, ty] = map(gst.total.x + gst.total.w / 2, gst.total.y);
  return (
    <>
      {t >= cue.show && (
        <>
          <BrowserProof panel={PANEL} host="internetoolbox.com" path="/tools/gst-calculator/" shot={{ file: shotFile, ...gst.shot }} cam={c} enter={1} out={out}>
            <Highlight t={t} r={gst.amount} at={cue.amount} outAt={cue.hover - 0.1} z={c.z} />
            <Highlight t={t} r={gst.rate18} at={cue.pick} outAt={cue.result} z={c.z} />
            <Highlight t={t} r={gst.total} at={cue.resultWord} outAt={99} z={c.z} />
          </BrowserProof>
          <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
            <RealPill t={t} at={cue.show - 2} text="Real website" right={PANEL.x + PANEL.w - 14} top={PANEL.y - 30} outAt={cue.ready - 0.15} />
            <Cursor
              t={t}
              stops={[
                { at: cue.amount, u: ax - 60, v: ay, click: true },
                { at: cue.hover, u: rx, v: ry },
                { at: cue.pick, u: rx, v: ry, click: true },
              ]}
              map={map}
              from={[930, 1180]}
              showAt={cue.amount - 0.45}
              hideAt={cue.pick + 0.4}
            />
            <PopSticker t={t} at={cue.ready} x={tx} y={ty - 96} size={58} rotate={-5}>
              ₹1,180 ✓
            </PopSticker>
            {[0, 1, 2].map((i) => (
              <RisingCoin key={i} t={t} at={cue.ready + 0.05 + i * 0.08} x={tx - 250 - i * 95} y={ty + 60} />
            ))}
          </div>
        </>
      )}
      <Headline
        t={t}
        top={LAYOUT.headerTop + 30}
        inAt={cue.intro}
        outAt={cue.amount - 0.15}
        lines={[
          {
            size: 104,
            segs: [
              { text: "GST", at: cue.gstWord, tone: "marker" },
              { text: "calculator", at: cue.calcWord },
            ],
          },
        ]}
      />
      <Headline
        t={t}
        top={LAYOUT.headerTop - 10}
        inAt={cue.amount + 0.05}
        outAt={cue.out}
        lines={[
          {
            size: 76,
            segs: [
              { text: "₹1,000", at: cue.amount + 0.05 },
              { text: "+ 18%", at: cue.rateWord, tone: "lime" },
            ],
          },
          { size: 84, segs: [{ text: "= ₹1,180", at: cue.ready, tone: "inkTag" }] },
        ]}
      />
    </>
  );
};

const RisingCoin: React.FC<{ t: number; at: number; x: number; y: number }> = ({ t, at, x, y }) => {
  const k = range(t, at, at + 1.0);
  if (t < at || k >= 1) return null;
  return (
    <div style={{ position: "absolute", left: x - 32, top: y - 40 - k * 170, opacity: k < 0.7 ? 1 : 1 - (k - 0.7) / 0.3 }}>
      <Coin size={64} spin={Math.cos((t - at) * 9)} />
    </div>
  );
};
