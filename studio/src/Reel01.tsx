import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "./components/Background";
import { Captions } from "./components/Captions";
import { SceneRuler } from "./scenes/SceneRuler";
import { SceneTraffic } from "./scenes/SceneTraffic";
import { SceneBuild } from "./scenes/SceneBuild";
import { SceneCta } from "./scenes/SceneCta";
import { reel01 as ep } from "./episodes/reel01";
import { colors, fontFamily, SAFE } from "./theme";

const Brand: React.FC = () => (
  <div style={{ position: "absolute", left: SAFE.left, top: 258, display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ width: 54, height: 54, borderRadius: 12, background: colors.cyan, color: colors.navy, fontFamily, fontWeight: 900, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>IT</div>
    <div style={{ fontFamily, fontWeight: 800, fontSize: 30, color: colors.white, letterSpacing: 1, opacity: 0.9 }}>INTERNET TOOLBOX</div>
  </div>
);

export const Reel01: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const f = (s: number) => Math.round(s * fps);
  const S = ep.scenes;
  const E = ep.events;
  const seq = (key: string) => ({ from: f(S[key][0]), durationInFrames: f(S[key][1] - S[key][0] + 0.2) });
  return (
    <AbsoluteFill style={{ backgroundColor: colors.navy }}>
      <Background />
      <Sequence {...seq("ruler")} layout="none">
        <SceneRuler start={S.ruler[0]} end={S.ruler[1]} titleAt={E.titleSlam} screenshot={ep.screenshot} />
      </Sequence>
      <Sequence {...seq("traffic")} layout="none">
        <SceneTraffic start={S.traffic[0]} end={S.traffic[1]} titleAt={E.trafficTitle} adAt={E.adAppears} coinsAt={E.coins} />
      </Sequence>
      <Sequence {...seq("build")} layout="none">
        <SceneBuild start={S.build[0]} end={S.build[1]} codeAt={E.codeStart} titleAt={E.buildTitle} pillAt={E.freePill} morphAt={E.morph} howAt={E.how} />
      </Sequence>
      <Sequence {...seq("cta")} layout="none">
        <SceneCta start={S.cta[0]} end={S.cta[1]} commentAt={E.commentBubble} followAt={E.followTap} part2At={E.part2} />
      </Sequence>
      <Brand />
      <Captions captions={ep.captions} />
      <div style={{ position: "absolute", left: SAFE.left, width: SAFE.right - SAFE.left, top: 1500, textAlign: "center", fontFamily, fontWeight: 600, fontSize: 26, color: colors.muted, opacity: 0.85 }}>{ep.disclaimer}</div>
      <Audio src={staticFile(ep.voiceover)} />
      <div style={{ position: "absolute", left: 0, top: 0, height: 8, width: `${(frame / (f(ep.voiceSeconds + ep.tailSeconds))) * 100}%`, background: colors.cyan }} />
    </AbsoluteFill>
  );
};
