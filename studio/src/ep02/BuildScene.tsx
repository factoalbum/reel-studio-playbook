import React from "react";
import { LAYOUT, mono, palette as P } from "../brand/tokens";
import { Headline } from "../brand/Headline";
import { LabelPill, Mark } from "../brand/Bits";
import { toFrame, type Rect, type Shot } from "../brand/ProofPanel";
import { BrowserProof, camPath, keyAt, viewOf, type CamKey } from "../brand/BrowserProof";
import { Cursor, Highlight, PopSticker, RealPill } from "../brand/ProofMarks";
import { PromptCard } from "../brand/PromptCard";
import { StepStrip } from "../brand/Steps";
import { range, usePop } from "../components/motion";

/** Voice times for the "make your own tool with ChatGPT" part (seconds). */
export type BuildCues = {
  crazy: number;
  sabse: number;
  crazyWord: number;
  baat: number;
  corner: number;
  typeFrom: number;
  typeTo: number;
  send: number;
  answer: number;
  scroll: number;
  chatgpt: number;
  preview: number;
  typed: number;
  hover: number;
  click: number;
  works: number;
  publish: number;
  out: number;
};
/** The exact prompt and real screenshots of ChatGPT's answer (code scrolled to the top, then to the end). */
export type ChatAssets = { prompt: string; top: Shot; code: Shot };
/** ChatGPT's code running in Chrome: screenshots per state and the boxes we point at (page pixels). */
export type PreviewCapture = { shot: { width: number; height: number }; button: Rect; result: Rect; states: { name: string; file: string }[] };

const PANEL = LAYOUT.panel;
const PIVOT = `${PANEL.x + PANEL.w / 2}px ${PANEL.y + PANEL.h / 2}px`;

/**
 * "Ab sabse crazy baat suno: aisa ek tool tum bhi ChatGPT ki madad se bana sakte ho."
 * The real prompt is typed, ChatGPT's real answer is shown, its code runs in a real browser, and free hosting is named
 * with the honest catch (a custom domain costs money). Steps stay on screen: Prompt, Code, Preview, Publish.
 */
export const BuildScene: React.FC<{ t: number; cue: BuildCues; chat: ChatAssets; preview: PreviewCapture }> = ({ t, cue, chat, preview }) => {
  const answerIn = usePop(t, cue.answer, { damping: 14, stiffness: 130, mass: 0.8 });
  if (t < cue.crazy - 0.05 || t > cue.out + 0.3) return null;
  const view = viewOf(PANEL);
  const flip = range(t, cue.preview - 0.12, cue.preview + 0.3);
  const answerAngle = Math.min(90, flip * 180);
  const previewAngle = Math.max(0, 90 - Math.max(0, flip * 180 - 90));
  const out = range(t, cue.out, cue.out + 0.25);

  const answerCam = camPath(
    [
      [cue.answer, { cx: 478, cy: 262, z: 0.91 }],
      [cue.answer + 0.4, { cx: 400, cy: 470, z: 1.2 }, 0.45],
      [cue.scroll + 0.1, { cx: 335, cy: 600, z: 1.45 }, 0.45],
    ] as CamKey[],
    t,
  );
  const previewCam = camPath(
    [
      [cue.preview, { cx: 360, cy: 226, z: 1.21 }],
      [cue.works - 0.12, { cx: 360, cy: 330, z: 1.5 }, 0.4],
    ] as CamKey[],
    t,
  );
  const file = (name: string) => preview.states.find((s) => s.name === name)?.file ?? preview.states[0].file;
  const previewFile = keyAt(
    [
      [0, file("percent")],
      [cue.typed, file("number")],
      [cue.hover, file("hover")],
      [cue.click, file("result")],
    ],
    t,
  );
  const btn = preview.button;
  return (
    <>
      {/* The twist: "Ab sabse crazy baat suno". */}
      <Headline
        t={t}
        top={LAYOUT.headerTop + 20}
        inAt={cue.crazy}
        outAt={cue.corner - 0.05}
        lines={[
          {
            size: 86,
            segs: [
              { text: "Sabse", at: cue.sabse },
              { text: "crazy", at: cue.crazyWord, tone: "marker" },
              { text: "baat", at: cue.baat },
            ],
          },
        ]}
      />
      {t < cue.corner + 0.2 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - range(t, cue.corner - 0.05, cue.corner + 0.15) }}>
          <Mark t={t} at={cue.crazyWord} x={830} y={560} text="!" color={P.lime} size={160} rot={12} />
          <Mark t={t} at={cue.baat} x={120} y={600} text="?" color={P.gold} size={130} rot={-14} />
        </div>
      )}

      {/* The how-to header: one line and the four steps. */}
      <Headline
        t={t}
        top={LAYOUT.headerTop - 4}
        inAt={cue.corner}
        outAt={cue.out}
        lines={[
          {
            size: 70,
            segs: [
              { text: "Build it with", at: cue.corner + 0.05 },
              { text: "ChatGPT", at: cue.chatgpt, tone: "lime" },
            ],
          },
        ]}
      />
      <StepStrip
        t={t}
        top={430}
        inAt={cue.corner}
        outAt={cue.out}
        steps={[
          { label: "Prompt", at: cue.corner + 0.05 },
          { label: "Code", at: cue.answer },
          { label: "Preview", at: cue.preview },
          { label: "Publish", at: cue.publish },
        ]}
      />

      {/* 1. The exact prompt that was used. */}
      <PromptCard t={t} at={cue.corner} label="Prompt" source="ChatGPT" text={chat.prompt} typeFrom={cue.typeFrom} typeTo={cue.typeTo} sendAt={cue.send} outAt={cue.answer} top={580} />

      {/* 2. ChatGPT's real answer, then 3. its code running in Chrome (the panel flips between them). */}
      {t >= cue.answer && answerAngle < 90 && (
        <div style={{ position: "absolute", inset: 0, transformOrigin: PIVOT, transform: `perspective(1800px) rotateY(${answerAngle}deg)` }}>
          <BrowserProof panel={PANEL} host="chatgpt.com" shot={t < cue.scroll ? chat.top : chat.code} cam={answerCam} enter={answerIn} out={0} pageBg="#000000" />
        </div>
      )}
      {flip > 0.5 && (
        <div style={{ position: "absolute", inset: 0, transformOrigin: PIVOT, transform: `perspective(1800px) rotateY(${-previewAngle}deg)` }}>
          <BrowserProof panel={PANEL} host="percentage-calculator.html" icon="file" shot={{ file: previewFile, ...preview.shot }} cam={previewCam} enter={1} out={out} pageBg="#F1F5F9">
            <Highlight t={t} r={{ x: preview.result.x, y: preview.result.y - 6, w: preview.result.w, h: preview.result.h + 12 }} at={cue.works} outAt={99} z={previewCam.z} />
          </BrowserProof>
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
        {t >= cue.answer && t < cue.preview && <RealPill t={t} at={cue.answer + 0.3} text="Real ChatGPT answer" right={PANEL.x + PANEL.w - 14} top={PANEL.y - 30} />}
        {t >= cue.preview && <RealPill t={t} at={cue.preview + 0.2} text="ChatGPT's code in Chrome" right={PANEL.x + PANEL.w - 14} top={PANEL.y - 30} />}
        <CodeChips t={t} cue={cue} />
        <Cursor
          t={t}
          stops={[
            { at: cue.hover, u: btn.x + btn.w / 2, v: btn.y + btn.h / 2 },
            { at: cue.click, u: btn.x + btn.w / 2, v: btn.y + btn.h / 2, click: true },
          ]}
          map={(u, v) => toFrame(view, u, v, previewCam)}
          from={[930, 1150]}
          showAt={cue.preview + 0.05}
          hideAt={cue.works}
        />
        {/* 4. Publishing: free static hosting exists; a custom domain is a paid extra. */}
        <PopSticker t={t} at={cue.publish} x={515} y={958} size={42} rotate={-3}>
          Publish free: GitHub Pages ✓
        </PopSticker>
        <DomainNote t={t} at={cue.publish + 0.15} />
      </div>
    </>
  );
};

/** HTML, CSS and JavaScript chips along the bottom edge of ChatGPT's answer. */
const CodeChips: React.FC<{ t: number; cue: BuildCues }> = ({ t, cue }) => {
  if (t < cue.answer || t > cue.preview + 0.1) return null;
  const chips: { text: string; at: number; x: number; bg: string }[] = [
    { text: "HTML", at: cue.answer + 0.35, x: 230, bg: P.lime },
    { text: "CSS", at: cue.answer + 0.55, x: 430, bg: P.gold },
    { text: "JavaScript", at: cue.scroll + 0.1, x: 690, bg: P.card },
  ];
  const fade = 1 - range(t, cue.preview - 0.15, cue.preview + 0.05);
  return (
    <>
      {chips.map((c) => (
        <Chip key={c.text} t={t} at={c.at} x={c.x} bg={c.bg} text={c.text} fade={fade} />
      ))}
    </>
  );
};

const Chip: React.FC<{ t: number; at: number; x: number; bg: string; text: string; fade: number }> = ({ t, at, x, bg, text, fade }) => {
  const p = usePop(t, at, { damping: 9, stiffness: 220, mass: 0.6 });
  if (p <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x - 300, width: 600, top: 1052, display: "flex", justifyContent: "center", opacity: Math.min(1, p * 2) * fade }}>
      <div
        style={{
          transform: `scale(${p}) rotate(-3deg)`,
          background: bg,
          border: `5px solid ${P.ink}`,
          borderRadius: 14,
          boxShadow: `7px 7px 0 ${P.ink}`,
          padding: "4px 18px 8px",
        }}
      >
        <span style={{ fontFamily: mono, fontWeight: 600, fontSize: 36, color: P.ink }}>{text}</span>
      </div>
    </div>
  );
};

const DomainNote: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const p = usePop(t, at, { damping: 11, stiffness: 190, mass: 0.6 });
  if (p <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, width: 1030, top: 1030, display: "flex", justifyContent: "center", opacity: Math.min(1, p * 2) }}>
      <LabelPill text="Custom domain = paid" t={t} size={24} pop={p} />
    </div>
  );
};
