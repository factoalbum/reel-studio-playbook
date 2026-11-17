import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Avatar, Backdrop, BrandBug, BrandMark, Disclaimer, palette as P, ProgressBar, ReelAudio, SAFE, Subtitles, type } from "./brand";
import { Highlight, StepBadge, StepTitle } from "./secrets/kit";
import { Cta, DarkStage, HeldPdf, Hook, NotMagic, Outro, PdfReveal, Reveal, SixGrid, Step1, Step2, Step3, Step4, Step6, WantThese } from "./secrets/Scenes";
import { C, secrets as ep } from "./episodes/secrets";

const Series: React.FC = () => (
  <div style={{ position: "absolute", right: 1080 - SAFE.right, top: 268, ...type.label, fontSize: 23, letterSpacing: "0.08em", color: P.ink2 }}>Creator Secrets #01</div>
);

const BugOnDark: React.FC = () => (
  <div style={{ position: "absolute", left: SAFE.left, top: 258, display: "flex", alignItems: "center", gap: 14 }}>
    <BrandMark size={54} />
    <div style={{ ...type.display, letterSpacing: "-0.02em", fontSize: 32, color: P.card }}>Internet Toolbox</div>
  </div>
);

/**
 * Creator Secrets #01: six steps to an AI reel, in the permanent Internet Toolbox look.
 * Remotion is the master timeline; every scene reads its times from src/episodes/secrets.ts.
 */
export const ReelSecrets: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const high = (c: { start: number }) => c.start >= ep.captionHighFrom && c.start < ep.captionHighTo;
  const dark = t >= C.s5 - 0.1 && t < C.s6 - 0.3;
  const plan = t >= C.s3 - 0.16 && t < C.s4 - 0.16;
  const free = t >= C.pdfAt && t < C.wantAt + 0.1;
  return (
    <AbsoluteFill style={{ backgroundColor: P.paper, overflow: "hidden" }}>
      <Backdrop />
      <DarkStage t={t} />
      {dark ? <BugOnDark /> : <BrandBug />}
      {plan && <Disclaimer lines={["Claude Code needs a paid Claude plan."]} />}
      {free && <Disclaimer lines={["The PDF is free. The tools may not be."]} />}
      {!plan && !free && !dark && t < C.outroAt && <Series />}

      <Hook t={t} />
      <SixGrid t={t} />

      <StepBadge t={t} n={1} at={C.s1 - 0.1} out={C.s2 - 0.16} />
      <StepTitle t={t} at={C.s1 - 0.1} out={C.s2 - 0.16} lines={["ChatGPT", "Hook + script"]} />
      <Step1 t={t} />
      <Highlight t={t} at={C.scriptWord} out={C.s2 - 0.16} lines={["HOOK +", "SCRIPT"]} />

      <StepBadge t={t} n={2} at={C.s2 - 0.1} out={C.s3 - 0.16} />
      <StepTitle t={t} at={C.s2 - 0.1} out={C.s3 - 0.16} lines={["Google", "AI Studio"]} />
      <Step2 t={t} />
      <Highlight t={t} at={C.voiceWord} out={C.s3 - 0.16} lines={["AI VOICE"]} size={72} />

      <StepBadge t={t} n={3} at={C.s3 - 0.1} out={C.s4 - 0.16} />
      <StepTitle t={t} at={C.s3 - 0.1} out={C.s4 - 0.16} lines={["Claude Code", "+ Character"]} />
      <Step3 t={t} />
      <Highlight t={t} at={C.characterWord + 0.2} out={C.s4 - 0.16} lines={["ONE CHARACTER.", "EVERY REEL."]} size={46} x={696} />

      <StepBadge t={t} n={4} at={C.s4 - 0.1} out={C.s5Say - 0.08} />
      <StepTitle t={t} at={C.s4 - 0.1} out={C.s5Say - 0.08} lines={["Voice se", "Captions"]} />
      <Step4 t={t} />
      <Highlight t={t} at={C.captionsWord - 0.1} out={C.s5Say - 0.08} lines={["AUDIO-SYNCED", "CAPTIONS"]} size={50} />

      <StepBadge t={t} n={5} at={C.s5 - 0.1} out={C.s6 - 0.16} dark />
      <StepTitle t={t} at={C.s5 - 0.1} out={C.s6 - 0.16} lines={["The", "big reveal"]} dark />
      <Reveal t={t} />

      <StepBadge t={t} n={6} at={C.s6 - 0.1} out={C.lekin - 0.1} />
      <StepTitle t={t} at={C.s6 - 0.1} out={C.lekin - 0.1} lines={["Check, fix", "and render"]} />
      <Step6 t={t} />

      <NotMagic t={t} />
      <PdfReveal t={t} />
      <WantThese t={t} />
      <Cta t={t} />
      <Outro t={t} />

      <Avatar keys={ep.avatarKeys} places={ep.avatarPlaces} env={ep.env} blinks={ep.blinks} />
      <HeldPdf t={t} />
      <Subtitles captions={ep.captions.filter((c) => !high(c))} />
      <Subtitles captions={ep.captions.filter(high)} top={ep.captionHighTop} />
      <ProgressBar />
      <ReelAudio voice={ep.voiceover} music={ep.music} env={ep.env} sfx={ep.sfx} />
    </AbsoluteFill>
  );
};
