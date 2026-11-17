import React from "react";
import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";

/**
 * Voice, music and sound effects for a reel. The voice is used exactly as recorded;
 * the music ducks under it (louder in pauses, quieter while words are spoken), using the voice loudness per frame.
 */
export const ReelAudio: React.FC<{ voice: string; env: number[]; music?: string; sfx?: [number, string, number][]; musicLevel?: number }> = ({
  voice,
  env,
  music,
  sfx = [],
  musicLevel = 0.4,
}) => {
  const { fps } = useVideoConfig();
  const musicVolume = (f: number) => {
    let e = 0;
    for (let i = f - 6; i <= f + 2; i++) e = Math.max(e, env[Math.max(0, Math.min(env.length - 1, i))] ?? 0);
    return musicLevel * (1 - 0.5 * Math.min(1, e * 1.4));
  };
  return (
    <>
      <Audio src={staticFile(voice)} />
      {music && <Audio src={staticFile(music)} volume={musicVolume} />}
      {sfx.map(([at, name, vol], i) => (
        <Sequence key={i} from={Math.round(at * fps)} layout="none">
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </>
  );
};
