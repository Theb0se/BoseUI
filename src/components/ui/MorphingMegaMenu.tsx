"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Receipt,
  Network,
  Smartphone,
  Layers,
  Building2,
  ShoppingCart,
  Globe2,
  BookOpen,
  Code2,
  Terminal,
  Cpu,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  id: string;
  label: string;
}

export interface MorphingMegaMenuProps {
  className?: string;
  stiffness?: number;
  damping?: number;
  embedded?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: "products", label: "Products" },
  { id: "solutions", label: "Solutions" },
  { id: "developers", label: "Developers" },
];

export function MorphingMegaMenu({
  className,
  stiffness = 380,
  damping = 30,
  embedded = false,
}: MorphingMegaMenuProps) {
  const [activeTab, setActiveTab] = useState<string | null>("products");
  const [navCoords, setNavCoords] = useState<{
    left: number;
    width: number;
    height: number;
    arrowX: number;
  }>({ left: 0, width: 480, height: 320, arrowX: 100 });

  const navRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const panelRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const [activeStiffness, setActiveStiffness] = useState(stiffness);
  const [activeDamping, setActiveDamping] = useState(damping);
  const [pinOpen, setPinOpen] = useState(false);

  // Measure and align popover when active tab changes
  useEffect(() => {
    if (!activeTab || !navRef.current) return;
    const tabEl = tabRefs.current[activeTab];
    const panelEl = panelRefs.current[activeTab];
    const navRect = navRef.current.getBoundingClientRect();

    if (tabEl && panelEl) {
      const tabRect = tabEl.getBoundingClientRect();
      const panelRect = panelEl.getBoundingClientRect();

      const tabCenter = tabRect.left + tabRect.width / 2 - navRect.left;
      const targetLeft = Math.max(16, tabCenter - panelRect.width / 2);
      const arrowX = tabCenter - targetLeft;

      setNavCoords({
        left: targetLeft,
        width: panelRect.width,
        height: panelRect.height,
        arrowX,
      });
    }
  }, [activeTab]);

  const handleMouseEnterTab = (id: string) => {
    setActiveTab(id);
  };

  if (embedded) {
    return (
      <div
        ref={navRef}
        onMouseLeave={() => {
          if (!pinOpen) setActiveTab(null);
        }}
        className={cn("relative flex items-center", className)}
      >
        {/* Main Nav Items */}
        <nav className="flex items-center space-x-1" role="menubar">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  tabRefs.current[item.id] = el;
                }}
                onMouseEnter={() => handleMouseEnterTab(item.id)}
                onClick={() => setActiveTab(activeTab === item.id ? null : item.id)}
                aria-expanded={isActive}
                className={cn(
                  "relative px-4 py-1.5 text-sm font-medium transition-colors rounded-lg",
                  isActive
                    ? "text-white"
                    : "text-neutral-400 hover:text-neutral-200"
                )}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="navTabPillEmbedded"
                    className="absolute inset-0 rounded-lg bg-neutral-800/80 -z-10"
                    transition={{
                      type: "spring",
                      stiffness: activeStiffness,
                      damping: activeDamping,
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Morphing Popover Floating Container */}
        <AnimatePresence>
          {activeTab && (
            <motion.div
              initial={false}
              animate={{
                x: navCoords.left,
                width: navCoords.width,
                height: navCoords.height,
                opacity: 1,
                scale: 1,
              }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: activeStiffness,
                damping: activeDamping,
              }}
              className="absolute top-full mt-3 left-0 z-50 overflow-hidden rounded-2xl border border-neutral-700/60 bg-[#0d101f]/95 shadow-2xl backdrop-blur-2xl"
              style={{
                boxShadow:
                  "0 20px 50px -10px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
              }}
            >
              {/* Synchronized Caret / Arrow */}
              <motion.div
                className="absolute -top-1.5 z-50 h-3 w-3 rotate-45 border-l border-t border-neutral-700/60 bg-[#0d101f]"
                animate={{ x: navCoords.arrowX - 6 }}
                transition={{
                  type: "spring",
                  stiffness: activeStiffness,
                  damping: activeDamping,
                }}
              />

              {/* Dropdown Panels Container */}
              <div className="relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {activeTab === "products" && (
                    <motion.div
                      key="products"
                      ref={(el) => {
                        panelRefs.current["products"] = el;
                      }}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ duration: 0.18 }}
                      className="w-[520px] p-6"
                    >
                      <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4 flex items-center gap-2">
                        <Layers className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Core Infrastructure</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <PanelItem
                          icon={<CreditCard className="h-5 w-5 text-indigo-400" />}
                          title="Payments"
                          description="Online card payments and multi-currency checkout"
                        />
                        <PanelItem
                          icon={<Receipt className="h-5 w-5 text-emerald-400" />}
                          title="Billing"
                          description="Smart subscription lifecycles and usage metering"
                        />
                        <PanelItem
                          icon={<Network className="h-5 w-5 text-cyan-400" />}
                          title="Connect"
                          description="Marketplace payouts and seller onboarding"
                        />
                        <PanelItem
                          icon={<Smartphone className="h-5 w-5 text-violet-400" />}
                          title="Terminal"
                          description="In-person POS readers and hardware integration"
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "solutions" && (
                    <motion.div
                      key="solutions"
                      ref={(el) => {
                        panelRefs.current["solutions"] = el;
                      }}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ duration: 0.18 }}
                      className="w-[480px] p-6"
                    >
                      <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4 flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                        <span>Engineered by Industry</span>
                      </div>
                      <div className="space-y-3">
                        <PanelItem
                          icon={<Building2 className="h-5 w-5 text-amber-400" />}
                          title="SaaS & Subscription"
                          description="Predictable recurring revenues and automated billing"
                        />
                        <PanelItem
                          icon={<Globe2 className="h-5 w-5 text-blue-400" />}
                          title="Global Platforms"
                          description="Multi-sided marketplaces with split payments"
                        />
                        <PanelItem
                          icon={<ShoppingCart className="h-5 w-5 text-rose-400" />}
                          title="E-Commerce Stores"
                          description="Frictionless conversion and instant localized checkout"
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "developers" && (
                    <motion.div
                      key="developers"
                      ref={(el) => {
                        panelRefs.current["developers"] = el;
                      }}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ duration: 0.18 }}
                      className="w-[500px] p-6"
                    >
                      <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4 flex items-center gap-2">
                        <Code2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Documentation & APIs</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <PanelItem
                          icon={<BookOpen className="h-5 w-5 text-emerald-400" />}
                          title="Documentation"
                          description="Full architectural guides and code quickstarts"
                        />
                        <PanelItem
                          icon={<Terminal className="h-5 w-5 text-indigo-400" />}
                          title="API Reference"
                          description="Deterministic REST endpoints and SDK client libraries"
                        />
                        <PanelItem
                          icon={<Cpu className="h-5 w-5 text-purple-400" />}
                          title="Webhooks & Events"
                          description="Real-time distributed stream notifications"
                        />
                        <PanelItem
                          icon={<Zap className="h-5 w-5 text-yellow-400" />}
                          title="Sandbox Playground"
                          description="Test API keys and test credit card numbers"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-neutral-800 bg-[#070913] p-6 text-white flex flex-col justify-between shadow-2xl selection:bg-indigo-500/30",
        className
      )}
    >
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-96 w-[640px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-500/10 blur-[120px]" />
        <div className="absolute -bottom-32 left-1/4 h-80 w-[420px] rounded-full bg-blue-600/10 blur-[100px]" />
      </div>

      {/* Top Header / Demo Navbar Area */}
      <div className="relative z-20 w-full max-w-4xl mx-auto pt-2">
        <div className="flex items-center justify-between pb-6 border-b border-neutral-800/80">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              PulseEngine
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono">
              v3.2
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <span className="hidden sm:inline">Stripe-style morphing popover</span>
            <button
              onClick={() => setPinOpen(!pinOpen)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-colors border",
                pinOpen
                  ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                  : "bg-neutral-800/60 border-neutral-700/50 text-neutral-400 hover:text-white"
              )}
            >
              {pinOpen ? "Pinned Open" : "Pin Menu"}
            </button>
          </div>
        </div>

        {/* Navigation Bar */}
        <div
          ref={navRef}
          onMouseLeave={() => {
            if (!pinOpen) setActiveTab(null);
          }}
          className="relative mt-6 flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-2.5 backdrop-blur-xl"
        >
          {/* Main Nav Items */}
          <nav className="flex items-center space-x-1" role="menubar">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    tabRefs.current[item.id] = el;
                  }}
                  onMouseEnter={() => handleMouseEnterTab(item.id)}
                  onClick={() => setActiveTab(item.id)}
                  aria-expanded={isActive}
                  className={cn(
                    "relative px-4 py-1.5 text-sm font-medium transition-colors rounded-lg",
                    isActive
                      ? "text-white"
                      : "text-neutral-400 hover:text-neutral-200"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="navTabPill"
                      className="absolute inset-0 rounded-lg bg-neutral-800/80 -z-10"
                      transition={{
                        type: "spring",
                        stiffness: activeStiffness,
                        damping: activeDamping,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3 text-sm">
            <button className="text-neutral-400 hover:text-white text-xs font-medium transition-colors">
              Sign in
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all">
              <span>Start Free</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Morphing Popover Floating Container */}
          <AnimatePresence>
            {activeTab && (
              <motion.div
                initial={false}
                animate={{
                  x: navCoords.left,
                  width: navCoords.width,
                  height: navCoords.height,
                  opacity: 1,
                  scale: 1,
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: activeStiffness,
                  damping: activeDamping,
                }}
                className="absolute top-full mt-3 left-0 z-50 overflow-hidden rounded-2xl border border-neutral-700/60 bg-[#0d101f]/95 shadow-2xl backdrop-blur-2xl"
                style={{
                  boxShadow:
                    "0 20px 50px -10px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
                }}
              >
                {/* Synchronized Caret / Arrow */}
                <motion.div
                  className="absolute -top-1.5 z-50 h-3 w-3 rotate-45 border-l border-t border-neutral-700/60 bg-[#0d101f]"
                  animate={{ x: navCoords.arrowX - 6 }}
                  transition={{
                    type: "spring",
                    stiffness: activeStiffness,
                    damping: activeDamping,
                  }}
                />

                {/* Dropdown Panels Container */}
                <div className="relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    {activeTab === "products" && (
                      <motion.div
                        key="products"
                        ref={(el) => {
                          panelRefs.current["products"] = el;
                        }}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16 }}
                        transition={{ duration: 0.18 }}
                        className="w-[520px] p-6"
                      >
                        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4 flex items-center gap-2">
                          <Layers className="h-3.5 w-3.5 text-indigo-400" />
                          <span>Core Infrastructure</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <PanelItem
                            icon={<CreditCard className="h-5 w-5 text-indigo-400" />}
                            title="Payments"
                            description="Online card payments and multi-currency checkout"
                          />
                          <PanelItem
                            icon={<Receipt className="h-5 w-5 text-emerald-400" />}
                            title="Billing"
                            description="Smart subscription lifecycles and usage metering"
                          />
                          <PanelItem
                            icon={<Network className="h-5 w-5 text-cyan-400" />}
                            title="Connect"
                            description="Marketplace payouts and seller onboarding"
                          />
                          <PanelItem
                            icon={<Smartphone className="h-5 w-5 text-amber-400" />}
                            title="Terminal"
                            description="Custom in-person POS hardware and EMV tap"
                          />
                        </div>

                        <div className="mt-5 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                          <span className="flex items-center gap-1.5 text-indigo-300 font-medium">
                            <Sparkles className="h-3.5 w-3.5" />
                            Radar Fraud Defense included
                          </span>
                          <a
                            href="#all-products"
                            className="text-neutral-300 hover:text-white flex items-center gap-1 group"
                          >
                            <span>Explore all 24 products</span>
                            <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                          </a>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "solutions" && (
                      <motion.div
                        key="solutions"
                        ref={(el) => {
                          panelRefs.current["solutions"] = el;
                        }}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16 }}
                        transition={{ duration: 0.18 }}
                        className="w-[460px] p-6"
                      >
                        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4 flex items-center gap-2">
                          <Building2 className="h-3.5 w-3.5 text-purple-400" />
                          <span>Tailored by Business Model</span>
                        </div>
                        <div className="space-y-3">
                          <SolutionRow
                            icon={<Zap className="h-4 w-4 text-purple-400" />}
                            title="SaaS & Software"
                            desc="Optimize recurring revenue with automated dunning"
                          />
                          <SolutionRow
                            icon={<Globe2 className="h-4 w-4 text-blue-400" />}
                            title="Platforms & Marketplaces"
                            desc="Route splits and escrow payouts across 135+ currencies"
                          />
                          <SolutionRow
                            icon={<ShoppingCart className="h-4 w-4 text-pink-400" />}
                            title="Global E-commerce"
                            desc="Single-click mobile checkout with Apple Pay & Google Pay"
                          />
                        </div>
                        <div className="mt-4 pt-3 border-t border-neutral-800/80 text-xs text-neutral-400 flex items-center justify-between">
                          <span>Enterprise Tier Available</span>
                          <a href="#solutions" className="text-purple-400 hover:underline">
                            Case studies &rarr;
                          </a>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "developers" && (
                      <motion.div
                        key="developers"
                        ref={(el) => {
                          panelRefs.current["developers"] = el;
                        }}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16 }}
                        transition={{ duration: 0.18 }}
                        className="w-[490px] p-6"
                      >
                        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4 flex items-center gap-2">
                          <Code2 className="h-3.5 w-3.5 text-cyan-400" />
                          <span>Developer Tools & APIs</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <DevItem
                            icon={<BookOpen className="h-4 w-4 text-cyan-400" />}
                            title="Documentation"
                            desc="Quickstarts & recipes"
                          />
                          <DevItem
                            icon={<Terminal className="h-4 w-4 text-emerald-400" />}
                            title="API Reference"
                            desc="REST & OpenAPI schemas"
                          />
                          <DevItem
                            icon={<Cpu className="h-4 w-4 text-violet-400" />}
                            title="Client SDKs"
                            desc="Node, Python, Go, iOS"
                          />
                          <DevItem
                            icon={<ShieldCheck className="h-4 w-4 text-amber-400" />}
                            title="Test Sandboxes"
                            desc="Mock clock & webhooks"
                          />
                        </div>
                        <div className="mt-4 pt-3 border-t border-neutral-800/80 bg-neutral-900/60 -mx-6 -mb-6 px-6 py-3 rounded-b-2xl flex items-center justify-between text-xs">
                          <code className="text-neutral-400 font-mono text-[11px]">
                            npm i @pulse/sdk
                          </code>
                          <span className="text-neutral-400">99.999% SLA Uptime</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Interactive Controls Stage Preview */}
      <div className="relative z-10 mt-20 pt-6 border-t border-neutral-800/80">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-neutral-400">
            <span className="font-medium text-neutral-300">Hover / Preview Target:</span>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "px-2.5 py-1 rounded-md font-mono transition-colors",
                  activeTab === item.id
                    ? "bg-indigo-600 text-white font-semibold"
                    : "bg-neutral-800/70 text-neutral-400 hover:text-white"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <div className="flex items-center gap-2">
              <span>Stiffness ({activeStiffness}):</span>
              <input
                type="range"
                min="200"
                max="600"
                value={activeStiffness}
                onChange={(e) => setActiveStiffness(Number(e.target.value))}
                className="w-20 accent-indigo-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span>Damping ({activeDamping}):</span>
              <input
                type="range"
                min="15"
                max="50"
                value={activeDamping}
                onChange={(e) => setActiveDamping(Number(e.target.value))}
                className="w-20 accent-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PanelItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-neutral-800/50 cursor-pointer">
      <div className="mt-0.5 rounded-lg bg-neutral-800 p-2 text-neutral-300 group-hover:bg-neutral-700/80 transition-colors">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-neutral-100 group-hover:text-white">
          {title}
        </h4>
        <p className="mt-0.5 text-xs leading-relaxed text-neutral-400 line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
}

function SolutionRow({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="group flex items-center justify-between rounded-xl p-2.5 transition-colors hover:bg-neutral-800/50 cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-neutral-800 p-2 text-neutral-300 group-hover:bg-neutral-700/80 transition-colors">
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-neutral-200 group-hover:text-white">
            {title}
          </h4>
          <p className="text-xs text-neutral-400">{desc}</p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-neutral-300 group-hover:translate-x-0.5 transition-transform" />
    </div>
  );
}

function DevItem({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-neutral-800/50 cursor-pointer">
      <div className="mt-0.5 rounded-lg bg-neutral-800 p-2 text-neutral-300 group-hover:bg-neutral-700/80 transition-colors">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-neutral-200 group-hover:text-white">
          {title}
        </h4>
        <p className="mt-0.5 text-xs text-neutral-400">{desc}</p>
      </div>
    </div>
  );
}

export default MorphingMegaMenu;
