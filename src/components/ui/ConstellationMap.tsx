"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Compass, Sparkles, Grid, Eye, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConstellationMapProps {
  /** Color of constellation connecting lines */
  lineColor?: string;
  /** Primary star node color */
  starColor?: string;
  /** Line drawing animation speed multiplier */
  drawSpeed?: number;
  /** Whether to display celestial RA/Dec coordinate grid */
  showGrid?: boolean;
  /** Whether to display constellation and star designation labels */
  showLabels?: boolean;
  /** Optional foreground content */
  children?: React.ReactNode;
  /** Additional container classes */
  className?: string;
}

interface StarNode {
  id: string;
  name: string;
  designation: string;
  spectralType: string;
  spectralColor: string;
  mag: string;
  x: number; // normalized percentage 0-100
  y: number; // normalized percentage 0-100
  radius: number;
}

interface ConstellationDef {
  id: string;
  name: string;
  latin: string;
  ra: string;
  dec: string;
  labelPos: { x: number; y: number };
  stars: StarNode[];
  edges: [string, string][];
}

const CONSTELLATIONS: ConstellationDef[] = [
  {
    id: "orion",
    name: "ORION",
    latin: "The Hunter",
    ra: "05h 35m",
    dec: "+05° 23′",
    labelPos: { x: 18, y: 21 },
    stars: [
      {
        id: "betelgeuse",
        name: "Betelgeuse",
        designation: "α Ori",
        spectralType: "M1-2 Ia",
        spectralColor: "#FB923C",
        mag: "0.42",
        x: 16.5,
        y: 30,
        radius: 4.6,
      },
      {
        id: "bellatrix",
        name: "Bellatrix",
        designation: "γ Ori",
        spectralType: "B2 III",
        spectralColor: "#93C5FD",
        mag: "1.64",
        x: 27.2,
        y: 32.5,
        radius: 3.5,
      },
      {
        id: "meissa",
        name: "Meissa",
        designation: "λ Ori",
        spectralType: "O8 III",
        spectralColor: "#BAE6FD",
        mag: "3.33",
        x: 22.2,
        y: 25.5,
        radius: 2.6,
      },
      {
        id: "alnitak",
        name: "Alnitak",
        designation: "ζ Ori",
        spectralType: "O9.5 Ib",
        spectralColor: "#93C5FD",
        mag: "1.77",
        x: 20.4,
        y: 46.8,
        radius: 3.1,
      },
      {
        id: "alnilam",
        name: "Alnilam",
        designation: "ε Ori",
        spectralType: "B0 Ia",
        spectralColor: "#BAE6FD",
        mag: "1.69",
        x: 22.8,
        y: 45.6,
        radius: 3.3,
      },
      {
        id: "mintaka",
        name: "Mintaka",
        designation: "δ Ori",
        spectralType: "O9.5 II",
        spectralColor: "#93C5FD",
        mag: "2.23",
        x: 25.2,
        y: 44.5,
        radius: 3.0,
      },
      {
        id: "saiph",
        name: "Saiph",
        designation: "κ Ori",
        spectralType: "B0.5 Ia",
        spectralColor: "#93C5FD",
        mag: "2.06",
        x: 18.2,
        y: 62.5,
        radius: 3.3,
      },
      {
        id: "rigel",
        name: "Rigel",
        designation: "β Ori",
        spectralType: "B8 Ia",
        spectralColor: "#7DD3FC",
        mag: "0.13",
        x: 28.8,
        y: 60.5,
        radius: 4.8,
      },
    ],
    edges: [
      ["meissa", "betelgeuse"],
      ["meissa", "bellatrix"],
      ["betelgeuse", "bellatrix"],
      ["betelgeuse", "alnitak"],
      ["bellatrix", "mintaka"],
      ["alnitak", "alnilam"],
      ["alnilam", "mintaka"],
      ["alnitak", "saiph"],
      ["mintaka", "rigel"],
      ["saiph", "rigel"],
    ],
  },
  {
    id: "cassiopeia",
    name: "CASSIOPEIA",
    latin: "The Seated Queen",
    ra: "01h 00m",
    dec: "+60° 14′",
    labelPos: { x: 44, y: 11 },
    stars: [
      {
        id: "caph",
        name: "Caph",
        designation: "β Cas",
        spectralType: "F2 III",
        spectralColor: "#FEF08A",
        mag: "2.28",
        x: 38.5,
        y: 18.2,
        radius: 3.2,
      },
      {
        id: "schedar",
        name: "Schedar",
        designation: "α Cas",
        spectralType: "K0 IIIa",
        spectralColor: "#FDBA74",
        mag: "2.24",
        x: 43.8,
        y: 24.5,
        radius: 3.8,
      },
      {
        id: "gamma_cas",
        name: "Navi",
        designation: "γ Cas",
        spectralType: "B0.5 IVe",
        spectralColor: "#7DD3FC",
        mag: "2.15",
        x: 48.8,
        y: 19.2,
        radius: 3.6,
      },
      {
        id: "ruchbah",
        name: "Ruchbah",
        designation: "δ Cas",
        spectralType: "A5 III",
        spectralColor: "#F8FAFC",
        mag: "2.68",
        x: 54.2,
        y: 25.0,
        radius: 3.0,
      },
      {
        id: "segin",
        name: "Segin",
        designation: "ε Cas",
        spectralType: "B3 III",
        spectralColor: "#93C5FD",
        mag: "3.35",
        x: 59.5,
        y: 16.8,
        radius: 2.8,
      },
    ],
    edges: [
      ["caph", "schedar"],
      ["schedar", "gamma_cas"],
      ["gamma_cas", "ruchbah"],
      ["ruchbah", "segin"],
    ],
  },
  {
    id: "ursa_major",
    name: "URSA MAJOR",
    latin: "The Great Bear",
    ra: "11h 18m",
    dec: "+55° 23′",
    labelPos: { x: 72, y: 14 },
    stars: [
      {
        id: "dubhe",
        name: "Dubhe",
        designation: "α UMa",
        spectralType: "K0 III",
        spectralColor: "#FDBA74",
        mag: "1.79",
        x: 87.5,
        y: 21.5,
        radius: 4.0,
      },
      {
        id: "merak",
        name: "Merak",
        designation: "β UMa",
        spectralType: "A1 V",
        spectralColor: "#F8FAFC",
        mag: "2.37",
        x: 86.2,
        y: 31.2,
        radius: 3.3,
      },
      {
        id: "phecda",
        name: "Phecda",
        designation: "γ UMa",
        spectralType: "A0 Ve",
        spectralColor: "#F8FAFC",
        mag: "2.44",
        x: 77.2,
        y: 33.0,
        radius: 3.2,
      },
      {
        id: "megrez",
        name: "Megrez",
        designation: "δ UMa",
        spectralType: "A3 V",
        spectralColor: "#F8FAFC",
        mag: "3.31",
        x: 76.5,
        y: 24.8,
        radius: 2.7,
      },
      {
        id: "alioth",
        name: "Alioth",
        designation: "ε UMa",
        spectralType: "A1 III",
        spectralColor: "#E0F2FE",
        mag: "1.77",
        x: 69.8,
        y: 23.8,
        radius: 3.9,
      },
      {
        id: "mizar",
        name: "Mizar",
        designation: "ζ UMa",
        spectralType: "A2 V",
        spectralColor: "#F8FAFC",
        mag: "2.23",
        x: 64.2,
        y: 25.5,
        radius: 3.4,
      },
      {
        id: "alkaid",
        name: "Alkaid",
        designation: "η UMa",
        spectralType: "B3 V",
        spectralColor: "#93C5FD",
        mag: "1.86",
        x: 57.8,
        y: 31.2,
        radius: 3.8,
      },
    ],
    edges: [
      ["dubhe", "merak"],
      ["merak", "phecda"],
      ["phecda", "megrez"],
      ["megrez", "dubhe"],
      ["megrez", "alioth"],
      ["alioth", "mizar"],
      ["mizar", "alkaid"],
    ],
  },
  {
    id: "cygnus",
    name: "CYGNUS",
    latin: "The Northern Cross",
    ra: "20h 37m",
    dec: "+42° 18′",
    labelPos: { x: 47, y: 42 },
    stars: [
      {
        id: "deneb",
        name: "Deneb",
        designation: "α Cyg",
        spectralType: "A2 Ia",
        spectralColor: "#E0F2FE",
        mag: "1.25",
        x: 52.0,
        y: 45.8,
        radius: 4.5,
      },
      {
        id: "sadr",
        name: "Sadr",
        designation: "γ Cyg",
        spectralType: "F8 Ib",
        spectralColor: "#FEF08A",
        mag: "2.23",
        x: 52.0,
        y: 57.2,
        radius: 3.6,
      },
      {
        id: "albireo",
        name: "Albireo",
        designation: "β Cyg",
        spectralType: "K3 II",
        spectralColor: "#FDBA74",
        mag: "3.05",
        x: 52.0,
        y: 73.5,
        radius: 3.2,
      },
      {
        id: "gienah",
        name: "Gienah",
        designation: "ε Cyg",
        spectralType: "K0 III",
        spectralColor: "#FDBA74",
        mag: "2.48",
        x: 62.2,
        y: 59.2,
        radius: 3.3,
      },
      {
        id: "delta_cyg",
        name: "Fawaris",
        designation: "δ Cyg",
        spectralType: "B9.5 III",
        spectralColor: "#BAE6FD",
        mag: "2.87",
        x: 41.8,
        y: 59.2,
        radius: 3.1,
      },
    ],
    edges: [
      ["deneb", "sadr"],
      ["sadr", "albireo"],
      ["delta_cyg", "sadr"],
      ["sadr", "gienah"],
    ],
  },
  {
    id: "lyra",
    name: "LYRA",
    latin: "The Harp",
    ra: "18h 51m",
    dec: "+36° 41′",
    labelPos: { x: 76, y: 41 },
    stars: [
      {
        id: "vega",
        name: "Vega",
        designation: "α Lyr",
        spectralType: "A0 Va",
        spectralColor: "#BAE6FD",
        mag: "0.03",
        x: 78.2,
        y: 47.2,
        radius: 4.9,
      },
      {
        id: "eps_lyr",
        name: "Double Double",
        designation: "ε Lyr",
        spectralType: "A4 V",
        spectralColor: "#F8FAFC",
        mag: "4.67",
        x: 81.8,
        y: 44.5,
        radius: 2.5,
      },
      {
        id: "zeta_lyr",
        name: "Zeta Lyrae",
        designation: "ζ Lyr",
        spectralType: "Am",
        spectralColor: "#F8FAFC",
        mag: "4.36",
        x: 80.2,
        y: 51.2,
        radius: 2.7,
      },
      {
        id: "delta_lyr",
        name: "Delta Lyrae",
        designation: "δ Lyr",
        spectralType: "M4 II",
        spectralColor: "#FB923C",
        mag: "4.22",
        x: 85.2,
        y: 52.2,
        radius: 2.7,
      },
      {
        id: "sheliak",
        name: "Sheliak",
        designation: "β Lyr",
        spectralType: "B8 II",
        spectralColor: "#93C5FD",
        mag: "3.52",
        x: 81.2,
        y: 60.4,
        radius: 3.1,
      },
      {
        id: "sulafat",
        name: "Sulafat",
        designation: "γ Lyr",
        spectralType: "B9 III",
        spectralColor: "#BAE6FD",
        mag: "3.25",
        x: 86.4,
        y: 61.2,
        radius: 3.2,
      },
    ],
    edges: [
      ["vega", "eps_lyr"],
      ["vega", "zeta_lyr"],
      ["eps_lyr", "zeta_lyr"],
      ["zeta_lyr", "delta_lyr"],
      ["delta_lyr", "sulafat"],
      ["sulafat", "sheliak"],
      ["sheliak", "zeta_lyr"],
    ],
  },
];

const SPECTRAL_PALETTE = [
  "#93C5FD", // O/B blue-white
  "#E0F2FE", // A white-blue
  "#F8FAFC", // F white
  "#FEF08A", // G yellow-white
  "#FDBA74", // K/M orange
];

// 240+ deterministic deep-field stars clustered denser along the diagonal Milky Way plane
const FIELD_STARS = Array.from({ length: 240 }, (_, i) => {
  const s1 = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
  const r1 = s1 - Math.floor(s1);
  const s2 = Math.sin(i * 78.233 + 9.731) * 29432.182;
  const r2 = s2 - Math.floor(s2);

  // Concentrate 45% of stars along the Milky Way diagonal band
  const inGalacticPlane = i % 10 < 5;
  const baseT = r1 * 96 + 2;
  const x = baseT;
  const y = inGalacticPlane
    ? Math.max(3, Math.min(96, 88 - baseT * 0.72 + (r2 - 0.5) * 32))
    : r2 * 94 + 3;

  return {
    id: i,
    x,
    y,
    r: 0.45 + (i % 5) * 0.28,
    opacity: 0.14 + ((i * 23) % 68) / 100,
    color: SPECTRAL_PALETTE[i % SPECTRAL_PALETTE.length] || "#F8FAFC",
  };
});

export function ConstellationMap({
  lineColor = "#38BDF8",
  starColor = "#F8FAFC",
  drawSpeed = 1.0,
  showGrid: propShowGrid = true,
  showLabels: propShowLabels = true,
  children,
  className,
}: ConstellationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 960, height: 540 });
  const [showGrid, setShowGrid] = useState(propShowGrid);
  const [showLabels, setShowLabels] = useState(propShowLabels);
  const [hoveredStar, setHoveredStar] = useState<StarNode | null>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    setShowGrid(propShowGrid);
  }, [propShowGrid]);

  useEffect(() => {
    setShowLabels(propShowLabels);
  }, [propShowLabels]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      setDimensions({
        width: Math.max(320, Math.floor(rect.width)),
        height: Math.max(420, Math.floor(rect.height)),
      });
    };

    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const durationBase = Math.max(0.4, 1.8 / Math.max(0.2, drawSpeed));

  return (
    <div
      ref={containerRef}
      data-fullscreen-scroll
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
        const ny = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
        setParallax({ x: nx * 14, y: ny * 14 });
      }}
      onMouseLeave={() => setParallax({ x: 0, y: 0 })}
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-sky-500/20 bg-[#02050E] text-slate-100 shadow-2xl",
        className
      )}
    >
      {/* Deep Space Zenith & Milky Way Galactic Dust Band */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(14,165,233,0.16),rgba(15,23,42,0.78)_55%,rgba(2,5,14,1)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-20 rotate-[-28deg] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.13)_0%,rgba(99,102,241,0.08)_35%,transparent_70%)] blur-2xl"
      />

      {/* Interactive Astronomical SVG Chart */}
      <svg
        key={replayKey}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="absolute inset-0 h-full w-full select-none"
        aria-label="Astronomical Constellation Star Chart"
      >
        <defs>
          <filter id="star-glow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="3.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="nebula-band" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.16" />
            <stop offset="50%" stopColor="#818CF8" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#02050E" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Diagonal Milky Way Galactic Plane Nebula Dust */}
        <g
          aria-hidden="true"
          transform={`translate(${-parallax.x * 0.35}, ${-parallax.y * 0.35})`}
        >
          <ellipse
            cx={dimensions.width * 0.52}
            cy={dimensions.height * 0.48}
            rx={dimensions.width * 0.65}
            ry={dimensions.height * 0.22}
            transform={`rotate(-26 ${dimensions.width * 0.52} ${
              dimensions.height * 0.48
            })`}
            fill="url(#nebula-band)"
          />
        </g>

        {/* Celestial RA / Dec Coordinate Grid */}
        {showGrid && (
          <g className="opacity-35">
            {/* Declination Parallels */}
            {[0.18, 0.36, 0.54, 0.72, 0.9].map((ratio, idx) => {
              const y = dimensions.height * ratio;
              const decDeg = 60 - idx * 20;
              return (
                <g key={`dec-${idx}`}>
                  <line
                    x1={0}
                    y1={y}
                    x2={dimensions.width}
                    y2={y}
                    stroke={lineColor}
                    strokeWidth="0.6"
                    strokeDasharray="3 6"
                    strokeOpacity="0.48"
                  />
                  <text
                    x={14}
                    y={y - 5}
                    fill={lineColor}
                    fontSize="9"
                    fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                    opacity="0.8"
                  >
                    DEC {decDeg >= 0 ? `+${decDeg}°` : `${decDeg}°`}
                  </text>
                </g>
              );
            })}

            {/* Right Ascension Meridians */}
            {[0.15, 0.32, 0.5, 0.68, 0.85].map((ratio, idx) => {
              const x = dimensions.width * ratio;
              const raHour = (idx * 4 + 2).toString().padStart(2, "0");
              return (
                <g key={`ra-${idx}`}>
                  <line
                    x1={x}
                    y1={0}
                    x2={x}
                    y2={dimensions.height}
                    stroke={lineColor}
                    strokeWidth="0.6"
                    strokeDasharray="3 6"
                    strokeOpacity="0.48"
                  />
                  <text
                    x={x + 6}
                    y={18}
                    fill={lineColor}
                    fontSize="9"
                    fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                    opacity="0.8"
                  >
                    RA {raHour}h 00m
                  </text>
                </g>
              );
            })}

            {/* Celestial Equator & Ecliptic Great Circle Curve */}
            <path
              d={`M 0 ${dimensions.height * 0.68} Q ${dimensions.width * 0.5} ${
                dimensions.height * 0.24
              } ${dimensions.width} ${dimensions.height * 0.62}`}
              fill="none"
              stroke={lineColor}
              strokeWidth="0.9"
              strokeDasharray="6 6"
              strokeOpacity="0.4"
            />
          </g>
        )}

        {/* 240+ Multi-Spectral Background Field Stars with subtle parallax */}
        <g
          aria-hidden="true"
          transform={`translate(${-parallax.x * 0.45}, ${-parallax.y * 0.45})`}
        >
          {FIELD_STARS.map((s) => (
            <circle
              key={s.id}
              cx={(s.x / 100) * dimensions.width}
              cy={(s.y / 100) * dimensions.height}
              r={s.r}
              fill={s.color}
              opacity={s.opacity}
            />
          ))}
        </g>

        {/* Constellation Geometries & Optical Diffraction Spikes */}
        <g transform={`translate(${parallax.x * 0.35}, ${parallax.y * 0.35})`}>
          {CONSTELLATIONS.map((constellation, cIndex) => {
            const starMap = new Map(
              constellation.stars.map((s) => [s.id, s])
            );

            return (
              <g key={constellation.id}>
                {/* Animated Connecting Edges */}
                {constellation.edges.map(([fromId, toId], edgeIndex) => {
                  const from = starMap.get(fromId);
                  const to = starMap.get(toId);
                  if (!from || !to) return null;

                  const x1 = (from.x / 100) * dimensions.width;
                  const y1 = (from.y / 100) * dimensions.height;
                  const x2 = (to.x / 100) * dimensions.width;
                  const y2 = (to.y / 100) * dimensions.height;

                  return (
                    <motion.line
                      key={`${constellation.id}-${fromId}-${toId}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={lineColor}
                      strokeWidth="1.35"
                      strokeOpacity="0.68"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.72 }}
                      transition={{
                        duration: durationBase,
                        delay: cIndex * 0.18 + edgeIndex * 0.08,
                        ease: "easeInOut",
                      }}
                    />
                  );
                })}

                {/* Constellation Designation Header */}
                {showLabels && (
                  <g
                    transform={`translate(${
                      (constellation.labelPos.x / 100) * dimensions.width
                    }, ${(constellation.labelPos.y / 100) * dimensions.height})`}
                  >
                    <text
                      fill={lineColor}
                      fontSize="10"
                      fontWeight="700"
                      letterSpacing="0.2em"
                      fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                    >
                      {constellation.name}
                    </text>
                    <text
                      y={12}
                      fill="#94A3B8"
                      fontSize="8.5"
                      fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                    >
                      {constellation.latin} · {constellation.ra} {constellation.dec}
                    </text>
                  </g>
                )}

                {/* Interactive Star Nodes with Optical Diffraction Spikes */}
                {constellation.stars.map((star) => {
                  const cx = (star.x / 100) * dimensions.width;
                  const cy = (star.y / 100) * dimensions.height;
                  const isHovered = hoveredStar?.id === star.id;
                  const isBrightMajor = star.radius >= 3.8;
                  const spikeLen = isHovered
                    ? star.radius * 4.2
                    : star.radius * 2.9;

                  return (
                    <g
                      key={star.id}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(null)}
                    >
                      {/* Spectral Color Halo */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? star.radius * 3.4 : star.radius * 2.2}
                        fill={star.spectralColor}
                        opacity={isHovered ? 0.34 : 0.18}
                        filter="url(#star-glow)"
                      />

                      {/* 4-Point Telescope Optical Diffraction Spikes on Bright / Hovered Stars */}
                      {(isBrightMajor || isHovered) && (
                        <g stroke={star.spectralColor} strokeOpacity={isHovered ? 0.9 : 0.65}>
                          <line
                            x1={cx - spikeLen}
                            y1={cy}
                            x2={cx + spikeLen}
                            y2={cy}
                            strokeWidth={isHovered ? "1.1" : "0.8"}
                          />
                          <line
                            x1={cx}
                            y1={cy - spikeLen}
                            x2={cx}
                            y2={cy + spikeLen}
                            strokeWidth={isHovered ? "1.1" : "0.8"}
                          />
                        </g>
                      )}

                      {/* Outer Astrometric Lock-On Reticle Ring */}
                      {(isBrightMajor || isHovered) && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isHovered ? star.radius + 7 : star.radius + 4.5}
                          fill="none"
                          stroke={isHovered ? "#FFFFFF" : lineColor}
                          strokeWidth={isHovered ? "1.1" : "0.75"}
                          strokeOpacity={isHovered ? "0.95" : "0.35"}
                          strokeDasharray="2.5 2.5"
                        />
                      )}

                      {/* Invisible hit target for effortless hovering */}
                      <circle cx={cx} cy={cy} r={14} fill="transparent" />

                      {/* Incandescent Star Core */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? star.radius + 1.5 : star.radius}
                        fill={isHovered ? "#FFFFFF" : star.spectralColor || starColor}
                        filter="url(#star-glow)"
                      />

                      {/* Star Designation & Magnitude Label */}
                      {showLabels && (star.radius >= 3.3 || isHovered) && (
                        <text
                          x={cx + star.radius + 8}
                          y={cy + 3}
                          fill={isHovered ? "#FFFFFF" : "#E2E8F0"}
                          fontSize={isHovered ? "10.5" : "9.5"}
                          fontWeight={isHovered ? "600" : "400"}
                          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                        >
                          {star.name}{" "}
                          <tspan fill={lineColor} opacity="0.88">
                            ({star.designation})
                          </tspan>
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}
        </g>
      </svg>

      {children ? (
        <div className="relative z-10 h-full w-full">{children}</div>
      ) : (
        <div className="pointer-events-none relative z-10 flex min-h-[520px] flex-col justify-between p-6 sm:p-8">
          {/* Top Astrometry Telemetry Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-white/10 bg-slate-950/75 px-3.5 py-1.5 backdrop-blur-md">
              <Compass className="h-3.5 w-3.5 text-sky-400" />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-300">
                EPOCH J2000.0 // DEEP-SKY ASTROMETRY
              </span>
            </div>

            <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/75 px-3.5 py-1.5 font-mono text-[11px] text-slate-300 backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-sky-400" />
              {hoveredStar ? (
                <span>
                  <strong className="text-white">{hoveredStar.name}</strong> ·{" "}
                  {hoveredStar.designation} · CLASS {hoveredStar.spectralType} ·
                  MAG {hoveredStar.mag}
                </span>
              ) : (
                <span>240+ FIELD STARS · HOVER ANY STAR NODE</span>
              )}
            </div>
          </div>

          {/* Bottom Interactive HUD Controls */}
          <div className="pointer-events-auto flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-950/80 p-3.5 backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowGrid((g) => !g)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-xs uppercase transition",
                  showGrid
                    ? "bg-sky-500/25 text-sky-300 ring-1 ring-sky-400/50"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                )}
              >
                <Grid className="h-3 w-3" />
                RA/Dec Grid
              </button>

              <button
                type="button"
                onClick={() => setShowLabels((l) => !l)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-xs uppercase transition",
                  showLabels
                    ? "bg-sky-500/25 text-sky-300 ring-1 ring-sky-400/50"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                )}
              >
                <Eye className="h-3 w-3" />
                Designations
              </button>
            </div>

            <button
              type="button"
              onClick={() => setReplayKey((k) => k + 1)}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-slate-200 transition hover:bg-white/10"
            >
              <RotateCcw className="h-3 w-3 text-sky-400" />
              Replay Trace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConstellationMap;
