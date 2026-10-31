"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useId,
} from "react";
import { flushSync } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types & Available Transition Variants                              */
/* ------------------------------------------------------------------ */

export type TransitionVariant =
  // Organic Liquids, Waves & Curves (Primary)
  | "liquid-blob"
  | "ocean-wave"
  | "waterfall"
  | "tide-sweep"
  | "tide-sweep-left"
  | "concentric-ripple"
  | "liquid-droplet"
  | "goo-melt"
  | "aurora-wave"
  | "bubble-burst"
  | "fluid-curtain"
  | "whirlpool"
  | "circle"
  // Geometric & Directional (Legacy)
  | "diamond"
  | "hexagon"
  | "octagon"
  | "star"
  | "flower"
  | "triangle"
  | "square"
  | "rectangle"
  | "wipe-right"
  | "wipe-left"
  | "wipe-down"
  | "wipe-up"
  | "diagonal-slash"
  | "curtain"
  | "aperture";

export interface AnimatedThemeTogglerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Transition geometry variant. Default: "liquid-blob" */
  variant?: TransitionVariant;
  /** Transition duration in milliseconds. Default: 520 */
  duration?: number;
  /** Custom CSS easing timing function. Default: "cubic-bezier(0.22, 1, 0.36, 1)" (fluid deceleration) */
  easing?: string;
  /** When true, transition expands outward from viewport center instead of button center */
  fromCenter?: boolean;
  /** Controlled theme state ('light' | 'dark') */
  theme?: "light" | "dark";
  /** Callback fired whenever theme changes */
  onThemeChange?: (theme: "light" | "dark") => void;
  /** Custom size of toggle button */
  size?: "sm" | "md" | "lg";
  /** Whether to project a subtle ambient glow aura behind the button */
  glow?: boolean;
  /** Custom class name */
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Geometry & Fluid View-Transition Clip-Path Generators               */
/* ------------------------------------------------------------------ */

function polygonCollapsed(pointStr: string, vertexCount: number): string {
  const points = Array.from({ length: vertexCount }, () => pointStr).join(", ");
  return `polygon(${points})`;
}

/**
 * Computes responsive percentage-based clip-path keyframe tuples [startPath, midPath?, endPath].
 * Uses percentage calculations to ensure rock-solid scaling across Windows 125%/150% display zoom.
 */
export function getThemeTransitionClipPaths(
  variant: TransitionVariant,
  cx: number,
  cy: number,
  maxRadius: number,
  viewportWidth: number,
  viewportHeight: number
): string[] {
  const toX = (x: number) => `${((x / viewportWidth) * 100).toFixed(3)}%`;
  const toY = (y: number) => `${((y / viewportHeight) * 100).toFixed(3)}%`;
  const point = (x: number, y: number) => `${toX(x)} ${toY(y)}`;
  const toRadius = (r: number) =>
    `${((r / (Math.hypot(viewportWidth, viewportHeight) / Math.SQRT2)) * 100).toFixed(3)}%`;

  switch (variant) {
    /* ─────────────────────────────────────────────────────────────
     * 1. LIQUID BLOB: Organic multi-lobed fluid bubble
     * ───────────────────────────────────────────────────────────── */
    case "liquid-blob": {
      const N = 40;
      const startVerts: string[] = [];
      const midVerts: string[] = [];
      const endVerts: string[] = [];

      for (let i = 0; i < N; i++) {
        const theta = (i * 2 * Math.PI) / N;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);

        // Frame 0: Small fluid droplet collapsed at click center
        const rStart = 4;
        startVerts.push(point(cx + rStart * cosT, cy + rStart * sinT));

        // Frame 1: Fluid multi-harmonic lobes wobbling with surface tension
        const midLobe =
          1 +
          0.22 * Math.sin(3 * theta) +
          0.14 * Math.cos(5 * theta + 0.8) +
          0.08 * Math.sin(7 * theta);
        const rMid = maxRadius * 0.65 * midLobe;
        midVerts.push(point(cx + rMid * cosT, cy + rMid * sinT));

        // Frame 2: Fully engulfing all viewport corners
        const endLobe =
          1 +
          0.05 * Math.sin(3 * theta + Math.PI) +
          0.03 * Math.cos(5 * theta);
        const rEnd = maxRadius * 1.48 * endLobe;
        endVerts.push(point(cx + rEnd * cosT, cy + rEnd * sinT));
      }

      return [
        `polygon(${startVerts.join(", ")})`,
        `polygon(${midVerts.join(", ")})`,
        `polygon(${endVerts.join(", ")})`,
      ];
    }

    /* ─────────────────────────────────────────────────────────────
     * 2. OCEAN WAVE: Sinusoidal liquid wave rising from bottom to top
     * ───────────────────────────────────────────────────────────── */
    case "ocean-wave": {
      const steps = 36;
      const startVerts: string[] = [];
      const midVerts: string[] = [];
      const endVerts: string[] = [];

      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const x = u * viewportWidth;

        const yStart = viewportHeight * 1.08 + Math.sin(u * 4 * Math.PI) * 16;
        const yMid =
          viewportHeight * 0.48 +
          Math.sin(u * 4 * Math.PI) * (viewportHeight * 0.07) +
          Math.cos(u * 6 * Math.PI + 1.2) * (viewportHeight * 0.035);
        const yEnd =
          -viewportHeight * 0.12 + Math.sin(u * 4 * Math.PI + Math.PI) * 12;

        startVerts.push(point(x, yStart));
        midVerts.push(point(x, yMid));
        endVerts.push(point(x, yEnd));
      }

      // Anchors enclosing the bottom half of the screen
      const bRight = point(viewportWidth * 1.08, viewportHeight * 1.18);
      const bLeft = point(-viewportWidth * 0.08, viewportHeight * 1.18);

      startVerts.push(bRight, bLeft);
      midVerts.push(bRight, bLeft);
      endVerts.push(bRight, bLeft);

      return [
        `polygon(${startVerts.join(", ")})`,
        `polygon(${midVerts.join(", ")})`,
        `polygon(${endVerts.join(", ")})`,
      ];
    }

    /* ─────────────────────────────────────────────────────────────
     * 3. WATERFALL: Cascading fluid curtain flowing from top to bottom
     * ───────────────────────────────────────────────────────────── */
    case "waterfall": {
      const steps = 36;
      const startVerts: string[] = [];
      const midVerts: string[] = [];
      const endVerts: string[] = [];

      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const x = u * viewportWidth;

        const yStart =
          -viewportHeight * 0.08 + Math.sin(u * 4 * Math.PI) * 16;
        const yMid =
          viewportHeight * 0.52 +
          Math.sin(u * 4 * Math.PI) * (viewportHeight * 0.07) +
          Math.cos(u * 7 * Math.PI + 0.8) * (viewportHeight * 0.035);
        const yEnd =
          viewportHeight * 1.15 + Math.sin(u * 4 * Math.PI + Math.PI) * 12;

        startVerts.push(point(x, yStart));
        midVerts.push(point(x, yMid));
        endVerts.push(point(x, yEnd));
      }

      const tRight = point(viewportWidth * 1.08, -viewportHeight * 0.18);
      const tLeft = point(-viewportWidth * 0.08, -viewportHeight * 0.18);

      startVerts.push(tRight, tLeft);
      midVerts.push(tRight, tLeft);
      endVerts.push(tRight, tLeft);

      return [
        `polygon(${startVerts.join(", ")})`,
        `polygon(${midVerts.join(", ")})`,
        `polygon(${endVerts.join(", ")})`,
      ];
    }

    /* ─────────────────────────────────────────────────────────────
     * 4. TIDE SWEEP: Rolling liquid wave surging left to right
     * ───────────────────────────────────────────────────────────── */
    case "tide-sweep": {
      const steps = 36;
      const startVerts: string[] = [];
      const midVerts: string[] = [];
      const endVerts: string[] = [];

      for (let i = 0; i <= steps; i++) {
        const v = i / steps;
        const y = v * viewportHeight;

        const xStart =
          -viewportWidth * 0.08 + Math.sin(v * 4 * Math.PI) * 16;
        const xMid =
          viewportWidth * 0.50 +
          Math.sin(v * 4 * Math.PI) * (viewportWidth * 0.07) +
          Math.cos(v * 6 * Math.PI + 1.0) * (viewportWidth * 0.035);
        const xEnd =
          viewportWidth * 1.15 + Math.sin(v * 4 * Math.PI + Math.PI) * 12;

        startVerts.push(point(xStart, y));
        midVerts.push(point(xMid, y));
        endVerts.push(point(xEnd, y));
      }

      const bLeft = point(-viewportWidth * 0.18, viewportHeight * 1.08);
      const tLeft = point(-viewportWidth * 0.18, -viewportHeight * 0.08);

      startVerts.push(bLeft, tLeft);
      midVerts.push(bLeft, tLeft);
      endVerts.push(bLeft, tLeft);

      return [
        `polygon(${startVerts.join(", ")})`,
        `polygon(${midVerts.join(", ")})`,
        `polygon(${endVerts.join(", ")})`,
      ];
    }

    /* ─────────────────────────────────────────────────────────────
     * 5. TIDE SWEEP LEFT: Rolling liquid wave surging right to left
     * ───────────────────────────────────────────────────────────── */
    case "tide-sweep-left": {
      const steps = 36;
      const startVerts: string[] = [];
      const midVerts: string[] = [];
      const endVerts: string[] = [];

      for (let i = 0; i <= steps; i++) {
        const v = i / steps;
        const y = v * viewportHeight;

        const xStart =
          viewportWidth * 1.08 + Math.sin(v * 4 * Math.PI) * 16;
        const xMid =
          viewportWidth * 0.50 -
          Math.sin(v * 4 * Math.PI) * (viewportWidth * 0.07) -
          Math.cos(v * 6 * Math.PI + 1.0) * (viewportWidth * 0.035);
        const xEnd =
          -viewportWidth * 0.15 - Math.sin(v * 4 * Math.PI + Math.PI) * 12;

        startVerts.push(point(xStart, y));
        midVerts.push(point(xMid, y));
        endVerts.push(point(xEnd, y));
      }

      const bRight = point(viewportWidth * 1.18, viewportHeight * 1.08);
      const tRight = point(viewportWidth * 1.18, -viewportHeight * 0.08);

      startVerts.push(bRight, tRight);
      midVerts.push(bRight, tRight);
      endVerts.push(bRight, tRight);

      return [
        `polygon(${startVerts.join(", ")})`,
        `polygon(${midVerts.join(", ")})`,
        `polygon(${endVerts.join(", ")})`,
      ];
    }

    /* ─────────────────────────────────────────────────────────────
     * 6. CONCENTRIC RIPPLE: Fluid multi-ring water ripple
     * ───────────────────────────────────────────────────────────── */
    case "concentric-ripple": {
      const N = 40;
      const startVerts: string[] = [];
      const midVerts: string[] = [];
      const endVerts: string[] = [];

      for (let i = 0; i < N; i++) {
        const theta = (i * 2 * Math.PI) / N;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);

        const rStart = 4;
        startVerts.push(point(cx + rStart * cosT, cy + rStart * sinT));

        const midR = maxRadius * 0.62 * (1 + 0.16 * Math.sin(8 * theta));
        midVerts.push(point(cx + midR * cosT, cy + midR * sinT));

        const endR =
          maxRadius * 1.48 * (1 + 0.03 * Math.sin(8 * theta + Math.PI));
        endVerts.push(point(cx + endR * cosT, cy + endR * sinT));
      }

      return [
        `polygon(${startVerts.join(", ")})`,
        `polygon(${midVerts.join(", ")})`,
        `polygon(${endVerts.join(", ")})`,
      ];
    }

    /* ─────────────────────────────────────────────────────────────
     * 7. LIQUID DROPLET: Viscous teardrop splash
     * ───────────────────────────────────────────────────────────── */
    case "liquid-droplet": {
      const N = 36;
      const startVerts: string[] = [];
      const midVerts: string[] = [];
      const endVerts: string[] = [];

      for (let i = 0; i < N; i++) {
        const theta = (i * 2 * Math.PI) / N;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);

        const rStart = 4;
        startVerts.push(point(cx + rStart * cosT, cy + rStart * sinT));

        const dropMid = 1 + 0.28 * sinT + 0.14 * Math.cos(2 * theta);
        const rMid = maxRadius * 0.62 * dropMid;
        midVerts.push(point(cx + rMid * cosT, cy + rMid * sinT));

        const dropEnd = 1 + 0.05 * sinT;
        const rEnd = maxRadius * 1.46 * dropEnd;
        endVerts.push(point(cx + rEnd * cosT, cy + rEnd * sinT));
      }

      return [
        `polygon(${startVerts.join(", ")})`,
        `polygon(${midVerts.join(", ")})`,
        `polygon(${endVerts.join(", ")})`,
      ];
    }

    /* ─────────────────────────────────────────────────────────────
     * 8. GOO MELT: Organic melting slime with falling viscous droplets
     * ───────────────────────────────────────────────────────────── */
    case "goo-melt": {
      const steps = 36;
      const startVerts: string[] = [];
      const midVerts: string[] = [];
      const endVerts: string[] = [];

      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const x = u * viewportWidth;

        const dripBase =
          0.14 * Math.pow(Math.abs(Math.sin(u * 3 * Math.PI)), 3) +
          0.18 * Math.pow(Math.abs(Math.sin(u * 5 * Math.PI + 0.6)), 4) +
          0.06 * Math.sin(u * 2 * Math.PI);

        const yStart = -viewportHeight * 0.08;
        const yMid = viewportHeight * (0.35 + dripBase);
        const yEnd = viewportHeight * (1.18 + dripBase * 0.15);

        startVerts.push(point(x, yStart));
        midVerts.push(point(x, yMid));
        endVerts.push(point(x, yEnd));
      }

      const tRight = point(viewportWidth * 1.08, -viewportHeight * 0.18);
      const tLeft = point(-viewportWidth * 0.08, -viewportHeight * 0.18);

      startVerts.push(tRight, tLeft);
      midVerts.push(tRight, tLeft);
      endVerts.push(tRight, tLeft);

      return [
        `polygon(${startVerts.join(", ")})`,
        `polygon(${midVerts.join(", ")})`,
        `polygon(${endVerts.join(", ")})`,
      ];
    }

    /* ─────────────────────────────────────────────────────────────
     * 9. AURORA WAVE: Flowing diagonal sinuous ribbon
     * ───────────────────────────────────────────────────────────── */
    case "aurora-wave": {
      const steps = 36;
      const startVerts: string[] = [];
      const midVerts: string[] = [];
      const endVerts: string[] = [];

      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const xBase = u * (viewportWidth * 1.4) - viewportWidth * 0.2;
        const yBase = u * (viewportHeight * 1.4) - viewportHeight * 0.2;

        const sinWave = Math.sin(u * 4 * Math.PI);
        const amp = viewportHeight * 0.09;

        const xWave = -sinWave * amp * 0.7;
        const yWave = sinWave * amp;

        startVerts.push(
          point(-viewportWidth * 0.35 + xWave, -viewportHeight * 0.35 + yWave)
        );
        midVerts.push(point(xBase + xWave, yBase + yWave));
        endVerts.push(
          point(viewportWidth * 1.35 + xWave, viewportHeight * 1.35 + yWave)
        );
      }

      const bLeft = point(-viewportWidth * 0.45, viewportHeight * 1.45);
      const tRight = point(viewportWidth * 1.45, -viewportHeight * 0.45);

      startVerts.push(bLeft, tRight);
      midVerts.push(bLeft, tRight);
      endVerts.push(bLeft, tRight);

      return [
        `polygon(${startVerts.join(", ")})`,
        `polygon(${midVerts.join(", ")})`,
        `polygon(${endVerts.join(", ")})`,
      ];
    }

    /* ─────────────────────────────────────────────────────────────
     * 10. BUBBLE BURST: Smooth elastic sphere with surface tension
     * ───────────────────────────────────────────────────────────── */
    case "bubble-burst": {
      const N = 36;
      const startVerts: string[] = [];
      const midVerts: string[] = [];
      const endVerts: string[] = [];

      for (let i = 0; i < N; i++) {
        const theta = (i * 2 * Math.PI) / N;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);

        const rStart = 3;
        startVerts.push(point(cx + rStart * cosT, cy + rStart * sinT));

        const bubbleMid =
          1 + 0.08 * Math.sin(2 * theta) + 0.05 * Math.cos(4 * theta);
        const rMid = maxRadius * 0.64 * bubbleMid;
        midVerts.push(point(cx + rMid * cosT, cy + rMid * sinT));

        const rEnd = maxRadius * 1.48;
        endVerts.push(point(cx + rEnd * cosT, cy + rEnd * sinT));
      }

      return [
        `polygon(${startVerts.join(", ")})`,
        `polygon(${midVerts.join(", ")})`,
        `polygon(${endVerts.join(", ")})`,
      ];
    }

    /* ─────────────────────────────────────────────────────────────
     * 11. WHIRLPOOL: Swirling curved liquid eddy vortex
     * ───────────────────────────────────────────────────────────── */
    case "whirlpool": {
      const N = 40;
      const startVerts: string[] = [];
      const midVerts: string[] = [];
      const endVerts: string[] = [];

      for (let i = 0; i < N; i++) {
        const theta = (i * 2 * Math.PI) / N;

        const rStart = 4;
        startVerts.push(
          point(cx + rStart * Math.cos(theta), cy + rStart * Math.sin(theta))
        );

        const phi = theta + 0.75 * Math.PI;
        const rMid =
          maxRadius * 0.65 * (1 + 0.22 * Math.sin(3 * theta + theta * 0.5));
        midVerts.push(
          point(cx + rMid * Math.cos(phi), cy + rMid * Math.sin(phi))
        );

        const endPhi = theta + 1.4 * Math.PI;
        const rEnd = maxRadius * 1.48;
        endVerts.push(
          point(cx + rEnd * Math.cos(endPhi), cy + rEnd * Math.sin(endPhi))
        );
      }

      return [
        `polygon(${startVerts.join(", ")})`,
        `polygon(${midVerts.join(", ")})`,
        `polygon(${endVerts.join(", ")})`,
      ];
    }

    /* ─────────────────────────────────────────────────────────────
     * 12. FLUID CURTAIN: Symmetrical liquid wave parting outward
     * ───────────────────────────────────────────────────────────── */
    case "fluid-curtain": {
      const N = 40;
      const startVerts: string[] = [];
      const midVerts: string[] = [];
      const endVerts: string[] = [];

      for (let i = 0; i < N; i++) {
        const theta = (i * 2 * Math.PI) / N;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);

        const rStart = 4;
        startVerts.push(point(cx + rStart * cosT, cy + rStart * sinT));

        const hScale = 1.7;
        const rMid =
          maxRadius * 0.65 * (1 + 0.15 * Math.sin(6 * theta));
        midVerts.push(point(cx + rMid * cosT * hScale, cy + rMid * sinT));

        const rEnd = maxRadius * 1.5;
        endVerts.push(point(cx + rEnd * cosT * hScale, cy + rEnd * sinT));
      }

      return [
        `polygon(${startVerts.join(", ")})`,
        `polygon(${midVerts.join(", ")})`,
        `polygon(${endVerts.join(", ")})`,
      ];
    }

    /* ─────────────────────────────────────────────────────────────
     * 13. CIRCLE: Smooth radial curve
     * ───────────────────────────────────────────────────────────── */
    case "circle": {
      return [
        `circle(0% at ${point(cx, cy)})`,
        `circle(${toRadius(maxRadius * 0.58)} at ${point(cx, cy)})`,
        `circle(${toRadius(maxRadius * 1.08)} at ${point(cx, cy)})`,
      ];
    }

    /* ─────────────────────────────────────────────────────────────
     * Backward-Compatible Geometric & Directional Variants
     * ───────────────────────────────────────────────────────────── */
    case "diamond": {
      const R = maxRadius * Math.SQRT2 * 1.05;
      const end = [
        point(cx, cy - R),
        point(cx + R, cy),
        point(cx, cy + R),
        point(cx - R, cy),
      ].join(", ");
      return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`];
    }

    case "square": {
      const halfSide =
        Math.max(
          Math.max(cx, viewportWidth - cx),
          Math.max(cy, viewportHeight - cy)
        ) * 1.05;
      const end = [
        point(cx - halfSide, cy - halfSide),
        point(cx + halfSide, cy - halfSide),
        point(cx + halfSide, cy + halfSide),
        point(cx - halfSide, cy + halfSide),
      ].join(", ");
      return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`];
    }

    case "rectangle": {
      const halfW = Math.max(cx, viewportWidth - cx) * 1.05;
      const halfH = Math.max(cy, viewportHeight - cy) * 1.05;
      const end = [
        point(cx - halfW, cy - halfH),
        point(cx + halfW, cy - halfH),
        point(cx + halfW, cy + halfH),
        point(cx - halfW, cy + halfH),
      ].join(", ");
      return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`];
    }

    case "triangle": {
      const scale = maxRadius * 2.3;
      const dx = (Math.sqrt(3) / 2) * scale;
      const verts = [
        point(cx, cy - scale),
        point(cx + dx, cy + 0.5 * scale),
        point(cx - dx, cy + 0.5 * scale),
      ].join(", ");
      return [polygonCollapsed(point(cx, cy), 3), `polygon(${verts})`];
    }

    case "hexagon": {
      const R = maxRadius * Math.SQRT2 * 1.05;
      const verts: string[] = [];
      for (let i = 0; i < 6; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 3;
        verts.push(point(cx + R * Math.cos(a), cy + R * Math.sin(a)));
      }
      return [polygonCollapsed(point(cx, cy), 6), `polygon(${verts.join(", ")})`];
    }

    case "octagon": {
      const R = maxRadius * Math.SQRT2 * 1.05;
      const verts: string[] = [];
      for (let i = 0; i < 8; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 4;
        verts.push(point(cx + R * Math.cos(a), cy + R * Math.sin(a)));
      }
      return [polygonCollapsed(point(cx, cy), 8), `polygon(${verts.join(", ")})`];
    }

    case "star": {
      const R = maxRadius * Math.SQRT2 * 1.06;
      const innerRatio = 0.42;
      const starPoly = (radius: number) => {
        const verts: string[] = [];
        for (let i = 0; i < 5; i++) {
          const outerA = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
          verts.push(
            point(cx + radius * Math.cos(outerA), cy + radius * Math.sin(outerA))
          );
          const innerA = outerA + Math.PI / 5;
          verts.push(
            point(
              cx + radius * innerRatio * Math.cos(innerA),
              cy + radius * innerRatio * Math.sin(innerA)
            )
          );
        }
        return `polygon(${verts.join(", ")})`;
      };
      return [starPoly(3), starPoly(R)];
    }

    case "flower": {
      const R = maxRadius * Math.SQRT2 * 1.06;
      const innerRatio = 0.62;
      const flowerPoly = (radius: number) => {
        const verts: string[] = [];
        for (let i = 0; i < 8; i++) {
          const outerA = (i * 2 * Math.PI) / 8;
          verts.push(
            point(cx + radius * Math.cos(outerA), cy + radius * Math.sin(outerA))
          );
          const innerA = outerA + Math.PI / 8;
          verts.push(
            point(
              cx + radius * innerRatio * Math.cos(innerA),
              cy + radius * innerRatio * Math.sin(innerA)
            )
          );
        }
        return `polygon(${verts.join(", ")})`;
      };
      return [flowerPoly(3), flowerPoly(R)];
    }

    case "aperture": {
      const R = maxRadius * Math.SQRT2 * 1.08;
      const N = 12;
      const irisPoly = (radius: number, swirl: number) => {
        const verts: string[] = [];
        for (let i = 0; i < N; i++) {
          const a = (i * 2 * Math.PI) / N + swirl;
          verts.push(point(cx + radius * Math.cos(a), cy + radius * Math.sin(a)));
        }
        return `polygon(${verts.join(", ")})`;
      };
      return [irisPoly(3, 0), irisPoly(R, Math.PI / 3)];
    }

    case "wipe-right": {
      const start = [
        point(0, 0),
        point(0, 0),
        point(0, viewportHeight),
        point(0, viewportHeight),
      ].join(", ");
      const end = [
        point(0, 0),
        point(viewportWidth, 0),
        point(viewportWidth, viewportHeight),
        point(0, viewportHeight),
      ].join(", ");
      return [`polygon(${start})`, `polygon(${end})`];
    }

    case "wipe-left": {
      const start = [
        point(viewportWidth, 0),
        point(viewportWidth, 0),
        point(viewportWidth, viewportHeight),
        point(viewportWidth, viewportHeight),
      ].join(", ");
      const end = [
        point(viewportWidth, 0),
        point(0, 0),
        point(0, viewportHeight),
        point(viewportWidth, viewportHeight),
      ].join(", ");
      return [`polygon(${start})`, `polygon(${end})`];
    }

    case "wipe-down": {
      const start = [
        point(0, 0),
        point(viewportWidth, 0),
        point(viewportWidth, 0),
        point(0, 0),
      ].join(", ");
      const end = [
        point(0, 0),
        point(viewportWidth, 0),
        point(viewportWidth, viewportHeight),
        point(0, viewportHeight),
      ].join(", ");
      return [`polygon(${start})`, `polygon(${end})`];
    }

    case "wipe-up": {
      const start = [
        point(0, viewportHeight),
        point(viewportWidth, viewportHeight),
        point(viewportWidth, viewportHeight),
        point(0, viewportHeight),
      ].join(", ");
      const end = [
        point(0, viewportHeight),
        point(viewportWidth, viewportHeight),
        point(viewportWidth, 0),
        point(0, 0),
      ].join(", ");
      return [`polygon(${start})`, `polygon(${end})`];
    }

    case "diagonal-slash": {
      const maxDim = Math.max(viewportWidth, viewportHeight) * 2.2;
      const start = [
        point(0, 0),
        point(0, 0),
        point(0, 0),
        point(0, 0),
      ].join(", ");
      const end = [
        point(-maxDim * 0.2, -maxDim * 0.2),
        point(maxDim, -maxDim * 0.2),
        point(maxDim * 0.2, maxDim),
        point(-maxDim * 0.2, maxDim),
      ].join(", ");
      return [`polygon(${start})`, `polygon(${end})`];
    }

    case "curtain": {
      const midX = viewportWidth / 2;
      const start = [
        point(midX, 0),
        point(midX, 0),
        point(midX, viewportHeight),
        point(midX, viewportHeight),
      ].join(", ");
      const end = [
        point(0, 0),
        point(viewportWidth, 0),
        point(viewportWidth, viewportHeight),
        point(0, viewportHeight),
      ].join(", ");
      return [`polygon(${start})`, `polygon(${end})`];
    }

    default:
      return [
        `circle(0% at ${point(cx, cy)})`,
        `circle(${toRadius(maxRadius * 0.58)} at ${point(cx, cy)})`,
        `circle(${toRadius(maxRadius * 1.08)} at ${point(cx, cy)})`,
      ];
  }
}

/* ------------------------------------------------------------------ */
/* Kinetic Morphing Sun/Moon SVG Icon Component                       */
/* ------------------------------------------------------------------ */

interface MorphingThemeIconProps {
  isDark: boolean;
  className?: string;
}

export function MorphingThemeIcon({ isDark, className }: MorphingThemeIconProps) {
  const maskId = useId();

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-5 w-5 pointer-events-none select-none", className)}
      animate={{
        rotate: isDark ? 40 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      <defs>
        <mask id={maskId}>
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          {/* Animated eclipse circle carving the moon crescent */}
          <motion.circle
            animate={{
              cx: isDark ? 9 : 28,
              cy: isDark ? 5 : -4,
              r: isDark ? 8.2 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 24,
            }}
            fill="black"
          />
        </mask>
      </defs>

      {/* Sun / Moon Core Disc */}
      <motion.circle
        cx="12"
        cy="12"
        fill="currentColor"
        mask={`url(#${maskId})`}
        animate={{
          r: isDark ? 8 : 5,
        }}
        transition={{
          type: "spring",
          stiffness: 320,
          damping: 22,
        }}
      />

      {/* Radiant Sun Rays (pop out when light, tuck away when dark) */}
      <motion.g
        stroke="currentColor"
        animate={{
          opacity: isDark ? 0 : 1,
          scale: isDark ? 0.35 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 340,
          damping: 20,
        }}
        style={{ originX: "12px", originY: "12px" }}
      >
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </motion.g>

      {/* Twinkling Night Stars */}
      <motion.circle
        animate={{
          opacity: isDark ? 1 : 0,
          scale: isDark ? 1 : 0,
        }}
        cx="19"
        cy="15"
        r="1"
        fill="currentColor"
        className="text-neutral-300 dark:text-neutral-200"
        transition={{ type: "spring", stiffness: 380, damping: 22, delay: 0.04 }}
      />
      <motion.circle
        animate={{
          opacity: isDark ? 0.75 : 0,
          scale: isDark ? 1 : 0,
        }}
        cx="16"
        cy="20"
        r="0.75"
        fill="currentColor"
        className="text-neutral-400 dark:text-neutral-300"
        transition={{ type: "spring", stiffness: 380, damping: 22, delay: 0.08 }}
      />
    </motion.svg>
  );
}

/* ------------------------------------------------------------------ */
/* Main AnimatedThemeToggler Component                                */
/* ------------------------------------------------------------------ */

export const AnimatedThemeToggler = ({
  className,
  duration = 520,
  easing = "cubic-bezier(0.22, 1, 0.36, 1)",
  variant = "liquid-blob",
  fromCenter = false,
  theme,
  onThemeChange,
  size = "md",
  glow = true,
  ...props
}: AnimatedThemeTogglerProps) => {
  const isControlled = theme !== undefined;
  const [internalIsDark, setInternalIsDark] = useState(false);
  const isDark = isControlled ? theme === "dark" : internalIsDark;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isTransitioningRef = useRef(false);
  const activeAnimRef = useRef<Animation | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Internal tactile liquid ripples inside button
  const [internalRipples, setInternalRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  const cancelAnim = useCallback(() => {
    activeAnimRef.current?.cancel();
    activeAnimRef.current = null;
  }, []);

  // Ensure View Transition clean clipping rules are injected in DOM
  useEffect(() => {
    const STYLE_ID = "boseui-vt-clean-styles";
    if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.innerHTML = `
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation: none !important;
          mix-blend-mode: normal !important;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      cancelAnim();
      const root = document.documentElement;
      delete root.dataset.boseuiThemeVt;
    };
  }, [cancelAnim]);

  // Synchronize internal state with document dark class for uncontrolled usage
  useEffect(() => {
    if (isControlled) return;

    const updateTheme = () => {
      setInternalIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [isControlled]);

  const toggleTheme = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = buttonRef.current;
      if (!button) return;

      // Spawn internal micro liquid ripple inside button
      const rect = button.getBoundingClientRect();
      const clickX = (e.clientX || rect.left + rect.width / 2) - rect.left;
      const clickY = (e.clientY || rect.top + rect.height / 2) - rect.top;
      setInternalRipples((prev) => [
        ...prev.slice(-2),
        { id: Date.now(), x: clickX, y: clickY },
      ]);

      if (
        isTransitioningRef.current ||
        document.documentElement.dataset.boseuiThemeVt === "active"
      ) {
        return;
      }

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let x: number;
      let y: number;

      if (fromCenter) {
        x = viewportWidth / 2;
        y = viewportHeight / 2;
      } else if (e.clientX && e.clientY) {
        x = e.clientX;
        y = e.clientY;
      } else {
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }

      const maxRadius = Math.hypot(
        Math.max(x, viewportWidth - x),
        Math.max(y, viewportHeight - y)
      );

      const applyTheme = () => {
        const newTheme = !isDark;
        document.documentElement.classList.toggle("dark");
        if (newTheme) {
          document.documentElement.style.colorScheme = "dark";
        } else {
          document.documentElement.style.colorScheme = "light";
        }

        if (isControlled) {
          onThemeChange?.(newTheme ? "dark" : "light");
        } else {
          setInternalIsDark(newTheme);
          window.localStorage.setItem("boseui-theme", newTheme ? "dark" : "light");
        }
      };

      // Fallback for browsers without View Transitions API or prefers-reduced-motion
      if (
        typeof document.startViewTransition !== "function" ||
        shouldReduceMotion
      ) {
        applyTheme();
        return;
      }

      const clipPath = getThemeTransitionClipPaths(
        variant,
        x,
        y,
        maxRadius,
        viewportWidth,
        viewportHeight
      );

      const root = document.documentElement;
      root.dataset.boseuiThemeVt = "active";

      const cleanup = () => {
        isTransitioningRef.current = false;
        delete root.dataset.boseuiThemeVt;
        cancelAnim();
      };

      isTransitioningRef.current = true;
      const transition = document.startViewTransition(() => {
        flushSync(applyTheme);
      });

      if (typeof transition?.finished?.finally === "function") {
        transition.finished.finally(cleanup).catch(() => {});
      } else {
        cleanup();
      }

      const ready = transition?.ready;
      if (ready && typeof ready.then === "function") {
        ready
          .then(() => {
            const anim = document.documentElement.animate(
              {
                clipPath,
              },
              {
                duration,
                easing,
                fill: "forwards",
                pseudoElement: "::view-transition-new(root)",
              }
            );
            activeAnimRef.current = anim;
          })
          .catch(() => {});
      }
    },
    [
      variant,
      fromCenter,
      duration,
      easing,
      isDark,
      isControlled,
      onThemeChange,
      cancelAnim,
      shouldReduceMotion,
    ]
  );

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-9 w-9",
    lg: "h-11 w-11",
  }[size];

  return (
    <motion.button
      type="button"
      ref={buttonRef}
      onClick={toggleTheme}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.90, rotate: isDark ? -8 : 8 }}
      transition={{
        type: "spring",
        stiffness: 450,
        damping: 16,
      }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode (${variant} transition)`}
      className={cn(
        "relative flex items-center justify-center rounded-full border transition-all overflow-hidden",
        "border-neutral-200/90 bg-white/90 text-neutral-800 shadow-2xs backdrop-blur-md hover:border-neutral-300 hover:text-neutral-950",
        "dark:border-neutral-800/90 dark:bg-neutral-900/90 dark:text-neutral-100 dark:hover:border-neutral-700 dark:hover:text-white",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black",
        sizeClasses,
        className
      )}
      {...(props as any)}
    >
      {/* Ambient theme aura glow */}
      {glow && (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -inset-1 rounded-full opacity-60 blur-xs transition-opacity duration-300",
            isDark ? "bg-indigo-500/15" : "bg-amber-500/15"
          )}
        />
      )}

      {/* Internal tactile liquid ripple */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
        {internalRipples.map((rip) => (
          <motion.span
            key={rip.id}
            initial={{ scale: 0, opacity: 0.55 }}
            animate={{ scale: 3.2, opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            style={{ left: rip.x, top: rip.y }}
            className={cn(
              "absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xs",
              isDark ? "bg-amber-400/35" : "bg-indigo-500/25"
            )}
          />
        ))}
      </div>

      <MorphingThemeIcon isDark={isDark} />
      <span className="sr-only">Toggle theme</span>
    </motion.button>
  );
};

export default AnimatedThemeToggler;
