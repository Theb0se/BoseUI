"use client";

import React, { useEffect, useRef, useState } from "react";
import { CloudRain } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RainOnGlassProps {
  /** Number of main sliding rain droplets. Default: 45 */
  dropCount?: number;
  /** Fall speed multiplier. Default: 1 */
  speed?: number;
  /** Horizontal wind slant (-1 to 1). Default: 0.05 */
  wind?: number;
  /** Intensity of the flipped inner refractive highlight (0 to 1). Default: 0.85 */
  refraction?: number;
  /** Optional foreground content */
  children?: React.ReactNode;
  className?: string;
}

interface Droplet {
  x: number;
  y: number;
  r: number;
  vy: number;
  trailTimer: number;
}

interface TrailBead {
  x: number;
  y: number;
  r: number;
  alpha: number;
}

export function RainOnGlass({
  dropCount = 45,
  speed = 1,
  wind = 0.05,
  refraction = 0.85,
  children,
  className,
}: RainOnGlassProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stormMode, setStormMode] = useState(false);

  const effectiveSpeed = stormMode ? speed * 2.2 : speed;
  const effectiveDrops = stormMode ? Math.round(dropCount * 1.6) : dropCount;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let width = (canvas.width = canvas.offsetWidth || 600);
    let height = (canvas.height = canvas.offsetHeight || 360);

    const drops: Droplet[] = Array.from({ length: effectiveDrops }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 3.5 + Math.random() * 5.5,
      vy: (35 + Math.random() * 75) * effectiveSpeed,
      trailTimer: Math.random() * 0.3,
    }));

    const beads: TrailBead[] = [];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 600;
      height = canvas.height = canvas.offsetHeight || 360;
    };

    window.addEventListener("resize", handleResize);

    let last = performance.now();
    const render = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      ctx.clearRect(0, 0, width, height);

      // Draw static/fading trail beads first
      for (let i = beads.length - 1; i >= 0; i--) {
        const b = beads[i];
        b.alpha -= dt * 0.35;
        if (b.alpha <= 0.02) {
          beads.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 238, 255, ${(b.alpha * 0.45).toFixed(3)})`;
        ctx.fill();
      }

      // Update & draw main refractive droplets
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        // Intermittent stutter-slide motion like real water on glass
        const surge = 0.6 + 0.6 * Math.sin(now * 0.004 + i * 2.1);
        d.y += d.vy * surge * dt;
        d.x += wind * 40 * dt + Math.sin(d.y * 0.04 + i) * 0.25;

        d.trailTimer -= dt;
        if (d.trailTimer <= 0 && beads.length < 220) {
          beads.push({
            x: d.x + (Math.random() - 0.5) * 1.5,
            y: d.y - d.r * 0.8,
            r: 1.1 + Math.random() * 1.4,
            alpha: 0.75,
          });
          d.trailTimer = 0.12 + Math.random() * 0.22;
        }

        if (d.y - d.r > height) {
          d.y = -d.r - Math.random() * 30;
          d.x = Math.random() * width;
        }
        if (d.x > width + 20) d.x = -10;
        if (d.x < -20) d.x = width + 10;

        // Droplet body (slightly elongated vertical tear/ellipse)
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, d.r * 0.82, d.r * 1.12, 0, 0, Math.PI * 2);

        // Flipped internal refraction gradient (amber/cyan city lights inverted inside drop)
        const refGrad = ctx.createRadialGradient(
          d.x - d.r * 0.25,
          d.y - d.r * 0.35,
          d.r * 0.1,
          d.x,
          d.y,
          d.r * 1.1
        );
        refGrad.addColorStop(0, `rgba(255, 255, 255, ${(0.9 * refraction).toFixed(2)})`);
        refGrad.addColorStop(0.45, `rgba(125, 211, 252, ${(0.45 * refraction).toFixed(2)})`);
        refGrad.addColorStop(0.85, `rgba(251, 146, 60, ${(0.28 * refraction).toFixed(2)})`);
        refGrad.addColorStop(1, "rgba(15, 23, 42, 0.55)");

        ctx.fillStyle = refGrad;
        ctx.fill();

        // Crisp specular rim highlight at bottom-right of drop
        ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.restore();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, [effectiveDrops, effectiveSpeed, wind, refraction]);

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative flex min-h-[360px] w-full flex-col justify-between overflow-hidden rounded-3xl border border-neutral-800 bg-[#070B14] p-6 text-white shadow-sm",
        className
      )}
    >
      {/* Blurred Bokeh Cityscape Background behind the glass */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden opacity-80 blur-2xl"
      >
        <div className="absolute -left-10 top-6 h-56 w-56 rounded-full bg-sky-600/35" />
        <div className="absolute right-8 top-12 h-64 w-64 rounded-full bg-indigo-600/30" />
        <div className="absolute bottom-2 left-1/3 h-48 w-64 rounded-full bg-amber-500/30" />
        <div className="absolute bottom-6 right-12 h-40 w-40 rounded-full bg-rose-500/25" />
      </div>

      {/* Frosted Window Pane Tint */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-slate-950/35 backdrop-blur-md"
      />

      {/* Refractive Droplets Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-1 flex-col justify-between">
        {children ?? (
          <>
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-3 py-1 font-mono text-[11px] font-medium text-white backdrop-blur-md">
                <CloudRain className="h-3.5 w-3.5 text-sky-300" />
                Rain on Glass · Refractive Lens
              </span>

              <button
                type="button"
                onClick={() => setStormMode((s) => !s)}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1 font-mono text-[11px] text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                Intensity: {stormMode ? "Downpour" : "Steady Rain"}
              </button>
            </div>

            <div className="my-auto max-w-md py-8">
              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Refractive Window Droplets
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/80 sm:text-sm">
                Blurred bokeh backdrop with water droplets that stutter-slide
                down the pane, leave micro-bead trails, and refract inverted
                highlights.
              </p>
            </div>

            <div className="font-mono text-[11px] text-white/55">
              Drops: {effectiveDrops} · Refraction: {Math.round(refraction * 100)}%
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RainOnGlass;
