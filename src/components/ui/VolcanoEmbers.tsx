"use client";

import React, { useEffect, useRef, useState } from "react";
import { Flame, Wind, ArrowUp, Sparkles, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VolcanoEmbersProps {
  /** Total number of rising incandescent embers and thermal sparks */
  emberCount?: number;
  /** Vertical thermal updraft velocity multiplier */
  updraftSpeed?: number;
  /** Horizontal curl/vortex turbulence intensity */
  turbulence?: number;
  /** Primary ember glow color in hex */
  emberColor?: string;
  /** Molten magma horizon glow intensity at the bottom (0 to 1.5) */
  coreGlow?: number;
  /** Optional foreground content */
  children?: React.ReactNode;
  /** Additional container classes */
  className?: string;
}

interface EmberParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  flickerPhase: number;
  flickerSpeed: number;
  turbulenceSeed: number;
  /** 0 = charred ash flake, 1 = sharp curved long-exposure spark streak, 2 = foreground bokeh ember */
  plane: 0 | 1 | 2;
  history: { x: number; y: number }[];
}

interface SmokePlume {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  seed: number;
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
  if (Number.isNaN(num)) return { r: 255, g: 107, b: 26 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// 2D divergence-free curl-like velocity field for coherent thermal vortex eddies
function sampleCurlVelocity(
  x: number,
  y: number,
  t: number,
  seed: number
): { cx: number; cy: number } {
  const sx = x * 0.0065;
  const sy = y * 0.0065;
  // Stream function potential psi(x, y, t) derivatives
  const dPsiDy =
    Math.cos(sy * 1.4 - t * 1.3 + seed * 0.2) * 1.35 +
    Math.sin(sx * 2.1 + sy * 1.9 + t * 0.9) * 0.85 +
    Math.cos(sy * 3.4 + sx * 1.2 - t * 1.8) * 0.45;
  const dPsiDx =
    -Math.sin(sx * 1.4 + t * 1.1 + seed * 0.2) * 1.1 +
    Math.cos(sx * 2.1 + sy * 1.9 + t * 0.9) * 0.65;
  return { cx: dPsiDy, cy: -dPsiDx * 0.35 };
}

const EMBER_PRESETS = [
  { label: "Magma Orange", hex: "#FF6B1A" },
  { label: "Solar Gold", hex: "#FACC15" },
  { label: "Crimson Forge", hex: "#F43F5E" },
  { label: "Arcane Blue", hex: "#38BDF8" },
];

export function VolcanoEmbers({
  emberCount = 110,
  updraftSpeed = 1.2,
  turbulence = 1.0,
  emberColor = "#FF6B1A",
  coreGlow = 0.8,
  children,
  className,
}: VolcanoEmbersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [simCount, setSimCount] = useState(emberCount);
  const [simUpdraft, setSimUpdraft] = useState(updraftSpeed);
  const [simTurbulence, setSimTurbulence] = useState(turbulence);
  const [simColor, setSimColor] = useState(emberColor);
  const [simGlow, setSimGlow] = useState(coreGlow);

  useEffect(() => setSimCount(emberCount), [emberCount]);
  useEffect(() => setSimUpdraft(updraftSpeed), [updraftSpeed]);
  useEffect(() => setSimTurbulence(turbulence), [turbulence]);
  useEffect(() => setSimColor(emberColor), [emberColor]);
  useEffect(() => setSimGlow(coreGlow), [coreGlow]);

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

    const createSmokePlume = (w: number, h: number, randomY = false): SmokePlume => {
      const maxLife = 220 + Math.random() * 140;
      return {
        x: w * (0.1 + Math.random() * 0.8),
        y: randomY ? Math.random() * h : h + 40,
        radius: 65 + Math.random() * 75,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(0.35 + Math.random() * 0.45),
        life: randomY ? Math.random() * maxLife : 0,
        maxLife,
        seed: Math.random() * 10,
      };
    };

    const createEmber = (
      w: number,
      h: number,
      idx: number,
      randomY = false
    ): EmberParticle => {
      const ratio = (idx * 0.61803398875) % 1;
      let plane: 0 | 1 | 2 = 1;
      let size = 2.0;

      if (ratio < 0.2) {
        // Charred floating thermal ash flake
        plane = 0;
        size = 1.4 + Math.random() * 2.0;
      } else if (ratio < 0.88) {
        // Sharp mid-ground incandescent long-exposure spark
        plane = 1;
        size = 1.4 + Math.random() * 2.2;
      } else {
        // Large out-of-focus foreground bokeh ember
        plane = 2;
        size = 14 + Math.random() * 16;
      }

      const maxLife = 120 + Math.random() * 150;
      const startX = Math.random() * w;
      const startY = randomY ? Math.random() * h : h + 8 + Math.random() * 30;

      return {
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 1.2,
        vy:
          plane === 2
            ? -(1.5 + Math.random() * 2.2)
            : -(1.2 + Math.random() * 2.5),
        size,
        life: randomY ? Math.random() * maxLife : 0,
        maxLife,
        flickerPhase: Math.random() * Math.PI * 2,
        flickerSpeed: 0.09 + Math.random() * 0.16,
        turbulenceSeed: Math.random() * 30,
        plane,
        history: [{ x: startX, y: startY }],
      };
    };

    let plumes: SmokePlume[] = Array.from({ length: 18 }, () =>
      createSmokePlume(width, height, true)
    );
    let particles: EmberParticle[] = Array.from({ length: simCount }, (_, i) =>
      createEmber(width, height, i, true)
    );

    const buildCalderaRidge = (w: number, h: number) => {
      const pts: { x: number; y: number }[] = [];
      const steps = 40;
      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        // Jagged volcanic crater rim dipping in the center caldera
        const craterDip = Math.exp(-Math.pow((u - 0.5) * 3.2, 2)) * 18;
        const jagged =
          Math.sin(i * 1.9) * 6 +
          Math.cos(i * 4.3) * 4 +
          Math.sin(i * 9.1) * 2.2;
        pts.push({
          x: u * w,
          y: h - 22 + craterDip + jagged,
        });
      }
      return pts;
    };

    let calderaPts = buildCalderaRidge(width, height);

    const updateSize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth || 800;
      height = container.clientHeight || 520;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      calderaPts = buildCalderaRidge(width, height);
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);

    let rafId = 0;
    let time = 0;
    const rgb = hexToRgb(simColor);

    const render = () => {
      time += 0.016;

      if (particles.length < simCount) {
        while (particles.length < simCount) {
          particles.push(
            createEmber(width, height, particles.length, true)
          );
        }
      } else if (particles.length > simCount) {
        particles.length = simCount;
      }

      // Volcanic smoky night sky gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, "#040305");
      bgGrad.addColorStop(0.52, "#0d070a");
      bgGrad.addColorStop(0.84, "#1e0c08");
      bgGrad.addColorStop(1, "#331206");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Billowing volcanic smoke & ash plumes illuminated from below by the caldera
      for (let i = 0; i < plumes.length; i++) {
        const pl = plumes[i];
        pl.life++;
        if (pl.life >= pl.maxLife || pl.y < -pl.radius) {
          plumes[i] = createSmokePlume(width, height, false);
          continue;
        }
        const pRatio = pl.life / pl.maxLife;
        pl.x +=
          pl.vx +
          Math.sin(time * 0.5 + pl.seed) * 0.35 * simTurbulence;
        pl.y += pl.vy * simUpdraft;

        const curR = pl.radius * (0.75 + pRatio * 0.85);
        const envAlpha = Math.sin(pRatio * Math.PI) * 0.22;
        const bottomProximity = Math.max(0, (pl.y / height));

        const sGrad = ctx.createRadialGradient(
          pl.x,
          pl.y + curR * 0.25,
          curR * 0.1,
          pl.x,
          pl.y,
          curR
        );
        // Under-lit warm magma scatter at the base of the smoke cloud, dark charcoal at top
        const litR = Math.round(18 + bottomProximity * rgb.r * 0.35 * simGlow);
        const litG = Math.round(12 + bottomProximity * rgb.g * 0.28 * simGlow);
        const litB = Math.round(16 + bottomProximity * rgb.b * 0.22 * simGlow);

        sGrad.addColorStop(0, `rgba(${litR}, ${litG}, ${litB}, ${envAlpha.toFixed(3)})`);
        sGrad.addColorStop(0.6, `rgba(14, 10, 14, ${(envAlpha * 0.65).toFixed(3)})`);
        sGrad.addColorStop(1, "rgba(8, 6, 10, 0)");

        ctx.fillStyle = sGrad;
        ctx.beginPath();
        ctx.arc(pl.x, pl.y, curR, 0, Math.PI * 2);
        ctx.fill();
      }

      // Molten caldera horizon glow at the bottom
      const pulse = 0.92 + Math.sin(time * 2.4) * 0.08;
      const horizonGlow = ctx.createRadialGradient(
        width * 0.5,
        height * 1.04,
        8,
        width * 0.5,
        height * 1.01,
        width * 0.72
      );
      const glowAlpha = Math.min(1, simGlow * 0.62 * pulse);
      horizonGlow.addColorStop(
        0,
        `rgba(255, 248, 200, ${(glowAlpha * 0.92).toFixed(3)})`
      );
      horizonGlow.addColorStop(
        0.26,
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${glowAlpha.toFixed(3)})`
      );
      horizonGlow.addColorStop(
        0.62,
        `rgba(${Math.floor(rgb.r * 0.65)}, ${Math.floor(rgb.g * 0.22)}, 8, ${(
          glowAlpha * 0.38
        ).toFixed(3)})`
      );
      horizonGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, 0, width, height);

      // Update & draw embers across depth planes
      const updateAndDrawEmber = (p: EmberParticle, idx: number) => {
        p.life++;
        p.flickerPhase += p.flickerSpeed;

        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio >= 1 || p.y < -50) {
          particles[idx] = createEmber(width, height, idx, false);
          return;
        }

        // Coherent curl-noise vortex eddy turbulence
        const { cx, cy } = sampleCurlVelocity(
          p.x,
          p.y,
          time,
          p.turbulenceSeed
        );
        p.vx += (cx * 1.35 * simTurbulence - p.vx) * 0.065;
        const vyTarget = (p.vy + cy * 0.45 * simTurbulence) * simUpdraft;

        // Pointer thermal updraft deflection
        if (pointerRef.current.active) {
          const dx = p.x - pointerRef.current.x;
          const dy = p.y - pointerRef.current.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 28000 && distSq > 16) {
            const dist = Math.sqrt(distSq);
            const push = (1 - dist / 167) * 0.42;
            p.vx += (dx / dist) * push;
          }
        }

        p.x += p.vx;
        p.y += vyTarget;

        if (p.x < -30) {
          p.x = width + 30;
          p.history = [{ x: p.x, y: p.y }];
        } else if (p.x > width + 30) {
          p.x = -30;
          p.history = [{ x: p.x, y: p.y }];
        } else {
          p.history.unshift({ x: p.x, y: p.y });
          if (p.history.length > 7) p.history.pop();
        }

        const coolFactor = Math.max(0, 1 - Math.pow(lifeRatio, 1.4));
        const flicker = 0.68 + 0.32 * Math.sin(p.flickerPhase);
        const radius = p.size * (0.35 + 0.65 * coolFactor);

        if (p.plane === 0) {
          // Floating dark charred thermal ash flake
          ctx.fillStyle = `rgba(148, 163, 184, ${(
            0.3 *
            coolFactor *
            flicker
          ).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.plane === 1) {
          // Curved long-exposure incandescent light streak with white-hot head & orange-red tail
          const alpha = coolFactor * flicker;
          if (p.history.length >= 2) {
            const tailPt = p.history[p.history.length - 1];
            const streakGrad = ctx.createLinearGradient(
              p.x,
              p.y,
              tailPt.x,
              tailPt.y
            );
            streakGrad.addColorStop(
              0,
              `rgba(255, 253, 235, ${Math.min(1, alpha * 1.1).toFixed(3)})`
            );
            streakGrad.addColorStop(
              0.38,
              `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(alpha * 0.88).toFixed(3)})`
            );
            streakGrad.addColorStop(
              1,
              `rgba(${Math.floor(rgb.r * 0.7)}, 20, 5, 0)`
            );

            ctx.strokeStyle = streakGrad;
            ctx.lineWidth = radius * 1.35;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.moveTo(p.history[0].x, p.history[0].y);
            for (let hIdx = 1; hIdx < p.history.length; hIdx++) {
              ctx.lineTo(p.history[hIdx].x, p.history[hIdx].y);
            }
            ctx.stroke();
          }

          // Hot incandescent core bloom
          const haloR = radius * 4.2;
          const eGrad = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            haloR
          );
          eGrad.addColorStop(
            0,
            `rgba(255, 255, 240, ${(alpha * 0.96).toFixed(3)})`
          );
          eGrad.addColorStop(
            0.32,
            `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(alpha * 0.72).toFixed(3)})`
          );
          eGrad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);

          ctx.fillStyle = eGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, haloR, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Out-of-focus foreground optical bokeh ember disc
          const bokehAlpha = coolFactor * flicker * 0.22;
          const bGrad = ctx.createRadialGradient(
            p.x,
            p.y,
            radius * 0.1,
            p.x,
            p.y,
            radius
          );
          bGrad.addColorStop(
            0,
            `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(bokehAlpha * 0.55).toFixed(
              3
            )})`
          );
          bGrad.addColorStop(
            0.78,
            `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(bokehAlpha * 0.92).toFixed(
              3
            )})`
          );
          bGrad.addColorStop(
            0.92,
            `rgba(255, 235, 190, ${(bokehAlpha * 1.15).toFixed(3)})`
          );
          bGrad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);

          ctx.fillStyle = bGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      // Render ash & sharp mid-ground spark streaks
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (let i = 0; i < particles.length; i++) {
        if (particles[i].plane !== 2) {
          updateAndDrawEmber(particles[i], i);
        }
      }
      ctx.restore();

      // Jagged volcanic basalt caldera rim along the bottom edge with glowing magma rim
      if (calderaPts.length > 0) {
        ctx.save();
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(
          0.45 * simGlow
        ).toFixed(3)})`;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(calderaPts[0].x, calderaPts[0].y);
        for (const pt of calderaPts) {
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();

        ctx.fillStyle = "#060304";
        ctx.beginPath();
        ctx.moveTo(0, height);
        for (const pt of calderaPts) {
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Render large out-of-focus foreground bokeh embers in front of the caldera rim
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (let i = 0; i < particles.length; i++) {
        if (particles[i].plane === 2) {
          updateAndDrawEmber(particles[i], i);
        }
      }
      ctx.restore();

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [simCount, simUpdraft, simTurbulence, simColor, simGlow]);

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
    setSimCount(emberCount);
    setSimUpdraft(updraftSpeed);
    setSimTurbulence(turbulence);
    setSimColor(emberColor);
    setSimGlow(coreGlow);
  };

  return (
    <div
      ref={containerRef}
      data-fullscreen-scroll
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl bg-[#040305] text-slate-100 select-none",
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

export default VolcanoEmbers;
