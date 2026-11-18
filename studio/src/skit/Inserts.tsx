import React from "react";
import { AbsoluteFill } from "remotion";
import { palette as P, shadow, type } from "../brand/tokens";
import { C } from "../episodes/watch";
import { eo, lerp, pop, seg } from "../mdh/kit";
import { mix, sc } from "../launch/kit";

/**
 * 2D story inserts for the "Claude watches reels" skit. Everything here is drawn by us: Chachu, his cooker and his
 * videos are made up. The only real things are the plugin name and its two install lines (from its README).
 */

const NIGHT = "#141B2E";
const GLASS = "rgba(20,26,44,0.9)";
const CLAUDE = "#D97757";
const MONO = { fontFamily: "IBM Plex Mono, monospace", fontWeight: 600 } as const;

/** Visible from a to b with a spring in and a quick fade out. */
const life = (t: number, a: number, b: number, cfg = { damping: 12, stiffness: 210 }) => {
  if (t < a - 0.05 || t > b + 0.25) return 0;
  return mix(pop(t, a, cfg)) * (1 - seg(t, b, b + 0.22));
};
const spring = (t: number, a: number) => sc(pop(t, a, { damping: 11, stiffness: 220 }));

const cardBox = (dark = true): React.CSSProperties => ({
  position: "absolute",
  background: dark ? GLASS : P.card,
  border: `4px solid ${dark ? "rgba(255,255,255,0.18)" : P.ink}`,
  borderRadius: 26,
  boxShadow: dark ? "0 22px 50px rgba(0,0,0,0.45)" : shadow.hard(7),
});

// ───────────────────────────── Chachu, drawn by us ─────────────────────────────

/** Chachu dancing. phase drives the arms and hips; groom adds a flower sehra and a pink safa. */
export const Chachu: React.FC<{ size: number; phase: number; groom?: boolean }> = ({ size, phase, groom = false }) => {
  const s = Math.sin(phase);
  const c = Math.cos(phase);
  const hip = s * 6;
  const armL = { x: 52 - 6 * c, y: 92 - 34 * Math.max(0, s) - 10 };
  const armR = { x: 148 + 6 * c, y: 92 - 34 * Math.max(0, -s) - 10 };
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 200 260">
      {/* legs */}
      <path d={`M ${86 + hip} 200 L ${74 + hip * 1.6} 250 M ${114 + hip} 200 L ${126 + hip * 1.6} 250`} stroke="#E9E2D0" strokeWidth={18} strokeLinecap="round" />
      {/* kurta */}
      <path d={`M ${64 + hip} 118 Q 100 104 ${136 + hip} 118 L ${144 + hip} 212 Q 100 222 ${56 + hip} 212 Z`} fill={groom ? "#F3D27A" : "#FFFFFF"} stroke="#2B1B13" strokeWidth={4} />
      <path d={`M ${100 + hip} 116 L ${100 + hip} 160`} stroke="#2B1B13" strokeWidth={3} />
      {/* arms */}
      <path d={`M ${70 + hip} 128 L ${armL.x} ${armL.y}`} stroke={groom ? "#F3D27A" : "#FFFFFF"} strokeWidth={16} strokeLinecap="round" />
      <path d={`M ${130 + hip} 128 L ${armR.x} ${armR.y}`} stroke={groom ? "#F3D27A" : "#FFFFFF"} strokeWidth={16} strokeLinecap="round" />
      <circle cx={armL.x} cy={armL.y} r={9} fill="#E3B08A" stroke="#2B1B13" strokeWidth={3} />
      <circle cx={armR.x} cy={armR.y} r={9} fill="#E3B08A" stroke="#2B1B13" strokeWidth={3} />
      {/* head */}
      <g transform={`rotate(${s * 8} 100 74)`}>
        <circle cx={100} cy={74} r={36} fill="#E3B08A" stroke="#2B1B13" strokeWidth={4} />
        {!groom && <path d="M 66 70 Q 64 50 74 46 M 134 70 Q 136 50 126 46" stroke="#9A9A9A" strokeWidth={8} fill="none" strokeLinecap="round" />}
        <circle cx={86} cy={70} r={10} fill="none" stroke="#2B1B13" strokeWidth={3} />
        <circle cx={114} cy={70} r={10} fill="none" stroke="#2B1B13" strokeWidth={3} />
        <path d="M 96 70 L 104 70" stroke="#2B1B13" strokeWidth={3} />
        <circle cx={86} cy={70} r={3.5} fill="#2B1B13" />
        <circle cx={114} cy={70} r={3.5} fill="#2B1B13" />
        <path d="M 78 88 Q 90 80 100 88 Q 110 80 122 88 Q 112 96 100 91 Q 88 96 78 88 Z" fill="#2B1B13" />
        <path d="M 90 97 Q 100 104 110 97" stroke="#5E1F22" strokeWidth={4} fill="none" strokeLinecap="round" />
        {groom && (
          <>
            <path d="M 62 56 Q 100 14 138 56 Q 100 40 62 56 Z" fill="#E58FA1" stroke="#2B1B13" strokeWidth={3} />
            {Array.from({ length: 7 }, (_, k) => (
              <path key={k} d={`M ${72 + k * 9.3} 58 L ${72 + k * 9.3} 112`} stroke="#FFFFFF" strokeWidth={4} strokeDasharray="4 5" />
            ))}
          </>
        )}
      </g>
    </svg>
  );
};

/** A pressure cooker; whistle 0..1 lifts the weight and puffs steam. */
export const Cooker: React.FC<{ size: number; whistle: number }> = ({ size, whistle }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    {whistle > 0 &&
      [0, 1, 2].map((k) => (
        <circle key={k} cx={100 + (k - 1) * 22 * whistle} cy={52 - 26 * whistle - k * 14} r={10 + 10 * whistle} fill="#FFFFFF" opacity={0.85 - k * 0.2} />
      ))}
    <rect x={92} y={52 - 10 * whistle} width={16} height={20} rx={4} fill="#2B2B2B" />
    <path d="M 40 92 Q 100 66 160 92 L 160 100 L 40 100 Z" fill="#C9CED6" stroke="#2B1B13" strokeWidth={4} />
    <rect x={44} y={98} width={112} height={76} rx={18} fill="#B5BBC4" stroke="#2B1B13" strokeWidth={4} />
    <rect x={150} y={88} width={44} height={14} rx={7} fill="#2B2B2B" />
    <path d="M 60 118 L 140 118" stroke="#FFFFFF" strokeWidth={5} opacity={0.5} strokeLinecap="round" />
  </svg>
);

/** One "video frame" thumbnail: Chachu and the cooker on a warm kitchen wall. */
const Frame: React.FC<{ w: number; phase: number; whistle?: number; groom?: boolean; tint?: string }> = ({ w, phase, whistle = 0, groom = false, tint }) => (
  <div style={{ width: w, height: w * 1.25, borderRadius: 14, overflow: "hidden", position: "relative", background: tint ?? (groom ? "linear-gradient(#FFD9E4, #F7B4C6)" : "linear-gradient(#FFE6B8, #F5C98A)"), border: "3px solid rgba(0,0,0,0.25)" }}>
    <div style={{ position: "absolute", left: w * 0.02, bottom: w * 0.02 }}>
      <Chachu size={w * 0.66} phase={phase} groom={groom} />
    </div>
    {!groom && (
      <div style={{ position: "absolute", right: w * 0.02, bottom: w * 0.04 }}>
        <Cooker size={w * 0.42} whistle={whistle} />
      </div>
    )}
  </div>
);

// ───────────────────────────── Inserts ─────────────────────────────

/** 1. The viral reel on the phone, top left over the wall. */
const ReelInsert: React.FC<{ t: number }> = ({ t }) => {
  const o = life(t, C.reel + 0.55, C.claudeNo - 0.05);
  if (!o) return null;
  return (
    <div style={{ ...cardBox(), left: 80, top: 250, width: 330, padding: 14, opacity: o, transform: `scale(${spring(t, C.reel + 0.55)}) rotate(-4deg)`, transformOrigin: "50% 100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 17, background: "#F5C98A", border: "2px solid #fff" }} />
        <div style={{ ...type.display, fontSize: 24, color: "#fff" }}>chachu_dance</div>
      </div>
      <Frame w={298} phase={t * 9} whistle={Math.max(0, Math.sin(t * 6))} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, ...type.display, fontSize: 26, color: "#fff" }}>
        <span>❤️ 🔥</span>
        <span style={{ background: "#FF3B5C", borderRadius: 10, padding: "2px 12px", fontSize: 22 }}>VIRAL</span>
      </div>
    </div>
  );
};

/** 2. Claude can't open Instagram. */
const LockInsert: React.FC<{ t: number }> = ({ t }) => {
  const o = life(t, C.claudeNo + 0.35, C.ruk - 0.05);
  if (!o) return null;
  return (
    <div style={{ ...cardBox(), left: 80, top: 280, padding: "22px 28px", opacity: o, transform: `scale(${spring(t, C.claudeNo + 0.35)})`, transformOrigin: "0 0", display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ fontSize: 60 }}>🔒</div>
      <div>
        <div style={{ ...MONO, fontSize: 30, color: "#fff" }}>instagram.com</div>
        <div style={{ ...type.display, fontSize: 32, color: "#FF6B6B", marginTop: 4 }}>✕ Login chahiye</div>
      </div>
    </div>
  );
};

/** 3. The video file flies to Claude, then the plugin install (real lines from the README). */
const FileInsert: React.FC<{ t: number }> = ({ t }) => {
  const oF = life(t, C.file, C.plugin + 0.1);
  const fly = eo(seg(t, C.file, C.file + 0.6));
  const oT = life(t, C.plugin, C.kya - 0.05);
  const l1 = "/plugin marketplace add MarcinSufa/claude-watch-video";
  const l2 = "/plugin install watch-video@claude-watch-video";
  const typed = Math.floor(seg(t, C.plugin + 0.05, C.plugin + 0.75) * (l1.length + l2.length));
  return (
    <>
      {oF > 0 && (
        <div style={{ ...cardBox(false), left: lerp(620, 120, fly), top: lerp(820, 300, fly), padding: "16px 24px", opacity: oF, transform: `rotate(${lerp(8, -3, fly)}deg)`, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 50 }}>🎬</div>
          <div style={{ ...MONO, fontSize: 30, color: P.ink }}>chachu_viral.mp4</div>
        </div>
      )}
      {oT > 0 && (
        <div style={{ ...cardBox(), left: 70, top: 930, width: 940, padding: "18px 24px 22px", opacity: oT, transform: `scale(${spring(t, C.plugin)})`, transformOrigin: "50% 100%" }}>
          <div style={{ display: "flex", gap: 9, marginBottom: 14, alignItems: "center" }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
              <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />
            ))}
            <div style={{ ...MONO, fontSize: 20, color: "rgba(255,255,255,0.5)", marginLeft: 10 }}>claude code</div>
          </div>
          <div style={{ ...MONO, fontSize: 25, color: "#E8F5D0", lineHeight: 1.5, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
            <span style={{ color: CLAUDE }}>&gt; </span>
            {l1.slice(0, Math.min(typed, l1.length))}
            {typed > l1.length && (
              <>
                {"\n"}
                <span style={{ color: CLAUDE }}>&gt; </span>
                {l2.slice(0, typed - l1.length)}
              </>
            )}
          </div>
          <div style={{ ...type.label, fontSize: 16, color: "#C8F169", marginTop: 12, opacity: mix(seg(t, C.plugin + 0.8, C.plugin + 1)) }}>watch-video plugin · free · open source (MIT)</div>
        </div>
      )}
    </>
  );
};

/** 4. What Claude gets: frames and the text of what was said. */
const FramesInsert: React.FC<{ t: number }> = ({ t }) => {
  const o = life(t, C.frames, C.achha - 0.05);
  if (!o) return null;
  const oText = mix(pop(t, C.text, { damping: 12, stiffness: 210 }));
  return (
    <div style={{ position: "absolute", left: 70, top: 250, width: 940, opacity: o }}>
      <div style={{ ...cardBox(), position: "relative", padding: "14px 16px", transform: `scale(${spring(t, C.frames)})`, transformOrigin: "50% 0" }}>
        <div style={{ ...type.label, fontSize: 20, color: "#C8F169", marginBottom: 10 }}>🎞 Frames</div>
        <div style={{ display: "flex", gap: 10 }}>
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <div key={k} style={{ opacity: mix(seg(t, C.frames + 0.2 + k * 0.12, C.frames + 0.3 + k * 0.12)) }}>
              <Frame w={140} phase={k * 1.1} whistle={k === 3 ? 1 : 0} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...cardBox(false), position: "relative", marginTop: 16, marginLeft: 120, width: 700, padding: "14px 22px", opacity: oText, transform: `scale(${sc(pop(t, C.text, { damping: 11, stiffness: 220 }))})` }}>
        <div style={{ ...type.label, fontSize: 18, color: "#6B6B6B" }}>📝 Jo bola, uska text</div>
        <div style={{ ...MONO, fontSize: 30, color: P.ink, marginTop: 4 }}>"Seeeetiii! Oye hoye!" ♪</div>
      </div>
    </div>
  );
};

/** 5. Claude analysing: frames light up one by one, then the whistle. */
const AnalysisInsert: React.FC<{ t: number }> = ({ t }) => {
  const o = life(t, C.achha + 0.15, C.haan - 0.05);
  if (!o) return null;
  const k = Math.floor((t - C.achha) * 5) % 4;
  const boom = pop(t, C.seeti + 0.55, { damping: 9, stiffness: 240 });
  return (
    <div style={{ position: "absolute", left: 80, top: 250, opacity: o }}>
      <div style={{ ...cardBox(), position: "relative", padding: 14, display: "grid", gridTemplateColumns: "repeat(2, 140px)", gap: 10, transform: `scale(${spring(t, C.achha + 0.15)})`, transformOrigin: "0 0" }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ outline: i === k ? "4px solid #C8F169" : "none", borderRadius: 14 }}>
            <Frame w={140} phase={i * 1.4 + t * 2} whistle={t > C.seeti + 0.4 ? 1 : 0} />
          </div>
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, top: `${(((t - C.achha) * 60) % 100) | 0}%`, height: 4, background: "#C8F169", boxShadow: "0 0 18px #C8F169" }} />
      </div>
      {t > C.seeti + 0.5 && (
        <div style={{ position: "absolute", left: 250, top: 330, transform: `scale(${sc(boom)}) rotate(-8deg)`, ...type.display, fontSize: 88, color: "#fff", WebkitTextStroke: `4px ${P.ink}`, textShadow: shadow.hard(6), whiteSpace: "nowrap" }}>
          SEETI! 💨
        </div>
      )}
    </div>
  );
};

/** 6. Beat pakad li. */
const BeatInsert: React.FC<{ t: number }> = ({ t }) => {
  const o = life(t, C.haan + 0.2, C.cooker - 0.05);
  if (!o) return null;
  return (
    <div style={{ position: "absolute", left: 80, top: 270, opacity: o, display: "flex", gap: 22 }}>
      {["♪", "♫", "♪", "♫"].map((n, i) => (
        <div key={i} style={{ ...type.display, fontSize: 96, color: i % 2 ? "#C8F169" : "#fff", transform: `translateY(${Math.sin(t * 9 + i) * 18}px)`, textShadow: "0 6px 20px rgba(0,0,0,0.5)" }}>
          {n}
        </div>
      ))}
    </div>
  );
};

/** 7. Cooker ne, ya Chachu ne? */
const WhoInsert: React.FC<{ t: number }> = ({ t }) => {
  const o = life(t, C.cooker + 0.25, C.tu - 0.05);
  if (!o) return null;
  const right = t > C.ya;
  const box = (on: boolean): React.CSSProperties => ({ ...cardBox(), position: "relative", padding: 12, opacity: on ? 1 : 0.45, transform: `scale(${on ? 1.06 : 0.94})`, border: `4px solid ${on ? "#C8F169" : "rgba(255,255,255,0.18)"}` });
  return (
    <div style={{ position: "absolute", left: 80, top: 260, opacity: o, display: "flex", alignItems: "center", gap: 18, transform: `scale(${spring(t, C.cooker + 0.25)})`, transformOrigin: "0 0" }}>
      <div style={box(!right)}>
        <Cooker size={190} whistle={!right ? Math.max(0, Math.sin(t * 8)) : 0} />
      </div>
      <div style={{ ...type.display, fontSize: 110, color: "#fff", textShadow: "0 6px 20px rgba(0,0,0,0.5)" }}>?</div>
      <div style={box(right)}>
        <Chachu size={150} phase={right ? t * 9 : 0} />
      </div>
    </div>
  );
};

/** 8. Ek aur video: compare. */
const CompareInsert: React.FC<{ t: number }> = ({ t }) => {
  const o = life(t, C.ekAur + 0.3, C.bas - 0.05);
  if (!o) return null;
  return (
    <div style={{ position: "absolute", left: 80, top: 260, opacity: o, display: "flex", alignItems: "center", gap: 16, transform: `scale(${spring(t, C.ekAur + 0.3)})`, transformOrigin: "0 0" }}>
      <Frame w={170} phase={t * 8} whistle={1} />
      <div style={{ ...type.display, fontSize: 64, color: "#C8F169", textShadow: "0 6px 20px rgba(0,0,0,0.5)" }}>VS</div>
      <div style={{ opacity: mix(seg(t, C.ekAur + 0.6, C.ekAur + 0.8)) }}>
        <Frame w={170} phase={t * 8 + 2} tint="linear-gradient(#CFE8FF, #9CC7F0)" />
      </div>
    </div>
  );
};

/** 9. "Bas ek." */
const OneInsert: React.FC<{ t: number }> = ({ t }) => {
  const o = life(t, C.bas + 0.15, C.skip - 0.02);
  if (!o) return null;
  return (
    <div style={{ position: "absolute", left: 80, top: 270, opacity: o, transform: `scale(${spring(t, C.bas + 0.15)}) rotate(-6deg)`, transformOrigin: "0 0", ...cardBox(false), padding: "10px 28px", ...type.display, fontSize: 72, color: P.ink }}>
      ☝️ SIRF 1
    </div>
  );
};

/** 10. Time jump: "3 ghante baad", clock spins, videos pile up. */
export const TimeSkip: React.FC<{ t: number }> = ({ t }) => {
  if (t < C.skip || t > C.night + 0.4) return null;
  const o = mix(seg(t, C.skip, C.skip + 0.25)) * (1 - seg(t, C.night, C.night + 0.35));
  const spin = eo(seg(t, C.skip + 0.15, C.night - 0.1)) * 360 * 3;
  const pile = Math.floor(seg(t, C.skip + 0.35, C.night - 0.15) * 9);
  return (
    <AbsoluteFill style={{ background: NIGHT, opacity: o, alignItems: "center" }}>
      <div style={{ position: "absolute", top: 520, width: 300, height: 300, borderRadius: 150, background: "#FAF9F6", border: `10px solid ${P.ink}` }}>
        <div style={{ position: "absolute", left: 145, top: 40, width: 10, height: 110, background: P.ink, borderRadius: 5, transformOrigin: "50% 100%", transform: `rotate(${spin}deg)` }} />
        <div style={{ position: "absolute", left: 144, top: 80, width: 12, height: 70, background: CLAUDE, borderRadius: 6, transformOrigin: "50% 100%", transform: `rotate(${spin / 12}deg)` }} />
        <div style={{ position: "absolute", left: 135, top: 135, width: 30, height: 30, borderRadius: 15, background: P.ink }} />
      </div>
      <div style={{ position: "absolute", top: 880, ...type.display, fontSize: 104, color: "#fff", transform: `scale(${spring(t, C.skip + 0.2)})` }}>3 GHANTE BAAD</div>
      {Array.from({ length: pile }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: 120 + ((i * 97) % 760), top: 1080 + ((i * 53) % 220), transform: `rotate(${((i * 37) % 30) - 15}deg)` }}>
          <Frame w={120} phase={i} tint={i % 2 ? "linear-gradient(#CFE8FF, #9CC7F0)" : undefined} />
        </div>
      ))}
    </AbsoluteFill>
  );
};

/** 11. 3 AM, and Claude is still watching. */
const NightInsert: React.FC<{ t: number }> = ({ t }) => {
  const o = life(t, C.night + 0.2, C.shaadi - 0.05);
  if (!o) return null;
  const n = Math.min(23, 9 + Math.floor((t - C.night) * 6));
  return (
    <div style={{ position: "absolute", left: 80, top: 260, opacity: o, display: "flex", gap: 16, alignItems: "flex-start" }}>
      <div style={{ ...cardBox(false), position: "relative", padding: "8px 22px", ...type.display, fontSize: 58, color: P.ink, transform: `scale(${spring(t, C.night + 0.2)})`, transformOrigin: "0 0" }}>🕒 3:00 AM</div>
      <div style={{ ...cardBox(), position: "relative", padding: "12px 20px", ...type.display, fontSize: 34, color: "#fff", opacity: mix(seg(t, C.teen, C.teen + 0.2)) }}>
        Videos dekhe: <span style={{ color: "#C8F169" }}>{n}</span>
      </div>
    </div>
  );
};

/** 12. The wedding video. */
const WeddingInsert: React.FC<{ t: number }> = ({ t }) => {
  const o = life(t, C.shaadi + 0.35, C.phone - 0.05);
  if (!o) return null;
  return (
    <div style={{ ...cardBox(false), left: 80, top: 260, padding: 14, opacity: o, transform: `scale(${spring(t, C.shaadi + 0.35)}) rotate(-4deg)`, transformOrigin: "0 0" }}>
      <Frame w={220} phase={t * 7} groom />
      <div style={{ ...MONO, fontSize: 24, color: P.ink, marginTop: 8 }}>💍 chachu_shaadi.mp4</div>
    </div>
  );
};

/** 13. CTA: comment WATCH, or type WATCH at the link in bio. */
const CtaInsert: React.FC<{ t: number }> = ({ t }) => {
  const o = life(t, C.cta + 0.1, C.end + 1);
  if (!o) return null;
  const word = "WATCH";
  const typed = word.slice(0, Math.floor(seg(t, C.comment - 0.2, C.comment + 0.3) * word.length));
  const posted = t > C.comment + 0.45;
  return (
    <div style={{ position: "absolute", left: 80, top: 250, width: 870, opacity: o }}>
      <div style={{ ...cardBox(false), position: "relative", padding: "16px 22px", display: "flex", alignItems: "center", gap: 16, transform: `scale(${spring(t, C.cta + 0.1)})`, transformOrigin: "0 0" }}>
        <div style={{ width: 54, height: 54, borderRadius: 27, background: "#C8F169", border: `3px solid ${P.ink}` }} />
        <div style={{ flex: 1, ...type.display, fontSize: 44, color: typed ? P.ink : "#9A9A9A" }}>
          {typed || "Add a comment"}
          {!posted && <span style={{ opacity: Math.floor(t * 3) % 2 ? 1 : 0 }}>|</span>}
        </div>
        <div style={{ ...type.display, fontSize: 34, color: posted ? "#28A745" : "#3B82F6" }}>{posted ? "✓ Posted" : "Post"}</div>
      </div>
      <div style={{ ...cardBox(), position: "relative", marginTop: 16, padding: "12px 22px", width: "fit-content", ...type.display, fontSize: 36, color: "#fff", opacity: mix(seg(t, C.comment + 0.5, C.comment + 0.7)) }}>
        ya <span style={{ color: "#C8F169" }}>link in bio</span> pe WATCH type karo
      </div>
    </div>
  );
};

export const Inserts: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", inset: 0, transform: "translateY(110px)" }}>
    <ReelInsert t={t} />
    <LockInsert t={t} />
    <FileInsert t={t} />
    <FramesInsert t={t} />
    <AnalysisInsert t={t} />
    <BeatInsert t={t} />
    <WhoInsert t={t} />
    <CompareInsert t={t} />
    <OneInsert t={t} />
    <NightInsert t={t} />
    <WeddingInsert t={t} />
    <CtaInsert t={t} />
  </div>
);
