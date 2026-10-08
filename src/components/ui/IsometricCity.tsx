"use client";

import React, { useEffect, useRef, useState } from "react";
import { Building2, Car, Sparkles, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IsometricCityProps {
  /** Number of city blocks along each isometric axis (4 to 10) */
  gridSize?: number;
  /** Probability [0.3 - 1.0] that a grid cell contains a skyscraper */
  buildingDensity?: number;
  /** Speed multiplier for avenue light-streak traffic */
  trafficSpeed?: number;
  /** Architectural lighting color palette */
  colorPalette?: "cyberpunk" | "midnight" | "amber";
  /** Whether office windows subtly toggle on and off over time */
  windowFlicker?: boolean;
  /** Optional foreground content */
  children?: React.ReactNode;
  /** Additional container classes */
  className?: string;
}

interface PaletteConfig {
  bgTop: string;
  bgBottom: string;
  smogGlow: string;
  gridLine: string;
  streetGlow: string;
  roofFace: string;
  leftFace: string;
  rightFace: string;
  edgeStroke: string;
  neonAccent: string;
  windowLitA: string;
  windowLitB: string;
  beaconColor: string;
  headlight: string;
  taillight: string;
}

const PALETTES: Record<"cyberpunk" | "midnight" | "amber", PaletteConfig> = {
  midnight: {
    bgTop: "#020617",
    bgBottom: "#091936",
    smogGlow: "rgba(56, 189, 248, 0.16)",
    gridLine: "rgba(56, 189, 248, 0.18)",
    streetGlow: "rgba(56, 189, 248, 0.12)",
    roofFace: "#1E293B",
    leftFace: "#0F172A",
    rightFace: "#080D1A",
    edgeStroke: "rgba(148, 163, 184, 0.25)",
    neonAccent: "#38BDF8",
    windowLitA: "#38BDF8",
    windowLitB: "#E0F2FE",
    beaconColor: "#F43F5E",
    headlight: "#F8FAFC",
    taillight: "#FB7185",
  },
  cyberpunk: {
    bgTop: "#060212",
    bgBottom: "#1B0933",
    smogGlow: "rgba(236, 72, 153, 0.20)",
    gridLine: "rgba(236, 72, 153, 0.22)",
    streetGlow: "rgba(34, 211, 238, 0.14)",
    roofFace: "#271340",
    leftFace: "#170A29",
    rightFace: "#0D041A",
    edgeStroke: "rgba(244, 114, 182, 0.32)",
    neonAccent: "#22D3EE",
    windowLitA: "#22D3EE",
    windowLitB: "#F472B6",
    beaconColor: "#22D3EE",
    headlight: "#22D3EE",
    taillight: "#F43F5E",
  },
  amber: {
    bgTop: "#080502",
    bgBottom: "#1F1408",
    smogGlow: "rgba(245, 158, 11, 0.16)",
    gridLine: "rgba(245, 158, 11, 0.18)",
    streetGlow: "rgba(251, 191, 36, 0.12)",
    roofFace: "#2B2118",
    leftFace: "#1C150E",
    rightFace: "#110C08",
    edgeStroke: "rgba(251, 191, 36, 0.26)",
    neonAccent: "#F59E0B",
    windowLitA: "#FBBF24",
    windowLitB: "#FEF3C7",
    beaconColor: "#EF4444",
    headlight: "#FDE68A",
    taillight: "#EA580C",
  },
};

interface BuildingBlock {
  gx: number;
  gy: number;
  height: number;
  floors: number;
  style: "stepped" | "helipad" | "spire" | "modern";
  upperTierHeight: number;
  hasBeacon: boolean;
  hasNeonTrim: boolean;
  beaconPhase: number;
  windowsLeft: boolean[][];
  windowsRight: boolean[][];
}

interface TrafficStreak {
  axis: "x" | "y";
  laneIndex: number;
  pos: number;
  speed: number;
  dir: 1 | -1;
  length: number;
}

export function IsometricCity({
  gridSize: propGridSize = 7,
  buildingDensity: propDensity = 0.78,
  trafficSpeed: propTrafficSpeed = 1.0,
  colorPalette: propPalette = "midnight",
  windowFlicker: propFlicker = true,
  children,
  className,
}: IsometricCityProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [palette, setPalette] = useState<"cyberpunk" | "midnight" | "amber">(
    propPalette
  );
  const [trafficSpeed, setTrafficSpeed] = useState(propTrafficSpeed);
  const [windowFlicker, setWindowFlicker] = useState(propFlicker);
  const [seed, setSeed] = useState(1);
  const [buildingCount, setBuildingCount] = useState(0);

  useEffect(() => {
    setPalette(propPalette);
  }, [propPalette]);

  useEffect(() => {
    setTrafficSpeed(propTrafficSpeed);
  }, [propTrafficSpeed]);

  useEffect(() => {
    setWindowFlicker(propFlicker);
  }, [propFlicker]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let width = 0;
    let height = 0;

    const N = Math.max(4, Math.min(10, propGridSize));

    // Generate procedural city blocks sorted back-to-front by (gx + gy)
    const buildings: BuildingBlock[] = [];
    for (let gx = 0; gx < N; gx++) {
      for (let gy = 0; gy < N; gy++) {
        if (Math.random() > propDensity) continue;

        const distFromCenter =
          Math.hypot(gx - (N - 1) / 2, gy - (N - 1) / 2) / (N * 0.7);
        const centerBoost = Math.max(0.28, 1 - distFromCenter * 0.72);
        const floors = Math.max(
          3,
          Math.floor((4 + Math.random() * 14) * centerBoost)
        );
        const bHeight = floors * 10;

        const cols = 4;
        const windowsLeft: boolean[][] = [];
        const windowsRight: boolean[][] = [];
        for (let f = 0; f < floors; f++) {
          windowsLeft.push(
            Array.from({ length: cols }, () => Math.random() < 0.64)
          );
          windowsRight.push(
            Array.from({ length: cols }, () => Math.random() < 0.58)
          );
        }

        const roll = Math.random();
        const style: BuildingBlock["style"] =
          floors >= 11 && roll < 0.38
            ? "stepped"
            : floors >= 10 && roll < 0.68
            ? "spire"
            : floors >= 8 && roll < 0.88
            ? "helipad"
            : "modern";

        buildings.push({
          gx,
          gy,
          height: bHeight,
          floors,
          style,
          upperTierHeight:
            style === "stepped" ? Math.floor(2 + Math.random() * 3) * 10 : 0,
          hasBeacon: floors >= 8,
          hasNeonTrim: floors >= 9 && Math.random() < 0.55,
          beaconPhase: Math.random() * Math.PI * 2,
          windowsLeft,
          windowsRight,
        });
      }
    }

    buildings.sort((a, b) => a.gx + a.gy - (b.gx + b.gy));
    setBuildingCount(buildings.length);

    // Avenue vehicle light-streaks
    const streaks: TrafficStreak[] = Array.from({ length: N * 4 }, (_, i) => ({
      axis: i % 2 === 0 ? "x" : "y",
      laneIndex: Math.floor(Math.random() * (N + 1)),
      pos: Math.random() * N,
      speed: 0.012 + Math.random() * 0.018,
      dir: Math.random() > 0.5 ? 1 : -1,
      length: 0.38 + Math.random() * 0.45,
    }));

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);

    let time = 0;

    const render = () => {
      time += 0.03;
      const theme = PALETTES[palette];

      // 1. Nocturnal Sky & Atmospheric Smog Horizon Glow
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, theme.bgTop);
      bgGrad.addColorStop(1, theme.bgBottom);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const smog = ctx.createRadialGradient(
        width * 0.5,
        height * 0.54,
        20,
        width * 0.5,
        height * 0.54,
        Math.max(width, height) * 0.55
      );
      smog.addColorStop(0, theme.smogGlow);
      smog.addColorStop(1, "transparent");
      ctx.fillStyle = smog;
      ctx.fillRect(0, 0, width, height);

      // Isometric projection with subtle mouse-driven camera parallax
      const tileW = Math.min(width / (N * 1.32), 70);
      const tileH = tileW * 0.52;
      const originX = width / 2 + pointerRef.current.x * 16;
      const originY = height * 0.35 + pointerRef.current.y * 10;

      const isoProject = (gx: number, gy: number, z = 0) => ({
        x: originX + (gx - gy) * (tileW * 0.5),
        y: originY + (gx + gy) * (tileH * 0.5) - z,
      });

      const drawIsoPrism = (
        x0: number,
        y0: number,
        x1: number,
        y1: number,
        zBase: number,
        zTop: number,
        highlightNeon = false
      ) => {
        const tBack = isoProject(x0, y0, zTop);
        const tRight = isoProject(x1, y0, zTop);
        const tFront = isoProject(x1, y1, zTop);
        const tLeft = isoProject(x0, y1, zTop);

        const bRight = isoProject(x1, y0, zBase);
        const bFront = isoProject(x1, y1, zBase);
        const bLeft = isoProject(x0, y1, zBase);

        // Left Face
        ctx.beginPath();
        ctx.moveTo(tLeft.x, tLeft.y);
        ctx.lineTo(tFront.x, tFront.y);
        ctx.lineTo(bFront.x, bFront.y);
        ctx.lineTo(bLeft.x, bLeft.y);
        ctx.closePath();
        ctx.fillStyle = theme.leftFace;
        ctx.fill();
        ctx.strokeStyle = theme.edgeStroke;
        ctx.lineWidth = 0.85;
        ctx.stroke();

        // Right Face
        ctx.beginPath();
        ctx.moveTo(tFront.x, tFront.y);
        ctx.lineTo(tRight.x, tRight.y);
        ctx.lineTo(bRight.x, bRight.y);
        ctx.lineTo(bFront.x, bFront.y);
        ctx.closePath();
        ctx.fillStyle = theme.rightFace;
        ctx.fill();
        ctx.stroke();

        // Roof Face
        ctx.beginPath();
        ctx.moveTo(tBack.x, tBack.y);
        ctx.lineTo(tRight.x, tRight.y);
        ctx.lineTo(tFront.x, tFront.y);
        ctx.lineTo(tLeft.x, tLeft.y);
        ctx.closePath();
        ctx.fillStyle = theme.roofFace;
        ctx.fill();
        ctx.stroke();

        // Neon architectural roof cornice trim
        if (highlightNeon) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(tLeft.x, tLeft.y);
          ctx.lineTo(tFront.x, tFront.y);
          ctx.lineTo(tRight.x, tRight.y);
          ctx.strokeStyle = theme.neonAccent;
          ctx.shadowColor = theme.neonAccent;
          ctx.shadowBlur = 8;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        }
      };

      // 2. Ground Avenue Grid & Wet-Street Intersection Glow Pools
      ctx.strokeStyle = theme.gridLine;
      ctx.lineWidth = 1.1;
      for (let i = 0; i <= N; i++) {
        const startX = isoProject(i, 0, 0);
        const endX = isoProject(i, N, 0);
        ctx.beginPath();
        ctx.moveTo(startX.x, startX.y);
        ctx.lineTo(endX.x, endX.y);
        ctx.stroke();

        const startY = isoProject(0, i, 0);
        const endY = isoProject(N, i, 0);
        ctx.beginPath();
        ctx.moveTo(startY.x, startY.y);
        ctx.lineTo(endY.x, endY.y);
        ctx.stroke();
      }

      // Intersection streetlamp reflection pools
      for (let gx = 0; gx <= N; gx++) {
        for (let gy = 0; gy <= N; gy++) {
          const pt = isoProject(gx, gy, 0);
          const pool = ctx.createRadialGradient(pt.x, pt.y, 1, pt.x, pt.y, 12);
          pool.addColorStop(0, theme.streetGlow);
          pool.addColorStop(1, "transparent");
          ctx.fillStyle = pool;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 12, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Bidirectional Avenue Vehicle Light Streaks (Headlights + Taillights)
      for (let i = 0; i < streaks.length; i++) {
        const st = streaks[i];
        st.pos += st.speed * trafficSpeed * st.dir;
        if (st.pos > N) st.pos = 0;
        if (st.pos < 0) st.pos = N;

        const tailPos = Math.max(0, Math.min(N, st.pos - st.length * st.dir));
        const laneOffset = st.dir === 1 ? 0.04 : -0.04;
        const pHead =
          st.axis === "x"
            ? isoProject(st.pos, st.laneIndex + laneOffset, 1)
            : isoProject(st.laneIndex + laneOffset, st.pos, 1);
        const pTail =
          st.axis === "x"
            ? isoProject(tailPos, st.laneIndex + laneOffset, 1)
            : isoProject(st.laneIndex + laneOffset, tailPos, 1);

        const grad = ctx.createLinearGradient(
          pTail.x,
          pTail.y,
          pHead.x,
          pHead.y
        );
        const streakColor = st.dir === 1 ? theme.headlight : theme.taillight;
        grad.addColorStop(0, "transparent");
        grad.addColorStop(1, streakColor);

        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.4;
        ctx.shadowColor = streakColor;
        ctx.shadowBlur = 9;
        ctx.beginPath();
        ctx.moveTo(pTail.x, pTail.y);
        ctx.lineTo(pHead.x, pHead.y);
        ctx.stroke();
        ctx.restore();
      }

      // 4. Depth-Sorted 3D Isometric Skyscrapers with Architectural Setbacks & Details
      const pad = 0.14;
      const bw = 1 - pad * 2;

      for (let i = 0; i < buildings.length; i++) {
        const b = buildings[i];

        if (windowFlicker && Math.random() < 0.016) {
          const f = Math.floor(Math.random() * b.floors);
          const c = Math.floor(Math.random() * 4);
          if (Math.random() < 0.5) {
            b.windowsLeft[f][c] = !b.windowsLeft[f][c];
          } else {
            b.windowsRight[f][c] = !b.windowsRight[f][c];
          }
        }

        const x0 = b.gx + pad;
        const y0 = b.gy + pad;
        const x1 = x0 + bw;
        const y1 = y0 + bw;
        const h = b.height;

        // Main tower shaft
        drawIsoPrism(x0, y0, x1, y1, 0, h, b.hasNeonTrim);

        // Draw perspective-projected office windows on main shaft
        for (let f = 0; f < b.floors; f++) {
          const zTop = (f + 0.72) * 10;
          const zBot = (f + 0.24) * 10;

          for (let col = 0; col < 4; col++) {
            const u0 = (col + 0.22) / 4.4;
            const u1 = (col + 0.76) / 4.4;

            if (b.windowsLeft[f][col]) {
              const wl0 = isoProject(x0 + bw * u0, y1, zTop);
              const wl1 = isoProject(x0 + bw * u1, y1, zTop);
              const wl2 = isoProject(x0 + bw * u1, y1, zBot);
              const wl3 = isoProject(x0 + bw * u0, y1, zBot);

              ctx.fillStyle =
                (f + col) % 3 === 0 ? theme.windowLitB : theme.windowLitA;
              ctx.globalAlpha = 0.82;
              ctx.beginPath();
              ctx.moveTo(wl0.x, wl0.y);
              ctx.lineTo(wl1.x, wl1.y);
              ctx.lineTo(wl2.x, wl2.y);
              ctx.lineTo(wl3.x, wl3.y);
              ctx.closePath();
              ctx.fill();
              ctx.globalAlpha = 1;
            }

            if (b.windowsRight[f][col]) {
              const wr0 = isoProject(x1, y0 + bw * u0, zTop);
              const wr1 = isoProject(x1, y0 + bw * u1, zTop);
              const wr2 = isoProject(x1, y0 + bw * u1, zBot);
              const wr3 = isoProject(x1, y0 + bw * u0, zBot);

              ctx.fillStyle =
                (f + col) % 2 === 0 ? theme.windowLitA : theme.windowLitB;
              ctx.globalAlpha = 0.58;
              ctx.beginPath();
              ctx.moveTo(wr0.x, wr0.y);
              ctx.lineTo(wr1.x, wr1.y);
              ctx.lineTo(wr2.x, wr2.y);
              ctx.lineTo(wr3.x, wr3.y);
              ctx.closePath();
              ctx.fill();
              ctx.globalAlpha = 1;
            }
          }
        }

        // Architectural Upper Setback Tier (Stepped Skyscraper)
        let topZ = h;
        if (b.style === "stepped" && b.upperTierHeight > 0) {
          const inset = bw * 0.22;
          topZ = h + b.upperTierHeight;
          drawIsoPrism(
            x0 + inset,
            y0 + inset,
            x1 - inset,
            y1 - inset,
            h,
            topZ,
            true
          );
        }

        // Glowing Rooftop Helipad Ring
        if (b.style === "helipad") {
          const roofCenter = isoProject(x0 + bw * 0.5, y0 + bw * 0.5, topZ + 0.5);
          ctx.save();
          ctx.translate(roofCenter.x, roofCenter.y);
          ctx.scale(1, 0.52);
          ctx.beginPath();
          ctx.arc(0, 0, tileW * 0.16, 0, Math.PI * 2);
          ctx.strokeStyle = theme.neonAccent;
          ctx.lineWidth = 1.3;
          ctx.stroke();
          ctx.restore();
        }

        // Rooftop Spire & Blinking Aviation Warning Beacon
        if (b.hasBeacon) {
          const roofCenter = isoProject(x0 + bw * 0.5, y0 + bw * 0.5, topZ);
          const hasTallSpire = b.style === "spire" || b.style === "stepped";
          const spireTop = isoProject(
            x0 + bw * 0.5,
            y0 + bw * 0.5,
            topZ + (hasTallSpire ? 22 : 5)
          );

          if (hasTallSpire) {
            ctx.beginPath();
            ctx.moveTo(roofCenter.x, roofCenter.y);
            ctx.lineTo(spireTop.x, spireTop.y);
            ctx.strokeStyle = "rgba(226, 232, 240, 0.65)";
            ctx.lineWidth = 1.3;
            ctx.stroke();
          }

          const pulse =
            0.35 +
            0.65 *
              Math.pow(Math.sin(time * 2.4 + b.beaconPhase) * 0.5 + 0.5, 2);
          ctx.save();
          ctx.beginPath();
          ctx.arc(spireTop.x, spireTop.y, 2.4, 0, Math.PI * 2);
          ctx.fillStyle = theme.beaconColor;
          ctx.globalAlpha = pulse;
          ctx.shadowColor = theme.beaconColor;
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [propGridSize, propDensity, palette, trafficSpeed, windowFlicker, seed]);

  return (
    <div
      ref={containerRef}
      data-fullscreen-scroll
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        pointerRef.current = {
          x: (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5,
          y: (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5,
        };
      }}
      onMouseLeave={() => {
        pointerRef.current = { x: 0, y: 0 };
      }}
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-sky-500/20 bg-[#020617] text-slate-100 shadow-2xl",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {children ? (
        <div className="relative z-10 h-full w-full">{children}</div>
      ) : (
        <div className="relative z-10 flex min-h-[520px] flex-col justify-between p-6 sm:p-8">
          {/* Top Architectural Telemetry Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-slate-950/75 px-3.5 py-1.5 backdrop-blur-md">
              <Building2 className="h-3.5 w-3.5 text-sky-400" />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-300">
                ISOMETRIC METROPOLIS // {palette.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/75 px-3.5 py-1.5 font-mono text-[11px] text-slate-300 backdrop-blur-md">
              <span>{buildingCount} TOWERS</span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1 text-sky-400">
                <Car className="h-3 w-3" />
                TRAFFIC {trafficSpeed.toFixed(1)}x
              </span>
            </div>
          </div>

          {/* Bottom Interactive HUD Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-950/80 p-3.5 backdrop-blur-md">
            {/* Palette Selector */}
            <div className="flex items-center gap-1.5">
              {(["midnight", "cyberpunk", "amber"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPalette(mode)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 font-mono text-xs uppercase transition",
                    palette === mode
                      ? "bg-sky-500/25 text-sky-300 ring-1 ring-sky-400/50"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Interactive Toggles */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setWindowFlicker((w) => !w)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1 font-mono text-xs transition",
                  windowFlicker
                    ? "bg-white/10 text-white"
                    : "bg-transparent text-slate-400"
                )}
              >
                <Sparkles className="h-3 w-3 text-sky-400" />
                Windows {windowFlicker ? "LIVE" : "STATIC"}
              </button>

              <button
                type="button"
                onClick={() =>
                  setTrafficSpeed((s) =>
                    s >= 2.0 ? 0.5 : Number((s + 0.5).toFixed(1))
                  )
                }
                className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-slate-200 transition hover:bg-white/10"
              >
                Traffic {trafficSpeed.toFixed(1)}x
              </button>

              <button
                type="button"
                onClick={() => setSeed((s) => s + 1)}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-slate-200 transition hover:bg-white/10"
              >
                <RefreshCw className="h-3 w-3 text-sky-400" />
                Regenerate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default IsometricCity;
