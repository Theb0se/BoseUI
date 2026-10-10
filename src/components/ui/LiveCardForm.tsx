"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Lock,
  CheckCircle2,
  AlertCircle,
  Wifi,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "unknown";

function detectCardBrand(number: string): CardBrand {
  const clean = number.replace(/\s+/g, "");
  if (/^4/.test(clean)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(clean)) return "mastercard";
  if (/^3[47]/.test(clean)) return "amex";
  if (/^(6011|65|64[4-9]|622)/.test(clean)) return "discover";
  return "unknown";
}

function formatCardNumber(value: string, brand: CardBrand): string {
  const digits = value.replace(/\D/g, "").slice(0, brand === "amex" ? 15 : 16);
  if (brand === "amex") {
    // 4-6-5 format
    const parts = [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10, 15)];
    return parts.filter(Boolean).join(" ");
  }
  // 4-4-4-4 format
  const parts = digits.match(/.{1,4}/g);
  return parts ? parts.join(" ") : digits;
}

function checkLuhn(val: string): boolean {
  const digits = val.replace(/\D/g, "");
  if (digits.length < 13) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export interface LiveCardFormProps {
  className?: string;
  defaultAmount?: string;
  onSuccess?: () => void;
}

export function LiveCardForm({
  className,
  defaultAmount = "$89.00",
}: LiveCardFormProps) {
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardHolder, setCardHolder] = useState("ALEXANDER MERCER");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("892");
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const brand = detectCardBrand(cardNumber);
  const isValidLuhn = checkLuhn(cardNumber);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const detected = detectCardBrand(raw);
    setCardNumber(formatCardNumber(raw, detected));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 3) {
      val = val.slice(0, 2) + "/" + val.slice(2);
    }
    setExpiry(val);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, brand === "amex" ? 4 : 3);
    setCvc(val);
  };

  const handleFillDemo = (type: "visa" | "mastercard" | "amex") => {
    if (type === "visa") {
      setCardNumber("4242 4242 4242 4242");
      setCardHolder("JANE DOE");
      setExpiry("08/29");
      setCvc("345");
    } else if (type === "mastercard") {
      setCardNumber("5555 5555 5555 4444");
      setCardHolder("THOMAS ANDERSON");
      setExpiry("11/27");
      setCvc("882");
    } else if (type === "amex") {
      setCardNumber("3782 822463 10005");
      setCardHolder("ELEANOR SHELL");
      setExpiry("05/30");
      setCvc("1234");
    }
    setIsSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 4000);
    }, 1200);
  };

  const getBrandGradient = () => {
    switch (brand) {
      case "visa":
        return "from-[#1a1f71] via-[#0d1440] to-[#04081c]";
      case "mastercard":
        return "from-[#251010] via-[#1a0f18] to-[#090b14]";
      case "amex":
        return "from-[#004b6e] via-[#012f48] to-[#011422]";
      case "discover":
        return "from-[#442306] via-[#2d1405] to-[#090b14]";
      default:
        return "from-neutral-800 via-neutral-900 to-black";
    }
  };

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-neutral-800 bg-[#070913] p-6 text-white flex flex-col justify-between shadow-2xl selection:bg-indigo-500/30",
        className
      )}
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 h-80 w-80 rounded-full bg-indigo-600/10 blur-[100px]" />
        <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-violet-600/10 blur-[90px]" />
      </div>

      {/* Main Content Grid: 3D Card vs Form */}
      <div className="relative z-10 w-full max-w-5xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4">
        {/* Left Side: 3D Interactive Card Preview */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div
            className="w-full max-w-[380px] h-[230px] cursor-pointer"
            style={{ perspective: 1000 }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.7, type: "spring", stiffness: 260, damping: 24 }}
              className="relative w-full h-full rounded-2xl shadow-2xl transition-all"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Card Front */}
              <div
                className={cn(
                  "absolute inset-0 rounded-2xl p-6 flex flex-col justify-between border border-white/15 bg-gradient-to-br shadow-2xl overflow-hidden",
                  getBrandGradient()
                )}
                style={{ backfaceVisibility: "hidden" }}
              >
                {/* Holographic Sheen Layer */}
                <div className="pointer-events-none absolute -inset-full bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-45 opacity-60" />

                {/* Card Top: Chip + Wireless + Brand */}
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-3">
                    {/* Metallic EMV Chip */}
                    <div className="h-8 w-11 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300/40 p-1 flex flex-col justify-between shadow-inner">
                      <div className="w-full h-0.5 bg-amber-700/40 rounded" />
                      <div className="w-full h-0.5 bg-amber-700/40 rounded" />
                      <div className="w-full h-0.5 bg-amber-700/40 rounded" />
                    </div>
                    {/* Wireless Contactless Icon */}
                    <Wifi className="h-4 w-4 text-white/60 rotate-90" />
                  </div>

                  {/* Brand Badge */}
                  <BrandLogo brand={brand} />
                </div>

                {/* Card Number */}
                <div className="z-10 tracking-[0.2em] font-mono text-lg sm:text-xl font-medium text-white drop-shadow">
                  {cardNumber || "•••• •••• •••• ••••"}
                </div>

                {/* Card Bottom: Holder + Expiry */}
                <div className="flex items-end justify-between z-10 text-xs font-mono">
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-white/60">
                      Card Holder
                    </div>
                    <div className="font-semibold text-neutral-100 tracking-wider truncate max-w-[190px]">
                      {cardHolder || "FULL NAME"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] uppercase tracking-wider text-white/60">
                      Expires
                    </div>
                    <div className="font-semibold text-neutral-100 tracking-wider">
                      {expiry || "MM/YY"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Back */}
              <div
                className={cn(
                  "absolute inset-0 rounded-2xl flex flex-col justify-between border border-white/15 bg-gradient-to-br shadow-2xl overflow-hidden py-5",
                  getBrandGradient()
                )}
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                {/* Magnetic Stripe */}
                <div className="w-full h-11 bg-neutral-950 mt-1 shadow-inner" />

                {/* Signature Strip + CVC */}
                <div className="px-6 flex items-center gap-3">
                  <div className="flex-1 h-9 bg-neutral-200/90 rounded px-3 flex items-center justify-between text-neutral-900 font-serif italic text-xs select-none">
                    <span className="truncate">{cardHolder || "Authorized Signature"}</span>
                  </div>
                  <div className="w-16 h-8 rounded bg-white text-neutral-900 font-mono font-bold flex items-center justify-center text-sm shadow">
                    {cvc || "•••"}
                  </div>
                </div>

                {/* Telemetry info */}
                <div className="px-6 text-[9px] text-white/50 leading-relaxed font-mono flex items-center justify-between">
                  <span>PULSE EMV GLOBAL NETWORK</span>
                  <span>CLICK TO FLIP</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-neutral-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive 3D Preview (Auto-flips on CVC focus)</span>
          </div>
        </div>

        {/* Right Side: Form Inputs */}
        <div className="lg:col-span-7 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
            <div>
              <h3 className="text-lg font-semibold text-white">Payment Details</h3>
              <p className="text-xs text-neutral-400">Complete your transaction with end-to-end encryption</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>PCI-DSS Level 1</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Card Number Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-neutral-300">
                  Card Number
                </label>
                {isValidLuhn && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <CheckCircle2 className="h-3 w-3" />
                    Luhn Verified
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="4242 4242 4242 4242"
                  className={cn(
                    "w-full rounded-xl bg-neutral-950/80 border px-3.5 py-2.5 text-sm font-mono text-white placeholder-neutral-500 focus:outline-none transition-all",
                    isValidLuhn
                      ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      : "border-neutral-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  )}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <BrandLogo brand={brand} small />
                </div>
              </div>
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                placeholder="ALEXANDER MERCER"
                className="w-full rounded-xl bg-neutral-950/80 border border-neutral-700/80 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono uppercase"
              />
            </div>

            {/* Expiry and CVC Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Expiration Date
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full rounded-xl bg-neutral-950/80 border border-neutral-700/80 px-3.5 py-2.5 text-sm font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-neutral-300">
                    CVC / CVV
                  </label>
                  <span className="text-[10px] text-neutral-500">
                    {brand === "amex" ? "4 digits" : "3 digits"}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={cvc}
                    onChange={handleCvcChange}
                    onFocus={() => setIsFlipped(true)}
                    onBlur={() => setIsFlipped(false)}
                    placeholder={brand === "amex" ? "••••" : "•••"}
                    maxLength={brand === "amex" ? 4 : 3}
                    className="w-full rounded-xl bg-neutral-950/80 border border-neutral-700/80 px-3.5 py-2.5 text-sm font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Authorizing Payment...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  <span>Authorized & Settled!</span>
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5" />
                  <span>Pay {defaultAmount} Securely</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function BrandLogo({ brand, small = false }: { brand: CardBrand; small?: boolean }) {
  if (brand === "visa") {
    return (
      <span
        className={cn(
          "font-black tracking-tighter text-blue-400 italic font-sans",
          small ? "text-xs" : "text-lg"
        )}
      >
        VISA
      </span>
    );
  }
  if (brand === "mastercard") {
    return (
      <div className="flex items-center -space-x-1.5">
        <div className={cn("rounded-full bg-red-500", small ? "h-3.5 w-3.5" : "h-5 w-5")} />
        <div className={cn("rounded-full bg-amber-400/90", small ? "h-3.5 w-3.5" : "h-5 w-5")} />
      </div>
    );
  }
  if (brand === "amex") {
    return (
      <span
        className={cn(
          "font-bold font-mono tracking-widest text-sky-400 border border-sky-400/40 rounded px-1",
          small ? "text-[10px]" : "text-xs"
        )}
      >
        AMEX
      </span>
    );
  }
  if (brand === "discover") {
    return (
      <span
        className={cn(
          "font-bold font-sans text-orange-400 tracking-wide",
          small ? "text-[10px]" : "text-xs"
        )}
      >
        DISCOVER
      </span>
    );
  }
  return <CreditCard className={cn("text-neutral-500", small ? "h-4 w-4" : "h-5 w-5")} />;
}

export default LiveCardForm;
