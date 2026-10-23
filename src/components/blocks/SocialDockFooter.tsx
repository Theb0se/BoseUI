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
} from "lucide-react";
import { ElasticDock, ElasticDockItem } from "@/components/ui/ElasticDock";
import { cn } from "@/lib/utils";

export interface SocialDockFooterProps {
  headline?: string;
  subheadline?: string;
  className?: string;
}

const SOCIAL_ITEMS: ElasticDockItem[] = [
  {
    id: "github",
    label: "GitHub (14.2k stars)",
    icon: <Github className="h-5 w-5 text-white" />,
  },
  {
    id: "twitter",
    label: "X / Twitter (@boseui)",
    icon: <Twitter className="h-5 w-5 text-sky-400" />,
  },
  {
    id: "discord",
    label: "Discord Community",
    icon: <Discord className="h-5 w-5 text-indigo-400" />,
    badge: 3,
  },
  {
    id: "youtube",
    label: "YouTube Channel",
    icon: <Youtube className="h-5 w-5 text-red-400" />,
  },
  {
    id: "linkedin",
    label: "LinkedIn Network",
    icon: <Linkedin className="h-5 w-5 text-blue-400" />,
  },
  {
    id: "figma",
    label: "Figma UI Kit",
    icon: <Figma className="h-5 w-5 text-rose-400" />,
  },
  {
    id: "email",
    label: "Developer Support",
    icon: <Mail className="h-5 w-5 text-emerald-400" />,
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
        <ElasticDock
          items={SOCIAL_ITEMS}
          baseSize={52}
          magnifiedSize={72}
          onSelect={(id) => {
            const found = SOCIAL_ITEMS.find((it) => it.id === id);
            if (found) setActiveItem(found.label);
          }}
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
