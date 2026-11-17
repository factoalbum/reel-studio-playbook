import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Avatar, Backdrop, BrandBug, Disclaimer, palette, ProgressBar, ReelAudio, Subtitles } from "./brand";
import { CAM_ORIGIN, cam, ChecksEmployee, ChecksScene, Festive, HookBack, HookFront, HookTitle, Wipes } from "./bonus/Story";
import { ActScene, LegalCard, RevealScene, ShareScene, TwistScene, WaitWhat } from "./bonus/Story2";
import { bonus as ep } from "./episodes/bonus";

/**
 * Diwali special 2026: "Diwali bonus nahi mila?", statutory bonus rights, in the permanent Internet Toolbox look.
 * Remotion is the master timeline; every scene reads its times from src/episodes/bonus.ts.
 * `cover` hides the subtitles and progress bar.
 */
export const ReelBonus: React.FC<{ cover?: boolean }> = ({ cover = false }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill style={{ backgroundColor: palette.paper, overflow: "hidden" }}>
      <Backdrop />
      <Festive t={t} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam(t)})`, transformOrigin: CAM_ORIGIN }}>
        <HookBack t={t} />
        <ChecksScene t={t} />
        <RevealScene t={t} />
        <TwistScene t={t} />
        <ActScene t={t} />
        <ShareScene t={t} />
        <ChecksEmployee t={t} />
        <Avatar keys={ep.avatarKeys} places={ep.avatarPlaces} env={ep.env} blinks={ep.blinks} />
        <HookFront t={t} />
      </div>
      <HookTitle t={t} />
      <WaitWhat t={t} />
      <LegalCard t={t} />
      <Wipes t={t} />
      <BrandBug />
      <Disclaimer lines={ep.disclaimer} />
      {!cover && <Subtitles captions={ep.captions.filter((c) => !ep.captionLow(c.start))} />}
      {!cover && <Subtitles captions={ep.captions.filter((c) => ep.captionLow(c.start))} top={ep.captionLowTop} />}
      {!cover && <ProgressBar />}
      <ReelAudio voice={ep.voiceover} music={ep.music} env={ep.env} sfx={ep.sfx} />
    </AbsoluteFill>
  );
};
