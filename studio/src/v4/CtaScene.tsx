import React from "react";
import { LAYOUT } from "../brand/tokens";
import { Headline } from "../brand/Headline";
import { Burst } from "../brand/Bits";
import { CommentCard, FollowButton } from "../brand/Cta";

/** CTA (from 13.95 s): "Comment LEARN aur follow karo. Part 2 mein banake dikhaunga!" */
export const CtaScene: React.FC<{ t: number }> = ({ t }) => {
  if (t < 13.95) return null;
  return (
    <>
      <Headline
        t={t}
        top={LAYOUT.headerTop}
        inAt={14.43}
        outAt={99}
        lines={[
          { size: 92, segs: [{ text: "Comment", at: 14.43 }, { text: "LEARN", at: 14.77, tone: "lime" }] },
          { size: 84, segs: [{ text: "Follow for", at: 15.49 }, { text: "Part 2", at: 16.22, tone: "inkTag" }] },
        ]}
      />
      <CommentCard t={t} at={14.02} keyword="LEARN" typeAt={14.77} typeTo={15.1} sendAt={15.18} top={640} />
      <FollowButton t={t} at={15.4} tapAt={15.68} top={880} />
      <Burst t={t} at={16.22} x={800} y={470} />
    </>
  );
};
