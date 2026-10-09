"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Wifi,
  Eye,
  EyeOff,
  RotateCw,
  Sparkles,
  ShieldCheck,
  CreditCard as CreditCardIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type CardTheme = "titanium" | "obsidian" | "rosegold" | "holographic";

export interface TiltCreditCard3DProps {
  cardHolder?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  theme?: CardTheme;
  className?: string;
}

const THEME_STYLES: Record<
  CardTheme,
  {
    name: string;
    bgGradient: string;
    foilOpacity: string;
    textColor: string;
    chipColor: string;
    border: string;
  }
> = {
  titanium: {
    name: "Titanium Metal",
    bgGradient:
      "linear-gradient(135deg, #d8d8d8 0%, #b0b0b0 25%, #ececec 50%, #8c8c8c 75%, #cfcfcf 100%)",
    foilOpacity: "opacity-40",
    textColor: "text-neutral-900",
    chipColor: "from-amber-200 via-yellow-400 to-amber-600",
    border: "border-neutral-300/60 shadow-2xl shadow-neutral-900/30",
  },
  obsidian: {
    name: "Obsidian Black",
    bgGradient:
      "linear-gradient(135deg, #18181b 0%, #09090b 45%, #27272a 75%, #09090b 100%)",
    foilOpacity: "opacity-25",
    textColor: "text-neutral-100",
    chipColor: "from-amber-300 via-amber-500 to-yellow-600",
    border: "border-neutral-700/50 shadow-2xl shadow-black/80",
  },
  rosegold: {
    name: "Rose Gold",
    bgGradient:
      "linear-gradient(135deg, #fbcfe8 0%, #f472b6 35%, #fdf2f8 65%, #db2777 85%, #fbcfe8 100%)",
    foilOpacity: "opacity-50",
    textColor: "text-rose-950",
    chipColor: "from-amber-200 via-amber-400 to-amber-500",
    border: "border-rose-300/50 shadow-2xl shadow-rose-950/20",
  },
  holographic: {
    name: "Holo Prism",
    bgGradient:
      "linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #312e81 50%, #0f172a 100%)",
    foilOpacity: "opacity-75",
    textColor: "text-white",
    chipColor: "from-amber-200 via-yellow-300 to-amber-500",
    border: "border-indigo-400/40 shadow-2xl shadow-indigo-950/40",
  },
};

export function TiltCreditCard3D({
  cardHolder: initialHolder = "ALEXANDER VANCE",
  cardNumber: initialNumber = "4532 8901 2345 7892",
  expiry: initialExpiry = "09/29",
  cvv: initialCvv = "842",
  theme: initialTheme = "titanium",
  className,
}: TiltCreditCard3DProps) {
  const [currentTheme, setCurrentTheme] = useState<CardTheme>(initialTheme);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showSensitive, setShowSensitive] = useState(false);
  const [holderName, setHolderName] = useState(initialHolder);

  const containerRef = useRef<HTMLDivElement>(null);

  // Framer Motion spring physics for mouse tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 260, mass: 0.6 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [18, -18]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-22, 22]);

  // Dynamic holographic reflection positioning
  const glareX = useTransform(smoothMouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(smoothMouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY]
  );

  const handlePointerLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const activeThemeConfig = THEME_STYLES[currentTheme];

  const maskedNumber = showSensitive
    ? initialNumber
    : `•••• •••• •••• ${initialNumber.slice(-4)}`;

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-950 p-6 text-neutral-100 shadow-xl dark:border-neutral-800 flex flex-col justify-between items-center",
        className
      )}
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px]" />

      {/* Top Header & Theme Selector */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <CreditCardIcon className="h-5 w-5 text-neutral-400" />
          <span className="font-semibold text-sm tracking-wide text-neutral-200">
            Vault 3D Metal Card
          </span>
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
            EMV Certified
          </span>
        </div>

        {/* Theme pills */}
        <div className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900/90 p-1 backdrop-blur-md">
          {(Object.keys(THEME_STYLES) as CardTheme[]).map((themeKey) => {
            const isSelected = currentTheme === themeKey;
            return (
              <button
                key={themeKey}
                type="button"
                onClick={() => setCurrentTheme(themeKey)}
                className={cn(
                  "relative rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                  isSelected
                    ? "text-white font-semibold"
                    : "text-neutral-400 hover:text-neutral-200"
                )}
              >
                {isSelected && (
                  <motion.div
                    layoutId="active-card-theme"
                    className="absolute inset-0 rounded-lg bg-neutral-800"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{THEME_STYLES[themeKey].name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D Perspective Card Stage */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative my-8 h-[250px] w-full max-w-[420px] cursor-grab active:cursor-grabbing [perspective:1200px]"
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          animate={{
            rotateY: isFlipped ? 180 : 0,
          }}
          transition={{
            rotateY: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
          }}
          className="relative h-full w-full rounded-2xl select-none"
        >
          {/* ================= CARD FRONT ================= */}
          <div
            style={{
              backfaceVisibility: "hidden",
              background: activeThemeConfig.bgGradient,
            }}
            className={cn(
              "absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border p-6 [transform:translateZ(1px)]",
              activeThemeConfig.border,
              activeThemeConfig.textColor
            )}
          >
            {/* Dynamic Holographic Foil Glare Overlay */}
            <motion.div
              style={{
                background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.7) 0%, rgba(255,182,255,0.3) 30%, rgba(130,220,255,0.2) 60%, transparent 80%)`,
              }}
              className={cn(
                "pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-300",
                activeThemeConfig.foilOpacity
              )}
            />

            {/* Brushed metal line texture overlay */}
            <div className="pointer-events-none absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />

            {/* Top row: Chip + Contactless waves + Brand */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Gold EMV Chip */}
                <div
                  className={cn(
                    "relative h-9 w-12 rounded-md border border-yellow-700/60 bg-gradient-to-br shadow-inner",
                    activeThemeConfig.chipColor
                  )}
                >
                  <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-yellow-900/40" />
                  <div className="absolute inset-y-0 left-1/3 w-px bg-yellow-900/40" />
                  <div className="absolute inset-y-0 right-1/3 w-px bg-yellow-900/40" />
                  <div className="absolute left-1/2 top-1/2 h-3.5 w-4 -translate-x-1/2 -translate-y-1/2 rounded-[3px] border border-yellow-900/40" />
                </div>

                {/* Contactless RFID Icon */}
                <Wifi className="h-5 w-5 rotate-90 opacity-80" />
              </div>

              {/* Bank Logo / Elite Mark */}
              <div className="flex items-center gap-1.5 font-bold tracking-widest text-xs uppercase opacity-90 font-mono">
                <Sparkles className="h-4 w-4" />
                <span>PULSE BLACK</span>
              </div>
            </div>

            {/* Middle: Debossed Card Number */}
            <div className="relative z-10 my-auto">
              <p className="font-mono text-xl sm:text-2xl font-bold tracking-[0.22em] drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
                {maskedNumber}
              </p>
            </div>

            {/* Bottom Row: Holder Name + Expiry + Network Logo */}
            <div className="relative z-10 flex items-end justify-between text-xs tracking-wider">
              <div>
                <span className="block text-[9px] uppercase tracking-widest opacity-60 font-semibold">
                  Cardholder Name
                </span>
                <span className="font-mono font-bold uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
                  {holderName || "YOUR NAME"}
                </span>
              </div>

              <div className="text-center">
                <span className="block text-[9px] uppercase tracking-widest opacity-60 font-semibold">
                  Valid Thru
                </span>
                <span className="font-mono font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
                  {initialExpiry}
                </span>
              </div>

              {/* Overlapping Master Circles or Visa Stylized */}
              <div className="flex items-center">
                <div className="h-7 w-7 rounded-full bg-rose-500/80 mix-blend-multiply opacity-90" />
                <div className="-ml-3 h-7 w-7 rounded-full bg-amber-400/80 mix-blend-multiply opacity-90" />
              </div>
            </div>
          </div>

          {/* ================= CARD BACK ================= */}
          <div
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: activeThemeConfig.bgGradient,
            }}
            className={cn(
              "absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border p-0 [transform:rotateY(180deg)_translateZ(1px)]",
              activeThemeConfig.border,
              activeThemeConfig.textColor
            )}
          >
            {/* Magnetic Stripe */}
            <div className="mt-6 h-12 w-full bg-neutral-900 shadow-inner" />

            <div className="p-6 pt-2 flex flex-col justify-between flex-1">
              {/* Signature Strip & CVV Box */}
              <div className="mt-2 flex items-center gap-2">
                <div className="h-10 flex-1 rounded bg-neutral-100/90 p-2 text-[10px] font-mono italic text-neutral-600 flex items-center justify-end select-none border border-neutral-300">
                  Authorized Signature
                </div>
                <div className="h-10 w-16 rounded bg-neutral-200/95 flex items-center justify-center font-mono font-bold text-neutral-900 border border-neutral-400 tracking-wider">
                  {showSensitive ? initialCvv : "•••"}
                </div>
              </div>

              {/* Security info text */}
              <div className="space-y-1 text-[9px] opacity-70 leading-relaxed font-mono">
                <p>
                  This titanium metal card is property of Pulse Financial Inc.
                  Unauthorized use or transfer is prohibited by law.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-current/20">
                  <span>24/7 Global Concierge: +1 (800) 555-PULSE</span>
                  <div className="flex items-center gap-1 font-bold">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>SECURE NFC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="relative z-10 w-full flex flex-wrap items-center justify-between gap-3 border-t border-neutral-800/80 pt-4 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          {/* Flip Toggle Button */}
          <button
            type="button"
            onClick={() => setIsFlipped((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 font-medium text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            <RotateCw className="h-3.5 w-3.5" />
            <span>{isFlipped ? "View Front" : "View Back (CVV)"}</span>
          </button>

          {/* Show/Hide sensitive numbers */}
          <button
            type="button"
            onClick={() => setShowSensitive((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 font-medium text-neutral-300 hover:bg-neutral-800 transition-colors"
          >
            {showSensitive ? (
              <>
                <EyeOff className="h-3.5 w-3.5 text-neutral-400" />
                <span>Mask Data</span>
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5 text-neutral-400" />
                <span>Reveal Numbers</span>
              </>
            )}
          </button>
        </div>

        {/* Live edit cardholder name */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-500 font-mono">Holder:</span>
          <input
            type="text"
            value={holderName}
            onChange={(e) => setHolderName(e.target.value.toUpperCase())}
            maxLength={22}
            className="w-36 rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-xs font-mono text-neutral-200 uppercase focus:border-neutral-700 focus:outline-none"
            placeholder="CARDHOLDER"
          />
        </div>
      </div>
    </div>
  );
}

export default TiltCreditCard3D;
