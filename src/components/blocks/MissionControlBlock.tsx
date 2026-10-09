"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  RefreshCw,
  Activity,
  Radio,
  Server,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { DigitalRadar } from "@/components/ui/DigitalRadar";
import { RollingNumberTicker } from "@/components/ui/RollingNumberTicker";
import { cn } from "@/lib/utils";

export interface MissionControlBlockProps {
  title?: string;
  tagline?: string;
  className?: string;
}

export function MissionControlBlock({
  title = "Autonomous Mission Control & Telemetry",
  tagline = "Live radar tracking of distributed edge clusters, anomalous traffic signatures, and real-time consensus telemetry.",
  className,
}: MissionControlBlockProps) {
  const [rps, setRps] = useState(48290);
  const [p99Latency, setP99Latency] = useState(12);
  const [uptime, setUptime] = useState(99.99);
  const [nodes, setNodes] = useState(240);
  const [radarColor, setRadarColor] = useState("#10B981");

  const handleSimulateSurge = () => {
    setRps(Math.floor(45000 + Math.random() * 25000));
    setP99Latency(Math.floor(11 + Math.random() * 6));
    setNodes(Math.floor(238 + Math.random() * 12));
  };

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[700px] overflow-hidden rounded-3xl bg-neutral-950 p-6 md:p-10 text-white border border-neutral-800 shadow-2xl",
        className
      )}
    >
      {/* Tactical Grid Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.08),transparent_70%)]" />

      {/* Top Header & Tactical Controls */}
      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-neutral-800 pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono text-emerald-400">
            <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-400" />
            <span>GLOBAL EDGE DEFENSE · ACTIVE</span>
          </div>

          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            {title}
          </h2>

          <p className="mt-1 text-sm text-neutral-400 max-w-2xl leading-relaxed">
            {tagline}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSimulateSurge}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-900 px-4 text-xs font-mono font-medium text-neutral-200 transition-colors hover:border-emerald-500/40 hover:bg-neutral-800"
          >
            <RefreshCw className="h-3.5 w-3.5 text-emerald-400" />
            <span>Simulate Traffic Surge</span>
          </button>
        </div>
      </div>

      {/* Center Radar Scope & Telemetry Viewport */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-8">
        {/* Radar Viewport */}
        <div className="lg:col-span-8 overflow-hidden rounded-2xl border border-neutral-800 bg-black/60 shadow-inner">
          <DigitalRadar
            color={radarColor}
            sweepSpeed={1.0}
            blipCount={12}
            rangeRings={4}
            showTelemetry={true}
            className="min-h-[440px] rounded-none border-0"
          >
            <div className="hidden" />
          </DigitalRadar>
        </div>

        {/* Tactical Status Cards */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-400">Cluster Consensus</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="mt-2 text-xl font-bold text-white">Raft Quorum Validated</p>
            <p className="mt-1 text-xs text-neutral-400">
              Zero split-brain events detected across 6 continental regions.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-400">DDoS Protection</span>
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
            </div>
            <p className="mt-2 text-xl font-bold text-white">Anycast Scrubbing Active</p>
            <p className="mt-1 text-xs text-neutral-400">
              Layer 7 polymorphic challenge pipeline mitigation under 800µs.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-400">Radar Spectrum</span>
              <div className="flex items-center gap-1.5">
                {["#10B981", "#06B6D4", "#F59E0B"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setRadarColor(c)}
                    style={{ backgroundColor: c }}
                    className={cn(
                      "h-3.5 w-3.5 rounded-full transition-transform hover:scale-125",
                      radarColor === c && "ring-2 ring-white ring-offset-2 ring-offset-neutral-900"
                    )}
                    aria-label={`Switch color to ${c}`}
                  />
                ))}
              </div>
            </div>
            <p className="mt-2 text-xs text-neutral-400">
              Toggle tactical phosphor coating between Emerald, Cyan, and Amber.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Live Rolling Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4 sm:p-5">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            <span>GLOBAL RPS</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <RollingNumberTicker
              value={rps}
              fontSize="lg"
              decimalPlaces={0}
              className="text-white font-bold"
            />
            <span className="text-xs font-mono text-neutral-400">req/s</span>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4 sm:p-5">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            <span>P99 LATENCY</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <RollingNumberTicker
              value={p99Latency}
              fontSize="lg"
              decimalPlaces={0}
              className="text-cyan-400 font-bold"
            />
            <span className="text-xs font-mono text-neutral-400">ms</span>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4 sm:p-5">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>UPTIME SLA</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <RollingNumberTicker
              value={uptime}
              fontSize="lg"
              decimalPlaces={2}
              className="text-emerald-400 font-bold"
            />
            <span className="text-xs font-mono text-neutral-400">%</span>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4 sm:p-5">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <Server className="h-3.5 w-3.5 text-purple-400" />
            <span>EDGE NODES</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <RollingNumberTicker
              value={nodes}
              fontSize="lg"
              decimalPlaces={0}
              className="text-white font-bold"
            />
            <span className="text-xs font-mono text-neutral-400">active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MissionControlBlock;
