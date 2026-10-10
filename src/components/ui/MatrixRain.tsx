"use client";

import React, { useEffect, useRef, useState } from "react";
import { Terminal, Zap, Cpu, RefreshCw, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MatrixRainProps {
  /** Primary phosphor color in hex format (e.g., "#10B981") */
  color?: string;
  /** Fall speed multiplier */
  speed?: number;
  /** Stream density multiplier (0.3 to 2.0) */
  density?: number;
  /** Glyph character set */
  charset?: "katakana" | "binary" | "hex";
  /** Font size in pixels */
  fontSize?: number;
  /** Optional overlay content */
  children?: React.ReactNode;
  /** Additional container classes */
  className?: string;
}

const CHARSETS: Record<"katakana" | "binary" | "hex", string> = {
  katakana:
    "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>|=+*:",
  binary: "01",
  hex: "0123456789ABCDEF",
};

interface StreamDrop {
  layer: 0 | 1 | 2; // 0 = far, 1 = mid, 2 = near
  x: number;
  y: number;
  speed: number;
  length: number;
  fontSize: number;
  chars: string[];
  glitchTimers: number[];
  mutationRate: number;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return { r: 16, g: 185, b: 129 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function MatrixRain({
  color: propColor = "#10B981",
  speed: propSpeed = 1.0,
  density: propDensity = 1.0,
  charset: propCharset = "katakana",
  fontSize: propFontSize = 15,
  children,
  className,
}: MatrixRainProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  const [activeCharset, setActiveCharset] = useState<
    "katakana" | "binary" | "hex"
  >(propCharset);
  const [activeColor, setActiveColor] = useState<string>(propColor);
  const [activeSpeed, setActiveSpeed] = useState<number>(propSpeed);
  const [activeDensity, setActiveDensity] = useState<number>(propDensity);
  const [streamCount, setStreamCount] = useState<number>(0);

  useEffect(() => {
    setActiveCharset(propCharset);
  }, [propCharset]);

  useEffect(() => {
    setActiveColor(propColor);
  }, [propColor]);

  useEffect(() => {
    setActiveSpeed(propSpeed);
  }, [propSpeed]);

  useEffect(() => {
    setActiveDensity(propDensity);
  }, [propDensity]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    let drops: StreamDrop[] = [];

    const glyphPool = CHARSETS[activeCharset] || CHARSETS.katakana;
    const randomGlyph = () =>
      glyphPool[Math.floor(Math.random() * glyphPool.length)] || "0";

    const createLayerDrops = (
      layer: 0 | 1 | 2,
      layerFontSize: number,
      densityFactor: number,
      speedRange: [number, number],
      lengthRange: [number, number]
    ): StreamDrop[] => {
      const colStep = Math.max(9, layerFontSize);
      const totalCols = Math.ceil(width / colStep);
      const count = Math.max(
        4,
        Math.floor(
          totalCols *
            densityFactor *
            Math.min(2.2, Math.max(0.3, activeDensity))
        )
      );

      return Array.from({ length: count }, (_, i) => {
        const colIndex = Math.floor((i / count) * totalCols);
        const length = Math.floor(
          lengthRange[0] + Math.random() * (lengthRange[1] - lengthRange[0])
        );
        return {
          layer,
          x:
            colIndex * colStep +
            layerFontSize * 0.5 +
            (Math.random() - 0.5) * 4,
          y: Math.random() * height * 1.4 - height * 0.7,
          speed:
            (speedRange[0] + Math.random() * (speedRange[1] - speedRange[0])) *
            layerFontSize *
            0.12,
          length,
          fontSize: layerFontSize,
          chars: Array.from({ length: length + 8 }, randomGlyph),
          glitchTimers: Array.from({ length: length + 8 }, () =>
            Math.random()
          ),
          mutationRate:
            layer === 1
              ? 0.03 + Math.random() * 0.06
              : 0.015 + Math.random() * 0.04,
        };
      });
    };

    const initStreams = () => {
      const farFont = Math.max(10, Math.round(propFontSize * 0.72));
      const midFont = Math.max(12, propFontSize);
      const nearFont = Math.max(18, Math.round(propFontSize * 1.48));

      const farDrops = createLayerDrops(0, farFont, 0.75, [0.45, 0.85], [14, 28]);
      const midDrops = createLayerDrops(1, midFont, 0.95, [0.85, 1.55], [14, 30]);
      const nearDrops = createLayerDrops(2, nearFont, 0.22, [1.45, 2.25], [8, 16]);

      drops = [...farDrops, ...midDrops, ...nearDrops];
      setStreamCount(drops.length);
    };

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStreams();
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);

    const rgb = hexToRgb(activeColor);
    const brightR = Math.min(255, rgb.r + 135);
    const brightG = Math.min(255, rgb.g + 135);
    const brightB = Math.min(255, rgb.b + 135);

    const render = () => {
      // Crisp full-frame dark phosphor clear + subtle ambient depth gradient
      ctx.fillStyle = "#02060A";
      ctx.fillRect(0, 0, width, height);

      const bgGlow = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        20,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75
      );
      bgGlow.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.07)`);
      bgGlow.addColorStop(1, "rgba(2, 6, 10, 0)");
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      const ptr = pointerRef.current;
      const parallaxOffset = ptr.active
        ? (ptr.x / Math.max(1, width) - 0.5) * 28
        : 0;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      let currentLayer = -1;

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];

        if (drop.layer !== currentLayer) {
          currentLayer = drop.layer;
          const weight = currentLayer === 0 ? "500" : "700";
          ctx.font = `${weight} ${drop.fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
        }

        drop.y += drop.speed * activeSpeed;

        const layerShift =
          drop.layer === 0
            ? -parallaxOffset * 0.35
            : drop.layer === 1
            ? parallaxOffset * 0.25
            : parallaxOffset * 0.85;

        const drawX = ((drop.x + layerShift) % width + width) % width;
        const stepY = drop.fontSize * 1.05;
        const headRow = Math.floor(drop.y / stepY);

        // Soft vertical phosphor bloom spine behind mid & near streams
        if (drop.layer >= 1) {
          const headY = headRow * stepY;
          const tailTopY = (headRow - drop.length * 0.75) * stepY;
          if (headY > 0 && tailTopY < height) {
            const spineGrad = ctx.createLinearGradient(
              drawX,
              Math.max(0, tailTopY),
              drawX,
              Math.min(height, headY + stepY)
            );
            const maxSpineAlpha = drop.layer === 2 ? 0.14 : 0.09;
            spineGrad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
            spineGrad.addColorStop(
              0.85,
              `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${maxSpineAlpha})`
            );
            spineGrad.addColorStop(
              1,
              `rgba(${brightR}, ${brightG}, ${brightB}, ${maxSpineAlpha * 1.5})`
            );
            ctx.fillStyle = spineGrad;
            ctx.fillRect(
              drawX - drop.fontSize * 0.45,
              Math.max(0, tailTopY),
              drop.fontSize * 0.9,
              Math.min(height, headY + stepY) - Math.max(0, tailTopY)
            );
          }
        }

        const baseLayerAlpha =
          drop.layer === 0 ? 0.34 : drop.layer === 1 ? 0.92 : 0.52;

        for (let j = 0; j < drop.length; j++) {
          const charY = (headRow - j) * stepY;
          if (charY < -drop.fontSize || charY > height + drop.fontSize) {
            continue;
          }

          // Deterministic slot tied to grid row so characters stay stationary in space while the illumination wave falls through them
          const charSlot =
            ((headRow - j) % drop.chars.length + drop.chars.length) %
            drop.chars.length;

          if (Math.random() < drop.mutationRate * (j === 0 ? 2.5 : 0.5)) {
            drop.chars[charSlot] = randomGlyph();
            drop.glitchTimers[charSlot] = 1.0;
          } else {
            drop.glitchTimers[charSlot] = Math.max(
              0,
              drop.glitchTimers[charSlot] - 0.04
            );
          }

          const ch = drop.chars[charSlot];

          // Pointer proximity boost
          let pointerBoost = 0;
          if (ptr.active) {
            const dist = Math.hypot(drawX - ptr.x, charY - ptr.y);
            if (dist < 130) {
              pointerBoost = (1 - dist / 130) * 0.55;
            }
          }

          if (j === 0) {
            // Incandescent white-hot lead character with bloom
            ctx.save();
            ctx.shadowColor = `rgba(${brightR}, ${brightG}, ${brightB}, 0.95)`;
            ctx.shadowBlur = drop.layer === 0 ? 4 : drop.layer === 1 ? 14 : 20;
            ctx.fillStyle =
              drop.layer === 0
                ? `rgba(${brightR}, ${brightG}, ${brightB}, 0.75)`
                : "#FFFFFF";
            ctx.fillText(ch, drawX, charY);
            ctx.restore();
          } else if (j <= 2) {
            // Sub-head high-energy phosphor transition
            const subAlpha = Math.min(1, baseLayerAlpha + pointerBoost);
            ctx.fillStyle = `rgba(${brightR}, ${brightG}, ${brightB}, ${subAlpha.toFixed(
              3
            )})`;
            ctx.fillText(ch, drawX, charY);
          } else {
            // Smooth exponential phosphor decay along tail + occasional bright glitch character
            const progress = j / drop.length;
            const decay = Math.pow(1 - progress, 1.65);
            const glitchFlash = drop.glitchTimers[charSlot] * 0.35;
            const finalAlpha = Math.min(
              1,
              (decay * baseLayerAlpha + glitchFlash + pointerBoost)
            );

            if (finalAlpha > 0.02) {
              if (drop.glitchTimers[charSlot] > 0.65 && drop.layer === 1) {
                ctx.fillStyle = `rgba(${brightR}, ${brightG}, ${brightB}, ${finalAlpha.toFixed(
                  3
                )})`;
              } else {
                ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${finalAlpha.toFixed(
                  3
                )})`;
              }
              ctx.fillText(ch, drawX, charY);
            }
          }
        }

        // Respawn stream once tail clears bottom of screen
        if ((headRow - drop.length) * stepY > height + drop.fontSize * 2) {
          drop.y = -Math.random() * height * 0.45;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [activeCharset, activeColor, activeSpeed, activeDensity, propFontSize]);

  return (
    <div
      ref={containerRef}
      data-fullscreen-scroll
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        pointerRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          active: true,
        };
      }}
      onMouseLeave={() => {
        pointerRef.current.active = false;
      }}
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-emerald-500/20 bg-[#02060A] text-slate-100 shadow-2xl",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* Authentic CRT Scanline & Vignette Overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.28)_50%)] bg-[length:100%_4px] opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(1,4,9,0.86)_100%)]"
      />

      {children && (
        <div className="relative z-10 flex min-h-[520px] w-full flex-col">
          {children}
        </div>
      )}
    </div>
  );
}

export default MatrixRain;
