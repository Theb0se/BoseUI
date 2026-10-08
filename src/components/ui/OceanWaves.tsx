"use client";

import React, { useEffect, useRef, useState } from "react";
import { Waves, Sparkles, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OceanWavesProps {
  /** Number of stacked parallax wave layers (3 to 9). Default: 5 */
  waveCount?: number;
  /** Peak vertical wave height in pixels. Default: 28 */
  amplitude?: number;
  /** Horizontal wave frequency (radians per pixel). Default: 0.008 */
  frequency?: number;
  /** Wave propagation speed multiplier. Default: 1.0 */
  speed?: number;
  /** Primary ocean water hex color. Default: "#0284C7" */
  oceanColor?: string;
  /** Render shimmering white foam highlights along wave ridges. Default: true */
  foam?: boolean;
  /** Optional foreground content */
  children?: React.ReactNode;
  className?: string;
}

interface SprayDroplet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    return [
      parseInt(clean[0] + clean[0], 16) || 2,
      parseInt(clean[1] + clean[1], 16) || 132,
      parseInt(clean[2] + clean[2], 16) || 199,
    ];
  }
  const num = parseInt(clean, 16);
  if (Number.isNaN(num)) return [2, 132, 199];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

const OCEAN_PRESETS = [
  { name: "Pacific", color: "#0284C7", amp: 28, speed: 1.0, count: 5 },
  { name: "Biolume", color: "#0D9488", amp: 34, speed: 0.85, count: 6 },
  { name: "Storm Swell", color: "#2563EB", amp: 44, speed: 1.55, count: 7 },
];

export function OceanWaves({
  waveCount = 5,
  amplitude = 28,
  frequency = 0.008,
  speed = 1.0,
  oceanColor = "#0284C7",
  foam = true,
  children,
  className,
}: OceanWavesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [liveCount, setLiveCount] = useState(waveCount);
  const [liveAmp, setLiveAmp] = useState(amplitude);
  const [liveSpeed, setLiveSpeed] = useState(speed);
  const [liveColor, setLiveColor] = useState(oceanColor);
  const [liveFoam, setLiveFoam] = useState(foam);

  useEffect(() => setLiveCount(waveCount), [waveCount]);
  useEffect(() => setLiveAmp(amplitude), [amplitude]);
  useEffect(() => setLiveSpeed(speed), [speed]);
  useEffect(() => setLiveColor(oceanColor), [oceanColor]);
  useEffect(() => setLiveFoam(foam), [foam]);

  const paramsRef = useRef({
    count: liveCount,
    amp: liveAmp,
    freq: frequency,
    speed: liveSpeed,
    color: liveColor,
    foam: liveFoam,
  });

  useEffect(() => {
    paramsRef.current = {
      count: liveCount,
      amp: liveAmp,
      freq: frequency,
      speed: liveSpeed,
      color: liveColor,
      foam: liveFoam,
    };
  }, [liveCount, liveAmp, frequency, liveSpeed, liveColor, liveFoam]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;
    const sprayDrops: SprayDroplet[] = [];

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let time = 0;

    const render = () => {
      const {
        count: curCount,
        amp: curAmp,
        freq: curFreq,
        speed: curSpeed,
        color: curColor,
        foam: curFoam,
      } = paramsRef.current;

      time += 0.018 * curSpeed;
      const [baseR, baseG, baseB] = hexToRgb(curColor);
      const layers = Math.max(3, Math.min(9, Math.round(curCount)));
      const horizonY = height * 0.35;

      // 1. Atmospheric twilight marine sky with low horizon celestial glow
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY + 30);
      skyGrad.addColorStop(0, "#020613");
      skyGrad.addColorStop(0.55, "#06152D");
      skyGrad.addColorStop(
        0.9,
        `rgb(${Math.min(255, Math.floor(baseR * 0.35 + 14))}, ${Math.min(255, Math.floor(baseG * 0.48 + 26))}, ${Math.min(255, Math.floor(baseB * 0.62 + 42))})`
      );
      skyGrad.addColorStop(1, "#041226");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, horizonY + 30);

      // Low horizon moon/sun atmospheric bloom & light pillar
      const sunX = width * 0.52;
      const sunGlow = ctx.createRadialGradient(
        sunX,
        horizonY - 8,
        4,
        sunX,
        horizonY,
        width * 0.58
      );
      sunGlow.addColorStop(0, "rgba(235, 252, 255, 0.38)");
      sunGlow.addColorStop(
        0.22,
        `rgba(${Math.min(255, baseR + 95)}, ${Math.min(255, baseG + 90)}, 255, 0.2)`
      );
      sunGlow.addColorStop(0.6, `rgba(${baseR}, ${baseG}, ${baseB}, 0.06)`);
      sunGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = sunGlow;
      ctx.fillRect(0, 0, width, height);

      // Base abyssal sea below horizon
      ctx.fillStyle = "#010712";
      ctx.fillRect(0, horizonY, width, height - horizonY);

      const startY = horizonY + 14;
      const bandSpan = height * 0.53;
      const stepX = 5;

      // 2. Render back-to-front Gerstner/Trochoidal swell layers
      for (let i = 0; i < layers; i++) {
        const depth = layers === 1 ? 1 : i / (layers - 1);
        // Non-linear perspective spacing: distant swells are tighter near horizon
        const perspDepth = Math.pow(depth, 1.28);
        const baseY = startY + perspDepth * bandSpan;

        const layerAmp = curAmp * (0.36 + perspDepth * 0.92);
        const layerFreq = curFreq * (1.55 - depth * 0.68);
        const dir = i % 2 === 0 ? 1 : -0.78;
        const phase = i * 2.15 + time * (0.62 + depth * 0.88) * dir;

        // Steepness factor for Gerstner trochoidal peaking (sharper crests, broad troughs)
        const steepness = 0.38 + depth * 0.24;

        const points: Array<{
          x: number;
          y: number;
          slope: number;
          crestFactor: number;
        }> = [];

        for (let x = -20; x <= width + 25; x += stepX) {
          const theta1 = x * layerFreq + phase;
          const theta2 = x * (layerFreq * 1.82) - time * 1.18 + i * 1.3;
          const theta3 = x * (layerFreq * 3.15) + time * 1.75 - i * 0.7;

          // Trochoidal horizontal pinching toward wave crests
          const pinchX =
            x - Math.cos(theta1) * layerAmp * steepness * 0.55;

          // Multi-harmonic vertical displacement with trochoidal sharpening
          const s1 = Math.sin(theta1);
          const sharpCrest = -Math.pow(0.5 + 0.5 * s1, 2.2) * layerAmp * 1.25 + layerAmp * 0.5;
          const h2 = Math.cos(theta2) * (layerAmp * 0.3);
          const h3 = Math.sin(theta3) * (layerAmp * 0.13);

          const yOffset = sharpCrest + h2 + h3;
          const y = baseY + yOffset;

          // Local wave slope for specular sky reflections
          const slope = Math.cos(theta1) * layerFreq * layerAmp;

          // Crest factor (0 in trough, 1 at sharp breaking ridge)
          const crestFactor = Math.max(
            0,
            Math.min(1, (-yOffset / (layerAmp * 1.15) + 0.28) * 0.95)
          );

          points.push({ x: pinchX, y, slope, crestFactor });
        }

        // Draw primary wave body with subsurface scattering gradient
        ctx.beginPath();
        for (let p = 0; p < points.length; p++) {
          const pt = points[p];
          if (p === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.lineTo(width + 40, height + 30);
        ctx.lineTo(-40, height + 30);
        ctx.closePath();

        // Translucent emerald/aquamarine subsurface scattering at thin wave top -> abyssal navy in trough
        const sssR = Math.min(255, Math.round(baseR * 0.65 + 45));
        const sssG = Math.min(255, Math.round(baseG * 1.15 + 75));
        const sssB = Math.min(255, Math.round(baseB * 1.05 + 55));

        const midR = Math.round(baseR * (0.42 + depth * 0.22));
        const midG = Math.round(baseG * (0.5 + depth * 0.22));
        const midB = Math.round(baseB * (0.62 + depth * 0.22));

        const deepR = Math.round(baseR * 0.08);
        const deepG = Math.round(baseG * 0.13);
        const deepB = Math.round(baseB * 0.25 + 8);

        const waveGrad = ctx.createLinearGradient(
          0,
          baseY - layerAmp * 1.35,
          0,
          baseY + layerAmp * 2.4 + 90
        );
        const topAlpha = 0.76 + depth * 0.2;
        waveGrad.addColorStop(0, `rgba(${sssR}, ${sssG}, ${sssB}, ${topAlpha})`);
        waveGrad.addColorStop(0.24, `rgba(${midR}, ${midG}, ${midB}, 0.94)`);
        waveGrad.addColorStop(0.68, `rgba(${deepR}, ${deepG}, ${deepB}, 0.98)`);
        waveGrad.addColorStop(1, "#010610");

        ctx.fillStyle = waveGrad;
        ctx.fill();

        // 3. Subsurface translucent glow band & specular sky reflection ribbons
        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        // Subsurface inner emerald/cyan transmission band right below the ridge
        ctx.beginPath();
        for (let p = 0; p < points.length; p++) {
          const pt = points[p];
          const sssThickness = 3 + pt.crestFactor * (8 + depth * 8);
          if (p === 0) ctx.moveTo(pt.x, pt.y + sssThickness * 0.45);
          else ctx.lineTo(pt.x, pt.y + sssThickness * 0.45);
        }
        ctx.strokeStyle = `rgba(${sssR}, ${Math.min(255, sssG + 30)}, ${sssB}, ${0.18 + depth * 0.16})`;
        ctx.lineWidth = 5 + depth * 6;
        ctx.stroke();

        // Specular water slope reflections under the sun/moon light path
        for (let p = 1; p < points.length; p += 2) {
          const pt = points[p];
          const sunAlign = Math.exp(
            -Math.pow((pt.x - sunX) / (width * 0.32), 2)
          );
          const facetGlint =
            0.5 + 0.5 * Math.sin(pt.x * 0.11 + time * 4.2 + i * 1.7);
          if (facetGlint > 0.58 && sunAlign > 0.12) {
            const specAlpha =
              (facetGlint - 0.55) * sunAlign * (0.28 + depth * 0.35);
            ctx.strokeStyle = `rgba(225, 248, 255, ${specAlpha})`;
            ctx.lineWidth = 1.2 + depth * 1.2;
            ctx.beginPath();
            ctx.moveTo(points[p - 1].x, points[p - 1].y + 3 + facetGlint * 5);
            ctx.lineTo(pt.x, pt.y + 3 + facetGlint * 5);
            ctx.stroke();
          }
        }

        // 4. Organic laced whitecap foam filaments & wind-blown sea spray
        if (curFoam) {
          // Primary variable-width whitecap ridge line
          for (let p = 1; p < points.length; p++) {
            const prev = points[p - 1];
            const pt = points[p];
            if (pt.crestFactor > 0.25) {
              const fAlpha =
                Math.pow(pt.crestFactor, 1.5) * (0.35 + depth * 0.55);
              ctx.strokeStyle = `rgba(242, 252, 255, ${fAlpha})`;
              ctx.lineWidth = 0.8 + pt.crestFactor * (1.8 + depth * 2.2);
              ctx.beginPath();
              ctx.moveTo(prev.x, prev.y);
              ctx.lineTo(pt.x, pt.y);
              ctx.stroke();
            }

            // Laced foam filaments trailing down the forward wave face near high crests
            if (pt.crestFactor > 0.58 && p % 2 === 0) {
              const laceLen =
                (pt.crestFactor - 0.55) * (24 + depth * 32) *
                (0.6 + 0.4 * Math.sin(pt.x * 0.08 + i * 3.1));
              const laceAlpha = (pt.crestFactor - 0.55) * (0.26 + depth * 0.35);

              ctx.strokeStyle = `rgba(230, 249, 255, ${laceAlpha})`;
              ctx.lineWidth = 0.9 + depth * 0.6;
              ctx.beginPath();
              ctx.moveTo(pt.x, pt.y + 1);
              ctx.quadraticCurveTo(
                pt.x - dir * laceLen * 0.35,
                pt.y + laceLen * 0.55,
                pt.x - dir * laceLen * 0.65,
                pt.y + laceLen
              );
              ctx.stroke();
            }

            // Spawn wind-blown sea spray droplets off steep breaking crests
            if (
              pt.crestFactor > 0.78 &&
              sprayDrops.length < 95 &&
              Math.random() < 0.045 * curSpeed
            ) {
              sprayDrops.push({
                x: pt.x,
                y: pt.y - 1,
                vx: dir * (1.2 + Math.random() * 2.4) * curSpeed,
                vy: -(0.9 + Math.random() * 2.1),
                size: 0.9 + Math.random() * 1.6 * (0.5 + depth * 0.6),
                alpha: 0.45 + Math.random() * 0.45,
                life: 0,
                maxLife: 22 + Math.random() * 24,
              });
            }
          }
        }

        ctx.restore();
      }

      // 5. Update and render wind-blown sea spray droplets
      if (curFoam && sprayDrops.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        for (let i = sprayDrops.length - 1; i >= 0; i--) {
          const sp = sprayDrops[i];
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.vy += 0.09; // gravity
          sp.life += 1;

          const lifeRatio = 1 - sp.life / sp.maxLife;
          if (lifeRatio <= 0) {
            sprayDrops.splice(i, 1);
            continue;
          }

          ctx.fillStyle = `rgba(240, 252, 255, ${sp.alpha * lifeRatio})`;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-fullscreen-scroll
      className={cn(
        "relative flex min-h-[520px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#020614] p-6 text-white shadow-2xl",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      <div className="relative z-10 flex flex-1 flex-col justify-between">
        {children ?? (
          <>
            {/* Top Telemetry Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-slate-950/60 px-3.5 py-1.5 font-mono text-xs text-sky-200 backdrop-blur-md">
                <Waves className="h-3.5 w-3.5 text-sky-400" />
                <span>OCEAN WAVES · {liveCount} GERSTNER SWELLS</span>
              </div>

              <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-950/60 p-1 backdrop-blur-md">
                {OCEAN_PRESETS.map((preset) => {
                  const active =
                    liveColor.toLowerCase() === preset.color.toLowerCase();
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setLiveColor(preset.color);
                        setLiveAmp(preset.amp);
                        setLiveSpeed(preset.speed);
                        setLiveCount(preset.count);
                      }}
                      className={cn(
                        "rounded-full px-3 py-1 font-mono text-[11px] transition-all",
                        active
                          ? "bg-sky-400/20 text-sky-200 ring-1 ring-sky-400/40"
                          : "text-slate-400 hover:text-white"
                      )}
                    >
                      {preset.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Info & Live Wave Synthesizer Controls */}
            <div className="mt-auto flex flex-col gap-5 pt-16 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-md space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Gerstner Swells &amp; Subsurface Glow
                </h2>
                <p className="text-sm leading-relaxed text-slate-200/85">
                  Trochoidal deep-ocean swells with translucent aquamarine subsurface scattering, laced whitecap foam filaments, and wind-blown sea spray.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-3.5 backdrop-blur-md sm:min-w-[330px]">
                <label className="flex flex-col gap-1.5">
                  <span className="flex items-center justify-between font-mono text-[10px] uppercase text-slate-400">
                    <span>Swell</span>
                    <span className="text-sky-300">{liveAmp}px</span>
                  </span>
                  <input
                    type="range"
                    min={12}
                    max={56}
                    step={2}
                    value={liveAmp}
                    onChange={(e) => setLiveAmp(parseFloat(e.target.value))}
                    className="h-1.5 cursor-pointer appearance-none rounded-lg bg-white/15 accent-sky-400"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="flex items-center justify-between font-mono text-[10px] uppercase text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Sliders className="h-2.5 w-2.5" /> Layers
                    </span>
                    <span className="text-sky-300">{liveCount}</span>
                  </span>
                  <input
                    type="range"
                    min={3}
                    max={8}
                    step={1}
                    value={liveCount}
                    onChange={(e) => setLiveCount(parseInt(e.target.value, 10))}
                    className="h-1.5 cursor-pointer appearance-none rounded-lg bg-white/15 accent-sky-400"
                  />
                </label>

                <div className="flex flex-col justify-between gap-1.5">
                  <span className="font-mono text-[10px] uppercase text-slate-400">
                    Crest Foam
                  </span>
                  <button
                    type="button"
                    onClick={() => setLiveFoam((v) => !v)}
                    className={cn(
                      "inline-flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-colors",
                      liveFoam
                        ? "border-sky-400/40 bg-sky-400/20 text-sky-200"
                        : "border-white/10 bg-white/5 text-slate-400"
                    )}
                  >
                    <Sparkles className="h-3 w-3" />
                    {liveFoam ? "Active" : "Muted"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default OceanWaves;
