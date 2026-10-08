"use client";

import React, { useEffect, useRef, useState } from "react";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WarpSpeedProps {
  /** Base forward velocity. Default: 180 */
  speed?: number;
  /** Number of 3D stars in the tunnel. Default: 320 */
  starCount?: number;
  /** Streak tail multiplier. Default: 1.4 */
  streakLength?: number;
  /** Engage hyperspace warp jump (ramps speed up 5x). Default: false */
  warp?: boolean;
  /** Normalized vanishing point { x: 0..1, y: 0..1 }. Default: { x: 0.5, y: 0.5 } */
  center?: { x: number; y: number };
  /** Allow vanishing point to follow the cursor. Default: true */
  followCursor?: boolean;
  /** Optional foreground content */
  children?: React.ReactNode;
  className?: string;
}

interface Star3D {
  x: number;
  y: number;
  z: number;
  pz: number;
}

export function WarpSpeed({
  speed = 180,
  starCount = 320,
  streakLength = 1.4,
  warp = false,
  center = { x: 0.5, y: 0.5 },
  followCursor = true,
  children,
  className,
}: WarpSpeedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isWarping, setIsWarping] = useState(warp);
  const vanishingRef = useRef({
    x: center.x,
    y: center.y,
    targetX: center.x,
    targetY: center.y,
  });

  useEffect(() => {
    setIsWarping(warp);
  }, [warp]);

  useEffect(() => {
    vanishingRef.current.targetX = center.x;
    vanishingRef.current.targetY = center.y;
  }, [center.x, center.y]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let width = (canvas.width = canvas.offsetWidth || 600);
    let height = (canvas.height = canvas.offsetHeight || 360);
    const maxDepth = 1000;

    const createStar = (): Star3D => {
      const z = Math.random() * maxDepth + 1;
      return {
        x: (Math.random() - 0.5) * width * 2.2,
        y: (Math.random() - 0.5) * height * 2.2,
        z,
        pz: z,
      };
    };

    const stars: Star3D[] = Array.from({ length: starCount }, createStar);
    let currentVelocity = speed;

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

      // Smoothly ramp velocity up or down for warp jump
      const targetVelocity = isWarping ? speed * 5.2 : speed;
      currentVelocity += (targetVelocity - currentVelocity) * 0.08;

      // Smoothly interpolate vanishing point
      vanishingRef.current.x +=
        (vanishingRef.current.targetX - vanishingRef.current.x) * 0.08;
      vanishingRef.current.y +=
        (vanishingRef.current.targetY - vanishingRef.current.y) * 0.08;

      const cx = vanishingRef.current.x * width;
      const cy = vanishingRef.current.y * height;
      const focal = Math.min(width, height) * 0.65;

      ctx.fillStyle = isWarping
        ? "rgba(3, 5, 12, 0.32)"
        : "rgba(3, 5, 12, 0.55)";
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.pz = s.z + currentVelocity * dt * streakLength * (isWarping ? 2.8 : 1);
        s.z -= currentVelocity * dt;

        if (s.z <= 2) {
          s.x = (Math.random() - 0.5) * width * 2.2;
          s.y = (Math.random() - 0.5) * height * 2.2;
          s.z = maxDepth;
          s.pz = maxDepth;
          continue;
        }

        // 3D perspective projection: screenX = (x / z) * focal + cx
        const sx = (s.x / s.z) * focal + cx;
        const sy = (s.y / s.z) * focal + cy;
        const px = (s.x / s.pz) * focal + cx;
        const py = (s.y / s.pz) * focal + cy;

        const depthRatio = 1 - s.z / maxDepth;
        const alpha = Math.max(0.08, Math.min(1, depthRatio * 1.2));
        const lineWidth = Math.max(0.6, depthRatio * (isWarping ? 2.8 : 2.0));

        ctx.strokeStyle = isWarping
          ? `rgba(186, 230, 253, ${alpha.toFixed(3)})`
          : `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, [speed, starCount, streakLength, isWarping]);

  return (
    <div
      data-fullscreen-scroll
      onMouseMove={(e) => {
        if (!followCursor) return;
        const rect = e.currentTarget.getBoundingClientRect();
        vanishingRef.current.targetX = (e.clientX - rect.left) / rect.width;
        vanishingRef.current.targetY = (e.clientY - rect.top) / rect.height;
      }}
      onMouseLeave={() => {
        if (!followCursor) return;
        vanishingRef.current.targetX = center.x;
        vanishingRef.current.targetY = center.y;
      }}
      className={cn(
        "relative flex min-h-[360px] w-full flex-col justify-between overflow-hidden rounded-3xl border border-neutral-800 bg-[#03050C] p-6 text-white shadow-sm",
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
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1 font-mono text-[11px] font-medium text-white backdrop-blur-md">
                <Zap className="h-3.5 w-3.5 text-sky-400" />
                Warp Speed · {isWarping ? "HYPERSPACE" : "SUBLIGHT"}
              </span>

              <button
                type="button"
                onClick={() => setIsWarping((w) => !w)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 font-mono text-xs font-semibold transition-all active:scale-95",
                  isWarping
                    ? "border-sky-400 bg-sky-400 text-black shadow-[0_0_20px_rgba(56,189,248,0.6)]"
                    : "border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
                )}
              >
                <Zap className="h-3 w-3" />
                <span>{isWarping ? "Disengage Warp" : "Engage Warp Jump"}</span>
              </button>
            </div>

            <div className="my-auto max-w-md py-8">
              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                3D Hyperspace Projection
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/75 sm:text-sm">
                Projects 3D star coordinates via{" "}
                <code className="font-mono text-sky-300">screenX = x / z</code>{" "}
                with cursor-steered vanishing point and velocity streak ramps.
              </p>
            </div>

            <div className="font-mono text-[11px] text-white/50">
              Move cursor to steer vanishing point · Click button to jump
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default WarpSpeed;
