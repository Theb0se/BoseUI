"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StarryNightProps {
  /** Number of stars rendered on the canvas (100 to 350). Default: 200 */
  density?: number;
  /** Enable sine-wave alpha twinkling per star. Default: true */
  twinkle?: boolean;
  /** Mouse-move parallax shift intensity in pixels. Default: 24 */
  parallax?: number;
  /** Optional foreground content */
  children?: React.ReactNode;
  className?: string;
}

interface StarParticle {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  phase: number;
  speed: number;
  depth: number; // 0.2 (far) to 1.0 (near)
}

export function StarryNight({
  density = 200,
  twinkle = true,
  parallax = 24,
  children,
  className,
}: StarryNightProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [twinkleOn, setTwinkleOn] = useState(twinkle);

  useEffect(() => {
    setTwinkleOn(twinkle);
  }, [twinkle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let width = (canvas.width = canvas.offsetWidth || 600);
    let height = (canvas.height = canvas.offsetHeight || 360);

    const count = Math.max(40, Math.min(400, density));
    const stars: StarParticle[] = Array.from({ length: count }, () => {
      const depth = 0.2 + Math.random() * 0.8;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.5 + depth * 1.4,
        baseAlpha: 0.35 + Math.random() * 0.65,
        phase: Math.random() * Math.PI * 2,
        speed: 1.2 + Math.random() * 2.8,
        depth,
      };
    });

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 600;
      height = canvas.height = canvas.offsetHeight || 360;
    };

    window.addEventListener("resize", handleResize);

    const render = (now: number) => {
      const t = now * 0.001;
      // Smooth lerp pointer parallax
      pointerRef.current.x +=
        (pointerRef.current.targetX - pointerRef.current.x) * 0.08;
      pointerRef.current.y +=
        (pointerRef.current.targetY - pointerRef.current.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const alpha = twinkleOn
          ? s.baseAlpha * (0.45 + 0.55 * Math.sin(t * s.speed + s.phase))
          : s.baseAlpha;

        const drawX =
          (s.x + pointerRef.current.x * s.depth * parallax + width) % width;
        const drawY =
          (s.y + pointerRef.current.y * s.depth * parallax + height) % height;

        ctx.beginPath();
        ctx.arc(drawX, drawY, s.radius, 0, Math.PI * 2);
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
  }, [density, parallax, twinkleOn]);

  return (
    <div
      data-fullscreen-scroll
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        pointerRef.current.targetX = -nx;
        pointerRef.current.targetY = -ny;
      }}
      onMouseLeave={() => {
        pointerRef.current.targetX = 0;
        pointerRef.current.targetY = 0;
      }}
      className={cn(
        "relative flex min-h-[360px] w-full flex-col justify-between overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-b from-[#03050C] via-[#070B19] to-[#0F172A] p-6 text-white shadow-sm",
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
                <Sparkles className="h-3.5 w-3.5 text-sky-300" />
                Starry Night · {density} Stars
              </span>

              <button
                type="button"
                onClick={() => setTwinkleOn((v) => !v)}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1 font-mono text-[11px] text-white/85 backdrop-blur-md transition-colors hover:bg-white/20"
              >
                Twinkle: {twinkleOn ? "ON" : "OFF"}
              </button>
            </div>

            <div className="my-auto max-w-md py-8">
              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Deep Space Starfield
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/75 sm:text-sm">
                Move your cursor to experience multi-plane depth parallax while
                each star oscillates on an independent sine-wave phase.
              </p>
            </div>

            <div className="font-mono text-[11px] text-white/50">
              Canvas 2D · Sine-Wave Alpha · 3D Depth Parallax
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StarryNight;
