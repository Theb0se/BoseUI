"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Plus,
  Minus,
  CheckCircle2,
  Sparkles,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { TiltCreditCard3D, CardTheme } from "@/components/ui/TiltCreditCard3D";
import { cn } from "@/lib/utils";

export interface CheckoutSectionBlockProps {
  productTitle?: string;
  basePrice?: number;
  className?: string;
}

export function CheckoutSectionBlock({
  productTitle = "Pulse Architecture Enterprise License",
  basePrice = 49,
  className,
}: CheckoutSectionBlockProps) {
  const [seats, setSeats] = useState(5);
  const [cardTheme, setCardTheme] = useState<CardTheme>("obsidian");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const [cardHolder, setCardHolder] = useState("ALEXANDER MERCER");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("888");
  const [postalCode, setPostalCode] = useState("94107");

  const formatCardNumber = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 16);
    return clean.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 4);
    if (clean.length >= 3) {
      return `${clean.slice(0, 2)}/${clean.slice(2)}`;
    }
    return clean;
  };

  const cleanDigits = cardNumber.replace(/\s+/g, "");
  const cardBrand = /^4/.test(cleanDigits)
    ? "VISA"
    : /^(5[1-5]|2[2-7])/.test(cleanDigits)
    ? "MASTERCARD"
    : /^3[47]/.test(cleanDigits)
    ? "AMEX"
    : "CARD";

  const subtotal = seats * basePrice;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = (subtotal + tax).toFixed(2);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
    }, 1400);
  };

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[720px] overflow-hidden rounded-3xl bg-[#090b14] text-white border border-neutral-800 shadow-2xl p-6 sm:p-10",
        className
      )}
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />

      {/* Header */}
      <div className="relative border-b border-neutral-800 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-mono text-indigo-300">
            <Lock className="h-3.5 w-3.5 text-indigo-400" />
            <span>ENCRYPTED 256-BIT CHECKOUT</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Complete Your Enterprise Order
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>PCI-DSS Level 1 Verified</span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: License Configuration & Embedded Live Card Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Seat License Stepper */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{productTitle}</p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  ${basePrice}/seat per month · Billed annually
                </p>
              </div>

              {/* Stepper Buttons */}
              <div className="flex items-center gap-3 bg-neutral-950 border border-neutral-800 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setSeats((s) => Math.max(1, s - 1))}
                  className="h-8 w-8 rounded-lg bg-neutral-900 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                  aria-label="Decrease seat count"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="text-sm font-mono font-bold text-white min-w-[2rem] text-center">
                  {seats}
                </span>
                <button
                  type="button"
                  onClick={() => setSeats((s) => s + 1)}
                  className="h-8 w-8 rounded-lg bg-neutral-900 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                  aria-label="Increase seat count"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Payment Details Form */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 sm:p-6 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Payment Details
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                <CreditCard className="h-3 w-3" />
                <span>{cardBrand}</span>
              </span>
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                placeholder="NAME ON CARD"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 px-3.5 py-2.5 text-sm font-mono text-white placeholder-neutral-600 focus:border-cyan-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Card Number */}
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="4242 •••• •••• 4242"
                maxLength={19}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 px-3.5 py-2.5 text-sm font-mono text-white placeholder-neutral-600 focus:border-cyan-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Expiry, CVC & ZIP */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Expires
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 px-3.5 py-2.5 text-sm font-mono text-white placeholder-neutral-600 focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  CVC
                </label>
                <input
                  type="text"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.slice(0, 4))}
                  placeholder="•••"
                  maxLength={4}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 px-3.5 py-2.5 text-sm font-mono text-white placeholder-neutral-600 focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value.slice(0, 10))}
                  placeholder="ZIP"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 px-3.5 py-2.5 text-sm font-mono text-white placeholder-neutral-600 focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Holographic Card & Checkout Summary */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interactive Tilt Credit Card 3D */}
          <div className="flex flex-col items-center">
            <TiltCreditCard3D
              theme={cardTheme}
              cardHolder={cardHolder || "NAME ON CARD"}
              cardNumber={cardNumber || "•••• •••• •••• 4242"}
              expiry={expiry || "MM/YY"}
              className="w-full max-w-[340px]"
            />

            {/* Theme Picker */}
            <div className="mt-4 flex items-center gap-2">
              {(["obsidian", "titanium", "rosegold", "holographic"] as CardTheme[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setCardTheme(t)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[11px] font-mono capitalize transition-all border",
                    cardTheme === t
                      ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                      : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Order Summary Receipt */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 font-mono">
              Order Summary
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-neutral-300">
                <span>{seats} × Developer Seat Licenses</span>
                <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Estimated Sales Tax (8%)</span>
                <span className="font-mono text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-400 text-xs">
                <span>Volume Discount Applied</span>
                <span>Included</span>
              </div>
            </div>

            <div className="border-t border-neutral-800 pt-3 flex justify-between items-baseline">
              <span className="text-base font-semibold text-white">Total Due Today</span>
              <span className="text-2xl font-bold font-mono text-cyan-400">${total}</span>
            </div>

            <button
              type="button"
              onClick={handlePay}
              disabled={isProcessing || isPaid}
              className={cn(
                "w-full h-12 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg",
                isPaid
                  ? "bg-emerald-600 text-white cursor-default"
                  : "bg-white text-neutral-950 hover:bg-neutral-100 hover:scale-[1.01] active:scale-[0.99]"
              )}
            >
              {isPaid ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Order Confirmed &amp; Invoiced</span>
                </>
              ) : isProcessing ? (
                <span>Authorizing with Bank...</span>
              ) : (
                <>
                  <span>Pay ${total} &amp; Activate License</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 pt-2 text-[11px] font-mono text-neutral-500">
              <span>30-Day Money Back</span>
              <span>·</span>
              <span>Instant Key Dispatch</span>
              <span>·</span>
              <span>SLA Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSectionBlock;
