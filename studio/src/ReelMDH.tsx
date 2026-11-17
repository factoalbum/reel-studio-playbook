import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Avatar, Backdrop, BrandBug, Disclaimer, palette, ProgressBar, ReelAudio, Subtitles } from "./brand";
import { GridScene, Scene1, Scene2, Scene7 } from "./mdh/Scenes";
import { mdh as ep } from "./episodes/mdh";

/**
 * Internet Stories: "The Million Dollar Homepage" in the permanent Internet Toolbox look.
 * Remotion is the master timeline; every scene reads its times from src/episodes/mdh.ts.
 * `cover` hides the subtitles and progress bar, for the Instagram cover.
 */
export const ReelMDH: React.FC<{ cover?: boolean }> = ({ cover = false }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill style={{ backgroundColor: palette.paper, overflow: "hidden" }}>
      <Backdrop />
      <Scene1 t={t} />
      <GridScene t={t} />
      <Scene7 t={t} />
      <Avatar keys={ep.avatarKeys} places={ep.avatarPlaces} env={ep.env} blinks={ep.blinks} />
      {/* The 2005 room is full-frame, so it sits above the presenter (who is off screen then). */}
      <Scene2 t={t} />
      <BrandBug />
      {t >= ep.disclaimerFrom && t < 68.9 && <Disclaimer lines={ep.disclaimer} />}
      {!cover && <Subtitles captions={ep.captions} />}
      {!cover && <ProgressBar />}
      <ReelAudio voice={ep.voiceover} music={ep.music} env={ep.env} sfx={ep.sfx} />
    </AbsoluteFill>
  );
};

