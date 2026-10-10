"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles, Trees, Gauge, Activity, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FirefliesProps {
  /** Number of bioluminescent firefly orbs */
  count?: number;
  /** Primary firefly bioluminescence color in hex */
  glowColor?: string;
  /** Drift velocity multiplier */
  speed?: number;
  /** Bioluminescent pulse cycle speed multiplier */
  pulseRate?: number;
  /** Render multi-layered twilight pine forest silhouette */
  showForest?: boolean;
  /** Attract nearby fireflies gently toward the cursor */
  interactive?: boolean;
  /** Optional overlay content */
  children?: React.ReactNode;
  /** Additional container classes */
  className?: string;
}

interface FireflyParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
  pulseFreq: number;
  noiseSeedX: number;
  noiseSeedY: number;
  depth: number;
  /** 0 = distant pinprick, 1 = sharp mid-ground with curved trail, 2 = foreground out-of-focus bokeh disc */
  plane: 0 | 1 | 2;
  trail: { x: number; y: number }[];
}

interface TreeRidge {
  points: { x: number; y: number; treeHeight: number; width: number }[];
  baseHeight: number;
  color: string;
}

interface GrassBlade {
  x: number;
  height: number;
  thickness: number;
  lean: number;
  swayFreq: number;
  swayPhase: number;
  color: string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return { r: 217, g: 249, b: 157 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

const COLOR_PRESETS = [
  { label: "Lime Glow", hex: "#D9F99D" },
  { label: "Amber Gold", hex: "#FDE047" },
  { label: "Cyan Sprite", hex: "#67E8F9" },
  { label: "Fairy Rose", hex: "#F9A8D4" },
];

export function Fireflies({
  count = 55,
  glowColor = "#D9F99D",
  speed = 1.0,
  pulseRate = 1.0,
  showForest = true,
  interactive = true,
  children,
  className,
}: FirefliesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [simCount, setSimCount] = useState(count);
  const [simColor, setSimColor] = useState(glowColor);
  const [simSpeed, setSimSpeed] = useState(speed);
  const [simPulse, setSimPulse] = useState(pulseRate);
  const [simForest, setSimForest] = useState(showForest);

  useEffect(() => setSimCount(count), [count]);
  useEffect(() => setSimColor(glowColor), [glowColor]);
  useEffect(() => setSimSpeed(speed), [speed]);
  useEffect(() => setSimPulse(pulseRate), [pulseRate]);
  useEffect(() => setSimForest(showForest), [showForest]);

  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 520;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const buildMountainRidge = (w: number, h: number) => {
      const pts: { x: number; y: number }[] = [];
      const segments = 32;
      for (let i = 0; i <= segments; i++) {
        const u = i / segments;
        const elev =
          Math.sin(u * Math.PI * 2.2 + 0.4) * 38 +
          Math.cos(u * Math.PI * 5.5 - 1.1) * 16 +
          Math.sin(u * Math.PI * 11.0) * 6;
        pts.push({
          x: u * w,
          y: h * 0.67 - elev,
        });
      }
      return pts;
    };

    const buildForestRidges = (w: number, h: number): TreeRidge[] => {
      const layerConfigs = [
        { baseHeight: h * 0.24, color: "#0b1a2c", density: 32, scale: 0.72 },
        { baseHeight: h * 0.14, color: "#050f1c", density: 42, scale: 1.08 },
      ];
      return layerConfigs.map((cfg, idx) => {
        const points = [];
        const step = w / cfg.density;
        for (let i = -1; i <= cfg.density + 1; i++) {
          const seed = Math.sin(i * 12.9898 + idx * 78.233) * 43758.5453;
          const rand = seed - Math.floor(seed);
          const x = i * step + (rand - 0.5) * step * 0.5;
          const hillOffset =
            Math.sin(i * 0.22 + idx * 1.7) * 24 +
            Math.cos(i * 0.11 - idx) * 12;
          const treeHeight = (34 + rand * 58) * cfg.scale;
          const widthTree = (15 + rand * 20) * cfg.scale;
          points.push({
            x,
            y: h - cfg.baseHeight + hillOffset,
            treeHeight,
            width: widthTree,
          });
        }
        return {
          points,
          baseHeight: cfg.baseHeight,
          color: cfg.color,
        };
      });
    };

    const buildForegroundGrass = (w: number): GrassBlade[] => {
      const bladeCount = Math.max(90, Math.floor(w / 7));
      const blades: GrassBlade[] = [];
      for (let i = 0; i < bladeCount; i++) {
        const seed = Math.sin(i * 93.17) * 43758.5453;
        const r1 = seed - Math.floor(seed);
        const r2 = ((seed * 1.73) % 1 + 1) % 1;
        blades.push({
          x: (i / bladeCount) * w + (r1 - 0.5) * 12,
          height: 26 + r1 * 56,
          thickness: 1.4 + r2 * 1.8,
          lean: (r1 - 0.5) * 22,
          swayFreq: 0.8 + r2 * 1.1,
          swayPhase: r1 * Math.PI * 2,
          color: i % 3 === 0 ? "#040b14" : "#02060c",
        });
      }
      return blades;
    };

    let mountainPts = buildMountainRidge(width, height);
    let ridges = buildForestRidges(width, height);
    let grassBlades = buildForegroundGrass(width);

    const createFirefly = (w: number, h: number, idx: number): FireflyParticle => {
      const roll = (idx * 0.61803398875) % 1;
      let plane: 0 | 1 | 2 = 1;
      let depth = 0.6;
      let radius = 2.0;

      if (roll < 0.34) {
        // Distant pinpricks
        plane = 0;
        depth = 0.25 + Math.random() * 0.25;
        radius = 0.8 + Math.random() * 0.9;
      } else if (roll < 0.84) {
        // Sharp mid-ground fireflies with trails
        plane = 1;
        depth = 0.52 + Math.random() * 0.32;
        radius = 1.6 + Math.random() * 1.6;
      } else {
        // Out-of-focus foreground bokeh discs
        plane = 2;
        depth = 0.88 + Math.random() * 0.35;
        radius = 16 + Math.random() * 18;
      }

      return {
        x: Math.random() * w,
        y:
          plane === 2
            ? h * 0.18 + Math.random() * (h * 0.75)
            : h * 0.1 + Math.random() * (h * 0.78),
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.4,
        radius,
        phase: Math.random() * Math.PI * 2,
        pulseFreq: 0.75 + Math.random() * 1.35,
        noiseSeedX: Math.random() * 100,
        noiseSeedY: Math.random() * 100,
        depth,
        plane,
        trail: [],
      };
    };

    let particles: FireflyParticle[] = Array.from({ length: simCount }, (_, i) =>
      createFirefly(width, height, i)
    );

    const stars = Array.from({ length: 75 }, (_, i) => ({
      u: ((Math.sin(i * 91.3) * 43758.5453) % 1 + 1) % 1,
      v: (((Math.cos(i * 47.7) * 23421.631) % 1 + 1) % 1) * 0.62,
      size: 0.5 + ((i * 19) % 10) * 0.11,
      twinklePhase: i * 1.3,
    }));

    const updateCanvasSize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth || 800;
      height = container.clientHeight || 520;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mountainPts = buildMountainRidge(width, height);
      ridges = buildForestRidges(width, height);
      grassBlades = buildForegroundGrass(width);
    };

    updateCanvasSize();
    const observer = new ResizeObserver(updateCanvasSize);
    observer.observe(container);

    let rafId = 0;
    let time = 0;
    const rgb = hexToRgb(simColor);

    const drawPine = (
      cx: number,
      baseY: number,
      treeH: number,
      treeW: number,
      fill: string
    ) => {
      ctx.fillStyle = fill;
      const tiers = 4;
      for (let t = 0; t < tiers; t++) {
        const tierProgress = t / tiers;
        const topY = baseY - treeH + tierProgress * (treeH * 0.58);
        const bottomY = baseY - (tiers - 1 - t) * (treeH * 0.2);
        const halfW = treeW * (0.38 + tierProgress * 0.62) * 0.52;
        ctx.beginPath();
        ctx.moveTo(cx, topY);
        ctx.quadraticCurveTo(cx - halfW * 0.35, (topY + bottomY) * 0.5, cx - halfW, bottomY);
        ctx.lineTo(cx + halfW, bottomY);
        ctx.quadraticCurveTo(cx + halfW * 0.35, (topY + bottomY) * 0.5, cx, topY);
        ctx.closePath();
        ctx.fill();
      }
    };

    const drawCrepuscularMoonbeams = () => {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const rays = [
        { x: width * 0.18, w: width * 0.16, alpha: 0.045 },
        { x: width * 0.42, w: width * 0.22, alpha: 0.06 },
        { x: width * 0.68, w: width * 0.18, alpha: 0.05 },
        { x: width * 0.86, w: width * 0.14, alpha: 0.035 },
      ];
      for (let i = 0; i < rays.length; i++) {
        const r = rays[i];
        const drift = Math.sin(time * 0.25 + i * 1.7) * 28;
        const topX = r.x + drift;
        const botX = topX - width * 0.22;
        const grad = ctx.createLinearGradient(topX, 0, botX, height * 0.92);
        grad.addColorStop(0, `rgba(186, 230, 253, ${r.alpha})`);
        grad.addColorStop(
          0.55,
          `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(r.alpha * 0.55).toFixed(4)})`
        );
        grad.addColorStop(1, "rgba(15, 23, 42, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(topX - r.w * 0.35, -10);
        ctx.lineTo(topX + r.w * 0.35, -10);
        ctx.lineTo(botX + r.w * 0.95, height);
        ctx.lineTo(botX - r.w * 0.95, height);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    };

    const render = () => {
      time += 0.016;

      if (particles.length < simCount) {
        while (particles.length < simCount) {
          particles.push(createFirefly(width, height, particles.length));
        }
      } else if (particles.length > simCount) {
        particles.length = simCount;
      }

      // Deep enchanted twilight sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, "#02050d");
      skyGrad.addColorStop(0.42, "#071226");
      skyGrad.addColorStop(0.76, "#0d2138");
      skyGrad.addColorStop(1, "#061320");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Faint background stars
      for (const s of stars) {
        const sx = s.u * width;
        const sy = s.v * height;
        const alpha = 0.18 + 0.38 * Math.sin(time * 1.4 + s.twinklePhase);
        ctx.fillStyle = `rgba(226, 232, 240, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Diagonal crepuscular moonbeams filtering through twilight mist
      drawCrepuscularMoonbeams();

      // Layer 1 of forest: Distant misty mountain ridge
      if (simForest && mountainPts.length > 0) {
        const mtnGrad = ctx.createLinearGradient(0, height * 0.55, 0, height);
        mtnGrad.addColorStop(0, "#0d2136");
        mtnGrad.addColorStop(1, "#081524");
        ctx.fillStyle = mtnGrad;
        ctx.beginPath();
        ctx.moveTo(0, height);
        for (const pt of mountainPts) {
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();

        // Valley mist blanket over mountain base
        const mistGrad = ctx.createLinearGradient(
          0,
          height * 0.62,
          0,
          height * 0.85
        );
        mistGrad.addColorStop(0, "rgba(18, 42, 66, 0)");
        mistGrad.addColorStop(
          0.5,
          `rgba(${Math.round(rgb.r * 0.4 + 20)}, ${Math.round(
            rgb.g * 0.4 + 45
          )}, ${Math.round(rgb.b * 0.4 + 65)}, 0.16)`
        );
        mistGrad.addColorStop(1, "rgba(8, 20, 34, 0)");
        ctx.fillStyle = mistGrad;
        ctx.fillRect(0, height * 0.62, width, height * 0.25);
      }

      const updateAndDrawFirefly = (p: FireflyParticle) => {
        const angleX =
          Math.sin(time * 0.68 * simSpeed + p.noiseSeedX) * 1.2 +
          Math.cos(time * 0.34 * simSpeed + p.noiseSeedY * 0.5) * 0.85;
        const angleY =
          Math.cos(time * 0.52 * simSpeed + p.noiseSeedY) * 0.9 +
          Math.sin(time * 0.29 * simSpeed + p.noiseSeedX) * 0.65;

        p.vx += (angleX * 0.42 * p.depth * simSpeed - p.vx) * 0.04;
        p.vy += ((angleY - 0.1) * 0.35 * p.depth * simSpeed - p.vy) * 0.04;

        if (interactive && pointerRef.current.active) {
          const dx = pointerRef.current.x - p.x;
          const dy = pointerRef.current.y - p.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 42000 && distSq > 25) {
            const dist = Math.sqrt(distSq);
            const pull = (1 - dist / 205) * 0.04 * p.depth;
            p.vx += (dx / dist) * pull;
            p.vy += (dy / dist) * pull;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        const margin = p.plane === 2 ? 50 : 30;
        if (p.x < -margin) p.x = width + margin;
        if (p.x > width + margin) p.x = -margin;
        if (p.y < -margin) p.y = height - 30;
        if (p.y > height + margin) p.y = 20;

        p.phase += 0.034 * p.pulseFreq * simPulse;
        const rawSine = (Math.sin(p.phase) + 1) * 0.5;
        const pulse = 0.1 + Math.pow(rawSine, 2.5) * 0.9;

        if (p.plane === 0) {
          // Distant tiny bioluminescent pinpricks
          const r = p.radius * (3.2 + pulse * 2.5);
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
          g.addColorStop(
            0,
            `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(0.75 * pulse).toFixed(3)})`
          );
          g.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.plane === 1) {
          // Sharp mid-ground fireflies with curved glowing trails & warm incandescent cores
          p.trail.unshift({ x: p.x, y: p.y });
          if (p.trail.length > 12) p.trail.pop();

          if (p.trail.length > 3) {
            for (let i = 0; i < p.trail.length - 1; i++) {
              const tRatio = 1 - i / p.trail.length;
              ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(
                pulse *
                0.28 *
                tRatio *
                tRatio
              ).toFixed(3)})`;
              ctx.lineWidth = p.radius * 0.85 * tRatio;
              ctx.lineCap = "round";
              ctx.beginPath();
              ctx.moveTo(p.trail[i].x, p.trail[i].y);
              ctx.lineTo(p.trail[i + 1].x, p.trail[i + 1].y);
              ctx.stroke();
            }
          }

          const haloRadius = p.radius * (7.0 + pulse * 6.0);
          const grad = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            haloRadius
          );
          grad.addColorStop(
            0,
            `rgba(255, 255, 240, ${(0.98 * pulse).toFixed(3)})`
          );
          grad.addColorStop(
            0.2,
            `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(0.82 * pulse).toFixed(3)})`
          );
          grad.addColorStop(
            0.52,
            `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(0.24 * pulse).toFixed(3)})`
          );
          grad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, haloRadius, 0, Math.PI * 2);
          ctx.fill();

          // Warm incandescent core
          ctx.fillStyle = `rgba(255, 255, 248, ${(0.55 + 0.45 * pulse).toFixed(
            3
          )})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * (0.72 + 0.35 * pulse), 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Plane 2: Large out-of-focus foreground optical bokeh discs (soft translucent rings)
          const bokehAlpha = (0.04 + pulse * 0.16) * 0.95;
          const r = p.radius * (0.9 + pulse * 0.22);
          const bokehGrad = ctx.createRadialGradient(p.x, p.y, r * 0.1, p.x, p.y, r);
          bokehGrad.addColorStop(
            0,
            `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(bokehAlpha * 0.55).toFixed(3)})`
          );
          bokehGrad.addColorStop(
            0.72,
            `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(bokehAlpha * 0.85).toFixed(3)})`
          );
          bokehGrad.addColorStop(
            0.9,
            `rgba(255, 255, 245, ${(bokehAlpha * 1.35).toFixed(3)})`
          );
          bokehGrad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);

          ctx.fillStyle = bokehGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      // Render distant pinprick fireflies (behind mid-ground conifers)
      for (const p of particles) {
        if (p.plane === 0) updateAndDrawFirefly(p);
      }

      // Layers 2 & 3 of forest: Mid-ground conifers & Near woodland trees
      if (simForest) {
        ridges.forEach((ridge, idx) => {
          ctx.fillStyle = ridge.color;
          ctx.beginPath();
          ctx.moveTo(0, height);
          for (const pt of ridge.points) {
            ctx.lineTo(pt.x, pt.y);
          }
          ctx.lineTo(width, height);
          ctx.closePath();
          ctx.fill();

          for (const pt of ridge.points) {
            drawPine(pt.x, pt.y + 6, pt.treeHeight, pt.width, ridge.color);
          }

          if (idx === 0) {
            const fogY = height - ridge.baseHeight - 30;
            const fogG = ctx.createLinearGradient(0, fogY - 35, 0, height);
            fogG.addColorStop(0, "rgba(15, 32, 52, 0)");
            fogG.addColorStop(0.5, "rgba(18, 42, 64, 0.28)");
            fogG.addColorStop(1, "rgba(4, 10, 18, 0)");
            ctx.fillStyle = fogG;
            ctx.fillRect(0, fogY - 35, width, 100);
          }
        });
      }

      // Render sharp mid-ground fireflies
      for (const p of particles) {
        if (p.plane === 1) updateAndDrawFirefly(p);
      }

      // Layer 4 of forest: Detailed foreground swaying grass blades along the bottom
      if (simForest) {
        ctx.fillStyle = "#02060c";
        ctx.fillRect(0, height - 10, width, 12);

        for (const blade of grassBlades) {
          const windSway =
            Math.sin(time * 1.45 * blade.swayFreq + blade.swayPhase) * 9 +
            Math.cos(time * 0.7 + blade.x * 0.02) * 4;
          const tipX = blade.x + blade.lean + windSway;
          const tipY = height - blade.height;
          const ctrlX = blade.x + (blade.lean + windSway) * 0.45;
          const ctrlY = height - blade.height * 0.52;

          ctx.fillStyle = blade.color;
          ctx.beginPath();
          ctx.moveTo(blade.x - blade.thickness, height);
          ctx.quadraticCurveTo(ctrlX - blade.thickness * 0.4, ctrlY, tipX, tipY);
          ctx.quadraticCurveTo(
            ctrlX + blade.thickness * 0.4,
            ctrlY,
            blade.x + blade.thickness,
            height
          );
          ctx.closePath();
          ctx.fill();
        }
      }

      // Render out-of-focus foreground bokeh fireflies in front of everything
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (const p of particles) {
        if (p.plane === 2) updateAndDrawFirefly(p);
      }
      ctx.restore();

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [simCount, simColor, simSpeed, simPulse, simForest, interactive]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handlePointerLeave = () => {
    pointerRef.current.active = false;
  };

  const resetDefaults = () => {
    setSimCount(count);
    setSimColor(glowColor);
    setSimSpeed(speed);
    setSimPulse(pulseRate);
    setSimForest(showForest);
  };

  return (
    <div
      ref={containerRef}
      data-fullscreen-scroll
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl bg-[#02050d] text-slate-100 select-none",
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

export default Fireflies;
