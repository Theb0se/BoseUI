"use client";

import React, { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface DotTextCanvasProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Headline lines drawn as a field of dots. Default: ["Cosign", "Awards"] */
  lines?: string[];
  /** Dot colors. Each dot picks one at random and re-picks as it twinkles. */
  colors?: string[];
  /** Max dot diameter in CSS px. Default: 14 */
  dotSize?: number;
  /** Mouse repulsion radius in pixels. Default: 80 */
  repelRadius?: number;
  /** Mouse repulsion strength multiplier. Default: 5 */
  repelStrength?: number;
  /** Spring return stiffness factor. Default: 0.08 */
  springStiffness?: number;
  /** Velocity friction damping. Default: 0.82 */
  damping?: number;
  /** Twinkle interval in ms. Default: 80 */
  twinkleInterval?: number;
  /** Custom canvas font family */
  fontFamily?: string;
  className?: string;
}

export interface DotTextHeroNavLink {
  label: string;
  href: string;
}

export interface DotTextHeroCta {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface DotTextHeroProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Headline lines drawn as a field of dots */
  lines?: string[];
  /** Dot colors palette. Each dot picks one at random and re-picks as it twinkles. */
  colors?: string[];
  /** Max dot diameter in CSS px */
  dotSize?: number;
  /** Mouse repulsion radius in pixels. Default: 80 */
  repelRadius?: number;
  /** Mouse repulsion force multiplier. Default: 5 */
  repelStrength?: number;
  /** Spring return stiffness. Default: 0.08 */
  springStiffness?: number;
  /** Velocity damping coefficient. Default: 0.82 */
  damping?: number;
  /** Twinkle interval in ms. Default: 80 */
  twinkleInterval?: number;
  /** Custom canvas font family */
  fontFamily?: string;
  /** Top bar brand title. Default: "cosign" */
  brandName?: string;
  /** Top bar brand subtitle or edition. Default: "Awards 2026" */
  brandTag?: string;
  /** Navigation links for the top bar */
  navLinks?: DotTextHeroNavLink[];
  /** Top bar action button */
  headerCta?: DotTextHeroCta;
  /** Status badge text or node. Default: "Cosigning is open" */
  badgeText?: React.ReactNode;
  /** Whether to render glowing ping indicator dot on badge. Default: true */
  showBadgePing?: boolean;
  /** Hero subtitle / description below headline */
  description?: React.ReactNode;
  /** Primary call-to-action button */
  primaryCta?: DotTextHeroCta;
  /** Secondary call-to-action button */
  secondaryCta?: DotTextHeroCta;
  /** Whether to render the header navigation. Default: true */
  showNav?: boolean;
  className?: string;
}

interface Dot {
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: number;
  delay: number;
  pop: number;
}

export const DEFAULT_DOT_COLORS = [
  "#ffffff",
  "#e5e5e5",
  "#bdbdbd",
  "#8a8a8a",
  "#5c5c5c",
];

const DEFAULT_NAV_LINKS: DotTextHeroNavLink[] = [
  { label: "Awards", href: "#awards" },
  { label: "Judges", href: "#judges" },
];

/**
 * DotTextCanvas — Standalone interactive canvas that rasterizes text lines into a
 * hexagonal-packed dot grid with physics-driven cursor repulsion, spring-back, and twinkling.
 */
export function DotTextCanvas({
  lines = ["Cosign", "Awards"],
  colors = DEFAULT_DOT_COLORS,
  dotSize = 14,
  repelRadius = 80,
  repelStrength = 5,
  springStiffness = 0.08,
  damping = 0.82,
  twinkleInterval = 80,
  fontFamily = "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  className,
  ...props
}: DotTextCanvasProps) {
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const linesKey = lines.join("|");
  const colorsKey = colors.join("|");

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let cancelled = false;
    let visible = true;
    let dots: Dot[] = [];
    let w = 0;
    let h = 0;
    let radius = 6;
    let start = performance.now();
    let lastSwap = 0;
    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    const mouse = { x: -9999, y: -9999 };
    const palette = colors && colors.length > 0 ? colors : DEFAULT_DOT_COLORS;
    const validLines = lines && lines.length > 0 ? lines : ["BoseUI"];

    const build = () => {
      w = wrap.clientWidth;
      if (!w) return;

      // 1. Measure text so headline fills ~84% of wrap width
      const probe = document.createElement("canvas").getContext("2d");
      if (!probe) return;

      probe.font = `800 100px ${fontFamily}`;
      const widest = Math.max(
        ...validLines.map((l) => probe.measureText(l).width || 100),
        1
      );
      const fs = Math.min((100 * w * 0.84) / widest, 300);
      const lineH = fs * 0.98;
      h = Math.ceil(validLines.length * lineH + fs * 0.12);

      if (w <= 0 || h <= 0) return;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      wrap.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 2. Rasterise offscreen text
      const off = document.createElement("canvas");
      off.width = Math.floor(w);
      off.height = Math.floor(h);
      const og = off.getContext("2d", { willReadFrequently: true });
      if (!og) return;

      og.fillStyle = "#fff";
      og.font = `800 ${fs}px ${fontFamily}`;
      og.textAlign = "center";
      og.textBaseline = "alphabetic";
      validLines.forEach((l, i) => {
        og.fillText(l, w / 2, lineH * i + fs * 0.8);
      });

      const data = og.getImageData(0, 0, off.width, off.height).data;

      // 3. Dot size
      const d = Math.max(6, Math.min(dotSize, w / 62));
      radius = d / 2;

      // 4. Hex-pack dots wherever text is solid (alpha > 150)
      const step = d * 1.04;
      const rowH = step * 0.866;
      dots = [];
      let row = 0;

      for (let y = radius; y < h - radius; y += rowH, row++) {
        const offset = row % 2 ? step / 2 : 0;
        for (let x = radius + offset; x < w - radius; x += step) {
          const idx = (Math.floor(y) * off.width + Math.floor(x)) * 4 + 3;
          const a = data[idx];
          if (a > 150) {
            dots.push({
              hx: x,
              hy: y,
              x,
              y,
              vx: 0,
              vy: 0,
              color: Math.floor(Math.random() * palette.length),
              delay: (x / w) * 0.7 + Math.random() * 0.4,
              pop: 0,
            });
          }
        }
      }
      start = performance.now();
    };

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || !dots.length) return;
      ctx.clearRect(0, 0, w, h);

      // Twinkle: randomly re-color a small batch of dots so field stays lively
      if (!reduceMotion && twinkleInterval > 0 && t - lastSwap > twinkleInterval) {
        lastSwap = t;
        const count = Math.min(7, Math.max(1, Math.floor(dots.length * 0.015)));
        for (let k = 0; k < count; k++) {
          const dot = dots[(Math.random() * dots.length) | 0];
          if (dot) {
            dot.color = (Math.random() * palette.length) | 0;
            dot.pop = 1;
          }
        }
      }

      const elapsed = (t - start) / 1000;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        const age = reduceMotion ? 1 : elapsed - dot.delay;
        if (age <= 0) continue;
        const intro = Math.min(1, age / 0.5);
        const eased = 1 - Math.pow(1 - intro, 3);

        if (!reduceMotion) {
          const dx = dot.x - mouse.x;
          const dy = dot.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < repelRadius && dist > 0.01) {
            const f = Math.pow(1 - dist / repelRadius, 2) * repelStrength;
            dot.vx += (dx / dist) * f;
            dot.vy += (dy / dist) * f;
          }
          dot.vx += (dot.hx - dot.x) * springStiffness;
          dot.vy += (dot.hy - dot.y) * springStiffness;
          dot.vx *= damping;
          dot.vy *= damping;
          dot.x += dot.vx;
          dot.y += dot.vy;
          dot.pop *= 0.88;
        }

        const r = radius * eased * (1 + dot.pop * 0.35);
        ctx.fillStyle = palette[dot.color] || "#ffffff";
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, Math.max(0.1, r), 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const ro = new ResizeObserver(build);
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 }
    );

    (async () => {
      if (typeof document !== "undefined" && document.fonts?.ready) {
        await document.fonts.ready;
      }
      if (cancelled) return;
      build();
      ro.observe(wrap);
      io.observe(wrap);
      raf = requestAnimationFrame(tick);
    })();

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointercancel", onLeave);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointercancel", onLeave);
    };
  }, [
    linesKey,
    colorsKey,
    dotSize,
    repelRadius,
    repelStrength,
    springStiffness,
    damping,
    twinkleInterval,
    fontFamily,
    reduceMotion,
  ]);

  return (
    <div
      ref={wrapRef}
      className={cn("relative w-full select-none touch-none", className)}
      aria-hidden="true"
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full" />
    </div>
  );
}

/**
 * DotTextHero — Production-grade hero section featuring the interactive canvas dot-matrix
 * headline with Hooke's Law spring physics, responsive navigation, status badge, and CTAs.
 */
export function DotTextHero({
  lines = ["BOSE", "UI"],
  colors = DEFAULT_DOT_COLORS,
  dotSize = 4,
  repelRadius = 20,
  repelStrength = 9,
  springStiffness = 0.08,
  damping = 0.82,
  twinkleInterval = 80,
  fontFamily,
  className,
  ...props
}: DotTextHeroProps) {




  return (
    <section
      className={cn(
        "relative flex min-h-[640px] w-full flex-col justify-between overflow-hidden bg-[#080808] text-white",
        className
      )}
      {...props}
    >


      {/* Hero Body */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-12 sm:py-16">


        {/* Canvas Dot Headline */}
        <DotTextCanvas
          lines={lines}
          colors={colors}
          dotSize={dotSize}
          repelRadius={repelRadius}
          repelStrength={repelStrength}
          springStiffness={springStiffness}
          damping={damping}
          twinkleInterval={twinkleInterval}
          fontFamily={fontFamily}
        />



      </div>
    </section>
  );
}

export default DotTextHero;
