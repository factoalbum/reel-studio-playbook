import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Avatar, Backdrop, BrandBug, Disclaimer, palette, ProgressBar, ReelAudio, Subtitles } from "./brand";
import { HookScene } from "./v4/HookScene";
import { WebsiteScene } from "./v4/WebsiteScene";
import { CrazyScene } from "./v4/CrazyScene";
import { BuildScene } from "./v4/BuildScene";
import { CtaScene } from "./v4/CtaScene";
import { reel01v4 as ep } from "./episodes/reel01v4";

/** Reel 01 in the permanent Internet Toolbox look. `cover` hides the subtitles and progress bar, for the Instagram cover. */
export const Reel01v4: React.FC<{ cover?: boolean }> = ({ cover = false }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill style={{ backgroundColor: palette.paper }}>
      <Backdrop />
      <CrazyScene t={t} />
      <WebsiteScene t={t} />
      <BuildScene t={t} />
      <CtaScene t={t} />
      <Avatar keys={ep.avatarKeys} places={ep.avatarPlaces} env={ep.env} blinks={ep.blinks} />
      {/* The hook title sits above the big centred avatar. */}
      <HookScene t={t} />
      <BrandBug />
      <Disclaimer lines={ep.disclaimer} />
      {!cover && <Subtitles captions={ep.captions} />}
      {!cover && <ProgressBar />}
      <ReelAudio voice={ep.voiceover} music={ep.music} env={ep.env} sfx={ep.sfx} />
    </AbsoluteFill>
  );
};
