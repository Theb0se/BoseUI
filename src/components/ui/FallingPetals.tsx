"use client";

import React, { useEffect, useRef, useState } from "react";
import { Flower2, Wind, ArrowDown, Sparkles, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export type PetalVariant = "sakura" | "autumn" | "golden";

export interface FallingPetalsProps {
  /** Botanical theme preset */
  variant?: PetalVariant;
  /** Number of falling petals or leaves */
  count?: number;
  /** Horizontal wind drift and gust multiplier */
  windSpeed?: number;
  /** Vertical gravity fall velocity multiplier */
  fallSpeed?: number;
  /** 3D pitch/roll/yaw rotational flutter intensity */
  flutter?: number;
  /** Optional foreground content */
  children?: React.ReactNode;
  /** Additional container classes */
  className?: string;
}

interface PetalParticle {
  x: number;
  y: number;
  depth: number;
  /** 0 = distant small, 1 = crisp mid-ground, 2 = foreground soft bokeh */
  plane: 0 | 1 | 2;
  size: number;
  yaw: number;
  pitch: number;
  roll: number;
  yawSpeed: number;
  pitchSpeed: number;
  rollSpeed: number;
  glidePhase: number;
  glideFreq: number;
  glideSpan: number;
  colorIndex: number;
}

const VARIANT_PALETTES: Record<
  PetalVariant,
  {
    label: string;
    bgTop: string;
    bgMid: string;
    bgBottom: string;
    sunbeam: string;
    colors: [string, string, string][];
  }
> = {
  sakura: {
    label: "Sakura Blossom",
    bgTop: "#0c0614",
    bgMid: "#190c26",
    bgBottom: "#281338",
    sunbeam: "rgba(249, 168, 212, 0.08)",
    colors: [
      ["#FFF1F2", "#FBCFE8", "#F472B6"],
      ["#FDF2F8", "#F9A8D4", "#EC4899"],
      ["#FFE4E6", "#FDA4AF", "#FB7185"],
      ["#FFFFFF", "#FCE7F3", "#F43F5E"],
    ],
  },
  autumn: {
    label: "Autumn Maple",
    bgTop: "#110705",
    bgMid: "#210e08",
    bgBottom: "#30150b",
    sunbeam: "rgba(251, 146, 60, 0.09)",
    colors: [
      ["#FFEDD5", "#FB923C", "#C2410C"],
      ["#FEE2E2", "#F87171", "#B91C1C"],
      ["#FEF3C7", "#FBBF24", "#B45309"],
      ["#FED7AA", "#EA580C", "#7C2D12"],
    ],
  },
  golden: {
    label: "Golden Ginkgo",
    bgTop: "#0b0904",
    bgMid: "#1a1407",
    bgBottom: "#291f0b",
    sunbeam: "rgba(253, 224, 71, 0.09)",
    colors: [
      ["#FEFCE8", "#FDE047", "#CA8A04"],
      ["#FEF9C3", "#FACC15", "#A16207"],
      ["#FFFBEB", "#FBBF24", "#B45309"],
      ["#FEF08A", "#EAB308", "#854D0E"],
    ],
  },
};

export function FallingPetals({
  variant = "sakura",
  count = 65,
  windSpeed = 1.0,
  fallSpeed = 1.0,
  flutter = 1.0,
  children,
  className,
}: FallingPetalsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [simVariant, setSimVariant] = useState<PetalVariant>(variant);
  const [simCount, setSimCount] = useState(count);
  const [simWind, setSimWind] = useState(windSpeed);
  const [simFall, setSimFall] = useState(fallSpeed);
  const [simFlutter, setSimFlutter] = useState(flutter);

  useEffect(() => setSimVariant(variant), [variant]);
  useEffect(() => setSimCount(count), [count]);
  useEffect(() => setSimWind(windSpeed), [windSpeed]);
  useEffect(() => setSimFall(fallSpeed), [fallSpeed]);
  useEffect(() => setSimFlutter(flutter), [flutter]);

  const pointerRef = useRef<{ x: number; y: number; vx: number }>({
    x: 0,
    y: 0,
    vx: 0,
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

    const createPetal = (
      w: number,
      h: number,
      idx: number,
      randomY = true
    ): PetalParticle => {
      const rollRatio = (idx * 0.61803398875) % 1;
      let plane: 0 | 1 | 2 = 1;
      let depth = 0.6;
      let size = 12;

      if (rollRatio < 0.3) {
        plane = 0;
        depth = 0.28 + Math.random() * 0.22;
        size = 5.5 + Math.random() * 3.5;
      } else if (rollRatio < 0.86) {
        plane = 1;
        depth = 0.52 + Math.random() * 0.34;
        size = 9.5 + Math.random() * 6.5;
      } else {
        plane = 2;
        depth = 0.92 + Math.random() * 0.32;
        size = 22 + Math.random() * 14;
      }

      return {
        x: Math.random() * w,
        y: randomY ? Math.random() * h : -40 - Math.random() * 45,
        depth,
        plane,
        size,
        yaw: Math.random() * Math.PI * 2,
        pitch: Math.random() * Math.PI * 2,
        roll: Math.random() * Math.PI * 2,
        yawSpeed: (Math.random() - 0.5) * 0.018,
        pitchSpeed: 0.018 + Math.random() * 0.025,
        rollSpeed: 0.014 + Math.random() * 0.022,
        glidePhase: Math.random() * Math.PI * 2,
        glideFreq: 0.85 + Math.random() * 0.75,
        glideSpan: 1.1 + Math.random() * 1.35,
        colorIndex: idx % 4,
      };
    };

    let petals: PetalParticle[] = Array.from({ length: simCount }, (_, i) =>
      createPetal(width, height, i, true)
    );

    const updateSize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth || 800;
      height = container.clientHeight || 520;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);

    let rafId = 0;
    let time = 0;

    const drawSakuraPetal = (r: number, showVeins: boolean) => {
      // Realistic notched heart-shaped sakura petal
      ctx.beginPath();
      ctx.moveTo(0, r * 1.05);
      ctx.bezierCurveTo(
        r * 0.92,
        r * 0.62,
        r * 1.08,
        -r * 0.48,
        r * 0.32,
        -r * 1.02
      );
      ctx.lineTo(0, -r * 0.68);
      ctx.lineTo(-r * 0.32, -r * 1.02);
      ctx.bezierCurveTo(
        -r * 1.08,
        -r * 0.48,
        -r * 0.92,
        r * 0.62,
        0,
        r * 1.05
      );
      ctx.closePath();
      ctx.fill();

      if (showVeins) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(0, r * 0.92);
        ctx.quadraticCurveTo(r * 0.08, 0, r * 0.16, -r * 0.62);
        ctx.moveTo(0, r * 0.92);
        ctx.quadraticCurveTo(-r * 0.08, 0, -r * 0.16, -r * 0.62);
        ctx.stroke();
      }
    };

    const drawAutumnMapleLeaf = (r: number, showVeins: boolean) => {
      // Serrated 5-lobe maple/oak autumn leaf silhouette
      ctx.beginPath();
      ctx.moveTo(0, r * 1.05);
      ctx.lineTo(r * 0.18, r * 0.65);
      ctx.lineTo(r * 0.88, r * 0.48);
      ctx.lineTo(r * 0.52, r * 0.12);
      ctx.lineTo(r * 1.05, -r * 0.35);
      ctx.lineTo(r * 0.42, -r * 0.42);
      ctx.lineTo(0, -r * 1.15);
      ctx.lineTo(-r * 0.42, -r * 0.42);
      ctx.lineTo(-r * 1.05, -r * 0.35);
      ctx.lineTo(-r * 0.52, r * 0.12);
      ctx.lineTo(-r * 0.88, r * 0.48);
      ctx.lineTo(-r * 0.18, r * 0.65);
      ctx.closePath();
      ctx.fill();

      if (showVeins) {
        ctx.strokeStyle = "rgba(255, 247, 237, 0.32)";
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.moveTo(0, r * 1.25);
        ctx.lineTo(0, -r * 0.92);
        ctx.moveTo(0, r * 0.25);
        ctx.lineTo(r * 0.68, -r * 0.22);
        ctx.moveTo(0, r * 0.25);
        ctx.lineTo(-r * 0.68, -r * 0.22);
        ctx.stroke();
      }
    };

    const drawGoldenGinkgo = (r: number, showVeins: boolean) => {
      // Fan-shaped golden ginkgo biloba leaf with stem & cleft
      ctx.beginPath();
      ctx.moveTo(0, r * 1.05);
      ctx.quadraticCurveTo(r * 0.22, r * 0.32, r * 1.12, -r * 0.38);
      ctx.bezierCurveTo(
        r * 0.92,
        -r * 1.05,
        r * 0.24,
        -r * 0.98,
        0,
        -r * 0.52
      );
      ctx.bezierCurveTo(
        -r * 0.24,
        -r * 0.98,
        -r * 0.92,
        -r * 1.05,
        -r * 1.12,
        -r * 0.38
      );
      ctx.quadraticCurveTo(-r * 0.22, r * 0.32, 0, r * 1.05);
      ctx.closePath();
      ctx.fill();

      if (showVeins) {
        ctx.strokeStyle = "rgba(254, 240, 138, 0.38)";
        ctx.lineWidth = 0.65;
        ctx.beginPath();
        ctx.moveTo(0, r * 1.32);
        ctx.lineTo(0, -r * 0.45);
        ctx.moveTo(0, r * 0.65);
        ctx.lineTo(r * 0.52, -r * 0.55);
        ctx.moveTo(0, r * 0.65);
        ctx.lineTo(-r * 0.52, -r * 0.55);
        ctx.stroke();
      }
    };

    const render = () => {
      time += 0.016;
      const palette = VARIANT_PALETTES[simVariant];

      if (petals.length < simCount) {
        while (petals.length < simCount) {
          petals.push(createPetal(width, height, petals.length, true));
        }
      } else if (petals.length > simCount) {
        petals.length = simCount;
      }

      // Rich botanical twilight gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, palette.bgTop);
      bgGrad.addColorStop(0.55, palette.bgMid);
      bgGrad.addColorStop(1, palette.bgBottom);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Diagonal ambient sunbeams
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (let b = 0; b < 3; b++) {
        const bx = width * (0.25 + b * 0.26) + Math.sin(time * 0.3 + b) * 30;
        const beamGrad = ctx.createLinearGradient(
          bx,
          0,
          bx - width * 0.25,
          height
        );
        beamGrad.addColorStop(0, palette.sunbeam);
        beamGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(bx - 70, 0);
        ctx.lineTo(bx + 70, 0);
        ctx.lineTo(bx - width * 0.25 + 150, height);
        ctx.lineTo(bx - width * 0.25 - 150, height);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      const globalGust =
        (Math.sin(time * 0.52) * 0.55 + Math.sin(time * 1.18) * 0.35 + 0.6) *
        simWind;

      pointerRef.current.vx *= 0.92;

      const updateAndDrawPetal = (p: PetalParticle) => {
        // Aerodynamic flutter-and-stall pendulum glide physics:
        // Horizontal velocity peaks in the middle of the swing and stalls at the apex,
        // while vertical descent slows during horizontal glide (aerodynamic lift) and drops at the stall apex.
        p.glidePhase += 0.026 * p.glideFreq * (0.55 + 0.45 * simFlutter);
        const sinPhase = Math.sin(p.glidePhase);
        const cosPhase = Math.cos(p.glidePhase);

        // Horizontal velocity is proportional to cos(glidePhase) -> stalls smoothly at sinPhase = +-1
        const aeroGlideVx = cosPhase * p.glideSpan * (0.65 + 0.55 * simFlutter);
        // Lift peaks when horizontal glide velocity is highest (|cosPhase| near 1)
        const aeroLift = (1 - Math.abs(cosPhase) * 0.48) * simFall;

        p.x +=
          (globalGust * 1.25 + aeroGlideVx + pointerRef.current.vx * 0.08) *
          p.depth;
        p.y += (0.95 + p.depth * 1.05) * aeroLift;

        // Bank angle coupled to aerodynamic glide + gentle 3D pitch/roll rotation
        p.yaw += p.yawSpeed * simFlutter;
        p.pitch += p.pitchSpeed * simFlutter;
        p.roll += p.rollSpeed * simFlutter;

        const margin = p.plane === 2 ? 55 : 35;
        if (p.y > height + margin) {
          p.y = -margin;
          p.x = Math.random() * width;
        }
        if (p.x > width + margin) p.x = -margin;
        if (p.x < -margin) p.x = width + margin;

        const scaleX = 0.26 + Math.abs(Math.cos(p.roll + sinPhase * 0.6)) * 0.74;
        const scaleY = 0.28 + Math.abs(Math.sin(p.pitch)) * 0.72;
        const bankAngle = p.yaw + sinPhase * 0.48 * simFlutter;

        const [tipColor, midColor, baseColor] =
          palette.colors[p.colorIndex % palette.colors.length];

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(bankAngle);
        ctx.scale(scaleX, scaleY);

        if (p.plane === 2) {
          // Out-of-focus foreground bokeh petal
          ctx.globalAlpha = 0.26;
          const bokehGrad = ctx.createRadialGradient(
            0,
            0,
            p.size * 0.1,
            0,
            0,
            p.size * 1.1
          );
          bokehGrad.addColorStop(0, tipColor);
          bokehGrad.addColorStop(0.55, midColor);
          bokehGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = bokehGrad;
        } else {
          ctx.globalAlpha = p.plane === 0 ? 0.48 : 0.92;
          const pGrad = ctx.createLinearGradient(
            -p.size * 0.5,
            -p.size,
            p.size * 0.5,
            p.size
          );
          pGrad.addColorStop(0, tipColor);
          pGrad.addColorStop(0.55, midColor);
          pGrad.addColorStop(1, baseColor);
          ctx.fillStyle = pGrad;
        }

        const showVeins = p.plane === 1;
        if (simVariant === "sakura") {
          drawSakuraPetal(p.size, showVeins);
        } else if (simVariant === "autumn") {
          drawAutumnMapleLeaf(p.size, showVeins);
        } else {
          drawGoldenGinkgo(p.size, showVeins);
        }

        ctx.restore();
      };

      // Render across 3 optical depth-of-field planes
      for (const p of petals) {
        if (p.plane === 0) updateAndDrawPetal(p);
      }
      for (const p of petals) {
        if (p.plane === 1) updateAndDrawPetal(p);
      }
      for (const p of petals) {
        if (p.plane === 2) updateAndDrawPetal(p);
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [simVariant, simCount, simWind, simFall, simFlutter]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = e.clientX - rect.left;
    const dx = nx - pointerRef.current.x;
    pointerRef.current.x = nx;
    pointerRef.current.y = e.clientY - rect.top;
    pointerRef.current.vx = Math.max(-18, Math.min(18, dx));
  };

  const resetDefaults = () => {
    setSimVariant(variant);
    setSimCount(count);
    setSimWind(windSpeed);
    setSimFall(fallSpeed);
    setSimFlutter(flutter);
  };

  return (
    <div
      ref={containerRef}
      data-fullscreen-scroll
      onPointerMove={handlePointerMove}
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl bg-[#0c0614] text-slate-100 select-none",
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

export default FallingPetals;
