"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ShootingStarsProps {
  /** Average spawns per second. Default: 2.5 */
  frequency?: number;
  /** Trajectory angle in degrees. Default: 35 */
  angle?: number;
  /** Hex or RGB color for the meteor head and tail. Default: "#FFFFFF" */
  color?: string;
  /** Maximum simultaneous shooting stars. Default: 6 */
  maxConcurrent?: number;
  /** Optional foreground content */
  children?: React.ReactNode;
  className?: string;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  life: number;
  maxLife: number;
}

export function ShootingStars({
  frequency = 2.5,
  angle = 35,
  color = "#FFFFFF",
  maxConcurrent = 6,
  children,
  className,
}: ShootingStarsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [burstTrigger, setBurstTrigger] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let width = (canvas.width = canvas.offsetWidth || 600);
    let height = (canvas.height = canvas.offsetHeight || 360);

    const rad = (angle * Math.PI) / 180;
    const vx = Math.cos(rad);
    const vy = Math.sin(rad);

    const meteors: Meteor[] = [];

    const spawnMeteor = () => {
      if (meteors.length >= maxConcurrent) return;
      meteors.push({
        x: Math.random() * width * 0.85,
        y: Math.random() * height * 0.45,
        length: 80 + Math.random() * 90,
        speed: 520 + Math.random() * 340,
        life: 0,
        maxLife: 0.75 + Math.random() * 0.45,
      });
    };

    // Initial spawn
    spawnMeteor();

    let last = performance.now();
    const render = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (Math.random() < frequency * dt) {
        spawnMeteor();
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.life += dt;
        if (m.life >= m.maxLife) {
          meteors.splice(i, 1);
          continue;
        }

        m.x += vx * m.speed * dt;
        m.y += vy * m.speed * dt;

        const progress = m.life / m.maxLife;
        const alpha =
          progress < 0.2
            ? progress / 0.2
            : Math.max(0, 1 - (progress - 0.2) / 0.8);

        const tailX = m.x - vx * m.length;
        const tailY = m.y - vy * m.length;

        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, color);
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Bright head glow
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [frequency, angle, color, maxConcurrent, burstTrigger]);

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative flex min-h-[360px] w-full flex-col justify-between overflow-hidden rounded-3xl border border-neutral-800 bg-[#05070F] p-6 text-white shadow-sm",
        className
      )}
    >
      {/* Subtle Background Star Dust */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:32px_32px]"
      />

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
                <Sparkles className="h-3.5 w-3.5 text-amber-200" />
                Shooting Stars · {angle}° Trajectory
              </span>

              <button
                type="button"
                onClick={() => setBurstTrigger((c) => c + 1)}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1 font-mono text-[11px] text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                Spawn Meteor
              </button>
            </div>

            <div className="my-auto max-w-md py-8">
              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Meteor Shower Streaking
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/75 sm:text-sm">
                Randomized diagonal meteors with bright heads and linear-gradient
                tails that fade out smoothly over a 1-second lifecycle.
              </p>
            </div>

            <div className="font-mono text-[11px] text-white/50">
              Max Concurrent: {maxConcurrent} · Frequency: {frequency}/s
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ShootingStars;
