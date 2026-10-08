"use client";

import React, { useEffect, useRef, useState } from "react";
import { Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SnowfallProps {
  /** Total number of snowflakes. Default: 140 */
  flakeCount?: number;
  /** Fall speed multiplier. Default: 1 */
  speed?: number;
  /** Horizontal wind drift (-2 to 2). Default: 0.3 */
  wind?: number;
  /** Maximum snowflake radius in pixels. Default: 4.2 */
  maxSize?: number;
  /** Optional foreground content */
  children?: React.ReactNode;
  className?: string;
}

interface Flake {
  x: number;
  y: number;
  r: number;
  depth: number; // 0.2 to 1.0 (bigger = faster & more opaque)
  phase: number;
  swayAmp: number;
}

export function Snowfall({
  flakeCount = 140,
  speed = 1,
  wind = 0.3,
  maxSize = 4.2,
  children,
  className,
}: SnowfallProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [blizzard, setBlizzard] = useState(false);

  const activeSpeed = blizzard ? speed * 2.4 : speed;
  const activeWind = blizzard ? wind + 1.4 : wind;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let width = (canvas.width = canvas.offsetWidth || 600);
    let height = (canvas.height = canvas.offsetHeight || 360);

    const flakes: Flake[] = Array.from({ length: flakeCount }, () => {
      const depth = 0.2 + Math.random() * 0.8;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.8 + depth * (maxSize - 0.8),
        depth,
        phase: Math.random() * Math.PI * 2,
        swayAmp: 12 + Math.random() * 22,
      };
    });

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 600;
      height = canvas.height = canvas.offsetHeight || 360;
    };

    window.addEventListener("resize", handleResize);

    let last = performance.now();
    const render = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      const t = now * 0.001;
      last = now;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        // Bigger particles move faster and are more opaque for depth
        const vy = (24 + f.depth * 68) * activeSpeed;
        const vx =
          activeWind * 28 * f.depth +
          Math.sin(t * 1.4 + f.phase) * f.swayAmp * f.depth;

        f.y += vy * dt;
        f.x += vx * dt;

        if (f.y > height + f.r) {
          f.y = -f.r;
          f.x = Math.random() * width;
        }
        if (f.x > width + f.r) f.x = -f.r;
        if (f.x < -f.r) f.x = width + f.r;

        const alpha = 0.22 + f.depth * 0.72;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, [flakeCount, activeSpeed, activeWind, maxSize]);

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative flex min-h-[360px] w-full flex-col justify-between overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-b from-[#060B16] via-[#0B1528] to-[#16243E] p-6 text-white shadow-sm",
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
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 font-mono text-[11px] font-medium text-white backdrop-blur-md">
                <Snowflake className="h-3.5 w-3.5 text-sky-200" />
                Snowfall · Depth Parallax
              </span>

              <button
                type="button"
                onClick={() => setBlizzard((b) => !b)}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1 font-mono text-[11px] text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                Mode: {blizzard ? "Winter Gale" : "Gentle Flurry"}
              </button>
            </div>

            <div className="my-auto max-w-md py-8">
              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Depth-Sorted Snowfall
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/80 sm:text-sm">
                Larger foreground flakes fall faster with higher opacity while
                distant micro-flakes drift gently on horizontal sine waves.
              </p>
            </div>

            <div className="font-mono text-[11px] text-white/50">
              {flakeCount} Particles · Sine Drift · Z-Depth Velocity
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Snowfall;
