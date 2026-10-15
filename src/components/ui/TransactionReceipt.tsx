"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  CreditCard,
  Download,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ReceiptItem {
  name: string;
  quantity?: number;
  price: number;
}

export interface TransactionReceiptProps {
  /** Merchant name */
  merchantName?: string;
  /** Transaction reference ID */
  transactionId?: string;
  /** ISO Date or formatted string */
  date?: string;
  /** Card last 4 digits */
  cardLast4?: string;
  /** Items list */
  items?: ReceiptItem[];
  /** Subtotal amount */
  subtotal?: number;
  /** Tax amount */
  tax?: number;
  /** Discount amount */
  discount?: number;
  /** Currency symbol. Default: "$" */
  currency?: string;
  /** Rubber stamp text: "PAID", "SETTLED", "REFUNDED", or null */
  stampText?: "PAID" | "SETTLED" | "REFUNDED" | null;
  /** Callback when receipt is stamped */
  onStamp?: () => void;
  className?: string;
}

const DEFAULT_ITEMS: ReceiptItem[] = [
  { name: "High-Performance Compute Pod (8 vCPU)", quantity: 1, price: 48.0 },
  { name: "Vector Memory Store (100 GB SSD)", quantity: 1, price: 12.0 },
  { name: "Continuous Integration Pipeline Runners", quantity: 2, price: 16.0 },
];

export function TransactionReceipt({
  merchantName = "BoseUI Cloud Infrastructure",
  transactionId = "TXN-84920481",
  date = "Oct 12, 2026 • 13:42 UTC",
  cardLast4 = "4242",
  items = DEFAULT_ITEMS,
  subtotal = 76.0,
  tax = 7.6,
  discount = 10.0,
  currency = "$",
  stampText = "PAID",
  onStamp,
  className,
}: TransactionReceiptProps) {
  const [currentStamp, setCurrentStamp] = useState<string | null>(stampText);
  const [copied, setCopied] = useState(false);
  const reduceMotion = useReducedMotion();

  const total = subtotal + tax - discount;

  const handleToggleStamp = () => {
    if (!currentStamp) {
      setCurrentStamp("PAID");
    } else if (currentStamp === "PAID") {
      setCurrentStamp("SETTLED");
    } else {
      setCurrentStamp(null);
    }
    onStamp?.();
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(transactionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-sm mx-auto flex flex-col items-center select-none font-sans",
        className
      )}
    >
      {/* Receipt Card Body */}
      <div className="relative w-full overflow-hidden rounded-t-2xl border border-neutral-200 dark:border-neutral-800 border-b-0 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xl p-6 pb-8 transition-all">
        {/* Top Paper Header */}
        <div className="flex flex-col items-center text-center border-b border-dashed border-neutral-200 dark:border-neutral-800 pb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 mb-2 shadow-xs">
            <Receipt className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-white">
            {merchantName}
          </h3>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 font-mono">
            {date}
          </span>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
            <span>Ref: {transactionId}</span>
            <button
              type="button"
              onClick={handleCopyId}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
              title="Copy transaction ID"
            >
              {copied ? (
                <Check className="h-2.5 w-2.5 text-emerald-500" />
              ) : (
                <Copy className="h-2.5 w-2.5" />
              )}
            </button>
          </div>
        </div>

        {/* Itemized Line Items */}
        <div className="py-4 space-y-2.5 border-b border-dashed border-neutral-200 dark:border-neutral-800 text-xs">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-start justify-between gap-2">
              <div className="flex-1 text-neutral-500 dark:text-neutral-400">
                <span className="text-neutral-900 dark:text-white font-medium">{item.name}</span>
                {item.quantity && item.quantity > 1 && (
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500 ml-1">
                    × {item.quantity}
                  </span>
                )}
              </div>
              <span className="font-mono font-medium text-neutral-900 dark:text-white shrink-0">
                {currency}
                {item.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals Breakdown */}
        <div className="py-4 space-y-1.5 border-b border-dashed border-neutral-200 dark:border-neutral-800 text-xs font-mono">
          <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
            <span>Subtotal</span>
            <span>
              {currency}
              {subtotal.toFixed(2)}
            </span>
          </div>
          {tax > 0 && (
            <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
              <span>Estimated Tax</span>
              <span>
                {currency}
                {tax.toFixed(2)}
              </span>
            </div>
          )}
          {discount > 0 && (
            <div className="flex justify-between text-emerald-500 font-medium">
              <span>Discount</span>
              <span>
                -{currency}
                {discount.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 text-sm font-bold text-neutral-900 dark:text-white font-sans">
            <span>Total Paid</span>
            <span className="font-mono text-base">
              {currency}
              {total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="pt-4 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-1.5">
            <CreditCard className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300" />
            <span>Mastercard ending in {cardLast4}</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-500 font-semibold">
            Approved
          </span>
        </div>

        {/* Animated Rubber Stamp Overlay */}
        <AnimatePresence>
          {currentStamp && (
            <motion.div
              key={currentStamp}
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 2.2, rotate: -25 }
              }
              animate={
                reduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0.9, scale: 1, rotate: -12 }
              }
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.8, rotate: -15 }
              }
              transition={
                reduceMotion
                  ? { duration: 0.1 }
                  : { type: "spring", stiffness: 450, damping: 22 }
              }
              onClick={handleToggleStamp}
              className={cn(
                "absolute right-6 top-36 z-20 cursor-pointer pointer-events-auto select-none",
                "px-4 py-1.5 rounded-lg border-4 border-dashed font-black tracking-widest text-lg font-mono uppercase shadow-md mix-blend-multiply dark:mix-blend-screen",
                currentStamp === "PAID" &&
                "border-emerald-500 text-emerald-500 bg-emerald-500/10",
                currentStamp === "SETTLED" &&
                "border-sky-500 text-sky-500 bg-sky-500/10",
                currentStamp === "REFUNDED" &&
                "border-rose-500 text-rose-500 bg-rose-500/10"
              )}
              title="Click to change or toggle stamp"
            >
              {currentStamp}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Simulated Barcode */}
        <div className="mt-6 flex flex-col items-center justify-center opacity-70">
          <div className="flex items-end gap-[2px] h-8 w-44 justify-center">
            {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 3, 1, 4, 2, 1, 2, 3, 1, 2, 4, 1, 2, 3, 1, 3, 2].map(
              (w, i) => (
                <div
                  key={i}
                  style={{ width: `${w}px` }}
                  className="h-full bg-neutral-900 dark:bg-neutral-100"
                />
              )
            )}
          </div>
          <span className="text-[9px] font-mono tracking-widest text-neutral-400 dark:text-neutral-500 mt-1">
            * 9 4 8 2 0 4 8 1 0 2 *
          </span>
        </div>
      </div>

      {/* Perforated Zigzag Bottom Edge (SVG) */}
      <div className="w-full h-4 overflow-hidden -mt-[1px] relative z-10">
        <svg
          className="w-full h-4 text-white dark:text-neutral-900 fill-current filter drop-shadow-xs"
          viewBox="0 0 384 16"
          preserveAspectRatio="none"
        >
          <path d="M0,0 L0,8 L12,16 L24,8 L36,16 L48,8 L60,16 L72,8 L84,16 L96,8 L108,16 L120,8 L132,16 L144,8 L156,16 L168,8 L180,16 L192,8 L204,16 L216,8 L228,16 L240,8 L252,16 L264,8 L276,16 L288,8 L300,16 L312,8 L324,16 L336,8 L348,16 L360,8 L372,16 L384,8 L384,0 Z" />
        </svg>
      </div>

      {/* Action Buttons Below Receipt */}
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggleStamp}
          className="text-xs px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-all shadow-xs"
        >
          Stamp: {currentStamp || "None"}
        </button>
      </div>
    </div>
  );
}
