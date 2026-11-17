import React from "react";
import { LAYOUT } from "../brand/tokens";
import { Headline } from "../brand/Headline";
import { toFrame, type Rect, type Shot } from "../brand/ProofPanel";
import { BrowserProof, camPath, viewOf, type CamKey } from "../brand/BrowserProof";
import { Cursor, Highlight, RealPill } from "../brand/ProofMarks";
import { usePop } from "../components/motion";

/** Voice times for the homepage reveal (seconds). */
export type HomeCues = { enter: number; meri: number; internet: number; count: number; ninety: number; free: number; jaise: number; gst: number; click: number; leave: number };
/** The real homepage screenshot and the boxes of the parts we point at (page pixels, from scripts/capture-ep02.mjs). */
export type HomeCapture = { shot: Shot; logo: Rect; count: Rect; gstCard: Rect };

const PANEL = LAYOUT.panel;

/**
 * The real www.internetoolbox.com homepage in the browser frame: the name, the "92 free tools" line,
 * a scroll through the tool lists, then a click on GST Calculator (the next scene opens it).
 */
export const HomeScene: React.FC<{ t: number; cue: HomeCues; home: HomeCapture }> = ({ t, cue, home }) => {
  const enter = usePop(t, cue.enter, { damping: 14, stiffness: 120, mass: 0.9 });
  if (t < cue.enter - 0.05 || t >= cue.leave) return null;
  const view = viewOf(PANEL);
  const cam: CamKey[] = [
    [cue.enter, { cx: 640, cy: 350, z: 0.68 }],
    [cue.internet - 0.2, { cx: 330, cy: 175, z: 1.45 }, 0.6],
    [cue.count - 0.1, { cx: 360, cy: 560, z: 1.3 }, 0.6],
    [cue.free - 0.05, { cx: 640, cy: 1130, z: 0.68 }, 0.75],
    [cue.free + 0.75, { cx: 640, cy: 1500, z: 0.68 }, 1.2],
    [cue.jaise, { cx: 340, cy: 1060, z: 1.3 }, 0.6],
  ];
  const c = camPath(cam, t);
  const card = home.gstCard;
  return (
    <>
      <BrowserProof panel={PANEL} host="internetoolbox.com" shot={home.shot} cam={c} enter={enter} out={0}>
        <Highlight t={t} r={home.logo} at={cue.internet} outAt={cue.count - 0.15} z={c.z} />
        <Highlight t={t} r={home.count} at={cue.ninety} outAt={cue.free - 0.05} z={c.z} />
        <Highlight t={t} r={card} at={cue.gst} outAt={cue.leave} z={c.z} />
      </BrowserProof>
      <RealPill t={t} at={cue.enter + 0.45} text="Real website" right={PANEL.x + PANEL.w - 14} top={PANEL.y - 30} />
      <Cursor
        t={t}
        stops={[{ at: cue.click, u: card.x + card.w * 0.4, v: card.y + card.h / 2, click: true }]}
        map={(u, v) => toFrame(view, u, v, c)}
        from={[930, 1160]}
        showAt={cue.gst - 0.25}
        hideAt={cue.leave}
      />
      <Headline
        t={t}
        top={LAYOUT.headerTop}
        inAt={cue.meri}
        outAt={cue.count - 0.15}
        lines={[
          { size: 88, segs: [{ text: "Meri website", at: cue.meri }] },
          { size: 78, segs: [{ text: "internetoolbox.com", at: cue.internet, tone: "lime" }] },
        ]}
      />
      <Headline
        t={t}
        top={LAYOUT.headerTop + 30}
        inAt={cue.count}
        outAt={cue.jaise - 0.1}
        lines={[
          {
            size: 104,
            segs: [
              { text: "90+", at: cue.ninety, tone: "lime" },
              { text: "free tools", at: cue.free },
            ],
          },
        ]}
      />
    </>
  );
};
