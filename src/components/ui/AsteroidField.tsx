"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles, Wind, Sliders, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export type AsteroidColorTheme = "basalt" | "ice" | "iron";

export interface AsteroidFieldProps {
  /** Total number of procedural 3D faceted asteroids across 3 parallax layers (default: 32) */
  asteroidCount?: number;
  /** Drift velocity multiplier (default: 1.0) */
  speed?: number;
  /** Trajectory angle in degrees (default: 18) */
  angle?: number;
  /** Spawn probability multiplier for high-speed glowing bolide meteors (default: 0.4) */
  meteorFrequency?: number;
  /** Mineral composition color palette (default: "basalt") */
  colorTheme?: AsteroidColorTheme;
  /** Optional foreground content rendered over the asteroid belt */
  children?: React.ReactNode;
  /** Additional CSS classes for the root container */
  className?: string;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface PolyFacet {
  i0: number;
  i1: number;
  i2: number;
  albedoVar: number;
}

interface CraterPit {
  facetIndex: number;
  radius: number;
}

interface Asteroid3D {
  x: number;
  y: number;
  layer: 0 | 1 | 2; // 0 = far, 1 = mid, 2 = near
  radius: number;
  rotZ: number;
  rotX: number;
  rotSpeedZ: number;
  rotSpeedX: number;
  vertices: Vec3[];
  outerCount: number;
  facets: PolyFacet[];
  craters: CraterPit[];
  driftJitter: number;
}

interface BolideSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

interface SmokePuff {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

interface BolideMeteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  life: number;
  maxLife: number;
  sparks: BolideSpark[];
  smoke: SmokePuff[];
}

interface DustMote {
  x: number;
  y: number;
  size: number;
  alpha: number;
  depth: number;
}

interface VolumetricDustCloud {
  x: number;
  y: number;
  rx: number;
  ry: number;
  rotation: number;
  alpha: number;
  speedFactor: number;
}

const THEME_PALETTES: Record<
  AsteroidColorTheme,
  {
    label: string;
    baseRgb: [number, number, number];
    specRgb: [number, number, number];
    shadowRgb: [number, number, number];
    rimColor: string;
    comaCore: string;
    comaHalo: string;
    plasmaTail: string;
    sparkRgb: string;
    nebulaRgb: string;
  }
> = {
  basalt: {
    label: "Chondrite Basalt",
    baseRgb: [78, 92, 114],
    specRgb: [165, 184, 208],
    shadowRgb: [13, 18, 29],
    rimColor: "rgba(186, 208, 235, 0.55)",
    comaCore: "#FFFFFF",
    comaHalo: "56, 189, 248",
    plasmaTail: "251, 146, 60",
    sparkRgb: "253, 224, 71",
    nebulaRgb: "56, 189, 248",
  },
  ice: {
    label: "Kuiper Frost",
    baseRgb: [56, 142, 198],
    specRgb: [218, 244, 255],
    shadowRgb: [9, 32, 56],
    rimColor: "rgba(224, 242, 254, 0.72)",
    comaCore: "#F0F9FF",
    comaHalo: "125, 211, 252",
    plasmaTail: "56, 189, 248",
    sparkRgb: "186, 230, 253",
    nebulaRgb: "125, 211, 252",
  },
  iron: {
    label: "Ferrous Ore",
    baseRgb: [112, 96, 86],
    specRgb: [224, 186, 152],
    shadowRgb: [22, 17, 15],
    rimColor: "rgba(253, 186, 116, 0.62)",
    comaCore: "#FFFBEB",
    comaHalo: "251, 146, 60",
    plasmaTail: "239, 68, 68",
    sparkRgb: "253, 186, 116",
    nebulaRgb: "249, 115, 22",
  },
};

export function AsteroidField({
  asteroidCount = 32,
  speed = 1.0,
  angle = 18,
  meteorFrequency = 0.4,
  colorTheme = "basalt",
  children,
  className,
}: AsteroidFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeTheme, setActiveTheme] = useState<AsteroidColorTheme>(colorTheme);
  const [activeSpeed, setActiveSpeed] = useState(speed);
  const [activeAngle, setActiveAngle] = useState(angle);
  const [activeMeteorFreq, setActiveMeteorFreq] = useState(meteorFrequency);
  useEffect(() => {
    setActiveTheme(colorTheme);
  }, [colorTheme]);
  useEffect(() => {
    setActiveSpeed(speed);
  }, [speed]);
  useEffect(() => {
    setActiveAngle(angle);
  }, [angle]);
  useEffect(() => {
    setActiveMeteorFreq(meteorFrequency);
  }, [meteorFrequency]);

  const manualMeteorQueueRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 520;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth || 800;
      height = container.clientHeight || 520;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    // Construct a 3D faceted polyhedral asteroid mesh (outer silhouette ring + inner ridge ring + apex crown)
    const createAsteroid3D = (layer: 0 | 1 | 2): Asteroid3D => {
      const baseRadius =
        layer === 0
          ? 8 + Math.random() * 10
          : layer === 1
          ? 18 + Math.random() * 18
          : 34 + Math.random() * 26;

      const N = layer === 0 ? 7 : layer === 1 ? 9 : 11;
      const vertices: Vec3[] = [];

      // 0..N-1: Outer equatorial craggy perimeter ring
      for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2 + (Math.random() - 0.5) * 0.18;
        const r = baseRadius * (0.74 + Math.random() * 0.42);
        const z = (Math.random() - 0.5) * baseRadius * 0.35;
        vertices.push({ x: Math.cos(a) * r, y: Math.sin(a) * r, z });
      }

      // N..2N-1: Inner elevated ridge ring
      for (let i = 0; i < N; i++) {
        const a = ((i + 0.5) / N) * Math.PI * 2 + (Math.random() - 0.5) * 0.22;
        const r = baseRadius * (0.32 + Math.random() * 0.25);
        const z = baseRadius * (0.48 + Math.random() * 0.35);
        vertices.push({ x: Math.cos(a) * r, y: Math.sin(a) * r, z });
      }

      // 2N: Central high crown peak
      vertices.push({
        x: (Math.random() - 0.5) * baseRadius * 0.18,
        y: (Math.random() - 0.5) * baseRadius * 0.18,
        z: baseRadius * (0.78 + Math.random() * 0.24),
      });

      const facets: PolyFacet[] = [];
      for (let i = 0; i < N; i++) {
        const next = (i + 1) % N;
        // Outer slope triangle 1: Outer[i] -> Outer[next] -> Inner[i]
        facets.push({
          i0: i,
          i1: next,
          i2: N + i,
          albedoVar: 0.9 + Math.random() * 0.2,
        });
        // Outer slope triangle 2: Outer[next] -> Inner[next] -> Inner[i]
        facets.push({
          i0: next,
          i1: N + next,
          i2: N + i,
          albedoVar: 0.9 + Math.random() * 0.2,
        });
        // Crown cap triangle: Inner[i] -> Inner[next] -> Crown[2N]
        facets.push({
          i0: N + i,
          i1: N + next,
          i2: 2 * N,
          albedoVar: 0.92 + Math.random() * 0.16,
        });
      }

      const craterCount = layer === 0 ? 1 : layer === 1 ? 2 : 4;
      const craters: CraterPit[] = Array.from({ length: craterCount }, () => ({
        facetIndex: Math.floor(Math.random() * facets.length),
        radius: baseRadius * (0.09 + Math.random() * 0.11),
      }));

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        layer,
        radius: baseRadius,
        rotZ: Math.random() * Math.PI * 2,
        rotX: (Math.random() - 0.5) * 0.7,
        rotSpeedZ: (Math.random() - 0.5) * (0.015 - layer * 0.003),
        rotSpeedX: (Math.random() - 0.5) * 0.008,
        vertices,
        outerCount: N,
        facets,
        craters,
        driftJitter: 0.85 + Math.random() * 0.3,
      };
    };

    const count = Math.max(8, Math.min(90, asteroidCount));
    const asteroids: Asteroid3D[] = [];
    for (let i = 0; i < count; i++) {
      const layer: 0 | 1 | 2 = i % 6 === 0 ? 2 : i % 2 === 0 ? 1 : 0;
      asteroids.push(createAsteroid3D(layer));
    }
    asteroids.sort((a, b) => a.layer - b.layer);

    // Volumetric background cosmic dust clouds
    const dustClouds: VolumetricDustCloud[] = Array.from({ length: 7 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      rx: 140 + Math.random() * 180,
      ry: 65 + Math.random() * 95,
      rotation: (Math.random() - 0.5) * 0.8,
      alpha: 0.045 + Math.random() * 0.055,
      speedFactor: 0.12 + Math.random() * 0.18,
    }));

    const dustMotes: DustMote[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 0.45 + Math.random() * 1.4,
      alpha: 0.15 + Math.random() * 0.6,
      depth: 0.2 + Math.random() * 0.85,
    }));

    const meteors: BolideMeteor[] = [];

    const spawnBolide = () => {
      const rad = (activeAngle * Math.PI) / 180;
      const spd = 11.5 + Math.random() * 6.5;
      meteors.push({
        x: Math.random() * width * 0.82,
        y: -35,
        vx: Math.cos(rad + 0.22) * spd,
        vy: Math.sin(rad + 0.36) * spd + 4.2,
        length: 95 + Math.random() * 90,
        life: 0,
        maxLife: 48 + Math.random() * 34,
        sparks: [],
        smoke: [],
      });
    };

    // Fixed directional solar light vector (top-left grazing sun)
    const sunDir: Vec3 = (() => {
      const lx = -0.68;
      const ly = -0.54;
      const lz = 0.49;
      const len = Math.hypot(lx, ly, lz);
      return { x: lx / len, y: ly / len, z: lz / len };
    })();

    let rafId = 0;

    const render = () => {
      const palette = THEME_PALETTES[activeTheme] || THEME_PALETTES.basalt;
      const rad = (activeAngle * Math.PI) / 180;
      const dirX = Math.cos(rad);
      const dirY = Math.sin(rad);

      // Deep space background
      ctx.fillStyle = "#03050B";
      ctx.fillRect(0, 0, width, height);

      // 1. Volumetric Mineral Dust Clouds
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (let i = 0; i < dustClouds.length; i++) {
        const dc = dustClouds[i];
        dc.x += dirX * dc.speedFactor * activeSpeed;
        dc.y += dirY * dc.speedFactor * activeSpeed;

        if (dc.x > width + dc.rx) dc.x = -dc.rx;
        if (dc.x < -dc.rx) dc.x = width + dc.rx;
        if (dc.y > height + dc.ry) dc.y = -dc.ry;
        if (dc.y < -dc.ry) dc.y = height + dc.ry;

        ctx.save();
        ctx.translate(dc.x, dc.y);
        ctx.rotate(dc.rotation);
        const cGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, dc.rx);
        cGrad.addColorStop(
          0,
          `rgba(${palette.nebulaRgb}, ${(dc.alpha * 1.4).toFixed(3)})`
        );
        cGrad.addColorStop(
          0.55,
          `rgba(${palette.nebulaRgb}, ${(dc.alpha * 0.5).toFixed(3)})`
        );
        cGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = cGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, dc.rx, dc.ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();

      // 2. Ambient Parallax Dust Motes & Background Stars
      for (let i = 0; i < dustMotes.length; i++) {
        const d = dustMotes[i];
        d.x += dirX * d.depth * 0.35 * activeSpeed;
        d.y += dirY * d.depth * 0.35 * activeSpeed;

        if (d.x > width + 10) d.x = -10;
        if (d.x < -10) d.x = width + 10;
        if (d.y > height + 10) d.y = -10;
        if (d.y < -10) d.y = height + 10;

        ctx.fillStyle = `rgba(226, 232, 240, ${d.alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Vaporizing Bolide Meteors (Ionized Coma, Fragmenting Sparks & Smoke Trail)
      if (
        manualMeteorQueueRef.current > 0 ||
        Math.random() < 0.025 * activeMeteorFreq * Math.max(0.2, activeSpeed)
      ) {
        if (manualMeteorQueueRef.current > 0) {
          manualMeteorQueueRef.current -= 1;
        }
        spawnBolide();
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx;
        m.y += m.vy;
        m.life += 1;

        const progress = m.life / m.maxLife;
        const alpha = Math.sin(progress * Math.PI);

        // Emit decaying atmospheric ablation smoke puffs along trajectory
        if (m.life % 2 === 0) {
          m.smoke.push({
            x: m.x - m.vx * 0.4 + (Math.random() - 0.5) * 3,
            y: m.y - m.vy * 0.4 + (Math.random() - 0.5) * 3,
            radius: 3.5 + Math.random() * 3,
            alpha: 0.22 * alpha,
          });
        }

        // Emit fragmenting incandescent ember sparks
        for (let s = 0; s < 2; s++) {
          if (Math.random() < 0.75) {
            m.sparks.push({
              x: m.x,
              y: m.y,
              vx: m.vx * (0.25 + Math.random() * 0.3) + (Math.random() - 0.5) * 2.6,
              vy: m.vy * (0.25 + Math.random() * 0.3) + (Math.random() - 0.5) * 2.6,
              life: 0,
              maxLife: 12 + Math.random() * 14,
              size: 0.8 + Math.random() * 1.4,
            });
          }
        }

        // Render decaying smoke trail
        for (let k = m.smoke.length - 1; k >= 0; k--) {
          const sm = m.smoke[k];
          sm.radius += 0.25;
          sm.alpha *= 0.93;
          if (sm.alpha <= 0.01) {
            m.smoke.splice(k, 1);
            continue;
          }
          ctx.fillStyle = `rgba(148, 163, 184, ${sm.alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(sm.x, sm.y, sm.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        // Render fragmenting ember sparks
        for (let k = m.sparks.length - 1; k >= 0; k--) {
          const sp = m.sparks[k];
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.life += 1;
          const spAlpha = (1 - sp.life / sp.maxLife) * alpha;
          if (sp.life >= sp.maxLife) {
            m.sparks.splice(k, 1);
            continue;
          }
          ctx.fillStyle = `rgba(${palette.sparkRgb}, ${spAlpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Render ionized plasma tail
        const norm = Math.hypot(m.vx, m.vy) || 1;
        const tailX = m.x - (m.vx / norm) * m.length;
        const tailY = m.y - (m.vy / norm) * m.length;

        const mGrad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        mGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha.toFixed(3)})`);
        mGrad.addColorStop(
          0.18,
          `rgba(${palette.comaHalo}, ${(alpha * 0.9).toFixed(3)})`
        );
        mGrad.addColorStop(
          0.48,
          `rgba(${palette.plasmaTail}, ${(alpha * 0.65).toFixed(3)})`
        );
        mGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.strokeStyle = mGrad;
        ctx.lineWidth = 2.6;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Glowing ionized bolide coma halo & incandescent head
        const comaGrad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 16);
        comaGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha.toFixed(3)})`);
        comaGrad.addColorStop(
          0.35,
          `rgba(${palette.comaHalo}, ${(alpha * 0.72).toFixed(3)})`
        );
        comaGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = comaGrad;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = palette.comaCore;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 2.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        if (m.life >= m.maxLife || m.x > width + 240 || m.y > height + 240) {
          meteors.splice(i, 1);
        }
      }

      // 4. Three-Layer Parallax 3D Polyhedral Asteroids with Per-Facet Normal Lighting
      const layerSpeedMultipliers = [0.42, 1.0, 2.1];
      const layerAlpha = [0.58, 0.88, 1.0];

      for (let i = 0; i < asteroids.length; i++) {
        const a = asteroids[i];
        const lSpeed =
          layerSpeedMultipliers[a.layer] * activeSpeed * a.driftJitter;

        a.x += dirX * lSpeed;
        a.y += dirY * lSpeed;
        a.rotZ += a.rotSpeedZ * Math.max(0.25, activeSpeed);
        a.rotX += a.rotSpeedX * Math.max(0.25, activeSpeed);

        const pad = a.radius + 50;
        if (a.x > width + pad) a.x = -pad;
        if (a.x < -pad) a.x = width + pad;
        if (a.y > height + pad) a.y = -pad;
        if (a.y < -pad) a.y = height + pad;

        // Transform 3D vertices by Z rotation + subtle X tumble
        const cosZ = Math.cos(a.rotZ);
        const sinZ = Math.sin(a.rotZ);
        const tiltX = Math.sin(a.rotX) * 0.32;
        const cosX = Math.cos(tiltX);
        const sinX = Math.sin(tiltX);

        const transformed: Vec3[] = a.vertices.map((v) => {
          const rx = v.x * cosZ - v.y * sinZ;
          const ry = v.x * sinZ + v.y * cosZ;
          const rz = v.z;
          return {
            x: rx,
            y: ry * cosX - rz * sinX,
            z: ry * sinX + rz * cosX,
          };
        });

        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.globalAlpha = layerAlpha[a.layer];

        // Render each triangular facet with true 3D surface normal dot product lighting
        for (let f = 0; f < a.facets.length; f++) {
          const facet = a.facets[f];
          const v0 = transformed[facet.i0];
          const v1 = transformed[facet.i1];
          const v2 = transformed[facet.i2];

          // Compute 3D edge vectors and surface normal
          const ux = v1.x - v0.x;
          const uy = v1.y - v0.y;
          const uz = v1.z - v0.z;
          const vx = v2.x - v0.x;
          const vy = v2.y - v0.y;
          const vz = v2.z - v0.z;

          let nx = uy * vz - uz * vy;
          let ny = uz * vx - ux * vz;
          let nz = ux * vy - uy * vx;
          const nLen = Math.hypot(nx, ny, nz) || 1;
          nx /= nLen;
          ny /= nLen;
          nz /= nLen;

          if (nz < 0) {
            nx = -nx;
            ny = -ny;
            nz = -nz;
          }

          // Lambertian diffuse + specular mineral glint against sunDir
          const ndotl = Math.max(
            0,
            nx * sunDir.x + ny * sunDir.y + nz * sunDir.z
          );
          const lit = Math.min(1, Math.pow(ndotl, 0.85) * facet.albedoVar);
          const spec = Math.pow(Math.max(0, ndotl), 4.5) * 0.45;

          const mixChannel = (cIdx: 0 | 1 | 2) => {
            const shadow = palette.shadowRgb[cIdx];
            const mid = palette.baseRgb[cIdx];
            const hi = palette.specRgb[cIdx];
            const baseMix =
              lit < 0.45
                ? shadow + (mid - shadow) * (lit / 0.45)
                : mid + (hi - mid) * ((lit - 0.45) / 0.55);
            return Math.min(255, Math.round(baseMix + spec * 90));
          };

          const rCol = mixChannel(0);
          const gCol = mixChannel(1);
          const bCol = mixChannel(2);

          const colorStr = `rgb(${rCol}, ${gCol}, ${bCol})`;
          ctx.fillStyle = colorStr;
          ctx.strokeStyle = colorStr;
          ctx.lineWidth = 0.65;
          ctx.lineJoin = "round";

          ctx.beginPath();
          ctx.moveTo(v0.x, v0.y);
          ctx.lineTo(v1.x, v1.y);
          ctx.lineTo(v2.x, v2.y);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }

        // Render recessed impact craters with opposite-side sunlit inner rim
        for (let c = 0; c < a.craters.length; c++) {
          const cr = a.craters[c];
          const facet = a.facets[cr.facetIndex];
          const v0 = transformed[facet.i0];
          const v1 = transformed[facet.i1];
          const v2 = transformed[facet.i2];
          const cx = (v0.x + v1.x + v2.x) / 3;
          const cy = (v0.y + v1.y + v2.y) / 3;

          ctx.fillStyle = `rgba(${palette.shadowRgb[0]}, ${palette.shadowRgb[1]}, ${palette.shadowRgb[2]}, 0.78)`;
          ctx.beginPath();
          ctx.arc(cx, cy, cr.radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = palette.rimColor;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.arc(cx, cy, cr.radius, -Math.PI * 0.2, Math.PI * 0.75);
          ctx.stroke();
        }

        // Crisp specular rim-lighting on sunward silhouette edges
        ctx.lineWidth = a.layer === 2 ? 1.5 : 1.0;
        for (let s = 0; s < a.outerCount; s++) {
          const p0 = transformed[s];
          const p1 = transformed[(s + 1) % a.outerCount];
          const edgeMidX = (p0.x + p1.x) * 0.5;
          const edgeMidY = (p0.y + p1.y) * 0.5;
          const edgeLen = Math.hypot(edgeMidX, edgeMidY) || 1;
          const rimDot =
            (edgeMidX / edgeLen) * sunDir.x + (edgeMidY / edgeLen) * sunDir.y;

          if (rimDot > 0.15) {
            ctx.strokeStyle = palette.rimColor;
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.stroke();
          }
        }

        ctx.restore();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [asteroidCount, activeSpeed, activeAngle, activeMeteorFreq, activeTheme]);

  return (
    <div
      ref={containerRef}
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl bg-[#03050B] text-white select-none",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
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

export default AsteroidField;
