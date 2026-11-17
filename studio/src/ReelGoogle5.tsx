import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Avatar, Backdrop, BrandBug, Disclaimer, palette, ProgressBar, ReelAudio, Subtitles } from "./brand";
import { google5 as ep } from "./episodes/google5";
import { CAM_ORIGIN, cam, CtaScene, GridScene, HookScene, LimitsScene, OpenerBg, SeriesTag, SmashFree, ToolScene, Wipes } from "./google5/Scenes";

/**
 * Creator Secrets #03: 5 Google AI tools, in the permanent Internet Toolbox look.
 * Remotion is the master timeline; every scene reads its times from src/episodes/google5.ts.
 * `cover` hides the subtitles and progress bar.
 */
export const ReelGoogle5: React.FC<{ cover?: boolean }> = ({ cover = false }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill style={{ backgroundColor: palette.paper, overflow: "hidden" }}>
      <Backdrop />
      <OpenerBg t={t} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam(t)})`, transformOrigin: CAM_ORIGIN }}>
        <HookScene t={t} />
        <GridScene t={t} />
        {[0, 1, 2, 3, 4].map((i) => (
          <ToolScene key={i} t={t} i={i} />
        ))}
        <LimitsScene t={t} />
        <CtaScene t={t} />
        <Avatar keys={ep.avatarKeys} places={ep.avatarPlaces} env={ep.env} blinks={ep.blinks} />
        <SeriesTag t={t} />
      </div>
      <Wipes t={t} />
      <BrandBug />
      <Disclaimer lines={ep.disclaimer} />
      <SmashFree t={t} />
      {!cover && <Subtitles captions={ep.captions.filter((c) => !ep.captionLow(c.start))} />}
      {!cover && <Subtitles captions={ep.captions.filter((c) => ep.captionLow(c.start))} top={ep.captionLowTop} />}
      {!cover && <ProgressBar />}
      <ReelAudio voice={ep.voiceover} music={ep.music} env={ep.env} sfx={ep.sfx} />
    </AbsoluteFill>
  );
};
