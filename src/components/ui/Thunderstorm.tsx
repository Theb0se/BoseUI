"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { CloudLightning, CloudRain, Wind, Zap, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ThunderstormProps {
  /** Number of wind-driven rain streaks on screen */
  rainIntensity?: number;
  /** Probability rate of automatic lightning strikes (0 = manual only, 1 = frequent) */
  lightningFrequency?: number;
  /** Wind tilt angle in degrees (-35 to 35) */
  windAngle?: number;
  /** Primary lightning bolt glow color in hex */
  boltColor?: string;
  /** Screen & cloud exposure flash intensity on strike (0 to 1) */
  flashIntensity?: number;
  /** Optional foreground content */
  children?: React.ReactNode;
  /** Additional container classes */
  className?: string;
}

interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  alpha: number;
  isMainChannel: boolean;
  tRatio: number;
}

interface LightningBolt {
  segments: Segment[];
  originX: number;
  originY: number;
  life: number;
  maxLife: number;
  restrikeFrames: [number, number];
}

interface RainDrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  depth: number;
  isForeground: boolean;
}

interface SplashRipple {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

interface CloudLobe {
  offsetX: number;
  offsetY: number;
  rx: number;
  ry: number;
}

interface CloudCluster {
  x: number;
  y: number;
  speed: number;
  layer: number;
  lobes: CloudLobe[];
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
  if (Number.isNaN(num)) return { r: 224, g: 242, b: 254 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function generateSteppedLeaderSegments(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  displace: number,
  startWidth: number,
  endWidth: number,
  alpha: number,
  depth: number,
  isMainChannel: boolean,
  t0: number,
  t1: number,
  out: Segment[]
) {
  if (depth <= 0 || displace < 1.8) {
    out.push({
      x1,
      y1,
      x2,
      y2,
      width: (startWidth + endWidth) * 0.5,
      alpha,
      isMainChannel,
      tRatio: (t0 + t1) * 0.5,
    });
    return;
  }

  const tMid = (t0 + t1) * 0.5;
  const midWidth = (startWidth + endWidth) * 0.5;
  const jitterX = (Math.random() - 0.5) * displace;
  const jitterY = (Math.random() - 0.5) * displace * 0.28;
  const midX = (x1 + x2) * 0.5 + jitterX;
  const midY = (y1 + y2) * 0.5 + jitterY;

  generateSteppedLeaderSegments(
    x1,
    y1,
    midX,
    midY,
    displace * 0.53,
    startWidth,
    midWidth,
    alpha,
    depth - 1,
    isMainChannel,
    t0,
    tMid,
    out
  );
  generateSteppedLeaderSegments(
    midX,
    midY,
    x2,
    y2,
    displace * 0.53,
    midWidth,
    endWidth,
    alpha,
    depth - 1,
    isMainChannel,
    tMid,
    t1,
    out
  );

  // Secondary & hair-thin tertiary branching forks
  const branchChance = isMainChannel ? 0.48 : 0.34;
  if (depth >= 2 && Math.random() < branchChance) {
    const dx = x2 - midX;
    const dy = y2 - midY;
    const side = Math.random() < 0.5 ? -1 : 1;
    const angle = side * (0.32 + Math.random() * 0.52);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const branchScale = isMainChannel
      ? 0.58 + Math.random() * 0.38
      : 0.45 + Math.random() * 0.3;
    const bx = midX + (dx * cos - dy * sin) * branchScale;
    const by = midY + (dx * sin + dy * cos) * branchScale;

    generateSteppedLeaderSegments(
      midX,
      midY,
      bx,
      by,
      displace * 0.46,
      midWidth * 0.58,
      Math.max(0.25, midWidth * 0.14),
      alpha * 0.68,
      depth - 2,
      false,
      tMid,
      Math.min(1, tMid + 0.3),
      out
    );
  }
}

const BOLT_PRESETS = [
  { label: "Ice Blue", hex: "#E0F2FE" },
  { label: "Plasma Violet", hex: "#DDD6FE" },
  { label: "Ion Cyan", hex: "#A5F3FC" },
  { label: "Solar Amber", hex: "#FEF08A" },
];

export function Thunderstorm({
  rainIntensity = 180,
  lightningFrequency = 0.35,
  windAngle = 14,
  boltColor = "#E0F2FE",
  flashIntensity = 0.6,
  children,
  className,
}: ThunderstormProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [simRain, setSimRain] = useState(rainIntensity);
  const [simFreq, setSimFreq] = useState(lightningFrequency);
  const [simWind, setSimWind] = useState(windAngle);
  const [simColor, setSimColor] = useState(boltColor);
  const [simFlash, setSimFlash] = useState(flashIntensity);
  const [strikeCount, setStrikeCount] = useState(0);

  useEffect(() => setSimRain(rainIntensity), [rainIntensity]);
  useEffect(() => setSimFreq(lightningFrequency), [lightningFrequency]);
  useEffect(() => setSimWind(windAngle), [windAngle]);
  useEffect(() => setSimColor(boltColor), [boltColor]);
  useEffect(() => setSimFlash(flashIntensity), [flashIntensity]);

  const strikeTriggerRef = useRef<(customX?: number) => void>(() => {});

  const handleManualStrike = useCallback(() => {
    strikeTriggerRef.current();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 520;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const createRainDrop = (w: number, h: number, randomY = true): RainDrop => {
      const isForeground = Math.random() < 0.28;
      const depth = isForeground
        ? 0.72 + Math.random() * 0.28
        : 0.22 + Math.random() * 0.45;
      return {
        x: (Math.random() - 0.3) * w * 1.6,
        y: randomY ? Math.random() * h : -35 - Math.random() * 60,
        length: isForeground
          ? (26 + Math.random() * 24) * depth
          : (12 + Math.random() * 14) * depth,
        speed: isForeground
          ? (18 + Math.random() * 10) * depth
          : (11 + Math.random() * 7) * depth,
        depth,
        isForeground,
      };
    };

    const createCloudClusters = (w: number): CloudCluster[] => {
      const clusters: CloudCluster[] = [];
      const count = 18;
      for (let i = 0; i < count; i++) {
        const layer = i % 3;
        const lobes: CloudLobe[] = [];
        const lobeCount = 4 + (i % 3);
        for (let l = 0; l < lobeCount; l++) {
          const angle = (l / lobeCount) * Math.PI * 2;
          lobes.push({
            offsetX: Math.cos(angle) * (45 + (l % 2) * 35),
            offsetY: Math.sin(angle) * (14 + (l % 2) * 12),
            rx: 95 + ((i * 29 + l * 17) % 75),
            ry: 38 + layer * 12 + ((l * 13) % 18),
          });
        }
        clusters.push({
          x: (i / count) * (w + 360) - 180,
          y: 18 + layer * 42 + Math.sin(i * 2.4) * 16,
          speed: (0.14 + layer * 0.12) * (i % 2 === 0 ? 1 : 0.82),
          layer,
          lobes,
        });
      }
      return clusters;
    };

    let drops: RainDrop[] = Array.from({ length: simRain }, () =>
      createRainDrop(width, height, true)
    );
    let clouds: CloudCluster[] = createCloudClusters(width);
    const bolts: LightningBolt[] = [];
    const splashes: SplashRipple[] = [];
    let screenFlash = 0;
    let flashCenterX = width * 0.5;
    let flashCenterY = 55;
    let time = 0;

    const spawnBolt = (customX?: number) => {
      const originX =
        customX !== undefined
          ? customX
          : width * (0.14 + Math.random() * 0.72);
      const originY = 18 + Math.random() * 38;
      const targetX = originX + (Math.random() - 0.5) * 210;
      const targetY = height * (0.78 + Math.random() * 0.22);

      const segments: Segment[] = [];
      generateSteppedLeaderSegments(
        originX,
        originY,
        targetX,
        targetY,
        125,
        3.4,
        1.1,
        1.0,
        6,
        true,
        0,
        1,
        segments
      );

      const f1 = 4 + Math.floor(Math.random() * 3);
      const f2 = f1 + 3 + Math.floor(Math.random() * 4);

      bolts.push({
        segments,
        originX,
        originY,
        life: 0,
        maxLife: 26 + Math.floor(Math.random() * 10),
        restrikeFrames: [f1, f2],
      });

      screenFlash = Math.min(1.1, screenFlash + 0.92);
      flashCenterX = originX;
      flashCenterY = originY + 24;
      setStrikeCount((c) => c + 1);
    };

    strikeTriggerRef.current = spawnBolt;

    const updateSize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth || 800;
      height = container.clientHeight || 520;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      clouds = createCloudClusters(width);
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);

    const initialTimer = setTimeout(() => {
      spawnBolt(width * 0.56);
    }, 320);

    let rafId = 0;
    const rgb = hexToRgb(simColor);

    const render = () => {
      time += 0.016;

      if (drops.length < simRain) {
        while (drops.length < simRain) {
          drops.push(createRainDrop(width, height, true));
        }
      } else if (drops.length > simRain) {
        drops.length = simRain;
      }

      if (simFreq > 0 && Math.random() < simFreq * 0.022) {
        spawnBolt();
      }

      screenFlash *= 0.87;
      const effectiveFlash = screenFlash * simFlash;

      // Deep storm atmosphere gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      const boost = Math.floor(effectiveFlash * 48);
      skyGrad.addColorStop(
        0,
        `rgb(${5 + boost}, ${9 + boost}, ${19 + Math.floor(boost * 1.45)})`
      );
      skyGrad.addColorStop(
        0.55,
        `rgb(${10 + boost}, ${16 + boost}, ${31 + Math.floor(boost * 1.3)})`
      );
      skyGrad.addColorStop(1, "#04070f");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Slanted distant rain sheets (curtains)
      const rad = (simWind * Math.PI) / 180;
      const sinA = Math.sin(rad);
      const cosA = Math.cos(rad);

      ctx.save();
      for (let s = 0; s < 5; s++) {
        const sheetX =
          (((s * 240 + time * (22 + s * 6) * (simWind >= 0 ? 1 : -1)) %
            (width + 300)) +
            (width + 300)) %
            (width + 300) -
          150;
        const sheetGrad = ctx.createLinearGradient(
          sheetX,
          60,
          sheetX + sinA * height,
          height
        );
        const sheetAlpha = (0.025 + effectiveFlash * 0.045).toFixed(3);
        sheetGrad.addColorStop(0, "rgba(148, 163, 184, 0)");
        sheetGrad.addColorStop(0.4, `rgba(186, 230, 253, ${sheetAlpha})`);
        sheetGrad.addColorStop(1, "rgba(148, 163, 184, 0)");
        ctx.fillStyle = sheetGrad;
        ctx.beginPath();
        ctx.moveTo(sheetX - 75, 40);
        ctx.lineTo(sheetX + 75, 40);
        ctx.lineTo(sheetX + 75 + sinA * height, height);
        ctx.lineTo(sheetX - 75 + sinA * height, height);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Volumetric textured storm cloud banks with internal cyan-violet scattering
      const windFactor = simWind / 14;
      for (const cluster of clouds) {
        cluster.x += cluster.speed * (0.65 + windFactor * 0.45);
        if (cluster.x > width + 240) cluster.x = -240;
        if (cluster.x < -240) cluster.x = width + 240;

        const distToBolt = Math.hypot(
          cluster.x - flashCenterX,
          cluster.y - flashCenterY
        );
        const scatter =
          effectiveFlash * Math.max(0, Math.exp(-distToBolt / (width * 0.36)));

        for (const lobe of cluster.lobes) {
          const lx = cluster.x + lobe.offsetX;
          const ly = cluster.y + lobe.offsetY;
          const cGrad = ctx.createRadialGradient(
            lx,
            ly - lobe.ry * 0.2,
            lobe.ry * 0.1,
            lx,
            ly,
            lobe.rx
          );

          const baseR = 11 + cluster.layer * 4;
          const baseG = 16 + cluster.layer * 6;
          const baseB = 28 + cluster.layer * 9;

          // Internal cyan-violet subsurface cloud scattering near bolt origin
          const r = Math.min(255, Math.round(baseR + scatter * (rgb.r * 0.65 + 45)));
          const g = Math.min(255, Math.round(baseG + scatter * (rgb.g * 0.72 + 30)));
          const b = Math.min(255, Math.round(baseB + scatter * (rgb.b * 0.9 + 65)));

          cGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.72)`);
          cGrad.addColorStop(
            0.55,
            `rgba(${Math.round(r * 0.75)}, ${Math.round(g * 0.78)}, ${Math.round(
              b * 0.85
            )}, 0.34)`
          );
          cGrad.addColorStop(1, `rgba(${baseR}, ${baseG}, ${baseB}, 0)`);

          ctx.fillStyle = cGrad;
          ctx.beginPath();
          ctx.ellipse(lx, ly, lobe.rx, lobe.ry, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Internal cloud discharge hotspot right around the bolt origin
      if (effectiveFlash > 0.01) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        const coreGlow = ctx.createRadialGradient(
          flashCenterX,
          flashCenterY,
          4,
          flashCenterX,
          flashCenterY,
          width * 0.48
        );
        coreGlow.addColorStop(
          0,
          `rgba(255, 255, 255, ${(effectiveFlash * 0.85).toFixed(3)})`
        );
        coreGlow.addColorStop(
          0.18,
          `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(effectiveFlash * 0.62).toFixed(
            3
          )})`
        );
        coreGlow.addColorStop(
          0.48,
          `rgba(167, 139, 250, ${(effectiveFlash * 0.22).toFixed(3)})`
        );
        coreGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = coreGlow;
        ctx.fillRect(0, 0, width, height * 0.65);
        ctx.restore();
      }

      // Active Stepped-Leader Lightning Bolts with restrike flicker & beaded decay
      for (let i = bolts.length - 1; i >= 0; i--) {
        const bolt = bolts[i];
        bolt.life++;
        if (bolt.life >= bolt.maxLife) {
          bolts.splice(i, 1);
          continue;
        }

        const isRestrike =
          bolt.life === bolt.restrikeFrames[0] ||
          bolt.life === bolt.restrikeFrames[0] + 1 ||
          bolt.life === bolt.restrikeFrames[1];

        if (bolt.life === bolt.restrikeFrames[0] || bolt.life === bolt.restrikeFrames[1]) {
          screenFlash = Math.max(screenFlash, 0.72);
        }

        const progress = bolt.life / bolt.maxLife;
        const mainFlicker = isRestrike
          ? 1.0
          : Math.pow(Math.max(0, 1 - progress), 1.65);
        const branchFlicker = isRestrike
          ? 0.75
          : Math.pow(Math.max(0, 1 - progress * 1.25), 2.1);

        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.globalCompositeOperation = "screen";

        // Pass 1: Wide outer atmospheric HDR bloom
        for (const seg of bolt.segments) {
          const f = seg.isMainChannel ? mainFlicker : branchFlicker;
          const a = seg.alpha * f;
          if (a <= 0.02) continue;
          ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(
            a * 0.18
          ).toFixed(3)})`;
          ctx.lineWidth = seg.width * 9.0;
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.stroke();
        }

        // Pass 2: Medium cyan-violet plasma sheath
        for (const seg of bolt.segments) {
          const f = seg.isMainChannel ? mainFlicker : branchFlicker;
          const a = seg.alpha * f;
          if (a <= 0.02) continue;
          ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(
            a * 0.52
          ).toFixed(3)})`;
          ctx.lineWidth = seg.width * 3.2;
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.stroke();
        }

        // Pass 3: White-hot core channel (with beaded ionization decay late in life)
        for (let sIdx = 0; sIdx < bolt.segments.length; sIdx++) {
          const seg = bolt.segments[sIdx];
          const f = seg.isMainChannel ? mainFlicker : branchFlicker;
          const a = seg.alpha * f;
          if (a <= 0.02) continue;
          // During late decay, alternate segments create realistic beaded lightning decay
          if (progress > 0.62 && !isRestrike && sIdx % 2 === 1) continue;

          ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(1, a * 1.05).toFixed(
            3
          )})`;
          ctx.lineWidth = seg.width;
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.stroke();
        }

        ctx.restore();
      }

      // Multi-layered rain streaks (distant fine curtains + fast foreground streaks)
      ctx.lineCap = "round";
      for (const d of drops) {
        d.x += sinA * d.speed;
        d.y += cosA * d.speed;

        if (d.y > height - 4) {
          if (d.isForeground && splashes.length < 70 && Math.random() < 0.45) {
            splashes.push({
              x: d.x,
              y: height - 2 - Math.random() * 8,
              vx: (Math.random() - 0.5) * 2.2 + sinA * 1.2,
              vy: -(1.4 + Math.random() * 2.1),
              life: 0,
              maxLife: 10 + Math.floor(Math.random() * 8),
            });
          }
          d.y = -30 - Math.random() * 45;
          d.x = (Math.random() - 0.3) * width * 1.6;
        }
        if (d.x > width + 160) d.x = -120;
        if (d.x < -160) d.x = width + 120;

        const baseAlpha = d.isForeground
          ? 0.24 + d.depth * 0.28
          : 0.09 + d.depth * 0.16;
        const alpha = baseAlpha * (1 + effectiveFlash * 0.75);
        ctx.strokeStyle = `rgba(186, 230, 253, ${Math.min(0.88, alpha).toFixed(
          3
        )})`;
        ctx.lineWidth = d.isForeground ? 1.1 + d.depth * 0.8 : 0.55 + d.depth * 0.45;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - sinA * d.length, d.y - cosA * d.length);
        ctx.stroke();
      }

      // Bottom splash droplets & ground mist
      for (let i = splashes.length - 1; i >= 0; i--) {
        const sp = splashes[i];
        sp.life++;
        if (sp.life >= sp.maxLife) {
          splashes.splice(i, 1);
          continue;
        }
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vy += 0.28;
        const spAlpha = (1 - sp.life / sp.maxLife) * 0.45;
        ctx.fillStyle = `rgba(224, 242, 254, ${spAlpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 1.1, 0, Math.PI * 2);
        ctx.fill();
      }

      const splashMist = ctx.createLinearGradient(0, height - 55, 0, height);
      splashMist.addColorStop(0, "rgba(15, 23, 42, 0)");
      splashMist.addColorStop(
        1,
        `rgba(148, 163, 184, ${(0.08 + effectiveFlash * 0.12).toFixed(3)})`
      );
      ctx.fillStyle = splashMist;
      ctx.fillRect(0, height - 55, width, 55);

      // Full-screen atmospheric exposure flash
      if (effectiveFlash > 0.02) {
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(
          effectiveFlash * 0.18
        ).toFixed(3)})`;
        ctx.fillRect(0, 0, width, height);
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      clearTimeout(initialTimer);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [simRain, simFreq, simWind, simColor, simFlash]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("[data-hud-panel]")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    strikeTriggerRef.current(e.clientX - rect.left);
  };

  const resetDefaults = () => {
    setSimRain(rainIntensity);
    setSimFreq(lightningFrequency);
    setSimWind(windAngle);
    setSimColor(boltColor);
    setSimFlash(flashIntensity);
  };

  return (
    <div
      ref={containerRef}
      data-fullscreen-scroll
      onClick={handleCanvasClick}
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl bg-[#04070f] text-slate-100 select-none cursor-crosshair",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {children ? (
        <div className="relative z-10 h-full w-full">{children}</div>
      ) : (
        <div className="relative z-10 flex min-h-[520px] flex-col justify-between p-6 sm:p-8">
          {/* Header & Telemetry */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-950/40 px-3 py-1 text-xs font-medium text-sky-200 backdrop-blur-md">
                <CloudLightning className="h-3.5 w-3.5 text-sky-300" />
                <span>Stepped-Leader Storm Engine</span>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Procedural Thunderstorm
              </h2>
              <p className="max-w-md text-xs text-slate-300/80 sm:text-sm">
                Internal cloud subsurface scattering, multi-pulse restrike
                flicker, and layered wind-driven rain curtains.
              </p>
            </div>

            <div
              data-hud-panel
              className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-slate-950/65 px-3.5 py-2 text-xs text-slate-300 backdrop-blur-md cursor-default"
            >
              <button
                type="button"
                onClick={handleManualStrike}
                className="inline-flex items-center gap-1.5 rounded-lg bg-sky-400/20 border border-sky-300/40 px-3 py-1 font-medium text-sky-100 transition-all hover:bg-sky-400/30 active:scale-95 cursor-pointer"
              >
                <Zap className="h-3.5 w-3.5 text-sky-300" />
                Trigger Strike
              </button>
              <span className="text-white/20">|</span>
              <span className="font-mono">{strikeCount} STRIKES</span>
            </div>
          </div>

          {/* Bottom Interactive HUD */}
          <div
            data-hud-panel
            className="mt-auto flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-4 backdrop-blur-xl cursor-default sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-wrap items-center gap-2">
              {BOLT_PRESETS.map((preset) => {
                const active =
                  simColor.toLowerCase() === preset.hex.toLowerCase();
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setSimColor(preset.hex)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer",
                      active
                        ? "border-white/30 bg-white/15 text-white"
                        : "border-white/5 bg-white/5 text-slate-300 hover:bg-white/10"
                    )}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor: preset.hex,
                        boxShadow: `0 0 6px ${preset.hex}`,
                      }}
                    />
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <label className="flex items-center gap-2 text-slate-300">
                <CloudRain className="h-3.5 w-3.5 text-sky-300" />
                <span>Rain</span>
                <input
                  type="range"
                  min={40}
                  max={360}
                  value={simRain}
                  onChange={(e) => setSimRain(Number(e.target.value))}
                  className="h-1.5 w-20 cursor-pointer accent-sky-300"
                />
              </label>

              <label className="flex items-center gap-2 text-slate-300">
                <Zap className="h-3.5 w-3.5 text-amber-300" />
                <span>Freq</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={simFreq}
                  onChange={(e) => setSimFreq(Number(e.target.value))}
                  className="h-1.5 w-20 cursor-pointer accent-amber-300"
                />
              </label>

              <label className="flex items-center gap-2 text-slate-300">
                <Wind className="h-3.5 w-3.5 text-cyan-300" />
                <span>Wind</span>
                <input
                  type="range"
                  min={-30}
                  max={30}
                  value={simWind}
                  onChange={(e) => setSimWind(Number(e.target.value))}
                  className="h-1.5 w-20 cursor-pointer accent-cyan-300"
                />
              </label>

              <button
                type="button"
                onClick={resetDefaults}
                title="Reset parameters"
                className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Thunderstorm;
