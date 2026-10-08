"use client";

import React, { useEffect, useRef } from "react";
import { Network } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ParticleNetworkProps {
  /** Number of drifting nodes. Default: 55 */
  particleCount?: number;
  /** Maximum distance in pixels to draw a connecting edge. Default: 125 */
  connectDistance?: number;
  /** Drift velocity multiplier. Default: 1 */
  speed?: number;
  /** RGB triplet (e.g. "255, 255, 255") for nodes and edges. Default: "255, 255, 255" */
  particleColor?: string;
  /** Connect nodes to the user's cursor when hovering. Default: true */
  interactive?: boolean;
  /** Optional foreground content */
  children?: React.ReactNode;
  className?: string;
}

interface NodeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

export function ParticleNetwork({
  particleCount = 55,
  connectDistance = 125,
  speed = 1,
  particleColor = "255, 255, 255",
  interactive = true,
  children,
  className,
}: ParticleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let width = (canvas.width = canvas.offsetWidth || 600);
    let height = (canvas.height = canvas.offsetHeight || 360);

    const nodes: NodeParticle[] = Array.from({ length: particleCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const v = (18 + Math.random() * 28) * speed;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * v,
        vy: Math.sin(angle) * v,
        r: 1.5 + Math.random() * 1.5,
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
      last = now;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx * dt;
        n.y += n.vy * dt;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Draw node dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor}, 0.75)`;
        ctx.fill();

        // Connect to neighbor nodes within threshold distance
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const dist = Math.hypot(dx, dy);

          if (dist < connectDistance) {
            const alpha = (1 - dist / connectDistance) * 0.42;
            ctx.strokeStyle = `rgba(${particleColor}, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }

        // Connect to cursor if active
        if (interactive && mouseRef.current.active) {
          const mdx = n.x - mouseRef.current.x;
          const mdy = n.y - mouseRef.current.y;
          const mDist = Math.hypot(mdx, mdy);
          const cursorThreshold = connectDistance * 1.25;
          if (mDist < cursorThreshold) {
            const alpha = (1 - mDist / cursorThreshold) * 0.65;
            ctx.strokeStyle = `rgba(${particleColor}, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.stroke();
          }
        }
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, [particleCount, connectDistance, speed, particleColor, interactive]);

  return (
    <div
      data-fullscreen-scroll
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseRef.current.x = e.clientX - rect.left;
        mouseRef.current.y = e.clientY - rect.top;
        mouseRef.current.active = true;
      }}
      onMouseLeave={() => {
        mouseRef.current.active = false;
      }}
      className={cn(
        "relative flex min-h-[360px] w-full flex-col justify-between overflow-hidden rounded-3xl border border-neutral-800 bg-[#05070B] p-6 text-white shadow-sm",
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
                <Network className="h-3.5 w-3.5 text-neutral-300" />
                Particle Network · {particleCount} Nodes
              </span>
              <span className="font-mono text-[11px] text-white/50">
                Radius: {connectDistance}px
              </span>
            </div>

            <div className="my-auto max-w-md py-8">
              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Proximity Graph Topology
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/75 sm:text-sm">
                Drifting nodes dynamically form edges whenever their Euclidean
                distance falls below {connectDistance}px, with line opacity
                scaling inversely with distance.
              </p>
            </div>

            <div className="font-mono text-[11px] text-white/50">
              Hover anywhere to attract proximity edges
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ParticleNetwork;
