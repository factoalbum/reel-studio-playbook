import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/IBMPlexSans";
import { Avatar, Backdrop, BrandBug, Disclaimer, palette, ProgressBar, ReelAudio, Subtitles } from "./brand";
import { HookScene } from "./ep02/HookScene";
import { HomeScene } from "./ep02/HomeScene";
import { GstScene } from "./ep02/GstScene";
import { BuildScene } from "./ep02/BuildScene";
import { CtaScene } from "./ep02/CtaScene";
import { reel02 as ep } from "./episodes/reel02";

// The rupee sign is in IBM Plex Sans' latin-ext subset.
loadFont("normal", { weights: ["500", "600", "700"], subsets: ["latin-ext"] });

const PANEL_CENTRE: [number, number] = [515, 812];

/** Reel 02 in the permanent Internet Toolbox look. `cover` hides the subtitles and progress bar, for the Instagram cover. */
export const Reel02: React.FC<{ cover?: boolean }> = ({ cover = false }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const { cues, capture } = ep;
  return (
    <AbsoluteFill style={{ backgroundColor: palette.paper }}>
      <Backdrop />
      <HomeScene t={t} cue={cues.home} home={capture.home} />
      <GstScene t={t} cue={cues.gst} gst={capture.gst} />
      <BuildScene t={t} cue={cues.build} chat={ep.chat} preview={capture.preview} />
      <CtaScene t={t} cue={cues.cta} home={capture.home.shot} domain={ep.domain} keyword={ep.keyword} next={ep.next} />
      <Avatar keys={ep.avatarKeys} places={ep.avatarPlaces} env={ep.env} blinks={ep.blinks} />
      {/* The recap card and the tools sit above the big centred avatar. */}
      <HookScene t={t} cue={cues.hook} recap={ep.recap} part={ep.part} target={PANEL_CENTRE} />
      <BrandBug />
      {t >= ep.disclaimerFrom && <Disclaimer lines={ep.disclaimer} />}
      {!cover && <Subtitles captions={ep.captions} />}
      {!cover && <ProgressBar />}
      <ReelAudio voice={ep.voiceover} music={ep.music} env={ep.env} sfx={ep.sfx} />
    </AbsoluteFill>
  );
};
