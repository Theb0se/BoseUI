"use client";

import React, { useState } from "react";
import { Check, Copy, Terminal as TerminalIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TerminalWindowMockupProps {
  /** Title shown in terminal titlebar. Default: "bash — 80×24" */
  title?: string;
  /** Active terminal command string */
  command?: string;
  /** Command output lines (string or array of strings) */
  output?: string | string[];
  /** Enable one-click copy command button. Default: true */
  copyable?: boolean;
  /** Custom inner children instead of default shell */
  children?: React.ReactNode;
  className?: string;
}

export function TerminalWindowMockup({
  title = "zsh — 80×24",
  command = "npx boseui add magnetic-button",
  output = [
    "✔ Validating registry dependencies...",
    "✔ Downloading component src/components/ui/MagneticButton.tsx",
    "✔ Added 1 component to your project.",
  ],
  copyable = true,
  children,
  className,
}: TerminalWindowMockupProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (command) {
      navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  const outputArray = Array.isArray(output) ? output : [output];

  return (
    <div
      className={cn(
        "relative w-full max-w-2xl overflow-hidden rounded-xl border border-neutral-800 bg-[#0C0C0E] text-neutral-200 shadow-2xl font-mono text-xs select-none",
        className
      )}
    >
      {/* Terminal Titlebar */}
      <div className="flex h-10 w-full items-center justify-between border-b border-neutral-800/80 bg-[#161618] px-4">
        {/* Left: Traffic Lights */}
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
          <span className="h-3 w-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
          <span className="h-3 w-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
        </div>

        {/* Center: Title */}
        <div className="flex items-center gap-1.5 text-neutral-400 font-sans text-xs">
          <TerminalIcon className="h-3.5 w-3.5 opacity-60" />
          <span className="font-medium text-neutral-300">{title}</span>
        </div>

        {/* Right: Copy Command Button */}
        <div>
          {copyable && command && (
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-md border border-neutral-700/60 bg-neutral-800/80 px-2 py-0.5 text-[11px] text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
              aria-label="Copy terminal command"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-5 space-y-2 leading-relaxed">
        {children ? (
          children
        ) : (
          <>
            {/* Command Line */}
            {command && (
              <div className="flex items-center gap-2 text-white">
                <span className="text-emerald-400 font-bold select-none">❯</span>
                <span className="font-semibold">{command}</span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="h-3.5 w-1.5 bg-neutral-400 inline-block align-middle"
                />
              </div>
            )}

            {/* Output Lines */}
            {outputArray.length > 0 && (
              <div className="space-y-1 pt-1 text-neutral-400">
                {outputArray.map((line, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
