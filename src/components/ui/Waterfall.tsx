"use client";

import React, { useEffect, useRef, useState } from "react";
import { Droplets, Sparkles, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WaterfallProps {
  /** Water velocity multiplier (0.3 to 2.5). Default: 1.0 */
  flow?: number;
  /** Plunge pool volumetric mist intensity (0 to 1). Default: 0.75 */
  mistAmount?: number;
  /** Primary water tint hex color. Default: "#38BDF8" */
  color?: string;
  /** Width of the waterfall curtain relative to container (0.3 to 1.0). Default: 0.75 */
  curtainWidth?: number;
  /** Upward-bouncing splash droplet density/energy. Default: 1.0 */
  splashIntensity?: number;
  /** Optional foreground content */
  children?: React.ReactNode;
  className?: string;
}

interface WaterRibbon {
  xNorm: number; // -0.5 to 0.5 within curtain
  y: number;
  width: number;
  baseSpeed: number;
  opacity: number;
  layer: 0 | 1 | 2; // 0 = deep subsurface sheet, 1 = turbulent mid-ribbon, 2 = aerated whitewater jet
  phase: number;
  freq: number;
  chuteIndex: number;
}

interface SplashDrop {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  life: number;
  maxLife: number;
}

interface MistBank {
  xNorm: number;
  yOffset: number;
  radius: number;
  phase: number;
  speed: number;
  risePhase: number;
}

interface PoolRipple {
  xNorm: number;
  yOffset: number;
  rx: number;
  ry: number;
  maxRx: number;
  alpha: number;
  speed: number;
}

interface CliffLedge {
  side: "left" | "right" | "center";
  yNorm: number;
  xNorm: number;
  wNorm: number;
  hNorm: number;
  shade: number;
  points: Array<{ dx: number; dy: number }>;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    return [
      parseInt(clean[0] + clean[0], 16) || 56,
      parseInt(clean[1] + clean[1], 16) || 189,
      parseInt(clean[2] + clean[2], 16) || 248,
    ];
  }
  const num = parseInt(clean, 16);
  if (Number.isNaN(num)) return [56, 189, 248];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

const PRESETS = [
  { name: "Skógafoss", color: "#38BDF8", flow: 1.0, mist: 0.78, curtain: 0.72 },
  { name: "Emerald Gorge", color: "#2DD4BF", flow: 1.35, mist: 0.9, curtain: 0.85 },
  { name: "Glacial Melt", color: "#60A5FA", flow: 0.85, mist: 0.65, curtain: 0.58 },
];

export function Waterfall({
  flow = 1.0,
  mistAmount = 0.75,
  color = "#38BDF8",
  curtainWidth = 0.75,
  splashIntensity = 1.0,
  children,
  className,
}: WaterfallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [liveFlow, setLiveFlow] = useState(flow);
  const [liveMist, setLiveMist] = useState(mistAmount);
  const [liveColor, setLiveColor] = useState(color);
  const [liveCurtain, setLiveCurtain] = useState(curtainWidth);

  useEffect(() => setLiveFlow(flow), [flow]);
  useEffect(() => setLiveMist(mistAmount), [mistAmount]);
  useEffect(() => setLiveColor(color), [color]);
  useEffect(() => setLiveCurtain(curtainWidth), [curtainWidth]);

  const paramsRef = useRef({
    flow: liveFlow,
    mist: liveMist,
    color: liveColor,
    curtain: liveCurtain,
    splash: splashIntensity,
  });

  useEffect(() => {
    paramsRef.current = {
      flow: liveFlow,
      mist: liveMist,
      color: liveColor,
      curtain: liveCurtain,
      splash: splashIntensity,
    };
  }, [liveFlow, liveMist, liveColor, liveCurtain, splashIntensity]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;

    const RIBBON_COUNT = 290;
    const ribbons: WaterRibbon[] = [];
    const drops: SplashDrop[] = [];
    const mistBanks: MistBank[] = [];
    const poolRipples: PoolRipple[] = [];
    const cliffLedges: CliffLedge[] = [];

    // 7 natural rock chutes across the crest lip so water groups into organic streams
    const chuteCenters = [-0.43, -0.29, -0.14, 0.0, 0.15, 0.3, 0.44];

    const initScene = () => {
      ribbons.length = 0;
      for (let i = 0; i < RIBBON_COUNT; i++) {
        const layerRand = Math.random();
        const layer: 0 | 1 | 2 = layerRand < 0.32 ? 0 : layerRand < 0.76 ? 1 : 2;
        const chuteIdx = Math.floor(Math.random() * chuteCenters.length);
        const chuteSpread = layer === 0 ? 0.14 : layer === 1 ? 0.095 : 0.065;
        const xNorm = Math.max(
          -0.49,
          Math.min(
            0.49,
            chuteCenters[chuteIdx] + (Math.random() - 0.5) * 2 * chuteSpread
          )
        );

        ribbons.push({
          xNorm,
          y: Math.random(), // normalized 0 (crest) to 1 (plunge)
          width:
            layer === 0
              ? 14 + Math.random() * 20
              : layer === 1
                ? 4.5 + Math.random() * 8
                : 1.5 + Math.random() * 3.2,
          baseSpeed:
            layer === 0
              ? 0.0055 + Math.random() * 0.003
              : layer === 1
                ? 0.008 + Math.random() * 0.0045
                : 0.011 + Math.random() * 0.006,
          opacity:
            layer === 0
              ? 0.16 + Math.random() * 0.14
              : layer === 1
                ? 0.28 + Math.random() * 0.26
                : 0.55 + Math.random() * 0.4,
          layer,
          phase: Math.random() * Math.PI * 2,
          freq: 2.5 + Math.random() * 4.5,
          chuteIndex: chuteIdx,
        });
      }

      mistBanks.length = 0;
      for (let i = 0; i < 24; i++) {
        mistBanks.push({
          xNorm: (Math.random() - 0.5) * 1.25,
          yOffset: (Math.random() - 0.5) * 44,
          radius: 65 + Math.random() * 110,
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 0.85,
          risePhase: Math.random() * Math.PI * 2,
        });
      }

      poolRipples.length = 0;
      for (let i = 0; i < 18; i++) {
        const maxRx = 55 + Math.random() * 140;
        poolRipples.push({
          xNorm: (Math.random() - 0.5) * 0.95,
          yOffset: 6 + Math.random() * 68,
          rx: Math.random() * maxRx,
          ry: 3 + Math.random() * 8,
          maxRx,
          alpha: 0.22 + Math.random() * 0.3,
          speed: 0.65 + Math.random() * 0.85,
        });
      }

      // Generate craggy wet basalt rock strata flanking & behind the cascade
      cliffLedges.length = 0;
      for (let row = 0; row < 11; row++) {
        const yNorm = 0.06 + (row / 10) * 0.72;
        for (const side of ["left", "right", "center"] as const) {
          const polyPts: Array<{ dx: number; dy: number }> = [];
          const segs = 7;
          for (let s = 0; s <= segs; s++) {
            const t = s / segs;
            polyPts.push({
              dx: t,
              dy: (Math.sin(row * 3.1 + s * 1.9) * 0.5 + (Math.random() - 0.5) * 0.5) * 0.04,
            });
          }
          cliffLedges.push({
            side,
            yNorm,
            xNorm:
              side === "left"
                ? 0
                : side === "right"
                  ? 0.68 + (row % 3) * 0.03
                  : 0.22 + (row % 2) * 0.08,
            wNorm:
              side === "center"
                ? 0.52
                : 0.28 + Math.sin(row * 1.7) * 0.06,
            hNorm: 0.09 + (row % 3) * 0.025,
            shade: 0.65 + (row % 4) * 0.12,
            points: polyPts,
          });
        }
      }
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (ribbons.length === 0) initScene();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let time = 0;

    const render = () => {
      const {
        flow: curFlow,
        mist: curMist,
        color: curColor,
        curtain: curCurtain,
        splash: curSplash,
      } = paramsRef.current;

      time += 0.016 * curFlow;
      const [r, g, b] = hexToRgb(curColor);
      const clampCurtain = Math.max(0.3, Math.min(1.0, curCurtain));
      const cWidth = width * clampCurtain;
      const centerX = width * 0.5;
      const crestY = height * 0.09;
      const plungeY = height * 0.79;
      const fallHeight = plungeY - crestY;

      // 1. Atmospheric misty gorge sky & deep canyon backdrop
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, "#050D1A");
      skyGrad.addColorStop(0.12, "#09192E");
      skyGrad.addColorStop(0.75, "#040B17");
      skyGrad.addColorStop(1, "#02060D");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Top atmospheric zenith glow catching the crest of the waterfall
      const crestSunGlow = ctx.createRadialGradient(
        centerX,
        crestY,
        10,
        centerX,
        crestY + fallHeight * 0.25,
        cWidth * 0.75
      );
      crestSunGlow.addColorStop(0, `rgba(${Math.min(255, r + 80)}, ${Math.min(255, g + 65)}, 255, 0.26)`);
      crestSunGlow.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, 0.1)`);
      crestSunGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = crestSunGlow;
      ctx.fillRect(0, 0, width, height);

      // 2. Shadowed wet basalt cliff rock strata flanking & behind the waterfall
      for (let i = 0; i < cliffLedges.length; i++) {
        const ledge = cliffLedges[i];
        const ly = ledge.yNorm * height;
        const lh = ledge.hNorm * height;
        let lx = ledge.xNorm * width;
        let lw = ledge.wNorm * width;

        if (ledge.side === "left") {
          lw = Math.max(width * 0.16, centerX - cWidth * 0.46 + Math.sin(i * 2.1) * 22);
          lx = 0;
        } else if (ledge.side === "right") {
          const rightStart = Math.min(
            width * 0.84,
            centerX + cWidth * 0.46 - Math.cos(i * 1.9) * 22
          );
          lx = rightStart;
          lw = width - rightStart;
        }

        ctx.beginPath();
        ctx.moveTo(lx, ly + lh);
        for (let p = 0; p < ledge.points.length; p++) {
          const pt = ledge.points[p];
          ctx.lineTo(lx + pt.dx * lw, ly + pt.dy * height);
        }
        ctx.lineTo(lx + lw, ly + lh);
        ctx.closePath();

        const rockGrad = ctx.createLinearGradient(0, ly, 0, ly + lh);
        const br = Math.round(12 * ledge.shade);
        const bg = Math.round(22 * ledge.shade);
        const bb = Math.round(36 * ledge.shade);
        rockGrad.addColorStop(0, `rgb(${br + 10}, ${bg + 16}, ${bb + 24})`);
        rockGrad.addColorStop(0.25, `rgb(${br}, ${bg}, ${bb})`);
        rockGrad.addColorStop(1, "#030710");
        ctx.fillStyle = rockGrad;
        ctx.fill();

        // Wet basalt specular sheen on top rock ridge catching mist light
        if (ledge.side !== "center") {
          ctx.beginPath();
          for (let p = 0; p < ledge.points.length; p++) {
            const pt = ledge.points[p];
            if (p === 0) ctx.moveTo(lx + pt.dx * lw, ly + pt.dy * height);
            else ctx.lineTo(lx + pt.dx * lw, ly + pt.dy * height);
          }
          ctx.strokeStyle = `rgba(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, 255, 0.14)`;
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }
      }

      // Upper river feeding into the waterfall lip
      const riverGrad = ctx.createLinearGradient(0, 0, 0, crestY + 12);
      riverGrad.addColorStop(0, "#041022");
      riverGrad.addColorStop(0.7, `rgba(${Math.floor(r * 0.45)}, ${Math.floor(g * 0.6)}, ${Math.floor(b * 0.75)}, 0.65)`);
      riverGrad.addColorStop(1, `rgba(225, 248, 255, 0.85)`);
      ctx.fillStyle = riverGrad;
      ctx.fillRect(centerX - cWidth * 0.5, 0, cWidth, crestY + 4);

      // 3. Multi-layered turbulent water ribbons accelerating under gravity v = sqrt(2 * g * y)
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < ribbons.length; i++) {
        const rb = ribbons[i];
        // Physical gravitational acceleration: velocity increases with square root of fall distance
        const gravityFactor = Math.sqrt(0.18 + Math.max(0, rb.y) * 1.95);
        rb.y += rb.baseSpeed * curFlow * gravityFactor;

        // Multi-frequency FBM/sine horizontal turbulence as water breaks into chutes
        const yPos = crestY + rb.y * fallHeight;
        const turb =
          Math.sin(rb.y * rb.freq + time * 3.2 + rb.phase) *
            (rb.layer === 0 ? 5.5 : 2.8) +
          Math.cos(rb.y * (rb.freq * 2.1) - time * 4.8 + rb.chuteIndex) * 1.6;

        // Slight inward vena-contracta narrowing mid-fall, then fanning out at plunge base
        const fanFactor = 1.0 - Math.sin(rb.y * Math.PI) * 0.04 + rb.y * 0.07;
        const xPos = centerX + rb.xNorm * cWidth * fanFactor + turb;

        // Ribbon length stretches proportionally to gravitational speed (motion blur streak)
        const streakLen =
          (rb.layer === 0 ? 75 : rb.layer === 1 ? 58 : 42) *
          (0.65 + gravityFactor * 0.75);

        const yTop = Math.max(crestY - 4, yPos - streakLen);
        const yBot = Math.min(plungeY + 10, yPos);

        // Edge feathering & aerated whitewater transition near the crest
        const edgeDist = 1 - Math.min(1, Math.abs(rb.xNorm) * 1.9);
        const crestAerated = Math.max(0, 1 - rb.y * 2.6); // extra foamy bright near top lip
        const alpha = rb.opacity * (0.35 + 0.65 * edgeDist);

        if (yBot > yTop) {
          const grad = ctx.createLinearGradient(xPos, yTop, xPos, yBot);
          if (rb.layer === 2 || crestAerated > 0.45) {
            grad.addColorStop(0, "rgba(255, 255, 255, 0)");
            grad.addColorStop(0.35, `rgba(220, 248, 255, ${alpha * 0.75})`);
            grad.addColorStop(0.82, `rgba(255, 255, 255, ${Math.min(0.95, alpha * 1.15)})`);
            grad.addColorStop(1, "rgba(255, 255, 255, 0)");
          } else {
            grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
            grad.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, ${alpha * 0.65})`);
            grad.addColorStop(
              0.8,
              `rgba(${Math.min(255, r + 75)}, ${Math.min(255, g + 60)}, 255, ${alpha})`
            );
            grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
          }

          ctx.fillStyle = grad;
          // Slightly thinner width as water stretches at high velocity
          const dynamicWidth = rb.width * (1.12 - rb.y * 0.28);
          ctx.fillRect(
            xPos - dynamicWidth * 0.5,
            yTop,
            dynamicWidth,
            yBot - yTop
          );
        }

        // Reset at plunge pool & trigger kinetic splash droplets
        if (rb.y >= 1.06) {
          rb.y = -Math.random() * 0.08;
          const chuteSpread = rb.layer === 0 ? 0.14 : rb.layer === 1 ? 0.095 : 0.065;
          rb.xNorm = Math.max(
            -0.49,
            Math.min(
              0.49,
              chuteCenters[rb.chuteIndex] + (Math.random() - 0.5) * 2 * chuteSpread
            )
          );

          if (
            drops.length < 160 &&
            Math.random() < 0.36 * curSplash * Math.min(1.9, curFlow)
          ) {
            const impactX = centerX + rb.xNorm * cWidth;
            const maxLife = 26 + Math.random() * 32;
            drops.push({
              x: impactX + (Math.random() - 0.5) * 18,
              y: plungeY + (Math.random() - 0.5) * 8,
              vx: (Math.random() - 0.5) * 4.2,
              vy: -(2.6 + Math.random() * 5.2) * Math.sqrt(curFlow),
              radius: 1.0 + Math.random() * 2.2,
              alpha: 0.5 + Math.random() * 0.45,
              life: 0,
              maxLife,
            });
          }
        }
      }

      // 4. Aerated rolling crest foam lip at the top ledge
      for (let c = 0; c < chuteCenters.length; c++) {
        const cx = centerX + chuteCenters[c] * cWidth;
        const lipRadius = (cWidth / chuteCenters.length) * 0.78;
        const lipGrad = ctx.createRadialGradient(
          cx,
          crestY + 4,
          2,
          cx,
          crestY + 12,
          lipRadius
        );
        lipGrad.addColorStop(0, "rgba(255, 255, 255, 0.52)");
        lipGrad.addColorStop(0.5, `rgba(${Math.min(255, r + 80)}, ${Math.min(255, g + 70)}, 255, 0.24)`);
        lipGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = lipGrad;
        ctx.beginPath();
        ctx.ellipse(cx, crestY + 6, lipRadius, 14, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 5. Dark abyssal plunge pool basin with subsurface emerald/cyan scattering
      const poolGrad = ctx.createLinearGradient(0, plungeY - 6, 0, height);
      poolGrad.addColorStop(0, `rgba(${Math.min(255, r + 40)}, ${Math.min(255, g + 50)}, 255, 0.42)`);
      poolGrad.addColorStop(0.22, `rgba(${Math.floor(r * 0.45)}, ${Math.floor(g * 0.55)}, ${Math.floor(b * 0.7)}, 0.72)`);
      poolGrad.addColorStop(0.65, `rgba(${Math.floor(r * 0.18)}, ${Math.floor(g * 0.26)}, ${Math.floor(b * 0.38)}, 0.92)`);
      poolGrad.addColorStop(1, "#02060E");
      ctx.fillStyle = poolGrad;
      ctx.fillRect(0, plungeY, width, height - plungeY);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      // Boiling whitewater foam rollers at the plunge pool impact zone
      const boilCount = 11;
      for (let bIdx = 0; bIdx < boilCount; bIdx++) {
        const bx =
          centerX +
          ((bIdx / (boilCount - 1)) - 0.5) * cWidth * 0.95 +
          Math.sin(time * 3.8 + bIdx * 1.7) * 10;
        const by = plungeY + 4 + Math.cos(time * 4.2 + bIdx * 2.3) * 4;
        const brx = (cWidth / boilCount) * (0.85 + 0.25 * Math.sin(time * 5 + bIdx));
        const bry = 8 + 4 * Math.cos(time * 4.5 + bIdx);

        const boilGrad = ctx.createRadialGradient(bx, by, 2, bx, by, brx);
        boilGrad.addColorStop(0, "rgba(255, 255, 255, 0.58)");
        boilGrad.addColorStop(0.55, `rgba(${Math.min(255, r + 75)}, ${Math.min(255, g + 65)}, 255, 0.25)`);
        boilGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = boilGrad;
        ctx.beginPath();
        ctx.ellipse(bx, by, brx, bry, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Expanding elliptical water surface ripples propagating outward across the plunge pool
      for (let i = 0; i < poolRipples.length; i++) {
        const pr = poolRipples[i];
        pr.rx += pr.speed * (0.7 + curFlow * 0.45);
        if (pr.rx > pr.maxRx) {
          pr.rx = 6;
          pr.xNorm = (Math.random() - 0.5) * 0.95;
          pr.yOffset = 6 + Math.random() * (height - plungeY - 18);
        }
        const progress = pr.rx / pr.maxRx;
        const fade = (1 - progress) * Math.sin(progress * Math.PI);
        const rx = centerX + pr.xNorm * cWidth * 0.9;
        const ry = plungeY + pr.yOffset + progress * 18;

        ctx.beginPath();
        ctx.ellipse(
          rx,
          ry,
          pr.rx,
          Math.max(2, pr.rx * 0.14),
          0,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = `rgba(220, 248, 255, ${pr.alpha * fade})`;
        ctx.lineWidth = 1.3 * (1 - progress * 0.5);
        ctx.stroke();
      }

      // 6. Ballistic splash droplets & fine spray with gravity
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.x += d.vx;
        d.y += d.vy;
        d.vy += 0.18; // gravity
        d.life += 1;

        const lifeRatio = 1 - d.life / d.maxLife;
        if (lifeRatio <= 0 || d.y > height) {
          drops.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(235, 251, 255, ${d.alpha * lifeRatio})`;
        ctx.fill();
      }

      // 7. Rising volumetric mist banks catching top ambient light
      if (curMist > 0.01) {
        for (let i = 0; i < mistBanks.length; i++) {
          const m = mistBanks[i];
          const rise = ((time * 0.22 * m.speed + m.risePhase) % 1);
          const fade = Math.sin(rise * Math.PI);
          const mx =
            centerX +
            m.xNorm * cWidth * 0.62 +
            Math.sin(time * 0.65 + m.phase) * 28;
          const my = plungeY + m.yOffset - rise * 78;
          const rad = m.radius * (0.85 + rise * 0.35);

          const mistGrad = ctx.createRadialGradient(
            mx,
            my - rad * 0.18,
            4,
            mx,
            my,
            rad
          );
          const peakAlpha = 0.16 * curMist * fade;
          mistGrad.addColorStop(0, `rgba(235, 250, 255, ${peakAlpha})`);
          mistGrad.addColorStop(
            0.48,
            `rgba(${Math.min(255, r + 35)}, ${Math.min(255, g + 35)}, 255, ${peakAlpha * 0.58})`
          );
          mistGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

          ctx.fillStyle = mistGrad;
          ctx.beginPath();
          ctx.arc(mx, my, rad, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-fullscreen-scroll
      className={cn(
        "relative flex min-h-[520px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#020611] p-6 text-white shadow-2xl",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* Subtle top-to-bottom vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#020611]/55 via-transparent to-[#020611]/75"
      />

      <div className="relative z-10 flex flex-1 flex-col justify-between">
        {children ?? (
          <>
            {/* Top Telemetry Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-slate-950/60 px-3.5 py-1.5 font-mono text-xs text-sky-200 backdrop-blur-md">
                <Droplets className="h-3.5 w-3.5 text-sky-400" />
                <span>WATERFALL · HYDRO-CASCADE &amp; BASALT GORGE</span>
              </div>

              <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-950/60 p-1 backdrop-blur-md">
                {PRESETS.map((preset) => {
                  const active =
                    liveColor.toLowerCase() === preset.color.toLowerCase();
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setLiveColor(preset.color);
                        setLiveFlow(preset.flow);
                        setLiveMist(preset.mist);
                        setLiveCurtain(preset.curtain);
                      }}
                      className={cn(
                        "rounded-full px-3 py-1 font-mono text-[11px] transition-all",
                        active
                          ? "bg-sky-400/20 text-sky-200 shadow-sm ring-1 ring-sky-400/40"
                          : "text-slate-400 hover:text-white"
                      )}
                    >
                      {preset.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Center Title & Bottom HUD Controls */}
            <div className="mt-auto flex flex-col gap-5 pt-16 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-md space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Cascading Plunge Hydro-Physics
                </h2>
                <p className="text-sm leading-relaxed text-slate-300/85">
                  Turbulent aerated water chutes crest over wet basalt cliff strata, accelerating under gravity into a boiling whitewater plunge basin and rising mist banks.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-3.5 backdrop-blur-md sm:min-w-[310px]">
                <label className="flex flex-col gap-1.5">
                  <span className="flex items-center justify-between font-mono text-[10px] uppercase text-slate-400">
                    <span>Flow</span>
                    <span className="text-sky-300">{liveFlow.toFixed(1)}x</span>
                  </span>
                  <input
                    type="range"
                    min={0.4}
                    max={2.2}
                    step={0.1}
                    value={liveFlow}
                    onChange={(e) => setLiveFlow(parseFloat(e.target.value))}
                    className="h-1.5 cursor-pointer appearance-none rounded-lg bg-white/15 accent-sky-400"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="flex items-center justify-between font-mono text-[10px] uppercase text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Wind className="h-2.5 w-2.5" /> Mist
                    </span>
                    <span className="text-sky-300">{Math.round(liveMist * 100)}%</span>
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={liveMist}
                    onChange={(e) => setLiveMist(parseFloat(e.target.value))}
                    className="h-1.5 cursor-pointer appearance-none rounded-lg bg-white/15 accent-sky-400"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="flex items-center justify-between font-mono text-[10px] uppercase text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Sparkles className="h-2.5 w-2.5" /> Span
                    </span>
                    <span className="text-sky-300">{Math.round(liveCurtain * 100)}%</span>
                  </span>
                  <input
                    type="range"
                    min={0.35}
                    max={1}
                    step={0.05}
                    value={liveCurtain}
                    onChange={(e) => setLiveCurtain(parseFloat(e.target.value))}
                    className="h-1.5 cursor-pointer appearance-none rounded-lg bg-white/15 accent-sky-400"
                  />
                </label>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Waterfall;
