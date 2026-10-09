"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  RotateCcw,
  Play,
  Pause,
  Zap,
  Sparkles,
  Sliders,
  MapPin,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface City {
  name: string;
  lat: number;
  lon: number;
  region: string;
}

const CITIES: City[] = [
  { name: "San Francisco", lat: 37.77, lon: -122.42, region: "US-West" },
  { name: "New York", lat: 40.71, lon: -74.01, region: "US-East" },
  { name: "London", lat: 51.51, lon: -0.13, region: "EU-West" },
  { name: "Tokyo", lat: 35.68, lon: 139.65, region: "AP-North" },
  { name: "Singapore", lat: 1.35, lon: 103.82, region: "AP-South" },
  { name: "Sydney", lat: -33.87, lon: 151.21, region: "AP-East" },
];

interface ArcRoute {
  from: City;
  to: City;
  color: string;
  speedMultiplier: number;
}

const ROUTES: ArcRoute[] = [
  { from: CITIES[0], to: CITIES[1], color: "#6366f1", speedMultiplier: 1.0 }, // SF -> NY
  { from: CITIES[1], to: CITIES[2], color: "#a855f7", speedMultiplier: 0.9 }, // NY -> London
  { from: CITIES[2], to: CITIES[4], color: "#06b6d4", speedMultiplier: 1.1 }, // London -> Singapore
  { from: CITIES[4], to: CITIES[3], color: "#10b981", speedMultiplier: 1.3 }, // Singapore -> Tokyo
  { from: CITIES[3], to: CITIES[0], color: "#f59e0b", speedMultiplier: 0.8 }, // Tokyo -> SF
  { from: CITIES[4], to: CITIES[5], color: "#ec4899", speedMultiplier: 1.2 }, // Singapore -> Sydney
];

// Generate dot coordinates on sphere
function generateSphereDots(count: number = 720) {
  const dots: { x: number; y: number; z: number }[] = [];
  const phi = (Math.PI * (3 - Math.sqrt(5))); // golden angle

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
    const radius = Math.sqrt(1 - y * y); // radius at y
    const theta = phi * i; // golden angle increment

    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    dots.push({ x, y, z });
  }
  return dots;
}

function latLonTo3D(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return {
    x: -(radius * Math.sin(phi) * Math.cos(theta)),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta),
  };
}

export interface GlobeArcsProps {
  className?: string;
  autoRotateSpeed?: number;
  initialRadius?: number;
  showHeader?: boolean;
  showControls?: boolean;
}

export function GlobeArcs({
  className,
  autoRotateSpeed = 0.004,
  initialRadius = 160,
  showHeader = true,
  showControls = true,
}: GlobeArcsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDragging = useRef(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotVelocity = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotation = useRef<{ x: number; y: number }>({ x: 0.25, y: -0.8 });
  const animFrameId = useRef<number | null>(null);

  const [isRotating, setIsRotating] = useState(true);
  const [speed, setSpeed] = useState(autoRotateSpeed);
  const [activeCity, setActiveCity] = useState<City>(CITIES[0]);
  const [transactionCount, setTransactionCount] = useState(14820);

  const sphereDots = useRef(generateSphereDots(820));

  const resetOrientation = () => {
    rotation.current = { x: 0.25, y: -0.8 };
    rotVelocity.current = { x: 0, y: 0 };
  };

  const triggerTransaction = () => {
    setTransactionCount((prev) => prev + 1);
    const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
    setActiveCity(randomCity);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.015;

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = rect.width;
      const height = rect.height;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const R = Math.min(width, height) * 0.36;

      // Handle drag inertia & continuous rotation
      if (isRotating && !isDragging.current) {
        rotation.current.y += speed;
      }

      if (!isDragging.current) {
        rotation.current.y += rotVelocity.current.y;
        rotation.current.x += rotVelocity.current.x;
        rotVelocity.current.x *= 0.92;
        rotVelocity.current.y *= 0.92;
      }

      // Clamp X rotation to prevent flipping upside down
      rotation.current.x = Math.max(-1.1, Math.min(1.1, rotation.current.x));

      const cosX = Math.cos(rotation.current.x);
      const sinX = Math.sin(rotation.current.x);
      const cosY = Math.cos(rotation.current.y);
      const sinY = Math.sin(rotation.current.y);

      // Rotate point helper
      const project = (x: number, y: number, z: number) => {
        // Rotate around Y
        const x1 = x * cosY - z * sinY;
        const z1 = z * cosY + x * sinY;
        // Rotate around X
        const y2 = y * cosX - z1 * sinX;
        const z2 = z1 * cosX + y * sinX;

        return {
          px: centerX + x1,
          py: centerY - y2,
          pz: z2,
        };
      };

      // Draw Atmospheric outer glow
      const atmosphereGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        R * 0.85,
        centerX,
        centerY,
        R * 1.25
      );
      atmosphereGrad.addColorStop(0, "rgba(99, 102, 241, 0.08)");
      atmosphereGrad.addColorStop(0.6, "rgba(6, 182, 212, 0.04)");
      atmosphereGrad.addColorStop(1, "transparent");
      ctx.fillStyle = atmosphereGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, R * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Draw Globe Base Sphere Fill (Dark midnight)
      const baseGrad = ctx.createRadialGradient(
        centerX - R * 0.3,
        centerY - R * 0.3,
        R * 0.1,
        centerX,
        centerY,
        R
      );
      baseGrad.addColorStop(0, "#0e1329");
      baseGrad.addColorStop(0.7, "#080b18");
      baseGrad.addColorStop(1, "#030409");
      ctx.fillStyle = baseGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, R, 0, Math.PI * 2);
      ctx.fill();

      // Draw Globe Dotted Point Cloud
      for (const dot of sphereDots.current) {
        const { px, py, pz } = project(dot.x * R, dot.y * R, dot.z * R);
        if (pz > -R * 0.2) {
          const alpha = (pz + R * 0.2) / (R * 1.2);
          const size = Math.max(0.75, (pz + R) / (R * 1.2) * 1.4);
          ctx.fillStyle = `rgba(148, 163, 184, ${alpha * 0.45})`;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw Great-Circle Arcs & Traveling Pulse Lights
      ROUTES.forEach((route, routeIdx) => {
        const p1_3d = latLonTo3D(route.from.lat, route.from.lon, R);
        const p2_3d = latLonTo3D(route.to.lat, route.to.lon, R);

        const steps = 36;
        const arcPoints: { px: number; py: number; pz: number }[] = [];

        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          // Linear blend then normalize to sphere + elevation arc
          const lx = p1_3d.x + (p2_3d.x - p1_3d.x) * t;
          const ly = p1_3d.y + (p2_3d.y - p1_3d.y) * t;
          const lz = p1_3d.z + (p2_3d.z - p1_3d.z) * t;
          const mag = Math.sqrt(lx * lx + ly * ly + lz * lz) || 1;

          // Arc height peaking at t = 0.5
          const heightMultiplier = 1 + 0.24 * Math.sin(t * Math.PI);
          const elevatedR = R * heightMultiplier;

          const ax = (lx / mag) * elevatedR;
          const ay = (ly / mag) * elevatedR;
          const az = (lz / mag) * elevatedR;

          arcPoints.push(project(ax, ay, az));
        }

        // Stroke the Arc
        ctx.beginPath();
        let firstVisible = false;
        arcPoints.forEach((pt, i) => {
          if (pt.pz > -R * 0.3) {
            if (!firstVisible) {
              ctx.moveTo(pt.px, pt.py);
              firstVisible = true;
            } else {
              ctx.lineTo(pt.px, pt.py);
            }
          }
        });

        ctx.strokeStyle = route.color + "55"; // translucent trail
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Traveling Light Pulse Head
        const pulseT = ((time * route.speedMultiplier * 0.4) + routeIdx * 0.18) % 1;
        const pulseIndex = Math.floor(pulseT * steps);
        const pulsePt = arcPoints[pulseIndex];

        if (pulsePt && pulsePt.pz > -R * 0.1) {
          // Glow halo
          const glow = ctx.createRadialGradient(
            pulsePt.px,
            pulsePt.py,
            0,
            pulsePt.px,
            pulsePt.py,
            9
          );
          glow.addColorStop(0, "#ffffff");
          glow.addColorStop(0.4, route.color);
          glow.addColorStop(1, "transparent");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(pulsePt.px, pulsePt.py, 9, 0, Math.PI * 2);
          ctx.fill();

          // Core point
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(pulsePt.px, pulsePt.py, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw Cities
      CITIES.forEach((city) => {
        const c3d = latLonTo3D(city.lat, city.lon, R);
        const { px, py, pz } = project(c3d.x, c3d.y, c3d.z);

        if (pz > 0) {
          const isSelected = activeCity.name === city.name;

          // Pulsing City Ring
          const ringRadius = isSelected ? 6 + Math.sin(time * 5) * 2 : 4;
          ctx.strokeStyle = isSelected ? "#38bdf8" : "rgba(255, 255, 255, 0.6)";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(px, py, ringRadius, 0, Math.PI * 2);
          ctx.stroke();

          // City Dot Core
          ctx.fillStyle = isSelected ? "#38bdf8" : "#ffffff";
          ctx.beginPath();
          ctx.arc(px, py, 2.2, 0, Math.PI * 2);
          ctx.fill();

          // City Label
          ctx.fillStyle = isSelected ? "#ffffff" : "rgba(226, 232, 240, 0.75)";
          ctx.font = isSelected
            ? "bold 10px ui-sans-serif, system-ui, sans-serif"
            : "9px ui-sans-serif, system-ui, sans-serif";
          ctx.fillText(city.name, px + 8, py + 3);
        }
      });

      ctx.restore();
      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [speed, isRotating, activeCity]);

  // Pointer drag interactions
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;

    rotation.current.y += dx * 0.006;
    rotation.current.x -= dy * 0.006;

    rotVelocity.current = { x: -dy * 0.002, y: dx * 0.002 };
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-neutral-800 bg-[#050711] text-white flex flex-col justify-between shadow-2xl selection:bg-indigo-500/30",
        className
      )}
    >
      {/* Top Header Overlay */}
      {showHeader && (
        <div className="relative z-10 p-6 flex flex-wrap items-center justify-between gap-4 pointer-events-none">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
                <Globe className="h-4 w-4 text-indigo-400" />
              </div>
              <h2 className="text-lg font-semibold tracking-tight text-white">
                Global Transaction Arcs
              </h2>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Real-time inter-continental payment routing across Tier-1 datacenters
            </p>
          </div>

          {/* Live Transaction Pill */}
          <div className="pointer-events-auto flex items-center gap-3 bg-neutral-900/80 border border-neutral-800 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-lg">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-neutral-300">
              {transactionCount.toLocaleString()} Settled
            </span>
            <button
              onClick={triggerTransaction}
              className="flex items-center gap-1 text-[11px] font-medium text-indigo-300 hover:text-white px-2 py-0.5 rounded bg-indigo-600/30 hover:bg-indigo-600/50 transition-colors"
            >
              <Send className="h-3 w-3" />
              <span>Emit Pulse</span>
            </button>
          </div>
        </div>
      )}

      {/* Interactive 3D Dotted Canvas */}
      <div
        className="relative flex-1 w-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full min-h-[360px]"
          style={{ width: "100%", height: "100%" }}
        />

        {/* Floating City Card Overlay */}
        <div className="absolute bottom-6 left-6 z-10 bg-neutral-900/80 border border-neutral-800/90 rounded-xl p-3 backdrop-blur-md text-xs shadow-xl hidden sm:block">
          <div className="flex items-center gap-1.5 text-neutral-400 font-mono text-[11px]">
            <MapPin className="h-3.5 w-3.5 text-indigo-400" />
            <span>Active Edge Node</span>
          </div>
          <div className="font-semibold text-white mt-0.5">{activeCity.name}</div>
          <div className="text-[10px] text-indigo-300 font-mono">{activeCity.region} &bull; 1.8ms RTT</div>
        </div>
      </div>

      {/* Interactive Controls Stage Footer */}
      {showControls && (
        <div className="relative z-10 px-6 py-4 border-t border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-neutral-400 font-medium">Focus Node:</span>
            {CITIES.map((c) => (
              <button
                key={c.name}
                onClick={() => setActiveCity(c)}
                className={cn(
                  "px-2.5 py-1 rounded text-xs transition-colors",
                  activeCity.name === c.name
                    ? "bg-indigo-600 text-white font-semibold"
                    : "bg-neutral-800/70 text-neutral-400 hover:text-white"
                )}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-neutral-400">
            <div className="flex items-center gap-2">
              <span>Spin Speed:</span>
              <input
                type="range"
                min="0.001"
                max="0.015"
                step="0.001"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-20 accent-indigo-500"
              />
            </div>

            <button
              onClick={() => setIsRotating(!isRotating)}
              className={cn(
                "p-1.5 rounded-lg border transition-colors flex items-center gap-1 text-xs",
                isRotating
                  ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                  : "bg-neutral-800/60 border-neutral-700 text-neutral-400"
              )}
              title={isRotating ? "Pause auto-rotation" : "Resume auto-rotation"}
            >
              {isRotating ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isRotating ? "Auto-Spin: ON" : "Paused"}</span>
            </button>

            <button
              onClick={resetOrientation}
              className="p-1.5 rounded-lg border border-neutral-700 bg-neutral-800/60 text-neutral-400 hover:text-white transition-colors"
              title="Reset sphere orientation"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GlobeArcs;
