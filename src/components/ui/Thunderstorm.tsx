"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface ThunderstormProps {
  /** Number of rain streaks on screen (split across far / mid / near depth layers) */
  rainIntensity?: number;
  /** How often storms strike on their own (0 = click only, 1 = frequent) */
  lightningFrequency?: number;
  /** Wind tilt angle in degrees (-35 to 35). Gusts add a little variation on top. */
  windAngle?: number;
  /** Lightning glow color in hex (the channel core is always white-hot) */
  boltColor?: string;
  /** Strength of the light thrown onto clouds, rain and sky (0 to 1, 0.6 is neutral) */
  flashIntensity?: number;
  /** Optional foreground content */
  children?: React.ReactNode;
  /** Additional container classes */
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*  Small helpers                                                             */
/* -------------------------------------------------------------------------- */

type RGB = { r: number; g: number; b: number };

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
const smooth = (t: number) => t * t * (3 - 2 * t);
const smoothstep = (e0: number, e1: number, x: number) =>
  smooth(clamp((x - e0) / (e1 - e0), 0, 1));

function hexToRgb(hex: string): RGB {
  const clean = hex.replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean
        .split("")
        .map((c) => c + c)
        .join("")
      : clean;
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return { r: 224, g: 242, b: 254 };
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function makeCanvas(w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.ceil(w));
  canvas.height = Math.max(1, Math.ceil(h));
  const ctx = canvas.getContext("2d")!;
  return { canvas, ctx };
}

/* -------------------------------------------------------------------------- */
/*  Horizontally tileable fractal noise (used to paint the cloud decks)       */
/* -------------------------------------------------------------------------- */

function hash2(x: number, y: number, seed: number) {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function vnoise(x: number, y: number, period: number, seed: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = smooth(x - xi);
  const yf = smooth(y - yi);
  const x0 = ((xi % period) + period) % period;
  const x1 = (x0 + 1) % period;
  const a = hash2(x0, yi, seed);
  const b = hash2(x1, yi, seed);
  const c = hash2(x0, yi + 1, seed);
  const d = hash2(x1, yi + 1, seed);
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
}

function fbm(
  u: number,
  v: number,
  cellsX: number,
  cellsY: number,
  octaves: number,
  seed: number
) {
  let amp = 0.5;
  let sum = 0;
  let norm = 0;
  let fx = cellsX;
  let fy = cellsY;
  for (let o = 0; o < octaves; o++) {
    sum += amp * vnoise(u * fx, v * fy, fx, seed + o * 31);
    norm += amp;
    amp *= 0.52;
    fx *= 2;
    fy *= 2;
  }
  return sum / norm;
}

/**
 * Bakes one seamless cloud deck. Returns a dark "resting" version and a bright
 * "lit" version with identical alpha, so lightning can light the clouds from inside.
 */
function buildCloudTile(
  w: number,
  h: number,
  cellsX: number,
  cellsY: number,
  seed: number,
  coverage: number,
  bodyLum: number
) {
  const base = makeCanvas(w, h);
  const lit = makeCanvas(w, h);
  const bi = base.ctx.createImageData(w, h);
  const li = lit.ctx.createImageData(w, h);
  const bd = bi.data;
  const ld = li.data;
  const OCT = 4;

  for (let y = 0; y < h; y++) {
    const v = y / h;
    // Dense at the top, ragged and broken toward the underside
    const env = 1 - smooth(clamp((v - 0.3) / 0.7, 0, 1));
    for (let x = 0; x < w; x++) {
      const u = x / w;
      const n = fbm(u, v, cellsX, cellsY, OCT, seed);
      const dens = n + (env - 0.5) * 0.6;
      const a = smoothstep(coverage, coverage + 0.2, dens);
      if (a < 0.004) continue;

      // Cheap directional shading: surfaces facing up catch more light
      const n2 = fbm(u, v + 3 / h, cellsX, cellsY, OCT, seed);
      const shade = clamp(0.5 + (n2 - n) * 14, 0, 1) * (0.55 + 0.45 * env);

      const i = (y * w + x) * 4;
      const L = bodyLum + 0.17 * shade;
      bd[i] = L * 0.78 * 255;
      bd[i + 1] = L * 0.9 * 255;
      bd[i + 2] = L * 1.2 * 255;
      bd[i + 3] = a * 235;

      const L2 = 0.38 + 0.62 * shade;
      ld[i] = L2 * 235;
      ld[i + 1] = L2 * 242;
      ld[i + 2] = L2 * 255;
      ld[i + 3] = a * 235;
    }
  }
  base.ctx.putImageData(bi, 0, 0);
  lit.ctx.putImageData(li, 0, 0);
  return { base: base.canvas, lit: lit.canvas };
}

/* -------------------------------------------------------------------------- */
/*  Lightning                                                                 */
/* -------------------------------------------------------------------------- */

interface Pulse {
  t: number; // ms after bolt start
  amp: number;
  tau: number; // decay time constant in ms
}

interface Sprite {
  glow: HTMLCanvasElement;
  core: HTMLCanvasElement;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Bolt {
  sprite: Sprite | null; // null = diffuse sheet lightning inside the clouds
  cx: number;
  cy: number;
  impactX: number;
  impactY: number;
  t: number; // ms
  dur: number;
  leader: number; // ms before the bright return stroke
  pulses: Pulse[];
  energy: number;
  glow: number; // smoothed light output
  I: number; // instantaneous intensity this frame
}

const TIER_WIDTHS = [3.4, 2.7, 2.1, 1.4, 0.8];

/**
 * Builds a tortuous main channel (momentum-based random walk pulled toward the
 * ground), downward-curving branches, sub-branches and a few horizontal cloud
 * crawlers, then bakes it once into two sprites (glow + white-hot core).
 */
function bakeBolt(
  ox: number,
  oy: number,
  tx: number,
  ty: number,
  rgb: RGB,
  dpr: number
) {
  const tiers: number[][] = [[], [], [], [], []];
  let segCount = 0;
  const push = (tier: number, x1: number, y1: number, x2: number, y2: number) => {
    tiers[tier].push(x1, y1, x2, y2);
    segCount++;
  };

  // Main channel
  const pts: Array<[number, number]> = [[ox, oy]];
  let x = ox;
  let y = oy;
  let slope = 0;
  while (y < ty) {
    const step = rand(6, 15);
    const remain = Math.max(ty - y, 12);
    slope =
      slope * 0.6 + (Math.random() - 0.5) * 1.3 + ((tx - x) / remain) * 0.28;
    if (Math.random() < 0.05) slope += (Math.random() - 0.5) * 2.6; // sudden kink
    slope = clamp(slope, -1.6, 1.6);
    x += slope * step;
    y = Math.min(ty, y + step);
    pts.push([x, y]);
  }

  const n = pts.length;
  for (let i = 1; i < n; i++) {
    const f = i / n;
    const tier = f < 0.34 ? 0 : f < 0.68 ? 1 : 2;
    push(tier, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]);
  }

  // Angle is measured from straight down; positive leans toward +x
  const grow = (sx: number, sy: number, ang: number, len: number, tier: number) => {
    let bx = sx;
    let by = sy;
    let a = ang;
    let walked = 0;
    while (walked < len && by < ty + 6 && segCount < 1400) {
      const step = rand(5, 11);
      a += (Math.random() - 0.5) * 0.6;
      a *= tier === 3 && Math.abs(a) > 1 ? 0.93 : 0.985; // crawlers bend downward
      const nx = bx + Math.sin(a) * step;
      const ny = by + Math.cos(a) * step;
      push(tier, bx, by, nx, ny);
      if (tier === 3 && walked > 18 && Math.random() < 0.06) {
        grow(
          nx,
          ny,
          a + (Math.random() < 0.5 ? -1 : 1) * rand(0.35, 0.85),
          (len - walked) * rand(0.35, 0.65),
          4
        );
      }
      bx = nx;
      by = ny;
      walked += step;
    }
  };

  for (let i = 3; i < n - 4; i++) {
    if (Math.random() < 0.1 * (1 - (i / n) * 0.5)) {
      const side = Math.random() < 0.5 ? -1 : 1;
      grow(
        pts[i][0],
        pts[i][1],
        side * rand(0.2, 0.9),
        rand(50, 210) * (1 - (i / n) * 0.5),
        3
      );
    }
  }

  // Near-horizontal crawlers inside the cloud base
  const crawlers = Math.random() < 0.6 ? (Math.random() < 0.5 ? 1 : 2) : 0;
  for (let c = 0; c < crawlers; c++) {
    const i = Math.floor(rand(0, Math.min(5, n - 1)));
    grow(
      pts[i][0],
      pts[i][1],
      (Math.random() < 0.5 ? -1 : 1) * rand(1.15, 1.45),
      rand(90, 260),
      3
    );
  }

  // Bounds
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const arr of tiers) {
    for (let i = 0; i < arr.length; i += 2) {
      minX = Math.min(minX, arr[i]);
      maxX = Math.max(maxX, arr[i]);
      minY = Math.min(minY, arr[i + 1]);
      maxY = Math.max(maxY, arr[i + 1]);
    }
  }
  const pad = 70;
  const bx0 = Math.floor(minX - pad);
  const by0 = Math.floor(minY - pad);
  const bw = Math.ceil(maxX - minX + pad * 2);
  const bh = Math.ceil(maxY - minY + pad * 2);

  const prep = () => {
    const { canvas, ctx } = makeCanvas(bw * dpr, bh * dpr);
    ctx.scale(dpr, dpr);
    ctx.translate(-bx0, -by0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    return { canvas, ctx };
  };

  const strokeTier = (
    g: CanvasRenderingContext2D,
    arr: number[],
    width: number,
    style: string
  ) => {
    if (!arr.length) return;
    g.beginPath();
    for (let i = 0; i < arr.length; i += 4) {
      g.moveTo(arr[i], arr[i + 1]);
      g.lineTo(arr[i + 2], arr[i + 3]);
    }
    g.lineWidth = width;
    g.strokeStyle = style;
    g.stroke();
  };

  const glow = prep();
  glow.ctx.globalCompositeOperation = "lighter";
  const col = (a: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
  tiers.forEach((arr, t) => {
    const w = TIER_WIDTHS[t];
    strokeTier(glow.ctx, arr, w * 12, col(0.06));
    strokeTier(glow.ctx, arr, w * 5.5, col(0.14));
    strokeTier(glow.ctx, arr, w * 2.4, col(0.38));
  });

  const core = prep();
  tiers.forEach((arr, t) => {
    const w = TIER_WIDTHS[t];
    strokeTier(core.ctx, arr, w * 1.9, col(0.7));
    strokeTier(core.ctx, arr, w * 0.9, "rgba(255,255,255,1)");
  });

  return {
    sprite: {
      glow: glow.canvas,
      core: core.canvas,
      x: bx0,
      y: by0,
      w: bw,
      h: bh,
    } as Sprite,
    impactX: pts[n - 1][0],
  };
}

/* -------------------------------------------------------------------------- */
/*  Rain, splashes, horizon                                                   */
/* -------------------------------------------------------------------------- */

interface Drop {
  x: number;
  y: number;
  speed: number;
  len: number;
  landY: number;
}
interface Ripple {
  x: number;
  y: number;
  age: number;
  life: number;
  maxR: number;
}
interface Droplet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
}

const RAIN_LAYERS = [
  { share: 0.5, alpha: 0.11, width: 0.6, speed: [620, 820], len: [10, 16] },
  { share: 0.32, alpha: 0.2, width: 0.9, speed: [900, 1150], len: [16, 26] },
  { share: 0.18, alpha: 0.34, width: 1.3, speed: [1250, 1650], len: [26, 42] },
];

/** Pre-renders a treeline silhouette so the storm has a horizon to sit on. */
function bakeHorizon(w: number, h: number, dpr: number, gy: number) {
  const { canvas, ctx } = makeCanvas(w * dpr, h * dpr);
  ctx.scale(dpr, dpr);

  // Low rolling hills
  ctx.fillStyle = "#060a13";
  ctx.beginPath();
  ctx.moveTo(0, gy + 4);
  for (let x = 0; x <= w; x += 6) {
    const hill = 14 + 30 * vnoise(x / 220, 3.3, 100000, 5);
    ctx.lineTo(x, gy - hill);
  }
  ctx.lineTo(w, gy + 4);
  ctx.closePath();
  ctx.fill();

  const conifer = (cx: number, baseY: number, th: number, tw: number) => {
    for (let lv = 0; lv < 3; lv++) {
      const yb = baseY - th * (lv * 0.28);
      const yt = baseY - th * (0.42 + lv * 0.29);
      const wl = tw * (1 - lv * 0.28);
      ctx.moveTo(cx - wl / 2, yb);
      ctx.lineTo(cx, yt);
      ctx.lineTo(cx + wl / 2, yb);
    }
  };

  const row = (color: string, baseY: number, gapLo: number, gapHi: number, hLo: number, hHi: number) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let x = rand(0, gapHi); x < w + 20; x += rand(gapLo, gapHi)) {
      const th = rand(hLo, hHi);
      conifer(x, baseY, th, th * rand(0.32, 0.42));
    }
    ctx.fill();
  };

  row("#070c16", gy + 2, 7, 14, 14, 34);
  row("#02040a", gy + 7, 16, 34, 26, 62);
  ctx.fillStyle = "#02040a";
  ctx.fillRect(0, gy + 5, w, h - gy);
  return canvas;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function Thunderstorm({
  rainIntensity = 320,
  lightningFrequency = 0.35,
  windAngle = 14,
  boltColor = "#E0F2FE",
  flashIntensity = 0.6,
  children,
  className,
}: ThunderstormProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Live props are read through a ref so the simulation never restarts when they change
  const paramsRef = useRef({
    rainIntensity,
    lightningFrequency,
    windAngle,
    boltColor,
    flashIntensity,
  });
  useEffect(() => {
    paramsRef.current = {
      rainIntensity,
      lightningFrequency,
      windAngle,
      boltColor,
      flashIntensity,
    };
  }, [rainIntensity, lightningFrequency, windAngle, boltColor, flashIntensity]);

  const strikeRef = useRef<(x?: number) => void>(() => { });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const flashScale = reduceMotion ? 0.3 : 1;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 520;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let groundY = height * 0.86;

    const MASK_SCALE = 0.25;
    const lit = makeCanvas(width, height);
    const mask = makeCanvas(width * MASK_SCALE, height * MASK_SCALE);
    let horizon = bakeHorizon(width, height, dpr, groundY);

    // Three cloud decks: far (fine detail), mid, near (big heavy masses)
    const DECKS = [
      { cellsX: 7, cellsY: 3, seed: 11, coverage: 0.55, lum: 0.07, scaleW: 1.25, scaleH: 0.5, speed: 6 },
      { cellsX: 5, cellsY: 3, seed: 47, coverage: 0.5, lum: 0.085, scaleW: 1.5, scaleH: 0.58, speed: 12 },
      { cellsX: 3, cellsY: 2, seed: 93, coverage: 0.48, lum: 0.1, scaleW: 1.9, scaleH: 0.66, speed: 22 },
    ];
    const tiles = DECKS.map((d) =>
      buildCloudTile(640, 200, d.cellsX, d.cellsY, d.seed, d.coverage, d.lum)
    );
    const deckPos = [rand(0, 500), rand(0, 500), rand(0, 500)];

    const layers: Drop[][] = [[], [], []];
    const ripples: Ripple[] = [];
    const droplets: Droplet[] = [];
    const bolts: Bolt[] = [];
    const followUps: number[] = [];
    let time = 0;
    let last = performance.now();

    const makeDrop = (layer: number, initial: boolean): Drop => {
      const c = RAIN_LAYERS[layer];
      const speed = rand(c.speed[0], c.speed[1]);
      const len = rand(c.len[0], c.len[1]);
      const span = height - groundY;
      const landY =
        layer === 0
          ? groundY + rand(1, span * 0.12)
          : layer === 1
            ? groundY + rand(0.1, 0.55) * span
            : groundY + rand(0.45, 1) * span - 2;
      const d: Drop = { x: 0, y: 0, speed, len, landY };
      placeDrop(d, initial);
      return d;
    };

    const placeDrop = (d: Drop, initial: boolean) => {
      const p = paramsRef.current;
      const tan = Math.tan((p.windAngle * Math.PI) / 180);
      const dx = height * tan;
      const minX = Math.min(0, -dx) - 80;
      const maxX = Math.max(width, width - dx) + 80;
      d.x = rand(minX, maxX);
      d.y = initial ? rand(-d.len, d.landY) : -d.len - rand(0, 80);
    };

    const spawnBolt = (customX?: number, manual = false) => {
      const p = paramsRef.current;
      const rgb = hexToRgb(p.boltColor);
      const ox = clamp(customX ?? width * rand(0.12, 0.88), 20, width - 20);
      const oy = height * rand(0.09, 0.17);
      const tx = clamp(ox + width * rand(-0.1, 0.1), 10, width - 10);
      const ty = groundY + rand(-3, 5);
      const { sprite, impactX } = bakeBolt(ox, oy, tx, ty, rgb, dpr);

      // Leader -> return stroke -> a few restrikes, like real flicker
      const leader = rand(40, 70);
      const pulses: Pulse[] = [{ t: leader, amp: 1, tau: 55 }];
      let tt = leader + rand(70, 130);
      const restrikes = Math.floor(rand(1, 4));
      for (let k = 0; k < restrikes; k++) {
        pulses.push({ t: tt, amp: rand(0.55, 0.95), tau: rand(40, 75) });
        tt += rand(60, 140);
      }
      bolts.push({
        sprite,
        cx: ox,
        cy: oy + 30,
        impactX,
        impactY: ty,
        t: 0,
        dur: tt + 220,
        leader,
        pulses,
        energy: 1,
        glow: 0,
        I: 0,
      });
      if (!manual && Math.random() < 0.3) followUps.push(time + rand(0.3, 1.2));
    };

    // Diffuse flicker inside the clouds with no visible channel
    const spawnSheet = () => {
      const pulses: Pulse[] = [];
      let tt = 0;
      const count = Math.floor(rand(2, 5));
      for (let k = 0; k < count; k++) {
        pulses.push({ t: tt, amp: rand(0.35, 0.8), tau: rand(70, 130) });
        tt += rand(50, 160);
      }
      bolts.push({
        sprite: null,
        cx: width * rand(0.05, 0.95),
        cy: height * rand(0.08, 0.3),
        impactX: 0,
        impactY: 0,
        t: 0,
        dur: tt + 300,
        leader: 0,
        pulses,
        energy: 0.5,
        glow: 0,
        I: 0,
      });
    };

    strikeRef.current = (x?: number) => spawnBolt(x, true);

    const updateSize = () => {
      width = container.clientWidth || 800;
      height = container.clientHeight || 520;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      groundY = height * 0.86;
      lit.canvas.width = Math.ceil(width);
      lit.canvas.height = Math.ceil(height);
      mask.canvas.width = Math.ceil(width * MASK_SCALE);
      mask.canvas.height = Math.ceil(height * MASK_SCALE);
      horizon = bakeHorizon(width, height, dpr, groundY);
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);

    const drawDecks = (
      target: CanvasRenderingContext2D,
      kind: "base" | "lit"
    ) => {
      for (let i = 0; i < DECKS.length; i++) {
        const d = DECKS[i];
        const dw = width * d.scaleW;
        const dh = height * d.scaleH;
        const x0 = -(((deckPos[i] % dw) + dw) % dw);
        for (let x = x0; x < width; x += dw) {
          target.drawImage(tiles[i][kind], x, 0, dw, dh);
        }
      }
    };

    const initialTimer = setTimeout(() => spawnBolt(width * 0.56, true), 320);

    let rafId = 0;

    const render = (now: number) => {
      rafId = requestAnimationFrame(render);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt;

      const p = paramsRef.current;
      const rgb = hexToRgb(p.boltColor);
      const fi = clamp(p.flashIntensity / 0.6, 0, 1.8) * flashScale;

      // Gusts: slow, overlapping sine waves on top of the base wind
      const angle =
        p.windAngle + Math.sin(time * 0.37) * 2.2 + Math.sin(time * 1.1 + 1.3) * 1.1;
      const rad = (angle * Math.PI) / 180;
      const sinA = Math.sin(rad);
      const cosA = Math.cos(rad);

      /* ----- automatic storms ----- */
      const freq = p.lightningFrequency * (reduceMotion ? 0.5 : 1);
      if (bolts.length < 4) {
        if (Math.random() < freq * 0.6 * dt) spawnBolt();
        if (Math.random() < freq * 0.7 * dt) spawnSheet();
      }
      if (followUps.length && time >= followUps[0]) {
        followUps.shift();
        if (bolts.length < 4) spawnBolt();
      }

      /* ----- bolt timelines and light output ----- */
      let sum = 0;
      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i];
        b.t += dt * 1000;
        let I = 0;
        if (b.t < b.leader) {
          I = 0.05;
        } else {
          for (const pu of b.pulses) {
            if (b.t >= pu.t) I = Math.max(I, pu.amp * Math.exp(-(b.t - pu.t) / pu.tau));
          }
          if (b.sprite) {
            // Continuing current keeps the channel faintly alive between strokes
            I = Math.max(I, 0.16 * (1 - (b.t - b.leader) / (b.dur - b.leader)));
          }
        }
        I *= 0.88 + Math.random() * 0.12;
        b.I = I;
        b.glow = Math.max(I * b.energy, b.glow * Math.exp(-dt * 9));
        if (b.t > b.dur && b.glow < 0.01) {
          bolts.splice(i, 1);
          continue;
        }
        sum += b.glow;
      }
      const L = Math.min(1.3, sum) * fi;
      const lift = L * 34;

      /* ----- sky ----- */
      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, `rgb(${6 + lift * 0.6}, ${10 + lift * 0.7}, ${20 + lift * 1.1})`);
      sky.addColorStop(0.55, `rgb(${12 + lift * 0.7}, ${18 + lift * 0.85}, ${32 + lift * 1.2})`);
      sky.addColorStop(0.86, `rgb(${24 + lift * 0.9}, ${33 + lift}, ${50 + lift * 1.3})`);
      sky.addColorStop(1, "#04070f");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      /* ----- cloud decks (parallax drift with the wind) ----- */
      const drift = (angle >= 0 ? 1 : -1) * (0.35 + Math.min(1, Math.abs(angle) / 20) * 0.9);
      for (let i = 0; i < DECKS.length; i++) deckPos[i] += DECKS[i].speed * drift * dt;
      drawDecks(ctx, "base");

      /* ----- lightning channels ----- */
      for (const b of bolts) {
        const s = b.sprite;
        if (!s) continue;
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        if (b.t < b.leader) {
          // Dim stepped leader reaching down toward the ground
          const f = b.t / b.leader;
          const flick = 0.7 + Math.random() * 0.3;
          const sw = s.core.width;
          const sh = s.core.height;
          const rh = Math.max(1, Math.floor(sh * f));
          ctx.globalAlpha = 0.28 * flick;
          ctx.drawImage(s.core, 0, 0, sw, rh, s.x, s.y, s.w, s.h * f);
          ctx.globalAlpha = 0.12 * flick;
          ctx.drawImage(s.glow, 0, 0, sw, rh, s.x, s.y, s.w, s.h * f);
        } else {
          ctx.globalAlpha = clamp(b.I * 0.95, 0, 1);
          ctx.drawImage(s.glow, s.x, s.y, s.w, s.h);
          if (b.I > 0.7) {
            ctx.globalAlpha = b.I - 0.7;
            ctx.drawImage(s.glow, s.x, s.y, s.w, s.h);
          }
          ctx.globalAlpha = clamp(b.I * 1.1, 0, 1);
          ctx.drawImage(s.core, s.x, s.y, s.w, s.h);
        }
        ctx.restore();
      }

      /* ----- light scattered through the cloud decks ----- */
      if (L > 0.015) {
        const mctx = mask.ctx;
        const mw = mask.canvas.width;
        const mh = mask.canvas.height;
        mctx.globalCompositeOperation = "source-over";
        mctx.clearRect(0, 0, mw, mh);
        mctx.globalCompositeOperation = "lighter";
        for (const b of bolts) {
          const a = clamp(b.glow * fi, 0, 1);
          if (a < 0.01) continue;
          const mx = b.cx * MASK_SCALE;
          const my = b.cy * MASK_SCALE;
          const r = width * 0.6 * MASK_SCALE;
          const g = mctx.createRadialGradient(mx, my, 0, mx, my, r);
          g.addColorStop(0, `rgba(255,255,255,${a})`);
          g.addColorStop(0.3, `rgba(255,255,255,${a * 0.55})`);
          g.addColorStop(1, "rgba(255,255,255,0)");
          mctx.fillStyle = g;
          mctx.fillRect(0, 0, mw, mh);
        }

        const lctx = lit.ctx;
        lctx.globalCompositeOperation = "source-over";
        lctx.clearRect(0, 0, lit.canvas.width, lit.canvas.height);
        drawDecks(lctx, "lit");
        lctx.globalCompositeOperation = "destination-in";
        lctx.drawImage(mask.canvas, 0, 0, lit.canvas.width, lit.canvas.height);
        lctx.globalCompositeOperation = "source-atop";
        lctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`;
        lctx.fillRect(0, 0, lit.canvas.width, lit.canvas.height);
        lctx.globalCompositeOperation = "source-over";

        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.drawImage(lit.canvas, 0, 0, width, height);

        // Hot core where the discharge happens inside the cloud
        for (const b of bolts) {
          const a = clamp(b.glow * fi, 0, 1);
          if (a < 0.01) continue;
          const g1 = ctx.createRadialGradient(b.cx, b.cy, 0, b.cx, b.cy, width * 0.35);
          g1.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(a * 0.45).toFixed(3)})`);
          g1.addColorStop(0.4, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(a * 0.14).toFixed(3)})`);
          g1.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g1;
          ctx.fillRect(0, 0, width, height * 0.8);

          const g2 = ctx.createRadialGradient(b.cx, b.cy, 0, b.cx, b.cy, 110);
          g2.addColorStop(0, `rgba(255,255,255,${(a * 0.5).toFixed(3)})`);
          g2.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = g2;
          ctx.fillRect(b.cx - 120, b.cy - 120, 240, 240);
        }
        ctx.restore();
      }

      /* ----- horizon haze, ground, treeline ----- */
      const hazeA = 0.06 + L * 0.2;
      const haze = ctx.createLinearGradient(0, groundY - 120, 0, groundY + 10);
      haze.addColorStop(0, "rgba(110,135,175,0)");
      haze.addColorStop(1, `rgba(${110 + rgb.r * 0.2}, ${135 + rgb.g * 0.2}, ${175 + rgb.b * 0.1}, ${hazeA.toFixed(3)})`);
      ctx.fillStyle = haze;
      ctx.fillRect(0, groundY - 120, width, 130);

      const ground = ctx.createLinearGradient(0, groundY, 0, height);
      ground.addColorStop(0, `rgb(${8 + lift * 0.5}, ${12 + lift * 0.6}, ${22 + lift * 0.8})`);
      ground.addColorStop(1, "#03050a");
      ctx.fillStyle = ground;
      ctx.fillRect(0, groundY, width, height - groundY);

      // Wet-ground sheen under each strike
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (const b of bolts) {
        if (!b.sprite) continue;
        const a = clamp(b.glow * fi, 0, 1);
        if (a < 0.01) continue;
        ctx.save();
        ctx.translate(b.impactX, groundY + (height - groundY) * 0.22);
        ctx.scale(1, 0.18);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, width * 0.28);
        g.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(a * 0.5).toFixed(3)})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(-width, -width, width * 2, width * 2);
        ctx.restore();
      }
      ctx.restore();

      ctx.drawImage(horizon, 0, 0, width, height);

      /* ----- rain ----- */
      const total = Math.max(0, Math.round(p.rainIntensity));
      const t0 = Math.round(total * RAIN_LAYERS[0].share);
      const t1 = Math.round(total * RAIN_LAYERS[1].share);
      const targets = [t0, t1, Math.max(0, total - t0 - t1)];
      const mixK = Math.min(1, L) * 0.55;
      const rr = Math.round(160 + (rgb.r - 160) * mixK);
      const rg = Math.round(190 + (rgb.g - 190) * mixK);
      const rb = Math.round(225 + (rgb.b - 225) * mixK);

      ctx.lineCap = "round";
      for (let l = 0; l < 3; l++) {
        const arr = layers[l];
        while (arr.length < targets[l]) arr.push(makeDrop(l, true));
        if (arr.length > targets[l]) arr.length = targets[l];

        const cfg = RAIN_LAYERS[l];
        ctx.beginPath();
        for (const d of arr) {
          d.x += sinA * d.speed * dt;
          d.y += cosA * d.speed * dt;
          if (d.y > d.landY) {
            if (l >= 1 && (l === 2 || Math.random() < 0.4) && ripples.length < 90) {
              ripples.push({
                x: d.x,
                y: d.landY,
                age: 0,
                life: rand(0.25, 0.45),
                maxR: rand(4, 11) * (0.6 + l * 0.35),
              });
            }
            if (l === 2 && Math.random() < 0.6 && droplets.length < 140) {
              for (let k = 0; k < 2; k++) {
                droplets.push({
                  x: d.x,
                  y: d.landY,
                  vx: rand(-60, 60) + sinA * 40,
                  vy: -rand(60, 160),
                  age: 0,
                  life: rand(0.18, 0.32),
                });
              }
            }
            placeDrop(d, false);
            continue;
          }
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - sinA * d.len, d.y - cosA * d.len);
        }
        ctx.strokeStyle = `rgba(${rr}, ${rg}, ${rb}, ${Math.min(0.9, cfg.alpha * (1 + L * 1.5)).toFixed(3)})`;
        ctx.lineWidth = cfg.width;
        ctx.stroke();
      }

      /* ----- ground splashes ----- */
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.age += dt;
        if (r.age >= r.life) {
          ripples.splice(i, 1);
          continue;
        }
        const k = r.age / r.life;
        ctx.strokeStyle = `rgba(200, 220, 240, ${((1 - k) * 0.4 * (1 + L)).toFixed(3)})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.maxR * k, r.maxR * k * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      for (let i = droplets.length - 1; i >= 0; i--) {
        const d = droplets[i];
        d.age += dt;
        if (d.age >= d.life) {
          droplets.splice(i, 1);
          continue;
        }
        d.vy += 520 * dt;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        ctx.fillStyle = `rgba(224, 242, 254, ${((1 - d.age / d.life) * 0.5).toFixed(3)})`;
        ctx.fillRect(d.x, d.y, 1.2, 1.2);
      }

      /* ----- ground mist, exposure flash, vignette ----- */
      const mist = ctx.createLinearGradient(0, groundY - 40, 0, height);
      mist.addColorStop(0, "rgba(120,140,170,0)");
      mist.addColorStop(0.35, `rgba(120,140,170,${(0.07 + L * 0.1).toFixed(3)})`);
      mist.addColorStop(1, "rgba(60,75,100,0.04)");
      ctx.fillStyle = mist;
      ctx.fillRect(0, groundY - 40, width, height - groundY + 40);

      if (L > 0.02) {
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(L * 0.08).toFixed(3)})`;
        ctx.fillRect(0, 0, width, height);
      }

      const vig = ctx.createRadialGradient(
        width / 2,
        height * 0.45,
        Math.min(width, height) * 0.35,
        width / 2,
        height * 0.5,
        Math.max(width, height) * 0.8
      );
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, width, height);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      clearTimeout(initialTimer);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("[data-hud-panel]")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    strikeRef.current(e.clientX - rect.left);
  };

  return (
    <div
      ref={containerRef}
      data-fullscreen-scroll
      onClick={handleClick}
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl bg-[#04070f] text-slate-100 select-none cursor-crosshair",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {children && (
        <div className="relative z-10 flex min-h-[520px] w-full flex-col">
          {children}
        </div>
      )}
    </div>
  );
}

export default Thunderstorm;