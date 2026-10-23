"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Shield,
  Layers,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";

export interface ColorFinish {
  id: string;
  name: string;
  hex: string;
  description: string;
}

const FINISHES: ColorFinish[] = [
  { id: "natural", name: "Natural Titanium", hex: "#9E9A95", description: "Raw micro-blasted aerospace grade finish." },
  { id: "desert", name: "Desert Titanium", hex: "#C3B19E", description: "Warm golden hue with PVD vapor deposition." },
  { id: "white", name: "White Titanium", hex: "#E8E7E3", description: "Ultra-pure matte ceramic-infused back glass." },
  { id: "black", name: "Black Titanium", hex: "#323336", description: "Deep carbon black DLC protective coating." },
];

export interface ProductRevealSectionProps {
  /** Flagship device headline */
  title?: string;
  /** Tagline descriptor */
  tagline?: string;
  /** Price display */
  price?: string;
  /** Custom container class names */
  className?: string;
}

export function ProductRevealSection({
  title = "Titanium Pro Max",
  tagline = "Engineered from aerospace Grade 5 titanium. Forged with precision micromechanics.",
  price = "$1,199",
  className,
}: ProductRevealSectionProps) {
  const [selectedFinish, setSelectedFinish] = useState<ColorFinish>(FINISHES[0]);
  const [activeTab, setActiveTab] = useState("inspection");
  const [preordered, setPreordered] = useState(false);

  const handlePreorder = () => {
    setPreordered(true);
    setTimeout(() => setPreordered(false), 2400);
  };

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[560px] overflow-hidden rounded-2xl border border-neutral-800 bg-[#08090C] text-white flex flex-col justify-between shadow-2xl selection:bg-neutral-500/30",
        className
      )}
    >
      {/* Pinned Sub-Navigation Bar */}
      <div className="relative z-30 w-full border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-xl px-4 py-3 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm tracking-tight text-white">{title}</span>
          <span className="text-xs text-neutral-400">From {price}</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-xs text-neutral-400 font-medium">
          <span className="text-white hover:text-neutral-200 transition-colors cursor-pointer">360° Inspection</span>
          <span className="hover:text-white transition-colors cursor-pointer">Titanium Finishes</span>
          <span className="hover:text-white transition-colors cursor-pointer">Glass Pass</span>
          <span className="hover:text-white transition-colors cursor-pointer">Tech Specs</span>
        </div>
        <button
          type="button"
          onClick={handlePreorder}
          className="rounded-lg bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-950 hover:bg-neutral-200 transition-all shadow-sm"
        >
          {preordered ? "Added!" : "Pre-order"}
        </button>
      </div>

      {/* Hero Headline Section */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-10 pb-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-neutral-700/80 bg-neutral-900/60 backdrop-blur-md text-xs font-medium text-neutral-300"
        >
          <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
          <span>Aerospace Metallurgy</span>
          <span className="text-neutral-500">•</span>
          <span className="text-white font-semibold">Sub-micron PVD Coating</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-b from-white via-neutral-200 to-neutral-400"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-neutral-400"
        >
          {tagline}
        </motion.p>

        {/* Section View Mode Tabs */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("inspection")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold transition-all min-h-[44px] flex items-center gap-2",
              activeTab === "inspection"
                ? "bg-neutral-200 text-neutral-900 shadow-md"
                : "bg-neutral-900/60 border border-neutral-800 text-neutral-400 hover:text-white"
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>360° Inspection & Finishes</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("card")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold transition-all min-h-[44px] flex items-center gap-2",
              activeTab === "card"
                ? "bg-neutral-200 text-neutral-900 shadow-md"
                : "bg-neutral-900/60 border border-neutral-800 text-neutral-400 hover:text-white"
            )}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Liquid Glass Security</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex-1 flex flex-col justify-center">
        {activeTab === "inspection" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left & Center: 360 Product Sequence Scrubber */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="w-full rounded-2xl border border-neutral-800/80 bg-neutral-950/60 backdrop-blur-md p-8 shadow-xl flex flex-col items-center justify-center min-h-[360px]">
                <div
                  className="relative w-64 h-80 rounded-3xl border shadow-2xl flex flex-col items-center justify-between p-6 transition-all duration-500"
                  style={{
                    borderColor: `${selectedFinish.hex}60`,
                    background: `radial-gradient(ellipse at top, ${selectedFinish.hex}25, #09090b)`,
                  }}
                >
                  <div className="w-16 h-3 rounded-full bg-neutral-900 border border-neutral-800" />
                  <div className="text-center font-mono text-xs text-neutral-300">
                    <Sparkles className="w-6 h-6 mx-auto mb-2 text-neutral-300 animate-pulse" />
                    <span>{selectedFinish.name}</span>
                  </div>
                  <div className="text-[11px] font-mono text-neutral-500">GRADE 5 TITANIUM</div>
                </div>
              </div>
            </div>

            {/* Right Side: Color Finish Picker & Metallurgy Telemetry */}
            <div className="lg:col-span-5 flex flex-col space-y-4">
              <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/60 backdrop-blur-md p-5 shadow-xl">
                <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3">
                  Select Finish
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {FINISHES.map((finish) => (
                    <button
                      key={finish.id}
                      type="button"
                      onClick={() => setSelectedFinish(finish)}
                      className={cn(
                        "flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all",
                        selectedFinish.id === finish.id
                          ? "border-white bg-neutral-800/80 shadow-md"
                          : "border-neutral-800 bg-neutral-900/50 hover:border-neutral-700"
                      )}
                    >
                      <span
                        className="h-5 w-5 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: finish.hex }}
                      />
                      <div>
                        <div className="text-xs font-medium text-white">{finish.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs text-neutral-400 leading-relaxed">
                  {selectedFinish.description}
                </p>
              </div>

              {/* Order Quick Action Banner */}
              <div className="p-4 rounded-xl border border-neutral-800/60 bg-neutral-900/40 backdrop-blur-md flex items-center justify-between">
                <div>
                  <div className="text-xs text-neutral-400">Delivery Status</div>
                  <div className="text-sm font-semibold text-white">
                    Free Express Shipping
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handlePreorder}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors flex items-center gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Pre-order {price}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Alternative Tab: Liquid Glass Specular Card Showcase */
          <div className="flex flex-col items-center justify-center py-6">
            <LiquidGlassCard
              title="Titanium Apple Card"
              subtitle="Mastercard • World Elite • 7492"
              tiltFactor={1.2}
              chromaticEdge
              className="max-w-4xl"
            />
          </div>
        )}
      </div>

      {/* Docked Footnote Specs */}
      <div className="relative z-10 w-full border-t border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs text-neutral-400 gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-200">Specification:</span>
            <span>Grade 5 Titanium (Ti-6Al-4V)</span>
            <span className="text-neutral-600">•</span>
            <span>Laser-welded internal aluminium substructure</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>Free 14-day returns</span>
            <span>•</span>
            <span>AppleCare+ available at checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductRevealSection;
