"use client";

import React, { useState } from "react";
import {
  Compass,
  Search,
  ArrowRight,
  Home,
  Rocket,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { SplitFlapText } from "@/components/ui/SplitFlapText";
import { cn } from "@/lib/utils";

export interface NotFound404BlockProps {
  title?: string;
  description?: string;
  className?: string;
}

export function NotFound404Block({
  title = "Orbit coordinates lost in deep space",
  description = "The requested navigation beacon or component route does not exist in this sector. Recalibrate sensors or return to the registry.",
  className,
}: NotFound404BlockProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[640px] overflow-hidden rounded-3xl bg-[#04060d] text-white border border-neutral-800 shadow-2xl flex flex-col justify-between items-center p-6 sm:p-12",
        className
      )}
    >
      {/* Background Deep Space Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-rose-500/10 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Top Sector Status Pill */}
      <div className="relative z-10 pt-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-xs font-mono text-rose-300 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
          <span>SECTOR 404 // BEACON UNREACHABLE</span>
        </div>
      </div>

      {/* Center 404 Mechanical Board & Search */}
      <div className="relative z-10 max-w-xl text-center space-y-6 my-auto py-8">
        {/* Split Flap Mechanical Airport Display */}
        <div className="flex justify-center">
          <SplitFlapText
            words={["404 ERROR", "LOST VOID", "OFF ORBIT", "NULL PATH"]}
            stiffness={340}
            damping={22}
            className="border-neutral-800 bg-neutral-900/90 backdrop-blur-xl shadow-2xl"
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
            {title}
          </h1>
          <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Quick Component Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search registry components (e.g. Buttons, Shaders)..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-neutral-700 bg-neutral-900/90 text-sm text-white placeholder-neutral-500 backdrop-blur-md focus:border-cyan-400 focus:outline-none"
          />
        </div>

        {/* Action Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-neutral-950 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home className="h-4 w-4" />
            <span>Return to Orbit</span>
          </a>

          <a
            href="/blocks"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-900/80 px-5 text-sm font-medium text-neutral-200 backdrop-blur-md transition-colors hover:bg-neutral-800 hover:text-white"
          >
            <Rocket className="h-4 w-4 text-cyan-400" />
            <span>Browse 26 Blocks</span>
            <ArrowRight className="h-3.5 w-3.5 text-neutral-400" />
          </a>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="relative z-10 text-xs font-mono text-neutral-500 flex items-center gap-2">
        <Compass className="h-3.5 w-3.5 text-neutral-400" />
        <span>Sub-Space Trajectory: Parallax Delta ±0.04 AU</span>
      </div>
    </div>
  );
}

export default NotFound404Block;
