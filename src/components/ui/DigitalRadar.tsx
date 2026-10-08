"use client";

import React, { useEffect, useRef, useState } from "react";
import { Radar, Crosshair, Activity, Plus, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DigitalRadarProps {
  /** Angular rotation speed multiplier */
  sweepSpeed?: number;
  /** Number of tracked tactical blips */
  blipCount?: number;
  /** Primary radar phosphor color in hex format */
  color?: string;
  /** Number of concentric range rings */
  rangeRings?: number;
  /** Whether to render target coordinate labels and HUD readouts */
  showTelemetry?: boolean;
  /** Optional foreground content */
  children?: React.ReactNode;
  /** Additional Tailwind classes */
  className?: string;
}

interface RadarBlip {
  id: string;
  angle: number; // polar angle in radians [0, 2*PI)
  distanceNorm: number; // normalized radius [0.16, 0.90]
  heading: number; // target movement heading in radians
  intensity: number; // [0, 1] phosphor excitation triggered on sweep contact
  altitude: number; // Flight level in hundreds of feet
  velocity: number; // Speed in knots
  classification: "HOSTILE" | "FRIENDLY" | "UNKNOWN";
  trail: { angle: number; dist: number }[];
}

interface ClutterCell {
  angle: number;
  distNorm: number;
  sizeNorm: number;
  density: number;
  intensity: number;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return { r: 16, g: 185, b: 129 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function DigitalRadar({
  sweepSpeed: propSweepSpeed = 1.0,
  blipCount: propBlipCount = 8,
  color: propColor = "#10B981",
  rangeRings: propRangeRings = 4,
  showTelemetry: propShowTelemetry = true,
  children,
  className,
}: DigitalRadarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeColor, setActiveColor] = useState(propColor);
  const [activeSpeed, setActiveSpeed] = useState(propSweepSpeed);
  const [activeBlipCount, setActiveBlipCount] = useState(propBlipCount);
  const [showTelemetry, setShowTelemetry] = useState(propShowTelemetry);
  const [sweepDeg, setSweepDeg] = useState(0);

  useEffect(() => {
    setActiveColor(propColor);
  }, [propColor]);

  useEffect(() => {
    setActiveSpeed(propSweepSpeed);
  }, [propSweepSpeed]);

  useEffect(() => {
    setActiveBlipCount(propBlipCount);
  }, [propBlipCount]);

  useEffect(() => {
    setShowTelemetry(propShowTelemetry);
  }, [propShowTelemetry]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    let currentAngle = -Math.PI * 0.5;
    let frameTick = 0;

    // Generate procedural topographic / weather clutter cells in polar coordinates
    const clutterClusters = [
      { baseAngle: 0.75, baseDist: 0.58, spread: 0.36, count: 42 },
      { baseAngle: 2.45, baseDist: 0.72, spread: 0.42, count: 48 },
      { baseAngle: 4.3, baseDist: 0.44, spread: 0.28, count: 32 },
    ];
    const clutterCells: ClutterCell[] = [];
    clutterClusters.forEach((cluster, cIdx) => {
      for (let i = 0; i < cluster.count; i++) {
        const seedA = Math.sin(i * 12.9898 + cIdx * 78.233) * 43758.5453;
        const randA = seedA - Math.floor(seedA);
        const seedB = Math.sin(i * 45.164 + cIdx * 19.13) * 23421.631;
        const randB = seedB - Math.floor(seedB);

        const angle =
          (cluster.baseAngle + (randA - 0.5) * cluster.spread * 2 + Math.PI * 2) %
          (Math.PI * 2);
        const distNorm = Math.max(
          0.12,
          Math.min(0.94, cluster.baseDist + (randB - 0.5) * cluster.spread * 0.75)
        );
        clutterCells.push({
          angle,
          distNorm,
          sizeNorm: 0.025 + (randA * 0.045),
          density: 0.12 + randB * 0.22,
          intensity: 0.2,
        });
      }
    });

    const callsigns = [
      "VPR-104",
      "AEX-882",
      "Kestrel-7",
      "NVR-310",
      "SIGMA-4",
      "ORION-9",
      "TALON-2",
      "DRAKE-5",
      "COBALT-6",
      "APEX-12",
      "VECTOR-8",
      "TITAN-3",
      "SPECTRE-1",
      "NOVA-11",
    ];

    const createBlips = (count: number): RadarBlip[] =>
      Array.from({ length: Math.max(1, count) }, (_, i) => {
        const angle = ((i / count) * Math.PI * 2 + Math.random() * 0.45) % (Math.PI * 2);
        const distanceNorm = 0.22 + Math.random() * 0.65;
        return {
          id: callsigns[i % callsigns.length] || `TRK-${101 + i}`,
          angle,
          distanceNorm,
          heading: angle + Math.PI * (0.55 + (Math.random() - 0.5) * 0.6),
          intensity: 0.35 + Math.random() * 0.5,
          altitude: Math.floor(140 + Math.random() * 280),
          velocity: Math.floor(390 + Math.random() * 480),
          classification:
            i % 5 === 0 ? "HOSTILE" : i % 3 === 0 ? "UNKNOWN" : "FRIENDLY",
          trail: [
            { angle: angle - 0.03, dist: distanceNorm + 0.01 },
            { angle: angle - 0.06, dist: distanceNorm + 0.02 },
            { angle: angle - 0.09, dist: distanceNorm + 0.03 },
          ],
        };
      });

    let blips = createBlips(activeBlipCount);

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);

    const rgb = hexToRgb(activeColor);
    const brightR = Math.min(255, rgb.r + 120);
    const brightG = Math.min(255, rgb.g + 120);
    const brightB = Math.min(255, rgb.b + 120);

    const isAngleCrossed = (target: number, prev: number, curr: number) => {
      const normTarget = ((target % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const normPrev = ((prev % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const normCurr = ((curr % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      if (normPrev <= normCurr) {
        return normTarget >= normPrev && normTarget <= normCurr;
      }
      return normTarget >= normPrev || normTarget <= normCurr;
    };

    const render = () => {
      frameTick++;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const maxRadius = Math.min(width, height) * 0.405;

      // Deep CRT Phosphor Scope Background
      const bgGrad = ctx.createRadialGradient(
        cx,
        cy,
        maxRadius * 0.05,
        cx,
        cy,
        Math.max(width, height) * 0.65
      );
      bgGrad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.11)`);
      bgGrad.addColorStop(0.55, "rgba(3, 9, 15, 0.96)");
      bgGrad.addColorStop(1, "rgba(1, 4, 8, 1)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle Cartesian Tactical Grid
      ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.045)`;
      ctx.lineWidth = 1;
      const gridStep = 36;
      for (let x = cx % gridStep; x < width; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = cy % gridStep; y < height; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Advance sweep beam angle
      const prevAngle = currentAngle;
      const step = 0.017 * activeSpeed;
      currentAngle = (currentAngle + step) % (Math.PI * 2);

      if (frameTick % 4 === 0) {
        setSweepDeg(Math.floor(((currentAngle * 180) / Math.PI + 90 + 360) % 360));
      }

      // 1. Render Topographic / Weather Radar Clutter Return inside scope clip
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, maxRadius - 2, 0, Math.PI * 2);
      ctx.clip();

      for (let i = 0; i < clutterCells.length; i++) {
        const cell = clutterCells[i];
        if (isAngleCrossed(cell.angle, prevAngle, currentAngle)) {
          cell.intensity = 1.0;
        } else {
          cell.intensity = Math.max(0.14, cell.intensity * 0.991);
        }

        const cellX = cx + Math.cos(cell.angle) * (cell.distNorm * maxRadius);
        const cellY = cy + Math.sin(cell.angle) * (cell.distNorm * maxRadius);
        const cellR = cell.sizeNorm * maxRadius;

        const cellGrad = ctx.createRadialGradient(
          cellX,
          cellY,
          0,
          cellX,
          cellY,
          cellR
        );
        const alpha = (cell.density * cell.intensity).toFixed(3);
        cellGrad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`);
        cellGrad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);

        ctx.fillStyle = cellGrad;
        ctx.beginPath();
        ctx.arc(cellX, cellY, cellR, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 2. Concentric Range Rings & Nautical Mile Scale
      const rings = Math.max(2, Math.min(8, propRangeRings));
      for (let i = 1; i <= rings; i++) {
        const r = (maxRadius / rings) * i;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle =
          i === rings
            ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.55)`
            : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`;
        ctx.lineWidth = i === rings ? 1.6 : 1;
        ctx.stroke();

        if (showTelemetry) {
          ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.62)`;
          ctx.font = "600 9.5px ui-monospace, SFMono-Regular, Menlo, monospace";
          ctx.textAlign = "left";
          ctx.fillText(`${i * 25} NM`, cx + 6, cy - r + 11);
        }
      }

      // Outer Bezel Ring
      ctx.beginPath();
      ctx.arc(cx, cy, maxRadius + 16, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Crosshair Cardinal Axes & 30-degree Radial Spokes
      for (let deg = 0; deg < 360; deg += 30) {
        const rad = (deg * Math.PI) / 180;
        const isCardinal = deg % 90 === 0;
        ctx.beginPath();
        ctx.moveTo(
          cx + Math.cos(rad) * (isCardinal ? 0 : maxRadius / rings),
          cy + Math.sin(rad) * (isCardinal ? 0 : maxRadius / rings)
        );
        ctx.lineTo(cx + Math.cos(rad) * maxRadius, cy + Math.sin(rad) * maxRadius);
        ctx.strokeStyle = isCardinal
          ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.24)`
          : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 360-Degree Precision Compass Bezel Ticks & Bearings
      for (let deg = 0; deg < 360; deg += 2) {
        const rad = (deg * Math.PI) / 180;
        const isMajor = deg % 30 === 0;
        const isMed = deg % 10 === 0;
        if (!isMed && deg % 4 !== 0) continue;

        const innerTick = maxRadius + 2;
        const outerTick = maxRadius + (isMajor ? 13 : isMed ? 8 : 5);

        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(rad) * innerTick, cy + Math.sin(rad) * innerTick);
        ctx.lineTo(cx + Math.cos(rad) * outerTick, cy + Math.sin(rad) * outerTick);
        ctx.strokeStyle = isMajor
          ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7)`
          : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.28)`;
        ctx.lineWidth = isMajor ? 1.5 : 1;
        ctx.stroke();

        if (isMajor && showTelemetry) {
          const labelRadius = maxRadius + 26;
          const lx = cx + Math.cos(rad) * labelRadius;
          const ly = cy + Math.sin(rad) * labelRadius;
          ctx.fillStyle = `rgba(${brightR}, ${brightG}, ${brightB}, 0.78)`;
          ctx.font = "600 10px ui-monospace, SFMono-Regular, Menlo, monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const compassDeg = (deg + 90) % 360;
          ctx.fillText(`${String(compassDeg).padStart(3, "0")}°`, lx, ly);
        }
      }

      // 3. Rotating Phosphor Conic Sweep Wedge
      const slices = 46;
      const trailArc = Math.PI * 0.48;
      for (let s = 0; s < slices; s++) {
        const ratio = s / slices;
        const a0 = currentAngle - trailArc * (1 - ratio);
        const a1 = currentAngle - trailArc * (1 - (s + 1) / slices);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, maxRadius, a0, a1);
        ctx.closePath();
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(
          Math.pow(ratio, 2.35) * 0.28
        ).toFixed(4)})`;
        ctx.fill();
      }

      // Incandescent Leading Sweep Beam
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(
        cx + Math.cos(currentAngle) * maxRadius,
        cy + Math.sin(currentAngle) * maxRadius
      );
      ctx.strokeStyle = "#FFFFFF";
      ctx.shadowColor = `rgba(${brightR}, ${brightG}, ${brightB}, 1)`;
      ctx.shadowBlur = 14;
      ctx.lineWidth = 2.2;
      ctx.stroke();
      ctx.restore();

      // 4. Update & Render Tactical Target Blips, Velocity Vectors & Transponder Tags
      for (let i = 0; i < blips.length; i++) {
        const blip = blips[i];

        // Slow orbital kinematics
        blip.angle = (blip.angle + 0.00028 * activeSpeed) % (Math.PI * 2);

        if (isAngleCrossed(blip.angle, prevAngle, currentAngle)) {
          blip.intensity = 1.0;
          // Push breadcrumb trail on sweep hit
          blip.trail.unshift({ angle: blip.angle, dist: blip.distanceNorm });
          if (blip.trail.length > 4) blip.trail.pop();
        } else {
          blip.intensity = Math.max(0.14, blip.intensity * 0.988);
        }

        const bx = cx + Math.cos(blip.angle) * (blip.distanceNorm * maxRadius);
        const by = cy + Math.sin(blip.angle) * (blip.distanceNorm * maxRadius);

        const isHostile = blip.classification === "HOSTILE";
        const blipRgb = isHostile ? { r: 244, g: 63, b: 94 } : rgb;

        // Draw decaying history breadcrumb dots
        for (let t = 0; t < blip.trail.length; t++) {
          const pt = blip.trail[t];
          const tx = cx + Math.cos(pt.angle) * (pt.dist * maxRadius);
          const ty = cy + Math.sin(pt.angle) * (pt.dist * maxRadius);
          const tAlpha = blip.intensity * (1 - (t + 1) / (blip.trail.length + 1)) * 0.55;
          ctx.beginPath();
          ctx.arc(tx, ty, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${blipRgb.r}, ${blipRgb.g}, ${blipRgb.b}, ${tAlpha.toFixed(
            3
          )})`;
          ctx.fill();
        }

        // Expanding sonar/radar ping wave immediately following sweep contact
        if (blip.intensity > 0.62) {
          const pingProgress = (1 - blip.intensity) / 0.38;
          const pingRadius = 5 + pingProgress * 28;
          ctx.beginPath();
          ctx.arc(bx, by, pingRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${blipRgb.r}, ${blipRgb.g}, ${blipRgb.b}, ${(
            (1 - pingProgress) *
            0.85
          ).toFixed(3)})`;
          ctx.lineWidth = 1.3;
          ctx.stroke();
        }

        // Velocity Vector Leader Line showing projected heading
        const vecLen = 18;
        const vx = bx + Math.cos(blip.heading) * vecLen;
        const vy = by + Math.sin(blip.heading) * vecLen;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(vx, vy);
        ctx.strokeStyle = `rgba(${blipRgb.r}, ${blipRgb.g}, ${blipRgb.b}, ${(
          blip.intensity * 0.85
        ).toFixed(3)})`;
        ctx.lineWidth = 1.25;
        ctx.stroke();

        // Tactical Diamond / Reticle Symbol + Glowing Core
        ctx.save();
        ctx.translate(bx, by);
        ctx.beginPath();
        if (isHostile) {
          // Diamond symbol for hostile contact
          ctx.moveTo(0, -7);
          ctx.lineTo(7, 0);
          ctx.lineTo(0, 7);
          ctx.lineTo(-7, 0);
          ctx.closePath();
        } else {
          // Tactical bracketed square for friendly/unknown
          ctx.rect(-6, -6, 12, 12);
        }
        ctx.strokeStyle = `rgba(${blipRgb.r}, ${blipRgb.g}, ${blipRgb.b}, ${Math.min(
          1,
          blip.intensity * 1.1
        ).toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Bright Phosphor Center Dot
        ctx.beginPath();
        ctx.arc(0, 0, 2.8, 0, Math.PI * 2);
        ctx.fillStyle =
          blip.intensity > 0.84
            ? "#FFFFFF"
            : `rgba(${blipRgb.r}, ${blipRgb.g}, ${blipRgb.b}, ${blip.intensity.toFixed(
                3
              )})`;
        ctx.shadowColor = `rgba(${blipRgb.r}, ${blipRgb.g}, ${blipRgb.b}, 0.95)`;
        ctx.shadowBlur = blip.intensity * 14;
        ctx.fill();
        ctx.restore();

        // Crisp Transponder Data Block Callout
        if (showTelemetry && blip.intensity > 0.2) {
          const alpha = Math.min(1, blip.intensity * 0.98);
          const calloutX = bx + 13;
          const calloutY = by - 8;

          // Leader tick from target to data block
          ctx.beginPath();
          ctx.moveTo(bx + 6, by - 4);
          ctx.lineTo(calloutX - 2, calloutY + 2);
          ctx.strokeStyle = `rgba(${blipRgb.r}, ${blipRgb.g}, ${blipRgb.b}, ${(
            alpha * 0.6
          ).toFixed(3)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();

          ctx.font = "700 10px ui-monospace, SFMono-Regular, Menlo, monospace";
          ctx.textAlign = "left";
          ctx.textBaseline = "alphabetic";
          ctx.fillStyle = isHostile
            ? `rgba(251, 113, 133, ${alpha.toFixed(3)})`
            : `rgba(${brightR}, ${brightG}, ${brightB}, ${alpha.toFixed(3)})`;
          ctx.fillText(blip.id, calloutX, calloutY);

          const bearingDeg = String(
            Math.floor(((blip.angle * 180) / Math.PI + 90 + 360) % 360)
          ).padStart(3, "0");
          const rangeNm = Math.round(blip.distanceNorm * 100);

          ctx.font = "500 9px ui-monospace, SFMono-Regular, Menlo, monospace";
          ctx.fillStyle = `rgba(226, 232, 240, ${(alpha * 0.82).toFixed(3)})`;
          ctx.fillText(
            `FL${blip.altitude} · ${blip.velocity}KT`,
            calloutX,
            calloutY + 11
          );
          ctx.fillStyle = `rgba(${blipRgb.r}, ${blipRgb.g}, ${blipRgb.b}, ${(
            alpha * 0.72
          ).toFixed(3)})`;
          ctx.fillText(
            `${bearingDeg}°/${rangeNm}NM`,
            calloutX,
            calloutY + 21
          );
        }
      }

      // Center Radar Origin Reticle
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [activeColor, activeSpeed, activeBlipCount, propRangeRings, showTelemetry]);

  return (
    <div
      ref={containerRef}
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-emerald-500/20 bg-[#010509] text-slate-100 shadow-2xl",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* CRT Glass Scanlines & Curved Scope Vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-55"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_48%,rgba(1,4,9,0.88)_100%)]"
      />

      {children ? (
        <div className="relative z-10 h-full w-full">{children}</div>
      ) : (
        <div className="relative z-10 flex min-h-[520px] flex-col justify-between p-6 sm:p-8">
          {/* Top Tactical Telemetry Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-black/70 px-3.5 py-1.5 backdrop-blur-md">
              <Radar className="h-3.5 w-3.5 text-emerald-400" />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                AEGIS CRT SCOPE // AZM {String(sweepDeg).padStart(3, "0")}°
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/70 px-3.5 py-1.5 font-mono text-[11px] text-slate-300 backdrop-blur-md">
              <span className="flex items-center gap-1.5">
                <Crosshair className="h-3 w-3 text-emerald-400" />
                {activeBlipCount} TRACKS
              </span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1 text-rose-400">
                <ShieldAlert className="h-3 w-3" />
                IFF ACTIVE
              </span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Activity className="h-3 w-3" />
                100NM
              </span>
            </div>
          </div>

          {/* Bottom Interactive HUD */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/75 p-3.5 backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowTelemetry((v) => !v)}
                className={cn(
                  "rounded-lg px-2.5 py-1 font-mono text-xs uppercase transition",
                  showTelemetry
                    ? "bg-emerald-500/25 text-emerald-300 ring-1 ring-emerald-400/50"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                )}
              >
                Transponders {showTelemetry ? "ON" : "OFF"}
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveBlipCount((c) => (c >= 14 ? 4 : c + 2))
                }
                className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-slate-200 transition hover:bg-white/10"
              >
                <Plus className="h-3 w-3 text-emerald-400" />
                Tracks ({activeBlipCount})
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                {[
                  { label: "Phosphor Green", hex: "#10B981" },
                  { label: "Naval Cyan", hex: "#06B6D4" },
                  { label: "Tactical Amber", hex: "#F59E0B" },
                ].map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    aria-label={`Select ${preset.label}`}
                    onClick={() => setActiveColor(preset.hex)}
                    className={cn(
                      "h-5 w-5 rounded-full border transition-transform",
                      activeColor === preset.hex
                        ? "scale-110 border-white ring-2 ring-white/40"
                        : "border-white/20 opacity-75 hover:opacity-100"
                    )}
                    style={{ backgroundColor: preset.hex }}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveSpeed((s) =>
                    s >= 2.0 ? 0.5 : Number((s + 0.5).toFixed(1))
                  )
                }
                className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-slate-200 transition hover:bg-white/10"
              >
                Sweep {activeSpeed.toFixed(1)}x
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DigitalRadar;
