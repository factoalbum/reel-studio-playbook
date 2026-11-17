import React from "react";
import { LAYOUT } from "../brand/tokens";
import { Headline } from "../brand/Headline";
import { Burst, LabelPill } from "../brand/Bits";
import { CommentCard, FollowButton } from "../brand/Cta";
import { BrowserProof } from "../brand/BrowserProof";
import { RealPill } from "../brand/ProofMarks";
import type { Shot } from "../brand/ProofPanel";
import { range, usePop } from "../components/motion";

/** Voice times for the call to action (seconds). */
export type CtaCues = {
  enter: number;
  domain: number;
  link: number;
  leave: number;
  poori: number;
  banana: number;
  card: number;
  comment: number;
  keyword: number;
  typeTo: number;
  send: number;
  followIn: number;
  follow: number;
  tap: number;
  part: number;
};

const PANEL = LAYOUT.panel;

/**
 * The V4 ending system: the real homepage with its address and "link in bio", then the comment keyword is typed and sent,
 * Follow is tapped, and the next part is promised. `domain` must be the site's real address.
 */
export const CtaScene: React.FC<{ t: number; cue: CtaCues; home: Shot; domain: string; keyword: string; next: string }> = ({ t, cue, home, domain, keyword, next }) => {
  const enter = usePop(t, cue.enter, { damping: 14, stiffness: 120, mass: 0.9 });
  const pill = usePop(t, cue.leave, { damping: 11, stiffness: 190, mass: 0.6 });
  if (t < cue.enter - 0.05) return null;
  const out = range(t, cue.leave, cue.leave + 0.25);
  return (
    <>
      {out < 1 && (
        <>
          <BrowserProof panel={PANEL} host={domain} shot={home} cam={{ cx: 640, cy: 330 + 40 * range(t, cue.enter, cue.leave), z: 0.68 }} enter={enter} out={out} />
          <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
            <RealPill t={t} at={cue.enter + 0.3} text="Real website" right={PANEL.x + PANEL.w - 14} top={PANEL.y - 30} />
          </div>
        </>
      )}
      <Headline
        t={t}
        top={LAYOUT.headerTop - 10}
        inAt={cue.enter}
        outAt={cue.leave}
        lines={[
          { size: 66, segs: [{ text: domain.toUpperCase(), at: cue.domain, tone: "lime" }] },
          { size: 72, segs: [{ text: "Link in bio", at: cue.link, tone: "inkTag" }] },
        ]}
      />
      <Headline
        t={t}
        top={LAYOUT.headerTop}
        inAt={cue.poori}
        outAt={cue.comment - 0.1}
        lines={[
          { size: 88, segs: [{ text: "Poori website", at: cue.poori }] },
          { size: 76, segs: [{ text: "banana seekhna hai?", at: cue.banana, tone: "marker" }] },
        ]}
      />
      <Headline
        t={t}
        top={LAYOUT.headerTop}
        inAt={cue.comment}
        outAt={999}
        lines={[
          {
            size: 92,
            segs: [
              { text: "Comment", at: cue.comment },
              { text: keyword, at: cue.keyword, tone: "lime" },
            ],
          },
          {
            size: 80,
            segs: [
              { text: "Follow for", at: cue.follow },
              { text: next, at: cue.part, tone: "inkTag" },
            ],
          },
        ]}
      />
      <CommentCard t={t} at={cue.card} keyword={keyword} typeAt={cue.keyword} typeTo={cue.typeTo} sendAt={cue.send} top={640} />
      <FollowButton t={t} at={cue.followIn} tapAt={cue.tap} top={880} />
      <Burst t={t} at={cue.part} x={800} y={470} />
      {pill > 0 && (
        <div style={{ position: "absolute", left: 0, width: 1030, top: 1035, display: "flex", justifyContent: "center", opacity: Math.min(1, pill * 2) }}>
          <LabelPill text={`${domain} · link in bio`} t={t} size={28} pop={pill} />
        </div>
      )}
    </>
  );
};
