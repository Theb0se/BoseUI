"use client";

import React, { useState } from "react";
import {
  Github,
  Twitter,
  Disc as Discord,
  Youtube,
  Linkedin,
  Figma,
  Mail,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { DockMagnification, DockAppItem } from "@/components/ui/DockMagnification";
import { cn } from "@/lib/utils";

export interface SocialDockFooterProps {
  headline?: string;
  subheadline?: string;
  className?: string;
}

const SOCIAL_ITEMS: DockAppItem[] = [
  {
    id: "github",
    name: "GitHub (14.2k stars)",
    icon: Github,
    color: "#FFFFFF",
    gradient: "from-neutral-800 to-neutral-950",
    isRunning: true,
  },
  {
    id: "twitter",
    name: "X / Twitter (@boseui)",
    icon: Twitter,
    color: "#38BDF8",
    gradient: "from-sky-900 to-neutral-950",
    isRunning: true,
  },
  {
    id: "discord",
    name: "Discord Community",
    icon: Discord,
    color: "#818CF8",
    gradient: "from-indigo-900 to-neutral-950",
    notificationCount: 3,
  },
  {
    id: "youtube",
    name: "YouTube Channel",
    icon: Youtube,
    color: "#F87171",
    gradient: "from-red-900 to-neutral-950",
  },
  {
    id: "linkedin",
    name: "LinkedIn Network",
    icon: Linkedin,
    color: "#60A5FA",
    gradient: "from-blue-900 to-neutral-950",
  },
  {
    id: "figma",
    name: "Figma UI Kit",
    icon: Figma,
    color: "#F43F5E",
    gradient: "from-rose-900 to-neutral-950",
  },
  {
    id: "email",
    name: "Developer Support",
    icon: Mail,
    color: "#34D399",
    gradient: "from-emerald-900 to-neutral-950",
    isRunning: true,
  },
];

export function SocialDockFooter({
  headline = "Connect with the Open Source Community",
  subheadline = "Join over 12,000+ engineers building fluid, physics-based user interfaces.",
  className,
}: SocialDockFooterProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  return (
    <footer
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[540px] overflow-hidden rounded-3xl bg-neutral-950 text-white border border-neutral-800 shadow-2xl flex flex-col justify-between p-6 sm:p-10",
        className
      )}
    >
      {/* Ambient gradient aura behind dock */}
      <div className="pointer-events-none absolute inset-x-0 bottom-12 h-64 bg-gradient-to-t from-sky-500/10 via-purple-500/5 to-transparent blur-3xl" />

      {/* Top Header Section */}
      <div className="relative z-10 text-center max-w-2xl mx-auto pt-6 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3.5 py-1 text-xs font-mono text-sky-300">
          <Sparkles className="h-3.5 w-3.5 text-sky-400" />
          <span>GLOBAL DEVELOPER CHANNELS</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
          {headline}
        </h2>

        <p className="text-sm text-neutral-400 max-w-lg mx-auto">
          {subheadline}
        </p>
      </div>

      {/* Center Interactive macOS Dock Bar */}
      <div className="relative z-10 my-10 flex flex-col items-center justify-center">
        <DockMagnification
          items={SOCIAL_ITEMS}
          baseSize={54}
          magnification={1.75}
          distance={160}
          embedded={true}
          onItemClick={(item) => setActiveItem(item.name)}
          className="shadow-2xl"
        />

        {activeItem && (
          <p className="mt-4 text-xs font-mono text-cyan-400 animate-in fade-in">
            Selected: {activeItem}
          </p>
        )}
      </div>

      {/* Bottom Legal & Operational Row */}
      <div className="relative z-10 border-t border-neutral-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>All channels active · Community response SLA &lt; 2h</span>
        </div>

        <div className="flex items-center gap-6">
          <span>© {new Date().getFullYear()} BoseUI Systems</span>
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <a href="#" className="hover:text-white transition-colors">License (MIT)</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
        </div>
      </div>
    </footer>
  );
}

export default SocialDockFooter;
