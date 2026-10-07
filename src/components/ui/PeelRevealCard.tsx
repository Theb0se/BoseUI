"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Eye, KeyRound, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PeelRevealCardProps {
  /** Cover layer title. Default: "Production Secret Key" */
  title?: string;
  /** Secret payload revealed underneath the peel cover. Default: "bose_live_98f72a41c09e3b1d" */
  secretValue?: string;
  /** Hooke's Law spring stiffness coefficient for curtain peel. Default: 300 */
  stiffness?: number;
  /** Spring damping coefficient for curtain peel. Default: 24 */
  damping?: number;
  className?: string;
}

export function PeelRevealCard({
  title = "Production Secret Key",
  secretValue = "bose_live_98f72a41c09e3b1d",
  stiffness = 300,
  damping = 24,
  className,
}: PeelRevealCardProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [isPeeled, setIsPeeled] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(secretValue).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      onMouseEnter={() => setIsPeeled(true)}
      onMouseLeave={() => setIsPeeled(false)}
      className={cn(
        "relative h-[168px] w-full max-w-sm select-none overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-950 p-6 text-white shadow-sm dark:border-[#262626] dark:bg-white dark:text-black",
        className
      )}
    >
      {/* Underlying Vault Layer */}
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            <KeyRound className="h-3.5 w-3.5" />
            VAULT_DECRYPTED
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-lg bg-white/15 px-2.5 py-1 font-mono text-[10px] font-semibold text-white transition-colors hover:bg-white/25 dark:bg-black/10 dark:text-black dark:hover:bg-black/20"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy Key
              </>
            )}
          </button>
        </div>

        <div>
          <div className="font-mono text-sm font-bold tracking-tight">
            {secretValue}
          </div>
          <p className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
            Move cursor away or press button to re-seal cover
          </p>
        </div>
      </div>

      {/* Spring-Hinged Frosted Peel Cover */}
      <motion.div
        role="button"
        tabIndex={0}
        aria-expanded={isPeeled}
        aria-label={`${title}. Activate or hover to peel back cover and reveal secret key.`}
        onClick={() => setIsPeeled((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsPeeled((prev) => !prev);
          }
        }}
        animate={{
          y: isPeeled ? "-76%" : "0%",
          rotateX: isPeeled && !shouldReduceMotion ? 14 : 0,
        }}
        transition={
          shouldReduceMotion
            ? { duration: 0.01 }
            : { type: "spring", stiffness, damping }
        }
        className="absolute inset-0 z-10 flex cursor-pointer flex-col justify-between rounded-3xl border border-neutral-200 bg-white p-6 text-black shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:border-[#262626] dark:bg-[#0D0D0D] dark:text-white dark:focus-visible:ring-white"
      >
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-mono text-[10px] font-semibold text-black dark:border-[#262626] dark:bg-[#141414] dark:text-white">
            <Eye className="h-3 w-3" />
            Hover or Click to Peel
          </span>
          <span className="font-mono text-[10px] text-neutral-400">
            SHA-256
          </span>
        </div>

        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="mt-0.5 font-mono text-xs tracking-widest text-neutral-400">
            ••••••••••••••••••••••••
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default PeelRevealCard;
