import React, { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * 3D toy kit for the desk skits: the Internet Toolbox mascot (middle-part black hair, black hoodie, lime drawstrings,
 * lime headphones round the neck, IT badge), "Claude" as our own small round desk buddy with a spark above its head,
 * the desk, and the room. Everything is built from primitives in code: no downloaded models or textures.
 * All motion comes in through props (driven by useCurrentFrame outside the canvas), never useFrame.
 */

export type V3 = [number, number, number];

export const K = {
  skin: "#E3B08A",
  skinShade: "#C98F69",
  line: "#2B1B13",
  hair: "#1F1714",
  beard: "#4A372D",
  hoodie: "#2C2B28",
  hoodieHi: "#45443F",
  lime: "#C8F169",
  limeDeep: "#9CCB3A",
  iris: "#3A2416",
  mouth: "#5E1F22",
  blush: "#E58F7A",
  claude: "#D97757",
  claudeDark: "#B4583C",
  claudeGlow: "#FFC09A",
  wood: "#9A6644",
  woodDark: "#6B442E",
  wall: "#33466A",
  paper: "#FAF9F6",
  ink: "#171717",
  teal: "#0F5A4F",
  olive: "#58731D",
  gold: "#E8B84A",
  pink: "#E58FA1",
};

const UP = new THREE.Vector3(0, 1, 0);

const rnd = (seed: number) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** A camera setup. The rig writes it during render, so the frame that follows always uses it. */
export type Cam = { pos: V3; look: V3; fov: number };
export const CameraRig: React.FC<{ cam: Cam }> = ({ cam }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  camera.position.set(cam.pos[0], cam.pos[1], cam.pos[2]);
  camera.fov = cam.fov;
  camera.near = 0.1;
  camera.far = 60;
  camera.updateProjectionMatrix();
  camera.lookAt(cam.look[0], cam.look[1], cam.look[2]);
  camera.updateMatrixWorld();
  return null;
};

export const mixCam = (a: Cam, b: Cam, t: number): Cam => ({
  pos: [a.pos[0] + (b.pos[0] - a.pos[0]) * t, a.pos[1] + (b.pos[1] - a.pos[1]) * t, a.pos[2] + (b.pos[2] - a.pos[2]) * t],
  look: [a.look[0] + (b.look[0] - a.look[0]) * t, a.look[1] + (b.look[1] - a.look[1]) * t, a.look[2] + (b.look[2] - a.look[2]) * t],
  fov: a.fov + (b.fov - a.fov) * t,
});

type MatProps = { c: string; flat?: boolean; rough?: number; emissive?: string; ei?: number; opacity?: number };
const Mat: React.FC<MatProps> = ({ c, flat = true, rough = 0.82, emissive, ei = 1, opacity }) => (
  <meshStandardMaterial
    color={c}
    flatShading={flat}
    roughness={rough}
    metalness={0}
    emissive={emissive ?? "#000000"}
    emissiveIntensity={emissive ? ei : 0}
    transparent={opacity !== undefined}
    opacity={opacity ?? 1}
  />
);

type BallProps = MatProps & { p?: V3; s?: V3 | number; r?: V3; detail?: number; smooth?: boolean; shadow?: boolean };
/** A low-poly blob (icosahedron) or a smooth sphere. */
const Ball: React.FC<BallProps> = ({ p = [0, 0, 0], s = 1, r = [0, 0, 0], detail = 1, smooth = false, shadow = true, ...mat }) => (
  <mesh position={p} scale={s} rotation={r} castShadow={shadow} receiveShadow={shadow}>
    {smooth ? <sphereGeometry args={[1, 30, 22]} /> : <icosahedronGeometry args={[1, detail]} />}
    <Mat {...mat} flat={!smooth} />
  </mesh>
);

type BoxProps = MatProps & { p?: V3; s: V3; r?: V3; shadow?: boolean };
const Box: React.FC<BoxProps> = ({ p = [0, 0, 0], s, r = [0, 0, 0], shadow = true, ...mat }) => (
  <mesh position={p} scale={s} rotation={r} castShadow={shadow} receiveShadow={shadow}>
    <boxGeometry args={[1, 1, 1]} />
    <Mat {...mat} />
  </mesh>
);

/** A tapered low-poly tube from a to b. */
export const Limb: React.FC<{ a: V3; b: V3; r?: number; r2?: number; c: string; seg?: number }> = ({ a, b, r = 0.08, r2, c, seg = 7 }) => {
  const va = new THREE.Vector3(a[0], a[1], a[2]);
  const vb = new THREE.Vector3(b[0], b[1], b[2]);
  const dir = vb.clone().sub(va);
  const len = Math.max(0.0001, dir.length());
  const q = new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().normalize());
  const mid = va.clone().add(vb).multiplyScalar(0.5);
  return (
    <mesh position={[mid.x, mid.y, mid.z]} quaternion={q} castShadow receiveShadow>
      <cylinderGeometry args={[r2 ?? r, r, len, seg, 1]} />
      <Mat c={c} />
    </mesh>
  );
};

/** Two-bone arm: where the elbow goes for a shoulder, a hand and a pole direction. */
const elbowOf = (s: V3, h: V3, l1: number, l2: number, pole: V3): V3 => {
  const S = new THREE.Vector3(s[0], s[1], s[2]);
  const H = new THREE.Vector3(h[0], h[1], h[2]);
  const d = H.clone().sub(S);
  const dist = Math.min(d.length(), (l1 + l2) * 0.999);
  const n = d.clone().normalize();
  const a = (l1 * l1 - l2 * l2 + dist * dist) / (2 * dist);
  const hgt = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const P = new THREE.Vector3(pole[0], pole[1], pole[2]);
  const perp = P.sub(n.clone().multiplyScalar(P.dot(n))).normalize();
  const E = S.clone().add(n.clone().multiplyScalar(a)).add(perp.multiplyScalar(hgt));
  return [E.x, E.y, E.z];
};

// ───────────────────────────────────────────── Mascot ─────────────────────────────────────────────

export type MascotPose = {
  /** Head turn (+ = towards screen right), nod (+ = down) and tilt, in radians. */
  yaw?: number;
  pitch?: number;
  roll?: number;
  /** Where the eyes look, -1..1 (x: + = screen right, y: + = up). */
  gaze?: [number, number];
  blink?: number;
  wide?: number;
  /** Brows: lift (-1..1) and tilt (+ = stern, - = worried). */
  brow?: number;
  browTilt?: number;
  /** Mouth: how open (0..1) and how much smile (0..1). */
  mouth?: number;
  smile?: number;
  /** Hand targets in mascot space. L = screen left, R = screen right. Desk top is y = 0. */
  handL?: V3;
  handR?: V3;
  /** Phone: tilt back in radians, or null for no phone. phoneHand picks the hand, phoneYaw turns it round. */
  phone?: number | null;
  phoneHand?: "L" | "R";
  phoneYaw?: number;
  phoneGlow?: number;
  lean?: number;
  turn?: number;
  bob?: number;
};

export const REST_L: V3 = [-0.22, 0.075, 0.62];
export const REST_R: V3 = [0.34, 0.075, 0.5];
export const PHONE_R: V3 = [0.2, 0.44, 0.46];
export const PHONE_L: V3 = [-0.2, 0.5, 0.46];

const Eye: React.FC<{ side: 1 | -1; gaze: [number, number]; blink: number; wide: number }> = ({ side, gaze, blink, wide }) => {
  const open = Math.max(0.07, (1 - blink) * (1 + 0.16 * wide));
  const gx = gaze[0] * 0.034;
  const gy = gaze[1] * 0.034;
  return (
    <group position={[side * 0.178, 0.035, 0.42]} rotation={[0, side * 0.34, 0]}>
      <group scale={[1, open, 1]}>
        <mesh scale={[0.108, 0.13, 0.043]}>
          <sphereGeometry args={[1, 22, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        <mesh position={[gx, gy, 0.029]} scale={[0.068, 0.08, 0.03]}>
          <sphereGeometry args={[1, 18, 12]} />
          <meshStandardMaterial color={K.iris} roughness={0.35} />
        </mesh>
        <mesh position={[gx * 1.12, gy * 1.12, 0.047]} scale={[0.037, 0.045, 0.018]}>
          <sphereGeometry args={[1, 14, 10]} />
          <meshStandardMaterial color="#0E0907" roughness={0.3} />
        </mesh>
        <mesh position={[gx * 1.12 + 0.024, gy * 1.12 + 0.032, 0.062]} scale={0.0155}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshBasicMaterial color="#FFFFFF" toneMapped={false} />
        </mesh>
      </group>
      {/* Upper lid line, as in the drawn mascot. */}
      <mesh position={[0, 0.128 * open + 0.004, 0.022]} rotation={[0, 0, -side * 0.08]} scale={[0.122, 0.011, 0.03]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={K.line} roughness={0.8} />
      </mesh>
    </group>
  );
};

const Stubble: React.FC = () => {
  const dots = useMemo(() => {
    const r = rnd(7);
    const out: V3[] = [];
    let guard = 0;
    while (out.length < 150 && guard++ < 4000) {
      const th = (r() * 2 - 1) * 1.0;
      const y = -0.44 + r() * 0.27;
      const rr = Math.sqrt(Math.max(0, 0.2515 - y * y));
      const x = Math.sin(th) * rr;
      const z = Math.cos(th) * rr;
      if (Math.abs(x) < 0.095 && y > -0.28 && y < -0.185) continue; // keep the mouth clear
      if (Math.abs(th) > 0.5 && y > -0.27) continue; // none high on the cheeks
      out.push([x, y, z]);
    }
    return out;
  }, []);
  return (
    <>
      {dots.map((d, i) => (
        <mesh key={i} position={d} scale={0.0064}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={K.beard} roughness={0.9} />
        </mesh>
      ))}
    </>
  );
};

const Hair: React.FC = () => (
  <group>
    {/* Cap over the top and back, tilted so the hairline sits high on the forehead. */}
    <mesh position={[0, 0.03, -0.035]} rotation={[-0.72, 0, 0]} castShadow>
      <sphereGeometry args={[0.545, 9, 6, 0, Math.PI * 2, 0, 1.5]} />
      <Mat c={K.hair} rough={0.78} />
    </mesh>
    {([1, -1] as const).map((s) => (
      <group key={s}>
        {/* Volume each side of the middle part. */}
        <Ball p={[s * 0.215, 0.46, 0.02]} s={[0.26, 0.16, 0.31]} r={[0.1, 0, -s * 0.3]} c={K.hair} rough={0.78} />
        {/* Curtain: from the part down across the corner of the forehead. */}
        <Ball p={[s * 0.26, 0.365, 0.27]} s={[0.105, 0.26, 0.125]} r={[-0.45, s * 0.5, s * 0.96]} c={K.hair} rough={0.78} />
        {/* Curtain tip beside the eye. */}
        <mesh position={[s * 0.475, 0.07, 0.2]} rotation={[0.1, 0, Math.PI + s * 0.12]} castShadow>
          <coneGeometry args={[0.085, 0.3, 5]} />
          <Mat c={K.hair} rough={0.78} />
        </mesh>
        {/* Side hair over the ear. */}
        <Ball p={[s * 0.5, 0.1, -0.02]} s={[0.11, 0.3, 0.27]} r={[0, 0, s * 0.08]} c={K.hair} rough={0.78} />
        <mesh position={[s * 0.52, -0.2, 0.02]} rotation={[0, 0, Math.PI - s * 0.05]} castShadow>
          <coneGeometry args={[0.075, 0.24, 5]} />
          <Mat c={K.hair} rough={0.78} />
        </mesh>
      </group>
    ))}
    {/* Two loose strands at the part. */}
    <mesh position={[0.05, 0.6, 0.02]} rotation={[0.2, 0, -0.5]}>
      <coneGeometry args={[0.03, 0.16, 4]} />
      <Mat c={K.hair} rough={0.78} />
    </mesh>
    <mesh position={[-0.07, 0.59, -0.04]} rotation={[-0.2, 0, 0.6]}>
      <coneGeometry args={[0.028, 0.13, 4]} />
      <Mat c={K.hair} rough={0.78} />
    </mesh>
  </group>
);

const Head: React.FC<Required<Pick<MascotPose, "gaze" | "blink" | "wide" | "brow" | "browTilt" | "mouth" | "smile">>> = ({ gaze, blink, wide, brow, browTilt, mouth, smile }) => {
  const talk = mouth > 0.06;
  return (
    <group>
      <mesh castShadow receiveShadow scale={[1, 0.97, 0.98]}>
        <sphereGeometry args={[0.5, 40, 30]} />
        <meshStandardMaterial color={K.skin} roughness={0.62} />
      </mesh>
      {/* Ears */}
      <Ball p={[0.49, -0.02, 0]} s={[0.05, 0.09, 0.07]} c={K.skin} smooth />
      <Ball p={[-0.49, -0.02, 0]} s={[0.05, 0.09, 0.07]} c={K.skin} smooth />
      <Eye side={1} gaze={gaze} blink={blink} wide={wide} />
      <Eye side={-1} gaze={gaze} blink={blink} wide={wide} />
      {([1, -1] as const).map((s) => (
        <mesh key={s} position={[s * 0.182, 0.225 + brow * 0.035, 0.44]} rotation={[-0.2, s * 0.34, s * (-0.13 + browTilt * 0.42)]} scale={[0.175, 0.042, 0.04]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={K.hair} roughness={0.7} />
        </mesh>
      ))}
      {/* Nose */}
      <Ball p={[0, -0.07, 0.49]} s={[0.05, 0.042, 0.042]} c={K.skinShade} smooth shadow={false} />
      {/* Cheeks */}
      {([1, -1] as const).map((s) => (
        <mesh key={s} position={[s * 0.315, -0.135, 0.365]} rotation={[0, s * 0.72, 0]} scale={[0.078, 0.05, 0.012]}>
          <sphereGeometry args={[1, 14, 10]} />
          <meshStandardMaterial color={K.blush} transparent opacity={0.55} roughness={0.9} />
        </mesh>
      ))}
      {/* Mouth: open oval while talking, a curved smile otherwise. */}
      <group position={[0, -0.232, 0.442]} rotation={[0.42, 0, 0]}>
        {talk || smile < 0.25 ? (
          <mesh scale={[0.062 + 0.02 * smile - 0.012 * mouth, 0.012 + 0.058 * mouth, 0.02]}>
            <sphereGeometry args={[1, 16, 12]} />
            <meshStandardMaterial color={K.mouth} roughness={0.6} />
          </mesh>
        ) : (
          <mesh position={[0, 0.045, 0]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.07 + 0.012 * smile, 0.0115, 6, 14, Math.PI]} />
            <meshStandardMaterial color={K.line} roughness={0.7} />
          </mesh>
        )}
      </group>
      {/* Beard shadow under the stubble dots. */}
      <mesh rotation={[-0.4, 0, 0]}>
        <sphereGeometry args={[0.5015, 32, 10, 0, Math.PI * 2, 2.02, 1.13]} />
        <meshStandardMaterial color={K.skinShade} transparent opacity={0.5} roughness={0.85} />
      </mesh>
      <Stubble />
      <Hair />
    </group>
  );
};

const Phone: React.FC<{ glow: number }> = ({ glow }) => (
  <group>
    <Box s={[0.19, 0.37, 0.022]} c={K.lime} rough={0.5} />
    {/* Camera bump on the back (the side the viewer sees). */}
    <Box p={[-0.045, 0.115, 0.014]} s={[0.065, 0.085, 0.012]} c={K.ink} rough={0.4} />
    {/* Screen, facing the mascot. */}
    <mesh position={[0, 0, -0.0125]} rotation={[0, Math.PI, 0]}>
      <planeGeometry args={[0.17, 0.35]} />
      <meshStandardMaterial color="#10131A" emissive="#CFE3FF" emissiveIntensity={0.9 * glow} roughness={0.3} />
    </mesh>
  </group>
);

export const Mascot3D: React.FC<{ pos?: V3; pose?: MascotPose }> = ({ pos = [0, 0, 0], pose = {} }) => {
  const {
    yaw = 0,
    pitch = 0,
    roll = 0,
    gaze = [0, 0],
    blink = 0,
    wide = 0,
    brow = 0,
    browTilt = 0,
    mouth = 0,
    smile = 0.6,
    handL = REST_L,
    handR = REST_R,
    phone = null,
    phoneHand = "R",
    phoneYaw = 0,
    phoneGlow = 1,
    lean = 0,
    turn = 0,
    bob = 0,
  } = pose;
  const sL: V3 = [-0.4, 0.66, 0.03];
  const sR: V3 = [0.4, 0.66, 0.03];
  const L1 = 0.4;
  const L2 = 0.38;
  const eL = elbowOf(sL, handL, L1, L2, [-0.75, -0.6, -0.25]);
  const eR = elbowOf(sR, handR, L1, L2, [0.75, -0.6, -0.25]);
  const ph = phoneHand === "L" ? handL : handR;
  return (
    <group position={[pos[0], pos[1] + bob, pos[2]]} rotation={[0, turn, 0]}>
      <group rotation={[lean, 0, 0]}>
        {/* Hoodie body */}
        <mesh position={[0, 0.315, 0]} scale={[1, 1, 0.74]} castShadow receiveShadow>
          <cylinderGeometry args={[0.34, 0.5, 0.93, 9, 2]} />
          <Mat c={K.hoodie} rough={0.9} />
        </mesh>
        <Ball p={[0.36, 0.69, 0]} s={0.19} c={K.hoodie} rough={0.9} />
        <Ball p={[-0.36, 0.69, 0]} s={0.19} c={K.hoodie} rough={0.9} />
        {/* Hood and collar */}
        <Ball p={[0, 0.85, -0.2]} s={[0.4, 0.2, 0.25]} c={K.hoodie} rough={0.9} />
        <mesh position={[0, 0.82, 0.03]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.2, 0.075, 6, 12]} />
          <Mat c={K.hoodieHi} rough={0.9} />
        </mesh>
        {/* Lime drawstrings */}
        {([1, -1] as const).map((s) => (
          <group key={s} position={[s * 0.078, 0.6, 0.283]} rotation={[-0.13, 0, s * 0.04]}>
            <mesh>
              <cylinderGeometry args={[0.013, 0.013, 0.27, 6]} />
              <Mat c={K.lime} rough={0.6} emissive={K.lime} ei={0.12} />
            </mesh>
            <Ball p={[0, -0.15, 0]} s={0.022} c={K.lime} emissive={K.lime} ei={0.12} />
          </group>
        ))}
        {/* IT badge */}
        <group position={[0, 0.24, 0.333]} rotation={[-0.13, 0, 0]}>
          <Box s={[0.2, 0.2, 0.026]} c={K.lime} rough={0.55} emissive={K.lime} ei={0.1} />
          <Box p={[-0.04, 0, 0.016]} s={[0.022, 0.09, 0.006]} c={K.ink} />
          <Box p={[-0.04, 0.045, 0.016]} s={[0.058, 0.02, 0.006]} c={K.ink} />
          <Box p={[-0.04, -0.045, 0.016]} s={[0.058, 0.02, 0.006]} c={K.ink} />
          <Box p={[0.042, 0, 0.016]} s={[0.022, 0.09, 0.006]} c={K.ink} />
          <Box p={[0.042, 0.045, 0.016]} s={[0.07, 0.02, 0.006]} c={K.ink} />
        </group>
        {/* Lime headphones round the neck: band behind, a cup on each side. */}
        <mesh position={[0, 0.865, -0.01]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.285, 0.036, 6, 16, Math.PI]} />
          <Mat c={K.lime} rough={0.5} emissive={K.lime} ei={0.1} />
        </mesh>
        {([1, -1] as const).map((s) => (
          <group key={s} position={[s * 0.29, 0.765, 0.19]} rotation={[-0.22, s * 0.5, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.125, 0.125, 0.075, 16]} />
              <Mat c={K.lime} rough={0.5} emissive={K.lime} ei={0.1} />
            </mesh>
            <mesh position={[0, 0, 0.0395]}>
              <circleGeometry args={[0.082, 16]} />
              <Mat c={K.limeDeep} rough={0.6} />
            </mesh>
            <mesh position={[0, 0, -0.052]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.11, 0.11, 0.03, 16]} />
              <Mat c={K.ink} rough={0.8} />
            </mesh>
          </group>
        ))}
        {/* Neck and head */}
        <mesh position={[0, 0.86, 0.01]}>
          <cylinderGeometry args={[0.14, 0.15, 0.2, 10]} />
          <meshStandardMaterial color={K.skinShade} roughness={0.7} />
        </mesh>
        <group position={[0, 0.9, 0]} rotation={[pitch, yaw, roll]}>
          <group position={[0, 0.45, 0.02]}>
            <Head gaze={gaze} blink={blink} wide={wide} brow={brow} browTilt={browTilt} mouth={mouth} smile={smile} />
          </group>
        </group>
      </group>
      {/* Arms (not leaned with the body, so hands stay where the pose puts them). */}
      <Limb a={sL} b={eL} r={0.105} r2={0.092} c={K.hoodie} />
      <Limb a={eL} b={handL} r={0.092} r2={0.08} c={K.hoodie} />
      <Ball p={eL} s={0.095} c={K.hoodie} />
      <Ball p={handL} s={0.092} c={K.skin} smooth />
      <Limb a={sR} b={eR} r={0.105} r2={0.092} c={K.hoodie} />
      <Limb a={eR} b={handR} r={0.092} r2={0.08} c={K.hoodie} />
      <Ball p={eR} s={0.095} c={K.hoodie} />
      <Ball p={handR} s={0.092} c={K.skin} smooth />
      {phone !== null && (
        <group position={[ph[0] + (phoneHand === "L" ? 0.03 : -0.03), ph[1] + 0.13, ph[2] + 0.04]} rotation={[phone, phoneYaw + (phoneHand === "L" ? 0.12 : -0.12), phoneHand === "L" ? -0.06 : 0.06]}>
          <Phone glow={phoneGlow} />
          <pointLight position={[0, 0.05, -0.25]} color="#CFE3FF" intensity={0.55 * phoneGlow} distance={1.5} decay={1.4} />
        </group>
      )}
    </group>
  );
};

// ───────────────────────────────────────────── Claude buddy ─────────────────────────────────────────────

export type BuddyPose = {
  yaw?: number;
  tilt?: number;
  /** 1 = normal, <1 squashed, >1 stretched. */
  stretch?: number;
  hop?: number;
  /** Eye openness 0..1.3 and gaze. */
  eye?: number;
  gaze?: [number, number];
  /** 0 neutral, 1 happy (eyes curve into arcs), -1 sad. */
  mood?: number;
  /** Mouth bar on the visor, 0..1 (driven by the voice). */
  mouth?: number;
  /** Spark above the head: 0 dim, 1 lit. */
  spark?: number;
  spin?: number;
};

/**
 * "Claude" as our own desk buddy: a terracotta gumdrop with a dark visor, lime eyes and a spark that floats
 * above its head. Sits on a lime coaster.
 */
export const Buddy3D: React.FC<{ pos?: V3; pose?: BuddyPose }> = ({ pos = [0, 0, 0], pose = {} }) => {
  const { yaw = 0, tilt = 0, stretch = 1, hop = 0, eye = 1, gaze = [0, 0], mood = 0, mouth = 0, spark = 0, spin = 0 } = pose;
  const R = 0.25;
  const wide = 1 / Math.sqrt(stretch);
  const sparkCol = new THREE.Color(K.claude).lerp(new THREE.Color("#FFD9BF"), spark);
  const happy = Math.max(0, mood);
  const sad = Math.max(0, -mood);
  return (
    <group position={[pos[0], pos[1], pos[2]]} scale={1.15}>
      {/* Lime coaster */}
      <mesh position={[0, 0.018, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.3, 0.32, 0.036, 20]} />
        <Mat c={K.lime} rough={0.6} />
      </mesh>
      <group position={[0, 0.036 + hop, 0]} rotation={[0, yaw, tilt]}>
        <group scale={[wide, stretch, wide]}>
          {/* Gumdrop body: a low-poly dome whose base sinks into the coaster. */}
          <mesh position={[0, 0.2, 0]} scale={[R, R * 1.05, R]} castShadow receiveShadow>
            <icosahedronGeometry args={[1, 2]} />
            <Mat c={K.claude} rough={0.7} />
          </mesh>
          {/* Dark visor */}
          <mesh position={[0, 0.236, 0.172]} rotation={[-0.1, 0, 0]} scale={[0.178, 0.09, 0.094]}>
            <sphereGeometry args={[1, 26, 18]} />
            <meshStandardMaterial color="#1B1D22" roughness={0.22} />
          </mesh>
          {/* Lime eyes: tall ovals, arcs when happy, tilted when sad */}
          {([1, -1] as const).map((s) => (
            <mesh
              key={s}
              position={[s * 0.068 + gaze[0] * 0.014, 0.25 + gaze[1] * 0.01 + happy * 0.006, 0.262 - Math.abs(gaze[0]) * 0.004]}
              rotation={[-0.1, s * 0.22, s * (0.5 * happy - 0.35 * sad)]}
              scale={[0.024 + 0.008 * happy, Math.max(0.006, 0.038 * eye * (1 - 0.62 * happy)), 0.008]}
            >
              <sphereGeometry args={[1, 14, 10]} />
              <meshStandardMaterial color={K.lime} emissive={K.lime} emissiveIntensity={1.5} roughness={0.4} />
            </mesh>
          ))}
          {/* Mouth bar */}
          <mesh position={[0, 0.193, 0.264]} rotation={[-0.1, 0, 0]} scale={[0.02 + 0.006 * mouth, 0.005 + 0.02 * mouth, 0.007]}>
            <sphereGeometry args={[1, 12, 8]} />
            <meshStandardMaterial color={K.lime} emissive={K.lime} emissiveIntensity={1.2} roughness={0.4} />
          </mesh>
        </group>
        {/* Spark floating above the head */}
        <group position={[0, 0.2 + R * 1.05 * stretch + 0.17, 0]} rotation={[0, 0, spin]} scale={0.9 + 0.2 * spark}>
          {Array.from({ length: 8 }, (_, k) => {
            const a = (k / 8) * Math.PI * 2;
            const len = k % 2 === 0 ? 0.1 : 0.072;
            const off = 0.03 + len / 2;
            return (
              <mesh key={k} position={[Math.sin(a) * off, Math.cos(a) * off, 0]} rotation={[0, 0, -a]} scale={[0.034, len, 0.034]} castShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={sparkCol} emissive={K.claudeGlow} emissiveIntensity={0.1 + spark * 1.05} roughness={0.5} flatShading />
              </mesh>
            );
          })}
          <pointLight color="#FFB48A" intensity={spark * 0.6} distance={1.6} decay={1.4} />
        </group>
      </group>
    </group>
  );
};

// ───────────────────────────────────────────── Desk and room ─────────────────────────────────────────────

/** Lights shared by both layers, so the blurred room and the sharp desk agree. */
export const Lights: React.FC<{ shadows?: boolean; warm?: number }> = ({ shadows = true, warm = 1 }) => (
  <>
    <hemisphereLight args={["#A3B4EE", "#4A342A", 1.1]} />
    {/* Key: warm, from the front left. */}
    <directionalLight
      position={[-2.2, 3.4, 3.6]}
      color="#FFDDB8"
      intensity={2.2 * warm}
      castShadow={shadows}
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-left={-3}
      shadow-camera-right={3}
      shadow-camera-top={3.5}
      shadow-camera-bottom={-2}
      shadow-camera-near={0.5}
      shadow-camera-far={14}
      shadow-bias={-0.0006}
      shadow-normalBias={0.02}
    />
    {/* Lime rim from the neon sign, behind on the left. */}
    <directionalLight position={[-2.8, 2.4, -3.0]} color={K.lime} intensity={1.25} />
    {/* Warm rim from behind on the right. */}
    <directionalLight position={[3.0, 2.0, -2.6]} color="#FF9E7A" intensity={1.3} />
    {/* Cool fill from the front right. */}
    <directionalLight position={[2.8, 1.0, 3.2]} color="#A9BCFF" intensity={0.5} />
  </>
);

/** The desk riser Claude sits on: where it stands and how high its top is. */
export const RISER: V3 = [-0.48, 0, -0.45];
export const RISER_TOP = 0.42;
const RISER_WOOD = "#C08A5C";

export const DeskSet: React.FC = () => (
  <group>
    {/* Desk top and front */}
    <Box p={[0, -0.06, -0.2]} s={[5.2, 0.12, 1.75]} c={K.wood} rough={0.75} />
    <Box p={[0, -0.82, 0.62]} s={[5.2, 1.4, 0.1]} c={K.woodDark} rough={0.85} />
    {/* Riser, with the closed laptop tucked under it */}
    <group position={RISER}>
      <Box p={[0, RISER_TOP - 0.025, 0]} s={[0.72, 0.05, 0.5]} c={RISER_WOOD} rough={0.7} />
      <Box p={[0.33, (RISER_TOP - 0.05) / 2, 0]} s={[0.05, RISER_TOP - 0.05, 0.46]} c={RISER_WOOD} rough={0.7} />
      <Box p={[-0.33, (RISER_TOP - 0.05) / 2, 0]} s={[0.05, RISER_TOP - 0.05, 0.46]} c={RISER_WOOD} rough={0.7} />
      <Box p={[0, 0.02, 0.03]} s={[0.52, 0.035, 0.36]} c="#3A3D45" rough={0.5} />
      <Box p={[0.14, 0.04, 0.1]} s={[0.1, 0.004, 0.1]} c={K.lime} shadow={false} />
    </group>
    {/* Mug */}
    <group position={[-0.5, 0, 0.28]}>
      <mesh position={[0, 0.09, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.09, 0.078, 0.18, 12]} />
        <Mat c={K.paper} rough={0.5} />
      </mesh>
      <mesh position={[-0.1, 0.09, 0]} castShadow>
        <torusGeometry args={[0.05, 0.016, 6, 10]} />
        <Mat c={K.paper} rough={0.5} />
      </mesh>
      <mesh position={[0, 0.176, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.078, 12]} />
        <Mat c="#6B3E26" rough={0.4} />
      </mesh>
    </group>
    {/* Sticky notes */}
    <Box p={[0.12, 0.004, 0.4]} s={[0.17, 0.006, 0.17]} r={[0, 0.25, 0]} c={K.lime} shadow={false} />
    <Box p={[0.52, 0.004, 0.5]} s={[0.15, 0.006, 0.15]} r={[0, -0.3, 0]} c={K.gold} shadow={false} />
    {/* Small plant behind the mascot's shoulder */}
    <group position={[1.02, 0, -0.5]}>
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.13, 0.1, 0.2, 8]} />
        <Mat c={K.teal} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <mesh key={k} position={[Math.sin(k * 1.05) * 0.08, 0.36 + (k % 2) * 0.05, Math.cos(k * 1.05) * 0.08]} rotation={[Math.cos(k * 1.05) * 0.5, 0, -Math.sin(k * 1.05) * 0.5]} castShadow>
          <coneGeometry args={[0.055, 0.36, 4]} />
          <Mat c={K.olive} />
        </mesh>
      ))}
    </group>
  </group>
);

const Neon: React.FC<{ p: V3; s: V3; neon?: number }> = ({ p, s, neon = 1 }) => (
  <mesh position={p} scale={s}>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color={K.lime} emissive={K.lime} emissiveIntensity={2.6 * neon} roughness={0.4} />
  </mesh>
);

/** The wall behind: neon IT sign, shelves, fairy lights. Rendered on its own layer and blurred. */
export const RoomSet: React.FC<{ neon?: number }> = ({ neon = 1 }) => {
  const bulbs = useMemo(() => Array.from({ length: 17 }, (_, i) => i / 16), []);
  return (
    <group>
      <mesh position={[0, 1.6, -2.9]} receiveShadow>
        <planeGeometry args={[16, 10]} />
        <meshStandardMaterial color={K.wall} roughness={0.95} />
      </mesh>
      {/* Neon IT badge */}
      <group position={[-0.8, 1.6, -2.82]}>
        <Neon neon={neon} p={[0, 0.36, 0]} s={[0.78, 0.06, 0.05]} />
        <Neon neon={neon} p={[0, -0.36, 0]} s={[0.78, 0.06, 0.05]} />
        <Neon neon={neon} p={[0.36, 0, 0]} s={[0.06, 0.78, 0.05]} />
        <Neon neon={neon} p={[-0.36, 0, 0]} s={[0.06, 0.78, 0.05]} />
        <Neon neon={neon} p={[-0.14, 0, 0]} s={[0.065, 0.36, 0.05]} />
        <Neon neon={neon} p={[-0.14, 0.18, 0]} s={[0.19, 0.06, 0.05]} />
        <Neon neon={neon} p={[-0.14, -0.18, 0]} s={[0.19, 0.06, 0.05]} />
        <Neon neon={neon} p={[0.15, 0, 0]} s={[0.065, 0.36, 0.05]} />
        <Neon neon={neon} p={[0.15, 0.18, 0]} s={[0.24, 0.06, 0.05]} />
        <pointLight position={[0, 0, 0.5]} color={K.lime} intensity={3.2 * neon} distance={3.4} decay={1.5} />
      </group>
      {/* Shelf with books and a pot */}
      <group position={[1.15, 2.15, -2.72]}>
        <Box s={[1.35, 0.06, 0.34]} c={K.woodDark} />
        <Box p={[-0.5, 0.2, 0]} s={[0.09, 0.34, 0.24]} c={K.gold} />
        <Box p={[-0.4, 0.22, 0]} s={[0.08, 0.38, 0.24]} c={K.paper} />
        <Box p={[-0.3, 0.18, 0]} s={[0.1, 0.3, 0.24]} c={K.claude} />
        <Box p={[-0.17, 0.2, 0]} s={[0.08, 0.34, 0.24]} r={[0, 0, -0.18]} c={K.teal} />
        <mesh position={[0.36, 0.13, 0]}>
          <cylinderGeometry args={[0.12, 0.09, 0.2, 8]} />
          <Mat c={K.paper} />
        </mesh>
        <Ball p={[0.36, 0.36, 0]} s={[0.2, 0.19, 0.2]} c={K.olive} />
      </group>
      {/* A lower shelf on the left, behind Claude */}
      <group position={[-1.75, 0.72, -2.72]}>
        <Box s={[1.1, 0.06, 0.34]} c={K.woodDark} />
        <Box p={[-0.3, 0.19, 0]} s={[0.09, 0.32, 0.24]} c={K.pink} />
        <Box p={[-0.2, 0.21, 0]} s={[0.08, 0.36, 0.24]} c={K.lime} />
        <Box p={[-0.1, 0.17, 0]} s={[0.09, 0.28, 0.24]} c={K.paper} />
        <Ball p={[0.3, 0.2, 0]} s={0.17} c={K.gold} />
      </group>
      {/* Fairy lights */}
      {bulbs.map((t, i) => (
        <mesh key={i} position={[-2.4 + t * 4.8, 2.82 - Math.sin(t * Math.PI) * 0.3 + (i % 2) * 0.03, -2.78]} scale={0.05}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color="#FFE7B8" emissive="#FFC978" emissiveIntensity={3.2} />
        </mesh>
      ))}
    </group>
  );
};
