"use client";

import React, { useEffect, useRef, useState } from "react";
import { Compass, Zap, Sliders, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WormholeTunnelProps {
  /** Number of concentric depth rings in the wormhole conduit (default: 28) */
  ringCount?: number;
  /** Forward traversal speed multiplier through the tunnel (default: 1.0) */
  speed?: number;
  /** Starting HSL hue in degrees (0-360, default: 195) */
  baseHue?: number;
  /** Total hue shift range from throat to outer aperture (default: 90) */
  hueShift?: number;
  /** Helical twist multiplier applied across tunnel depth (default: 1.2) */
  twist?: number;
  /** Whether the wormhole throat bends toward pointer movement (default: true) */
  interactive?: boolean;
  /** Optional foreground content rendered over the tunnel */
  children?: React.ReactNode;
  /** Additional CSS classes for the root container */
  className?: string;
}

interface RelativisticStarStreak {
  angle: number;
  z: number; // 0 (throat) to 1 (camera)
  speedOffset: number;
  hueOffset: number;
  thickness: number;
  radialJitter: number;
}

interface PlasmaCloudPuff {
  angle: number;
  z: number;
  sizeFactor: number;
  hueShift: number;
  alpha: number;
}

const WORMHOLE_PRESETS = [
  { name: "Cherenkov Cyan", baseHue: 195, hueShift: 90, twist: 1.2, speed: 1.0 },
  { name: "Hyperdrive Magenta", baseHue: 295, hueShift: 110, twist: 1.8, speed: 1.4 },
  { name: "Chrono Gold", baseHue: 38, hueShift: 65, twist: 0.75, speed: 0.85 },
] as const;

export function WormholeTunnel({
  ringCount = 28,
  speed = 1.0,
  baseHue = 195,
  hueShift = 90,
  twist = 1.2,
  interactive = true,
  children,
  className,
}: WormholeTunnelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeRings, setActiveRings] = useState(ringCount);
  const [activeSpeed, setActiveSpeed] = useState(speed);
  const [activeHue, setActiveHue] = useState(baseHue);
  const [activeHueShift, setActiveHueShift] = useState(hueShift);
  const [activeTwist, setActiveTwist] = useState(twist);
  const [showControls, setShowControls] = useState(false);

  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  useEffect(() => {
    setActiveRings(ringCount);
  }, [ringCount]);
  useEffect(() => {
    setActiveSpeed(speed);
  }, [speed]);
  useEffect(() => {
    setActiveHue(baseHue);
  }, [baseHue]);
  useEffect(() => {
    setActiveHueShift(hueShift);
  }, [hueShift]);
  useEffect(() => {
    setActiveTwist(twist);
  }, [twist]);

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

    // Relativistic star streaks warping along the curved spacetime walls
    const starStreaks: RelativisticStarStreak[] = Array.from(
      { length: 150 },
      () => ({
        angle: Math.random() * Math.PI * 2,
        z: Math.random(),
        speedOffset: 0.65 + Math.random() * 0.85,
        hueOffset: (Math.random() - 0.5) * 45,
        thickness: 0.8 + Math.random() * 1.8,
        radialJitter: 0.88 + Math.random() * 0.28,
      })
    );

    // Volumetric plasma nebula clouds spiraling along the manifold
    const plasmaPuffs: PlasmaCloudPuff[] = Array.from({ length: 42 }, (_, i) => ({
      angle: (i / 42) * Math.PI * 6,
      z: i / 42,
      sizeFactor: 0.42 + (i % 5) * 0.12,
      hueShift: ((i % 7) - 3) * 14,
      alpha: 0.08 + (i % 4) * 0.035,
    }));

    let rafId = 0;
    let time = 0;
    let smoothTargetX = 0;
    let smoothTargetY = 0;

    const numRings = Math.max(12, Math.min(60, activeRings));
    const segments = 16;

    const render = () => {
      const dt = 0.008 * activeSpeed;
      time += dt;

      // Deep relativistic void with motion persistence
      ctx.fillStyle = "rgba(2, 4, 12, 0.34)";
      ctx.fillRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.5;
      const maxRadius = Math.hypot(width, height) * 0.68;

      // Lissajous oscillation + interactive pointer steering for the throat
      const lissajousX = Math.sin(time * 2.1) * (width * 0.11);
      const lissajousY = Math.cos(time * 1.6) * (height * 0.09);

      const targetX =
        interactive && pointerRef.current.active
          ? pointerRef.current.x * (width * 0.25)
          : lissajousX;
      const targetY =
        interactive && pointerRef.current.active
          ? pointerRef.current.y * (height * 0.22)
          : lissajousY;

      smoothTargetX += (targetX - smoothTargetX) * 0.06;
      smoothTargetY += (targetY - smoothTargetY) * 0.06;

      // Helper to compute curved 3D manifold center and radius at normalized depth zNorm (0 = throat, 1 = camera)
      const sampleManifold = (zNorm: number) => {
        // Hyperbolic spacetime funnel profile: narrow throat flaring exponentially
        const scale = Math.pow(zNorm, 2.45);
        const radius = 8 + scale * maxRadius;
        const bendFactor = Math.pow(1 - zNorm, 1.48);
        const waveWobbleX =
          Math.sin(zNorm * Math.PI * 2.5 - time * 3.2) * 20 * bendFactor;
        const waveWobbleY =
          Math.cos(zNorm * Math.PI * 2.5 - time * 2.8) * 15 * bendFactor;

        return {
          x: cx + smoothTargetX * bendFactor + waveWobbleX,
          y: cy + smoothTargetY * bendFactor + waveWobbleY,
          radius,
          rotation: time * 0.95 + (1 - zNorm) * activeTwist * Math.PI * 1.55,
          hue: (activeHue + (1 - zNorm) * activeHueShift + 360) % 360,
        };
      };

      // 1. Volumetric Spiraling Plasma Nebula Clouds (Depth-Sorted Back-to-Front)
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (let i = 0; i < plasmaPuffs.length; i++) {
        const puff = plasmaPuffs[i];
        const zNorm = (puff.z + time * 0.85) % 1;
        const m = sampleManifold(zNorm);
        const theta = puff.angle + m.rotation * 1.15;
        const px = m.x + Math.cos(theta) * m.radius * 0.92;
        const py = m.y + Math.sin(theta) * m.radius * 0.92;
        const puffRadius = Math.max(18, m.radius * puff.sizeFactor);
        const depthFade = Math.sin(zNorm * Math.PI);
        const pHue = (m.hue + puff.hueShift + 360) % 360;

        const nebGrad = ctx.createRadialGradient(
          px,
          py,
          0,
          px,
          py,
          puffRadius
        );
        nebGrad.addColorStop(
          0,
          `hsla(${pHue.toFixed(1)}, 95%, 65%, ${(
            puff.alpha *
            depthFade *
            1.45
          ).toFixed(3)})`
        );
        nebGrad.addColorStop(
          0.48,
          `hsla(${((pHue + 28) % 360).toFixed(1)}, 90%, 48%, ${(
            puff.alpha *
            depthFade *
            0.65
          ).toFixed(3)})`
        );
        nebGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = nebGrad;
        ctx.beginPath();
        ctx.arc(px, py, puffRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 2. Curved Spacetime Manifold Geometry, Longitudinal Energy Filaments & Depth-Fog Occlusion
      const ringVertices: Array<{
        points: Array<{ x: number; y: number }>;
        cx: number;
        cy: number;
        radius: number;
        zNorm: number;
        hue: number;
        alpha: number;
      }> = [];

      const phase = (time * 1.45) % 1;

      for (let i = 0; i < numRings; i++) {
        const zNorm = (i + phase) / numRings;
        const m = sampleManifold(zNorm);
        // Depth fog attenuation near throat (zNorm -> 0) and smooth fade at camera clip (zNorm -> 1)
        const alpha =
          Math.sin(zNorm * Math.PI) * (0.14 + Math.pow(zNorm, 0.72) * 0.78);

        const points: Array<{ x: number; y: number }> = [];
        for (let s = 0; s < segments; s++) {
          const theta = m.rotation + (s / segments) * Math.PI * 2;
          const ripple =
            1 + 0.045 * Math.sin(s * 4 + time * 4.5 + zNorm * 9);
          points.push({
            x: m.x + Math.cos(theta) * m.radius * ripple,
            y: m.y + Math.sin(theta) * m.radius * ripple,
          });
        }

        ringVertices.push({
          points,
          cx: m.x,
          cy: m.y,
          radius: m.radius,
          zNorm,
          hue: m.hue,
          alpha,
        });
      }

      // Draw volumetric depth-fog shadow rings + glowing plasma filaments from back to front
      for (let i = 0; i < ringVertices.length - 1; i++) {
        const curr = ringVertices[i];
        const next = ringVertices[i + 1];

        // Subtle dark depth-fog occlusion band between rings to give 3D tubular solidity
        if (i % 2 === 0) {
          ctx.save();
          ctx.strokeStyle = `rgba(2, 4, 14, ${(
            (1 - curr.zNorm) *
            0.35
          ).toFixed(3)})`;
          ctx.lineWidth = Math.max(2, (next.radius - curr.radius) * 0.65);
          ctx.beginPath();
          ctx.arc(curr.cx, curr.cy, curr.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Spiraling longitudinal plasma filaments connecting consecutive rings
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        const ribAlpha = Math.min(curr.alpha, next.alpha) * 0.52;
        ctx.strokeStyle = `hsla(${curr.hue.toFixed(1)}, 95%, 66%, ${ribAlpha.toFixed(3)})`;
        ctx.lineWidth = 0.7 + curr.zNorm * 1.65;

        ctx.beginPath();
        for (let s = 0; s < segments; s++) {
          const nextIdx = (s + 1) % segments; // Helical diagonal filament weave
          ctx.moveTo(curr.points[s].x, curr.points[s].y);
          ctx.lineTo(next.points[nextIdx].x, next.points[nextIdx].y);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Draw concentric curved energy rings with chromatic aberration near the throat
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < ringVertices.length; i++) {
        const ring = ringVertices[i];
        const pts = ring.points;
        const lw = 0.9 + Math.pow(ring.zNorm, 1.55) * 2.6;

        const traceSmoothRing = (offsetX: number, offsetY: number) => {
          ctx.beginPath();
          for (let s = 0; s < segments; s++) {
            const p0 = pts[s];
            const p1 = pts[(s + 1) % segments];
            const midX = (p0.x + p1.x) * 0.5 + offsetX;
            const midY = (p0.y + p1.y) * 0.5 + offsetY;
            if (s === 0) {
              const prev = pts[segments - 1];
              ctx.moveTo(
                (prev.x + p0.x) * 0.5 + offsetX,
                (prev.y + p0.y) * 0.5 + offsetY
              );
            }
            ctx.quadraticCurveTo(p0.x + offsetX, p0.y + offsetY, midX, midY);
          }
          ctx.closePath();
        };

        // Relativistic chromatic aberration split (cyan vs magenta/red channel offset)
        const chromaShift = (1 - ring.zNorm) * 3.2 + ring.zNorm * 1.4;
        ctx.strokeStyle = `hsla(${((ring.hue - 32 + 360) % 360).toFixed(
          1
        )}, 100%, 62%, ${(ring.alpha * 0.42).toFixed(3)})`;
        ctx.lineWidth = lw * 1.15;
        traceSmoothRing(-chromaShift, 0);
        ctx.stroke();

        ctx.strokeStyle = `hsla(${((ring.hue + 32) % 360).toFixed(
          1
        )}, 100%, 62%, ${(ring.alpha * 0.42).toFixed(3)})`;
        traceSmoothRing(chromaShift, 0);
        ctx.stroke();

        // Primary white-hot/tinted geodesic ring
        ctx.strokeStyle = `hsla(${ring.hue.toFixed(1)}, 98%, 74%, ${ring.alpha.toFixed(3)})`;
        ctx.lineWidth = lw;
        traceSmoothRing(0, 0);
        ctx.stroke();
      }

      // 3. Relativistic Star Streaks Warping Along the Tunnel Walls
      for (let i = 0; i < starStreaks.length; i++) {
        const st = starStreaks[i];
        st.z += 0.011 * Math.max(0.15, activeSpeed) * st.speedOffset;
        if (st.z >= 1) {
          st.z = 0.02 + Math.random() * 0.08;
          st.angle = Math.random() * Math.PI * 2;
        }

        const zTail = Math.max(0.01, st.z - (0.035 + st.z * 0.085) * Math.max(0.3, activeSpeed));
        const mHead = sampleManifold(st.z);
        const mTail = sampleManifold(zTail);

        const aHead = st.angle + mHead.rotation * 0.85;
        const aTail = st.angle + mTail.rotation * 0.85;

        const hx = mHead.x + Math.cos(aHead) * mHead.radius * st.radialJitter;
        const hy = mHead.y + Math.sin(aHead) * mHead.radius * st.radialJitter;
        const tx = mTail.x + Math.cos(aTail) * mTail.radius * st.radialJitter;
        const ty = mTail.y + Math.sin(aTail) * mTail.radius * st.radialJitter;

        const streakAlpha = Math.sin(st.z * Math.PI) * 0.9;
        const sHue = (mHead.hue + st.hueOffset + 360) % 360;

        const sGrad = ctx.createLinearGradient(hx, hy, tx, ty);
        sGrad.addColorStop(0, `rgba(255, 255, 255, ${streakAlpha.toFixed(3)})`);
        sGrad.addColorStop(
          0.35,
          `hsla(${sHue.toFixed(1)}, 100%, 75%, ${(streakAlpha * 0.8).toFixed(3)})`
        );
        sGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.strokeStyle = sGrad;
        ctx.lineWidth = st.thickness * (0.5 + st.z * 1.4);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.lineTo(tx, ty);
        ctx.stroke();
      }

      // 4. Vanishing Throat Gravitational Lensing Singularity & Chromatic Caustic Ring
      const throat = sampleManifold(0.02);
      const throatHue = (activeHue + activeHueShift) % 360;

      // Outer lensing caustic halo
      const outerThroatGlow = ctx.createRadialGradient(
        throat.x,
        throat.y,
        4,
        throat.x,
        throat.y,
        135
      );
      outerThroatGlow.addColorStop(0, "rgba(255, 255, 255, 1)");
      outerThroatGlow.addColorStop(
        0.16,
        `hsla(${throatHue.toFixed(1)}, 100%, 78%, 0.85)`
      );
      outerThroatGlow.addColorStop(
        0.42,
        `hsla(${activeHue.toFixed(1)}, 95%, 58%, 0.35)`
      );
      outerThroatGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = outerThroatGlow;
      ctx.beginPath();
      ctx.arc(throat.x, throat.y, 135, 0, Math.PI * 2);
      ctx.fill();

      // Dark event-horizon aperture pinprick inside the wormhole throat surrounded by an Einstein ring
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#02030A";
      ctx.beginPath();
      ctx.arc(throat.x, throat.y, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(throat.x, throat.y, 10.5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      rafId = requestAnimationFrame(render);
    };

    ctx.fillStyle = "#02040C";
    ctx.fillRect(0, 0, width, height);
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [activeRings, activeSpeed, activeHue, activeHueShift, activeTwist, interactive]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    pointerRef.current = { x: nx, y: ny, active: true };
  };

  const handlePointerLeave = () => {
    pointerRef.current.active = false;
  };

  const handleReset = () => {
    setActiveRings(ringCount);
    setActiveSpeed(speed);
    setActiveHue(baseHue);
    setActiveHueShift(hueShift);
    setActiveTwist(twist);
  };

  return (
    <div
      ref={containerRef}
      data-fullscreen-scroll
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl bg-[#02040C] text-white select-none",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {children ? (
        <div className="relative z-10 flex min-h-[520px] w-full flex-col">
          {children}
        </div>
      ) : (
        <div className="relative z-10 flex min-h-[520px] w-full flex-col justify-between p-6 sm:p-8">
          {/* Top Telemetry Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 backdrop-blur-md">
                <Compass className="h-4 w-4 text-cyan-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                    Einstein-Rosen Manifold
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-medium text-cyan-300">
                    <Zap className="h-2.5 w-2.5" /> Warp {activeSpeed.toFixed(1)}c
                  </span>
                </div>
                <p className="text-xs text-white/50">
                  Volumetric Plasma Vortex &bull; {activeRings} Geodesic Horizons
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {WORMHOLE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setActiveHue(preset.baseHue);
                    setActiveHueShift(preset.hueShift);
                    setActiveTwist(preset.twist);
                    setActiveSpeed(preset.speed);
                  }}
                  className={cn(
                    "rounded-lg border px-2.5 py-1 text-xs font-medium transition-all backdrop-blur-md",
                    activeHue === preset.baseHue
                      ? "border-white/40 bg-white/15 text-white"
                      : "border-white/10 bg-black/40 text-white/65 hover:border-white/25 hover:text-white"
                  )}
                >
                  {preset.name}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setShowControls((v) => !v)}
                aria-label="Toggle wormhole parameters"
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors backdrop-blur-md",
                  showControls
                    ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-300"
                    : "border-white/10 bg-black/40 text-white/75 hover:border-white/25 hover:text-white"
                )}
              >
                <Sliders className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom Info & Controls */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-md space-y-1.5">
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Relativistic Spacetime Vortex
              </h2>
              <p className="text-xs leading-relaxed text-white/60 sm:text-sm">
                Volumetric plasma filaments, relativistic star streaks, and
                chromatic-aberrated geodesic rings spiral into a lensed
                Einstein-Rosen throat.
              </p>
            </div>

            {showControls && (
              <div className="w-full max-w-xs space-y-3 rounded-xl border border-white/15 bg-black/65 p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white/85">
                    Conduit Geometry
                  </span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1 text-[11px] text-white/50 hover:text-white"
                  >
                    <RotateCcw className="h-3 w-3" /> Reset
                  </button>
                </div>

                <label className="block space-y-1 text-xs">
                  <div className="flex justify-between text-white/65">
                    <span>Traversal Speed</span>
                    <span>{activeSpeed.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min={0.2}
                    max={2.5}
                    step={0.05}
                    value={activeSpeed}
                    onChange={(e) => setActiveSpeed(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/15 accent-cyan-400"
                  />
                </label>

                <label className="block space-y-1 text-xs">
                  <div className="flex justify-between text-white/65">
                    <span>Helical Twist</span>
                    <span>{activeTwist.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min={-2.5}
                    max={2.5}
                    step={0.05}
                    value={activeTwist}
                    onChange={(e) => setActiveTwist(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/15 accent-cyan-400"
                  />
                </label>

                <label className="block space-y-1 text-xs">
                  <div className="flex justify-between text-white/65">
                    <span>Base Spectrum Hue</span>
                    <span>{activeHue}&deg;</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    step={1}
                    value={activeHue}
                    onChange={(e) => setActiveHue(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/15 accent-cyan-400"
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default WormholeTunnel;
