import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Avatar, Backdrop, BrandBug, Disclaimer, palette, ProgressBar, ReelAudio, Subtitles } from "./brand";
import { AskScene, Outro, ReceiptTrip, RecapScene, RewardScene, SaveScene, ShareScene } from "./google/Ending";
import { Hook, Night, Rewind, Shop, TwistTitle } from "./google/Story";
import { google as ep } from "./episodes/google";

/**
 * Internet Stories ep 2: "The man who bought google.com for $12", in the permanent Internet Toolbox look.
 * Remotion is the master timeline; every scene reads its times from src/episodes/google.ts.
 * `cover` hides the subtitles and progress bar, for the Instagram cover.
 */
export const ReelGoogle: React.FC<{ cover?: boolean }> = ({ cover = false }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const low = (c: { start: number }) => c.start >= ep.captionLowFrom && c.start < ep.captionLowTo;
  return (
    <AbsoluteFill style={{ backgroundColor: palette.paper, overflow: "hidden" }}>
      <Backdrop />
      <Hook t={t} />
      <Rewind t={t} />
      <Night t={t} />
      <Shop t={t} />
      <TwistTitle t={t} />
      <RewardScene t={t} />
      <RecapScene t={t} />
      <AskScene t={t} />
      <ShareScene t={t} />
      <SaveScene t={t} />
      <Outro t={t} />
      <Avatar keys={ep.avatarKeys} places={ep.avatarPlaces} env={ep.env} blinks={ep.blinks} />
      <ReceiptTrip t={t} />
      <BrandBug />
      {t < ep.disclaimerTo && <Disclaimer lines={ep.disclaimer} />}
      {!cover && <Subtitles captions={ep.captions.filter((c) => !low(c))} />}
      {!cover && <Subtitles captions={ep.captions.filter(low)} top={ep.captionLowTop} />}
      {!cover && <ProgressBar />}
      <ReelAudio voice={ep.voiceover} music={ep.music} env={ep.env} sfx={ep.sfx} />
    </AbsoluteFill>
  );
};
