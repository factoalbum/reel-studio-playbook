import { buildEpisode, type ThirtyJson } from "../../thirty/episode";
import ep01 from "./ep01.json";

/**
 * "30 DAYS. ONE DIGITAL PRODUCT." episodes. To add a week: copy the last JSON, change the numbers and cues, put the
 * voice in public/thirty/epNN/, make the loudness file (README in THIRTY-PROGRESS.md) and add one line here.
 * The second argument is the voice loudness per frame (null until the WAV exists: the mouth stays still).
 */
export const THIRTY = {
  ep01: buildEpisode(ep01 as ThirtyJson, null),
};

export type ThirtyId = keyof typeof THIRTY;
