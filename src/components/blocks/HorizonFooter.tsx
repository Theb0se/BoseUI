"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Github,
  Twitter,
  Disc as Discord,
  CheckCircle2,
  Mail,
  Sparkles,
} from "lucide-react";
import { CipherScrambleText } from "@/components/ui/CipherScrambleText";
import { cn } from "@/lib/utils";

export interface FooterLink {
  label: string;
  href: string;
  badge?: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface HorizonFooterProps {
  columns?: FooterColumn[];
  wordmark?: string;
  className?: string;
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: "Products",
    links: [
      { label: "Kinetic Primitives", href: "#" },
      { label: "Background Shaders", href: "#", badge: "New" },
      { label: "Composite Blocks", href: "#", badge: "26 Blocks" },
      { label: "Design Intelligence", href: "#" },
      { label: "Figma UI Kit", href: "#" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Documentation", href: "#" },
      { label: "CLI Tooling (boseui)", href: "#" },
      { label: "Component Registry", href: "#" },
      { label: "GitHub Repository", href: "#" },
      { label: "Release Changelog", href: "#" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "SaaS Dashboards", href: "#" },
      { label: "Fintech Rails", href: "#" },
      { label: "High-Growth Startups", href: "#" },
      { label: "Enterprise Design Systems", href: "#" },
      { label: "Developer Experience", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Manifesto", href: "#" },
      { label: "Careers", href: "#", badge: "Hiring" },
      { label: "Brand Assets", href: "#" },
      { label: "Security & Privacy", href: "#" },
      { label: "System Status", href: "#" },
    ],
  },
];

export function HorizonFooter({
  columns = DEFAULT_COLUMNS,
  wordmark = "BOSEUI",
  className,
}: HorizonFooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <footer
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[640px] overflow-hidden rounded-3xl bg-[#030712] text-white border border-neutral-800 shadow-2xl flex flex-col justify-between",
        className
      )}
    >
      {/* Background Planetary Horizon Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[140%] h-[320px] rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.2),rgba(59,130,246,0.05),transparent_70%)] blur-2xl" />
        <div className="absolute -bottom-64 left-1/2 -translate-x-1/2 w-[160%] h-[200px] border-t border-cyan-500/20 rounded-[100%]" />
      </div>

      {/* Foreground Content Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 md:py-16 lg:px-8 w-full">
        {/* Top Newsletter & Brand Header */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 pb-12 border-b border-neutral-800/80 items-center">
          <div className="lg:col-span-6 space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Fluid Kinetic Engineering</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Build stunning interfaces in minutes.
            </h3>
            <p className="text-sm text-neutral-400 max-w-md">
              Receive zero-latency updates on new shaders, production blocks, and motion engineering tips.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md lg:ml-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-neutral-700 bg-neutral-900/80 text-sm text-white placeholder-neutral-500 backdrop-blur-md focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="h-11 px-5 rounded-xl bg-white text-neutral-950 font-semibold text-sm transition-transform hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2"
              >
                {subscribed ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Middle Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {columns.map((col) => (
            <div key={col.title} className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-sm text-neutral-300 transition-colors hover:text-white"
                    >
                      <span>{link.label}</span>
                      {link.badge && (
                        <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-mono text-cyan-300 group-hover:border-cyan-400">
                          {link.badge}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Giant Cipher Wordmark and Legal Strip */}
        <div className="pt-8 border-t border-neutral-800/80 space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational · 99.99% Edge Uptime</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
              <div className="flex items-center gap-3 text-neutral-300">
                <a href="#" aria-label="GitHub" className="hover:text-white transition-colors"><Github className="h-4 w-4" /></a>
                <a href="#" aria-label="Twitter" className="hover:text-white transition-colors"><Twitter className="h-4 w-4" /></a>
                <a href="#" aria-label="Discord" className="hover:text-white transition-colors"><Discord className="h-4 w-4" /></a>
              </div>
            </div>
          </div>

          {/* Massive Scramble Wordmark Display */}
          <div className="text-center pt-4">
            <div className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/90 via-white/50 to-white/10 select-none">
              <CipherScrambleText
                text={wordmark}
                frameInterval={24}
                cyclesPerChar={3}
                className="font-mono tracking-widest"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default HorizonFooter;
