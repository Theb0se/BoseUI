"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface MovingGridLinesProps {
  /** Size of each square grid cell in pixels. Default: 64 */
  gridSize?: number;
  /** Number of concurrent moving beams. Default: 8 */
  beamCount?: number;
  /** Length of the light beam trail in pixels. Default: 160 */
  beamLength?: number;
  /** Speed multiplier for the traveling beams. Default: 1.5 */
  speed?: number;
  /** Explicit grid line color. Defaults to adaptive light/dark mode color */
  gridColor?: string;
  /** Explicit beam light color. Defaults to adaptive light/dark mode beam color */
  beamColor?: string;
  /** Whether to apply a radial vignette mask fading edges to transparency. Default: true */
  radialMask?: boolean;
  /** Optional foreground content rendered above the moving grid surface */
  children?: React.ReactNode;
  /** Optional container CSS classes */
  className?: string;
}

interface GridBeam {
  id: number;
  direction: "horizontal" | "vertical";
  track: number; // Y coordinate for horizontal, X coordinate for vertical
  pos: number; // Current head position along the track
  startPos: number;
  endPos: number;
  speed: number;
  length: number;
  reverse: boolean;
  delay: number;
  opacity: number;
}

export function MovingGridLines({
  gridSize = 64,
  beamCount = 8,
  beamLength = 160,
  speed = 1.5,
  gridColor,
  beamColor,
  radialMask = true,
  children,
  className,
}: MovingGridLinesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Detect theme color adaptively
    const getThemeColors = () => {
      const isDark = document.documentElement.classList.contains("dark");
      const defaultGrid = isDark
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.05)";
      const defaultBeam = isDark
        ? "rgba(255, 255, 255, 0.85)"
        : "rgba(0, 0, 0, 0.75)";

      return {
        resolvedGridColor: gridColor || defaultGrid,
        resolvedBeamColor: beamColor || defaultBeam,
      };
    };

    let colors = getThemeColors();

    // Observe theme toggle on html tag
    const themeObserver = new MutationObserver(() => {
      colors = getThemeColors();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const createBeam = (id: number): GridBeam => {
      const isHorizontal = Math.random() > 0.5;
      const length = beamLength * (0.8 + Math.random() * 0.5);
      const beamSpeed = (120 + Math.random() * 140) * speed;
      const reverse = Math.random() > 0.5;

      if (isHorizontal) {
        const rows = Math.max(1, Math.floor(height / gridSize));
        const rowIndex = Math.floor(Math.random() * (rows + 1));
        const track = rowIndex * gridSize;

        return {
          id,
          direction: "horizontal",
          track,
          pos: reverse ? width + length : -length,
          startPos: reverse ? width + length : -length,
          endPos: reverse ? -length : width + length,
          speed: beamSpeed,
          length,
          reverse,
          delay: Math.random() * 2,
          opacity: 0.6 + Math.random() * 0.4,
        };
      } else {
        const cols = Math.max(1, Math.floor(width / gridSize));
        const colIndex = Math.floor(Math.random() * (cols + 1));
        const track = colIndex * gridSize;

        return {
          id,
          direction: "vertical",
          track,
          pos: reverse ? height + length : -length,
          startPos: reverse ? height + length : -length,
          endPos: reverse ? -length : height + length,
          speed: beamSpeed,
          length,
          reverse,
          delay: Math.random() * 2,
          opacity: 0.6 + Math.random() * 0.4,
        };
      }
    };

    let beams: GridBeam[] = [];

    const resize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // Re-initialize beams for new dimensions
      beams = Array.from({ length: beamCount }, (_, i) => createBeam(i));
    };

    resize();

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw static crisp grid lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = colors.resolvedGridColor;
      ctx.beginPath();

      // Vertical lines
      for (let x = 0; x <= width; x += gridSize) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
      }

      // Horizontal lines
      for (let y = 0; y <= height; y += gridSize) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
      }
      ctx.stroke();

      // 2. Draw moving glowing beams (if not reduced motion)
      if (!isReducedMotion) {
        for (let i = 0; i < beams.length; i++) {
          const b = beams[i];

          if (b.delay > 0) {
            b.delay -= dt;
            continue;
          }

          // Advance beam position
          if (b.reverse) {
            b.pos -= b.speed * dt;
            if (b.pos < b.endPos) {
              beams[i] = createBeam(b.id);
              continue;
            }
          } else {
            b.pos += b.speed * dt;
            if (b.pos > b.endPos) {
              beams[i] = createBeam(b.id);
              continue;
            }
          }

          // Draw linear glowing gradient beam along track
          ctx.save();
          if (b.direction === "horizontal") {
            const headX = b.pos;
            const tailX = b.reverse ? headX + b.length : headX - b.length;

            const grad = ctx.createLinearGradient(tailX, b.track, headX, b.track);
            grad.addColorStop(0, "transparent");
            grad.addColorStop(
              0.8,
              colors.resolvedBeamColor.replace(
                /[\d.]+\)$/g,
                `${(b.opacity * 0.7).toFixed(2)})`
              )
            );
            grad.addColorStop(1, colors.resolvedBeamColor);

            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(tailX, b.track + 0.5);
            ctx.lineTo(headX, b.track + 0.5);
            ctx.stroke();

            // Bright head spark
            ctx.fillStyle = colors.resolvedBeamColor;
            ctx.beginPath();
            ctx.arc(headX, b.track + 0.5, 1.5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            const headY = b.pos;
            const tailY = b.reverse ? headY + b.length : headY - b.length;

            const grad = ctx.createLinearGradient(b.track, tailY, b.track, headY);
            grad.addColorStop(0, "transparent");
            grad.addColorStop(
              0.8,
              colors.resolvedBeamColor.replace(
                /[\d.]+\)$/g,
                `${(b.opacity * 0.7).toFixed(2)})`
              )
            );
            grad.addColorStop(1, colors.resolvedBeamColor);

            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(b.track + 0.5, tailY);
            ctx.lineTo(b.track + 0.5, headY);
            ctx.stroke();

            // Bright head spark
            ctx.fillStyle = colors.resolvedBeamColor;
            ctx.beginPath();
            ctx.arc(b.track + 0.5, headY, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      themeObserver.disconnect();
    };
  }, [gridSize, beamCount, beamLength, speed, gridColor, beamColor, isReducedMotion]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden",
        radialMask &&
          "[mask-image:radial-gradient(ellipse_65%_55%_at_50%_25%,black_25%,transparent_100%)]",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 block h-full w-full"
      />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
