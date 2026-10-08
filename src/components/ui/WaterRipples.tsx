"use client";

import React, { useEffect, useRef, useState } from "react";
import { Radio, CloudRain, MousePointerClick } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WaterRipplesProps {
  /** Wave energy retention factor per frame (0.90 to 0.995). Default: 0.97 */
  damping?: number;
  /** Maximum expansion radius of spawned concentric ripple rings in px. Default: 140 */
  rippleRadius?: number;
  /** Automatically spawn periodic rain/ambient droplets across the surface. Default: true */
  ambientDrops?: boolean;
  /** Primary specular caustic highlight hex color. Default: "#38BDF8" */
  color?: string;
  /** Spawn ripples on pointer move and click. Default: true */
  interactive?: boolean;
  /** Optional foreground content */
  children?: React.ReactNode;
  className?: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    return [
      parseInt(clean[0] + clean[0], 16) || 56,
      parseInt(clean[1] + clean[1], 16) || 189,
      parseInt(clean[2] + clean[2], 16) || 248,
    ];
  }
  const num = parseInt(clean, 16);
  if (Number.isNaN(num)) return [56, 189, 248];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

const RIPPLE_PRESETS = [
  { name: "Lagoon Pool", color: "#38BDF8", damping: 0.975, radius: 140 },
  { name: "Jade Sanctuary", color: "#34D399", damping: 0.982, radius: 175 },
  { name: "Sapphire Basin", color: "#818CF8", damping: 0.962, radius: 120 },
];

export function WaterRipples({
  damping = 0.97,
  rippleRadius = 140,
  ambientDrops = true,
  color = "#38BDF8",
  interactive = true,
  children,
  className,
}: WaterRipplesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [liveDamping, setLiveDamping] = useState(damping);
  const [liveRadius, setLiveRadius] = useState(rippleRadius);
  const [liveAmbient, setLiveAmbient] = useState(ambientDrops);
  const [liveColor, setLiveColor] = useState(color);
  const [dropCounter, setDropCounter] = useState(0);

  useEffect(() => setLiveDamping(damping), [damping]);
  useEffect(() => setLiveRadius(rippleRadius), [rippleRadius]);
  useEffect(() => setLiveAmbient(ambientDrops), [ambientDrops]);
  useEffect(() => setLiveColor(color), [color]);

  const paramsRef = useRef({
    damping: liveDamping,
    radius: liveRadius,
    ambient: liveAmbient,
    color: liveColor,
  });

  useEffect(() => {
    paramsRef.current = {
      damping: liveDamping,
      radius: liveRadius,
      ambient: liveAmbient,
      color: liveColor,
    };
  }, [liveDamping, liveRadius, liveAmbient, liveColor]);

  // Imperative disturb callback ref so pointer handlers trigger ripples without re-mounting
  const disturbRef = useRef<
    (normX: number, normY: number, strength: number) => void
  >(() => {});

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let simW = 280;
    let simH = 180;
    let bufPrev = new Float32Array(simW * simH);
    let bufCurr = new Float32Array(simW * simH);
    // Precomputed procedural submerged mosaic/pebble & static caustic texture buffer
    let bedTex = new Float32Array(simW * simH);

    const offscreen = document.createElement("canvas");
    offscreen.width = simW;
    offscreen.height = simH;
    const offCtx = offscreen.getContext("2d");
    let imgData = offCtx ? offCtx.createImageData(simW, simH) : null;

    const buildSubmergedBed = (w: number, h: number) => {
      bedTex = new Float32Array(w * h);
      for (let y = 0; y < h; y++) {
        const ny = y / h;
        for (let x = 0; x < w; x++) {
          const nx = x / w;
          // Subtle submerged stone tile grid + organic pebble/sand harmonic texture
          const tileX = Math.abs(Math.sin(nx * Math.PI * 14));
          const tileY = Math.abs(Math.sin(ny * Math.PI * 9));
          const grout = Math.pow(Math.min(tileX, tileY), 0.18);

          const pebble =
            0.5 +
            0.25 * Math.sin(x * 0.23 + Math.cos(y * 0.19) * 2.5) +
            0.25 * Math.cos(y * 0.27 - Math.sin(x * 0.21) * 2.5);

          bedTex[y * w + x] = grout * (0.72 + 0.28 * pebble);
        }
      }
    };

    let viewW = 1;
    let viewH = 1;
    let dpr = 1;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      viewW = Math.max(1, rect.width);
      viewH = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(viewW * dpr);
      canvas.height = Math.floor(viewH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 0.45x simulation grid resolution for silky 60fps per-pixel 3D normal shading
      const nextSimW = Math.max(160, Math.min(340, Math.floor(viewW * 0.42)));
      const nextSimH = Math.max(110, Math.min(230, Math.floor(viewH * 0.42)));
      if (nextSimW !== simW || nextSimH !== simH || bedTex.length === 0) {
        simW = nextSimW;
        simH = nextSimH;
        bufPrev = new Float32Array(simW * simH);
        bufCurr = new Float32Array(simW * simH);
        buildSubmergedBed(simW, simH);
        offscreen.width = simW;
        offscreen.height = simH;
        imgData = offCtx ? offCtx.createImageData(simW, simH) : null;
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const triggerRipple = (normX: number, normY: number, strength: number) => {
      const gx = Math.floor(normX * simW);
      const gy = Math.floor(normY * simH);
      const rad = Math.max(
        3,
        Math.min(12, Math.round((paramsRef.current.radius / 140) * 6))
      );

      for (let dy = -rad; dy <= rad; dy++) {
        const y = gy + dy;
        if (y <= 2 || y >= simH - 2) continue;
        for (let dx = -rad; dx <= rad; dx++) {
          const x = gx + dx;
          if (x <= 2 || x >= simW - 2) continue;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist <= rad) {
            // Smooth raised ring profile so each drop launches a realistic capillary wave packet
            const phase = (dist / rad) * Math.PI;
            const profile = Math.cos(phase);
            bufPrev[y * simW + x] -= strength * profile;
          }
        }
      }
    };

    disturbRef.current = triggerRipple;

    // Seed initial welcoming droplets
    triggerRipple(0.35, 0.45, 220);
    triggerRipple(0.66, 0.54, 190);

    let rafId = 0;
    let frame = 0;

    // Normalized 3D directional light vector L = normalize(-0.45, -0.55, 0.70)
    // and Halfway vector H = normalize(L + V) where V = (0, 0, 1)
    const lx = -0.45;
    const ly = -0.55;
    const lz = 0.703;
    const hLen = Math.hypot(lx, ly, lz + 1.0);
    const hx = lx / hLen;
    const hy = ly / hLen;
    const hz = (lz + 1.0) / hLen;

    const render = () => {
      frame++;
      const {
        damping: curDamping,
        ambient: curAmbient,
        color: curColor,
      } = paramsRef.current;

      const [tintR, tintG, tintB] = hexToRgb(curColor);
      const damp = Math.max(0.9, Math.min(0.994, curDamping));

      // Periodic ambient rain droplets
      if (curAmbient && frame % 24 === 0) {
        triggerRipple(
          0.1 + Math.random() * 0.8,
          0.12 + Math.random() * 0.76,
          140 + Math.random() * 120
        );
      }

      // 1. Step 2D Wave Equation with 8-neighbor isotropic Laplacian kernel for circular waves
      for (let y = 1; y < simH - 1; y++) {
        const row = y * simW;
        for (let x = 1; x < simW - 1; x++) {
          const idx = row + x;
          const cardinal =
            bufPrev[idx - 1] +
            bufPrev[idx + 1] +
            bufPrev[idx - simW] +
            bufPrev[idx + simW];
          const diagonal =
            bufPrev[idx - simW - 1] +
            bufPrev[idx - simW + 1] +
            bufPrev[idx + simW - 1] +
            bufPrev[idx + simW + 1];

          const avg = cardinal * 0.4 + diagonal * 0.1;
          bufCurr[idx] = (avg - bufCurr[idx]) * damp;
        }
      }

      // 2. Per-pixel 3D Surface Normal Reconstruction, Snell Refraction, Caustic Focusing & Blinn-Phong Specular
      if (offCtx && imgData) {
        const data = imgData.data;
        const timeShift = frame * 0.025;

        for (let y = 1; y < simH - 1; y++) {
          const row = y * simW;
          const vNorm = y / simH;

          for (let x = 1; x < simW - 1; x++) {
            const idx = row + x;

            // Central-difference 2D height-field gradient (dh/dx, dh/dy)
            const dhdx = (bufCurr[idx + 1] - bufCurr[idx - 1]) * 0.032;
            const dhdy = (bufCurr[idx + simW] - bufCurr[idx - simW]) * 0.032;

            // 3D Surface Normal N = normalize(-dhdx, -dhdy, 1.0)
            const invLen = 1.0 / Math.sqrt(dhdx * dhdx + dhdy * dhdy + 1.0);
            const nx = -dhdx * invLen;
            const ny = -dhdy * invLen;
            const nz = invLen;

            // Refracted floor lookup coordinates shifted by surface normal
            const refX = Math.max(
              0,
              Math.min(simW - 1, Math.round(x + nx * 26))
            );
            const refY = Math.max(
              0,
              Math.min(simH - 1, Math.round(y + ny * 26))
            );
            const floorPattern = bedTex[refY * simW + refX];

            // Ambient refracted caustic wave network on the pool floor
            const cx = refX * 0.11 + timeShift;
            const cy = refY * 0.11 - timeShift * 0.7;
            const ambientCaustic = Math.pow(
              0.5 + 0.5 * Math.sin(cx + Math.cos(cy * 1.3)) * Math.cos(cy - Math.sin(cx * 1.2)),
              3.0
            );

            // Wave curvature convergence (Laplacian) creates bright caustic focal rings on the bed
            const curvature = Math.max(
              0,
              bufCurr[idx] * 2.0 -
                (bufCurr[idx - 1] + bufCurr[idx + 1]) * 0.5
            );
            const rippleCaustic = Math.min(1.4, curvature * 0.018);

            // Schlick Fresnel reflection factor: grazing angles reflect more bright sky light
            const fresnel = Math.pow(1.0 - nz, 3.0);

            // Diffuse lighting + sharp Blinn-Phong specular highlight pow(max(dot(N, H), 0.0), 80.0)
            const ndotl = Math.max(0.0, nx * lx + ny * ly + nz * lz);
            const ndoth = Math.max(0.0, nx * hx + ny * hy + nz * hz);
            const specular = Math.pow(ndoth, 80.0) * 1.85 + Math.pow(ndoth, 18.0) * 0.35;

            // Combine deep water absorption + refracted floor + caustics + Fresnel sky + specular glint
            const depthShade = 0.42 + 0.58 * (1.0 - vNorm * 0.45);
            const floorLight =
              floorPattern * depthShade * (0.55 + 0.45 * ndotl) +
              ambientCaustic * 0.24 +
              rippleCaustic * 0.55;

            const rOut =
              4 +
              floorLight * tintR * 0.78 +
              fresnel * 145 +
              specular * 255;
            const gOut =
              14 +
              floorLight * tintG * 0.92 +
              fresnel * 215 +
              specular * 252;
            const bOut =
              30 +
              floorLight * tintB * 1.05 +
              fresnel * 255 +
              specular * 255;

            const p = idx * 4;
            data[p] = rOut > 255 ? 255 : rOut < 0 ? 0 : rOut;
            data[p + 1] = gOut > 255 ? 255 : gOut < 0 ? 0 : gOut;
            data[p + 2] = bOut > 255 ? 255 : bOut < 0 ? 0 : bOut;
            data[p + 3] = 255;
          }
        }

        offCtx.putImageData(imgData, 0, 0);

        // Upscale smoothly onto full-resolution display canvas
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(offscreen, 0, 0, viewW, viewH);
      }

      // Swap wave equation buffers
      const temp = bufPrev;
      bufPrev = bufCurr;
      bufCurr = temp;

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / Math.max(1, rect.width);
    const ny = (e.clientY - rect.top) / Math.max(1, rect.height);
    disturbRef.current(nx, ny, 95);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / Math.max(1, rect.width);
    const ny = (e.clientY - rect.top) / Math.max(1, rect.height);
    disturbRef.current(nx, ny, 280);
    setDropCounter((c) => c + 1);
  };

  return (
    <div
      ref={containerRef}
      data-fullscreen-scroll
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      className={cn(
        "relative flex min-h-[520px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#030A18] p-6 text-white shadow-2xl select-none",
        interactive && "cursor-crosshair",
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
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-slate-950/65 px-3.5 py-1.5 font-mono text-xs text-sky-200 backdrop-blur-md">
                <Radio className="h-3.5 w-3.5 text-sky-400" />
                <span>
                  WATER RIPPLES · 3D NORMAL REFRACTION{" "}
                  {dropCounter > 0 ? `(${dropCounter} IMPACTS)` : ""}
                </span>
              </div>

              <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-950/65 p-1 backdrop-blur-md">
                {RIPPLE_PRESETS.map((preset) => {
                  const active =
                    liveColor.toLowerCase() === preset.color.toLowerCase();
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => {
                        setLiveColor(preset.color);
                        setLiveDamping(preset.damping);
                        setLiveRadius(preset.radius);
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

            {/* Bottom Info & Interactive Controls */}
            <div
              onPointerDown={(e) => e.stopPropagation()}
              className="mt-auto flex flex-col gap-5 pt-16 sm:flex-row sm:items-end sm:justify-between"
            >
              <div className="max-w-md space-y-2">
                <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-sky-300/90">
                  <MousePointerClick className="h-3.5 w-3.5" />
                  <span>Move cursor or click anywhere to disturb the surface</span>
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Normal-Mapped Liquid Refraction
                </h2>
                <p className="text-sm leading-relaxed text-slate-300/85">
                  Per-pixel 3D surface normal reconstruction from a 2D wave-equation height field, refracting a submerged mosaic floor with Fresnel sky reflection and Blinn-Phong specular highlights.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-3.5 backdrop-blur-md sm:min-w-[330px]">
                <label className="flex flex-col gap-1.5">
                  <span className="flex items-center justify-between font-mono text-[10px] uppercase text-slate-400">
                    <span>Damping</span>
                    <span className="text-sky-300">{liveDamping.toFixed(3)}</span>
                  </span>
                  <input
                    type="range"
                    min={0.92}
                    max={0.99}
                    step={0.005}
                    value={liveDamping}
                    onChange={(e) => setLiveDamping(parseFloat(e.target.value))}
                    className="h-1.5 cursor-pointer appearance-none rounded-lg bg-white/15 accent-sky-400"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="flex items-center justify-between font-mono text-[10px] uppercase text-slate-400">
                    <span>Impulse</span>
                    <span className="text-sky-300">{liveRadius}px</span>
                  </span>
                  <input
                    type="range"
                    min={80}
                    max={220}
                    step={10}
                    value={liveRadius}
                    onChange={(e) => setLiveRadius(parseInt(e.target.value, 10))}
                    className="h-1.5 cursor-pointer appearance-none rounded-lg bg-white/15 accent-sky-400"
                  />
                </label>

                <div className="flex flex-col justify-between gap-1.5">
                  <span className="font-mono text-[10px] uppercase text-slate-400">
                    Rain Drops
                  </span>
                  <button
                    type="button"
                    onClick={() => setLiveAmbient((v) => !v)}
                    className={cn(
                      "inline-flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-colors",
                      liveAmbient
                        ? "border-sky-400/40 bg-sky-400/20 text-sky-200"
                        : "border-white/10 bg-white/5 text-slate-400"
                    )}
                  >
                    <CloudRain className="h-3 w-3" />
                    {liveAmbient ? "Raining" : "Calm"}
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

export default WaterRipples;
