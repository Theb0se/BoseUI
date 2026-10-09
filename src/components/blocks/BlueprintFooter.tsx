"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  Github,
  Twitter,
  ArrowUpRight,
} from "lucide-react";
import { KeycapChips } from "@/components/ui/KeycapChips";
import { cn } from "@/lib/utils";

export interface BlueprintFooterLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface BlueprintFooterColumn {
  title: string;
  links: BlueprintFooterLink[];
}

export interface BlueprintFooterProps {
  columns?: BlueprintFooterColumn[];
  className?: string;
}

const DEFAULT_COLUMNS: BlueprintFooterColumn[] = [
  {
    title: "Platform",
    links: [
      { label: "Edge Functions", href: "#" },
      { label: "Incremental Static Reg", href: "#" },
      { label: "Fluid Micro-frontends", href: "#" },
      { label: "Server Actions", href: "#" },
      { label: "Preview Environments", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Component Library", href: "#" },
      { label: "CLI Documentation", href: "#" },
      { label: "Templates Gallery", href: "#" },
      { label: "Performance Audits", href: "#" },
      { label: "Security & SOC2", href: "#" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "REST & GraphQL APIs", href: "#" },
      { label: "Node.js & Python SDKs", href: "#" },
      { label: "Next.js Integration", href: "#" },
      { label: "Turborepo Guides", href: "#" },
      { label: "GitHub Discussions", href: "#", isExternal: true },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Engineering Blog", href: "#" },
      { label: "Careers (We're Hiring)", href: "#" },
      { label: "Brand Assets", href: "#" },
      { label: "Contact Sales", href: "#" },
    ],
  },
];

export function BlueprintFooter({
  columns = DEFAULT_COLUMNS,
  className,
}: BlueprintFooterProps) {
  const [activeCell, setActiveCell] = useState<number | null>(null);

  return (
    <footer
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[620px] overflow-hidden rounded-3xl bg-[#070709] text-white border border-neutral-800 shadow-2xl",
        className
      )}
    >
      {/* Blueprint Hairline Grid Texture */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Main Container */}
      <div className="relative mx-auto max-w-7xl px-6 py-12 md:py-16 lg:px-8">
        {/* Top Architectural Header Bar with Plus crosses */}
        <div className="relative border-b border-neutral-800 pb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400" />
              <span>ARCHITECTURAL SYSTEM SPECIFICATION v3.0</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-white">
              Deterministic Frontend Infrastructure
            </h3>
          </div>

          {/* Keycap Quick Action Command Pill */}
          <div className="flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-2.5 backdrop-blur-md">
            <div className="text-xs font-mono text-neutral-400 pl-1 hidden sm:block">
              Quick Navigation
            </div>
            <KeycapChips
              keys={["⌘", "K"]}
              size="sm"
              variant="obsidian"
              inline={true}
              className="p-0 border-0 bg-transparent"
            />
          </div>
        </div>

        {/* Blueprint Columns with Cross Intersections */}
        <div className="relative grid grid-cols-2 md:grid-cols-4 border-b border-neutral-800 py-12">
          {columns.map((col, idx) => (
            <div
              key={col.title}
              onMouseEnter={() => setActiveCell(idx)}
              onMouseLeave={() => setActiveCell(null)}
              className={cn(
                "relative p-6 transition-colors",
                idx !== columns.length - 1 && "md:border-r border-neutral-800/80",
                activeCell === idx && "bg-neutral-900/40"
              )}
            >
              {/* Corner Plus Cross Marker */}
              <span className="absolute -top-2 -left-2 select-none font-mono text-xs text-neutral-600 transition-colors group-hover:text-cyan-400">
                +
              </span>

              <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-5 flex items-center gap-2">
                <span className="text-[10px] text-cyan-400">0{idx + 1} //</span>
                <span>{col.title}</span>
              </h4>

              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-sm text-neutral-300 transition-colors hover:text-white"
                    >
                      <span>{link.label}</span>
                      {link.isExternal && (
                        <ArrowUpRight className="h-3 w-3 text-neutral-500 group-hover:text-neutral-300" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Blueprint Telemetry & System Status Row */}
        <div className="relative pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>All Systems Operational</span>
            </div>
            <span className="text-neutral-600">|</span>
            <span>Edge TTFB: 0.8ms</span>
            <span className="text-neutral-600">|</span>
            <span>Security: SOC2 Type II Certified</span>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-neutral-400">
            <span>© {new Date().getFullYear()} BoseUI Systems</span>
            <a href="#" className="hover:text-white transition-colors">Security</a>
            <a href="#" className="hover:text-white transition-colors">Telemetry</a>
            <div className="flex items-center gap-3 text-neutral-300 pl-2">
              <a href="#" aria-label="GitHub" className="hover:text-white transition-colors">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-white transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default BlueprintFooter;
