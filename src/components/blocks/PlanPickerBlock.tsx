"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Network,
  Server,
  Globe,
  Sliders,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HoverRevealFeatureGrid } from "@/components/ui/HoverRevealFeatureGrid";

export interface PlanPickerBlockProps {
  /** Optional title override */
  title?: string;
  /** Optional subtitle override */
  description?: string;
  className?: string;
}

interface ArchitectureTier {
  id: string;
  tag: string;
  name: string;
  price: string;
  period: string;
  popular?: boolean;
  accent: string;
  glowColor: string;
  summary: string;
  specs: {
    vpc: string;
    auth: string;
    sla: string;
    rateLimit: string;
  };
  revealedSpecs: string;
  badge: string;
}

const ARCHITECTURE_TIERS: ArchitectureTier[] = [
  {
    id: "edge-starter",
    tag: "TIER 01 // PROTOTYPE",
    name: "Edge Starter",
    price: "$49",
    period: "/ month",
    accent: "text-blue-400",
    glowColor: "rgba(59, 130, 246, 0.25)",
    badge: "Shared Edge",
    summary: "Multi-tenant sandboxed execution for early development and testing.",
    specs: {
      vpc: "Shared Global Edge Mesh",
      auth: "OAuth 2.0 & API Keys",
      sla: "99.9% Availability SLA",
      rateLimit: "5,000 req/min Burst Limit",
    },
    revealedSpecs:
      "V8 isolates spun up on demand across 310 global edge nodes. Includes community Slack support and automated GitHub CI/CD webhooks.",
  },
  {
    id: "dedicated-vpc",
    tag: "TIER 02 // PRODUCTION",
    name: "Dedicated VPC",
    price: "$199",
    period: "/ month",
    accent: "text-cyan-400",
    glowColor: "rgba(6, 182, 212, 0.25)",
    badge: "Isolated VPC",
    summary: "Dedicated isolated cluster with private IP peering and wireguard encryption.",
    specs: {
      vpc: "Dedicated VPC Peering (AWS/GCP)",
      auth: "OAuth + Team Role RBAC",
      sla: "99.95% High Availability",
      rateLimit: "25,000 req/min Rate Limits",
    },
    revealedSpecs:
      "Isolated network perimeter with private transit gateway routing, zero egress fees within availability zone, and 24h ticketing turnaround.",
  },
  {
    id: "enterprise-scale",
    tag: "TIER 03 // MISSION CRITICAL",
    name: "Enterprise Scale",
    price: "$499",
    period: "/ month",
    popular: true,
    accent: "text-indigo-400",
    glowColor: "rgba(99, 102, 241, 0.35)",
    badge: "99.99% SLA",
    summary: "Dual-region active-active cluster with enterprise identity governance.",
    specs: {
      vpc: "Multi-Region VPC Anycast",
      auth: "SSO / SAML & Okta/Azure AD",
      sla: "99.99% Financial Uptime SLA",
      rateLimit: "100,000 req/min Custom Limits",
    },
    revealedSpecs:
      "Full SAML 2.0 / SCIM directory syncing, SOC2 Type II automated compliance reporting, and 15-minute emergency response SLA from dedicated architects.",
  },
  {
    id: "sovereign-cloud",
    tag: "TIER 04 // GOVERNANCE",
    name: "Sovereign Cloud",
    price: "Custom",
    period: "annual contract",
    accent: "text-purple-400",
    glowColor: "rgba(168, 85, 247, 0.3)",
    badge: "Air-Gapped",
    summary: "Single-tenant air-gapped on-premise installation with hardware cryptographic modules.",
    specs: {
      vpc: "Air-Gapped On-Premise VPC",
      auth: "Hardware Token HSM + SCIM",
      sla: "99.999% Zero-Downtime SLA",
      rateLimit: "Unbounded Rate Limits",
    },
    revealedSpecs:
      "Complete source code escrow, air-gapped Kubernetes helm charts, bespoke data sovereignty compliance, and dedicated named principal engineer.",
  },
];

export function PlanPickerBlock({
  title = "Interactive Architecture Plan Picker",
  description = "Hover over each architectural blueprint to project radial spotlight diagnostics and reveal deep infrastructure specifications.",
  className,
}: PlanPickerBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedTier, setSelectedTier] = useState<string>("enterprise-scale");
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [showBentoSpecs, setShowBentoSpecs] = useState<boolean>(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos(null);
    setHoveredTier(null);
  }, []);

  return (
    <div
      data-fullscreen-scroll
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative w-full min-h-[540px] overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-[#07080D] p-6 sm:p-8 md:p-10 text-neutral-900 dark:text-white shadow-xl flex flex-col justify-between",
        className
      )}
    >
      {/* Background radial glow driven by cursor */}
      {mousePos && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 420px at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.15), transparent 80%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Header */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <Network className="h-3.5 w-3.5" />
          <span>ENTERPRISE TOPOLOGY MATRIX</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {title}
        </h2>

        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {description}
        </p>
      </div>

      {/* 4 Interactive Tier Tiles Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 my-8 items-stretch">
        {ARCHITECTURE_TIERS.map((tier) => {
          const isSelected = selectedTier === tier.id;
          const isHovered = hoveredTier === tier.id;

          return (
            <div
              key={tier.id}
              onMouseEnter={() => setHoveredTier(tier.id)}
              onMouseLeave={() => setHoveredTier(null)}
              onClick={() => setSelectedTier(tier.id)}
              className={cn(
                "relative group cursor-pointer flex flex-col justify-between rounded-xl p-5 sm:p-6 transition-all duration-300 border select-none",
                isSelected
                  ? "border-indigo-500/90 bg-white/95 dark:bg-neutral-900/95 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/30"
                  : "border-neutral-200/90 dark:border-neutral-800/90 bg-white/70 dark:bg-neutral-900/40 hover:border-neutral-400 dark:hover:border-neutral-700"
              )}
            >
              {/* Radial spotlight projection for individual tile */}
              <div
                className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle 260px at center, ${tier.glowColor}, transparent 75%)`,
                }}
                aria-hidden="true"
              />

              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                  Recommended
                </div>
              )}

              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                  <span>{tier.tag}</span>
                  <span className={cn("font-bold px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 text-[10px]", tier.accent)}>
                    {tier.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-2">
                  {tier.name}
                </h3>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 min-h-[32px]">
                  {tier.summary}
                </p>

                {/* Price */}
                <div className="my-4 flex items-baseline gap-1 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-900 dark:text-white">
                    {tier.price}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {tier.period}
                  </span>
                </div>

                {/* Granular Architecture Specs */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                    <Server className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    <span className="font-medium truncate">{tier.specs.vpc}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                    <Lock className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    <span className="font-medium truncate">{tier.specs.auth}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                    <ShieldCheck className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    <span className="font-medium truncate">{tier.specs.sla}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                    <Zap className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    <span className="font-medium truncate">{tier.specs.rateLimit}</span>
                  </div>
                </div>

                {/* Granular Revealed Specs Container on Hover */}
                <div
                  className={cn(
                    "mt-4 rounded-lg border border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/30 p-2.5 text-[11px] text-neutral-600 dark:text-neutral-300 transition-all duration-300",
                    isHovered || isSelected ? "opacity-100 max-h-32" : "opacity-75 max-h-32"
                  )}
                >
                  <div className="font-semibold text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    <span>Diagnostics:</span>
                  </div>
                  <p className="leading-relaxed">{tier.revealedSpecs}</p>
                </div>
              </div>

              {/* Bottom selection indicator */}
              <div className="mt-5 pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                  {isSelected ? "Active Blueprint" : "Click to select"}
                </span>
                <div
                  className={cn(
                    "h-5 w-5 rounded-full flex items-center justify-center transition-colors",
                    isSelected
                      ? "bg-indigo-600 text-white"
                      : "border border-neutral-300 dark:border-neutral-700 text-transparent"
                  )}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expandable Deep Feature Grid drawer leveraging HoverRevealFeatureGrid */}
      <div className="relative z-10 flex flex-col items-center mt-2 mb-4">
        <button
          type="button"
          onClick={() => setShowBentoSpecs((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 px-5 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
        >
          <Sliders className="h-3.5 w-3.5 text-indigo-500" />
          <span>{showBentoSpecs ? "Hide deep runtime diagnostics" : "View low-level V8 & telemetry bento grid"}</span>
        </button>

        <AnimatePresence>
          {showBentoSpecs && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="w-full mt-6 overflow-hidden"
            >
              <HoverRevealFeatureGrid
                spotlightColor="indigo"
                spotlightRadius={380}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer bar */}
      <div className="relative z-10 border-t border-neutral-200/60 dark:border-neutral-800/60 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 gap-2">
        <span>Selected: <strong className="text-neutral-900 dark:text-white capitalize">{selectedTier.replace("-", " ")}</strong> architecture blueprint.</span>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-1.5 text-xs transition-colors cursor-pointer"
        >
          <span>Confirm & Deploy Stack</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
