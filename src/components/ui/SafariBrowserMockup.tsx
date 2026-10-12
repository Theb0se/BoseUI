"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  RotateCw,
  Share,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SafariBrowserMockupProps {
  /** URL displayed in the address bar. Default: "https://boseui.site" */
  url?: string;
  /** Active page title */
  title?: string;
  /** Show top tab bar. Default: true */
  showTabs?: boolean;
  /** Optional screenshot image URL */
  imageSrc?: string;
  /** Content rendered inside the browser viewport */
  children?: React.ReactNode;
  className?: string;
}

export function SafariBrowserMockup({
  url = "https://boseui.site",
  title = "BoseUI — Architectural UI Components",
  showTabs = true,
  imageSrc,
  children,
  className,
}: SafariBrowserMockupProps) {
  const [currentUrl, setCurrentUrl] = useState(url);
  const [isReloading, setIsReloading] = useState(false);

  const handleReload = () => {
    setIsReloading(true);
    setTimeout(() => setIsReloading(false), 800);
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all select-none",
        className
      )}
    >
      {/* Top Safari Chrome Toolbar */}
      <div className="flex flex-col border-b border-border bg-muted/40">
        {/* Row 1: Traffic Lights + Unified Address Bar + Actions */}
        <div className="flex h-12 w-full items-center justify-between gap-3 px-4">
          {/* Traffic Lights */}
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
            <span className="h-3 w-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
            <span className="h-3 w-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
          </div>

          {/* Navigation Arrows */}
          <div className="hidden sm:flex items-center gap-1 text-muted-foreground/60">
            <button
              type="button"
              aria-label="Back"
              className="p-1 rounded-md hover:bg-foreground/5 hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Forward"
              className="p-1 rounded-md hover:bg-foreground/5 hover:text-foreground transition-colors disabled:opacity-40"
              disabled
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Central Unified Address Bar Pill */}
          <div className="flex flex-1 max-w-md items-center justify-between rounded-xl border border-border/80 bg-background/80 px-3 py-1.5 shadow-xs backdrop-blur-md">
            <div className="flex items-center gap-1.5 min-w-0">
              <Lock className="h-3 w-3 shrink-0 text-emerald-500" />
              <input
                type="text"
                value={currentUrl}
                onChange={(e) => setCurrentUrl(e.target.value)}
                className="w-full bg-transparent text-xs font-mono text-foreground/80 focus:outline-none truncate"
                aria-label="Address bar"
              />
            </div>
            <button
              type="button"
              onClick={handleReload}
              aria-label="Reload page"
              className="p-0.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCw className={cn("h-3 w-3", isReloading && "animate-spin")} />
            </button>
          </div>

          {/* Right Action Icons: Share + Privacy */}
          <div className="flex items-center gap-1 text-muted-foreground/60">
            <button
              type="button"
              aria-label="Share"
              className="p-1.5 rounded-md hover:bg-foreground/5 hover:text-foreground transition-colors"
            >
              <Share className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label="New tab"
              className="p-1.5 rounded-md hover:bg-foreground/5 hover:text-foreground transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Row 2: Safari Tab Bar */}
        {showTabs && (
          <div className="flex items-center gap-1 px-3 pb-1.5 overflow-x-auto text-xs">
            <div className="flex items-center gap-2 rounded-lg bg-background border border-border px-3 py-1 shadow-2xs font-medium text-foreground max-w-[200px] truncate">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">{title}</span>
            </div>
          </div>
        )}
      </div>

      {/* Browser Viewport Screen */}
      <div className="relative min-h-[260px] overflow-hidden bg-background">
        {children ? (
          children
        ) : imageSrc ? (
          <div className="relative w-full aspect-[16/10] overflow-hidden">
            <img
              src={imageSrc}
              alt="Browser viewport"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="relative w-full aspect-[16/10] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop"
              alt="SaaS Analytics Dashboard"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>
        )}
      </div>
    </div>
  );
}
