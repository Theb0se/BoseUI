"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Sparkles,
  Check,
  Copy,
  AlertCircle,
  HelpCircle,
  Hash,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface RegexPlaygroundProps {
  /** Initial regular expression pattern */
  initialPattern?: string;
  /** Initial flags (e.g. "g") */
  initialFlags?: string;
  /** Initial test string */
  initialTestString?: string;
  className?: string;
}

interface RegexPreset {
  label: string;
  pattern: string;
  flags: string;
  testString: string;
}

const PRESETS: RegexPreset[] = [
  {
    label: "Email Address",
    pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
    flags: "g",
    testString: "Contact alex@boseui.com or support@acme.cloud for feedback.",
  },
  {
    label: "Semver Version",
    pattern: "v?(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)",
    flags: "g",
    testString: "Upgraded from v1.2.4 to v2.0.0 and preview 3.0.1-beta.",
  },
  {
    label: "UUID v4",
    pattern: "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}",
    flags: "g",
    testString: "Assigned token 94b1e84a-1029-4829-8472-a1b2c3d4e5f6 to session.",
  },
  {
    label: "Hex Color",
    pattern: "#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})",
    flags: "g",
    testString: "Brand palette uses #38bdf8 for primary and #f43f5e for alerts.",
  },
];

export function RegexPlayground({
  initialPattern = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
  initialFlags = "g",
  initialTestString = "Contact alex@boseui.com or support@acme.cloud for engineering feedback.",
  className,
}: RegexPlaygroundProps) {
  const [pattern, setPattern] = useState(initialPattern);
  const [flags, setFlags] = useState(initialFlags);
  const [testString, setTestString] = useState(initialTestString);
  const [copiedRegex, setCopiedRegex] = useState(false);

  // Compute matches
  const { matches, error } = useMemo(() => {
    if (!pattern.trim()) return { matches: [], error: null };
    try {
      const regex = new RegExp(pattern, flags);
      const results: string[] = [];
      let match: RegExpExecArray | null;

      if (!flags.includes("g")) {
        const single = regex.exec(testString);
        if (single) results.push(single[0]);
      } else {
        // avoid infinite loop on empty pattern
        let iterations = 0;
        while ((match = regex.exec(testString)) !== null && iterations < 500) {
          results.push(match[0]);
          iterations++;
          if (match.index === regex.lastIndex) regex.lastIndex++;
        }
      }

      return { matches: results, error: null };
    } catch (err) {
      return { matches: [], error: (err as Error).message };
    }
  }, [pattern, flags, testString]);

  const toggleFlag = (flagChar: string) => {
    setFlags((prev) =>
      prev.includes(flagChar) ? prev.replace(flagChar, "") : prev + flagChar
    );
  };

  const handleApplyPreset = (p: RegexPreset) => {
    setPattern(p.pattern);
    setFlags(p.flags);
    setTestString(p.testString);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(`/${pattern}/${flags}`);
    setCopiedRegex(true);
    setTimeout(() => setCopiedRegex(false), 2000);
  };

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col gap-5",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-emerald-500" />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-tight">Regex Playground</h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Real-time regular expression pattern matching and token testing.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-mono text-neutral-800 dark:text-neutral-200 transition-all"
        >
          {copiedRegex ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          <span>/{pattern.slice(0, 15)}.../{flags}</span>
        </button>
      </div>

      {/* Preset Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mr-1">Presets:</span>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => handleApplyPreset(p)}
            className={cn(
              "px-2.5 py-1 text-xs font-medium rounded-lg border transition-all",
              pattern === p.pattern
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-950 font-semibold shadow-xs"
                : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Regex Input Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 font-mono text-xs">
        <span className="text-neutral-400 pl-2 select-none text-base font-bold">/</span>
        <input
          type="text"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="[a-z0-9]+..."
          className="flex-1 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 font-mono"
        />
        <span className="text-neutral-400 select-none text-base font-bold">/</span>

        {/* Flag toggles */}
        <div className="flex items-center gap-1">
          {(["g", "i", "m"] as const).map((f) => (
            <button
              key={f}
              onClick={() => toggleFlag(f)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-bold transition-all border",
                flags.includes(f)
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white"
                  : "bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Error or Matches status */}
      {error ? (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-mono">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Invalid Regex: {error}</span>
        </div>
      ) : (
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-neutral-500 dark:text-neutral-400">Test Text</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            {matches.length} {matches.length === 1 ? "match" : "matches"} found
          </span>
        </div>
      )}

      {/* Test String Box */}
      <textarea
        rows={3}
        value={testString}
        onChange={(e) => setTestString(e.target.value)}
        className="w-full bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 text-xs font-mono text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 shadow-xs resize-y"
        placeholder="Enter test string here..."
      />

      {/* Matches pill list */}
      {matches.length > 0 && (
        <div className="flex flex-col gap-2 pt-1 border-t border-neutral-200 dark:border-neutral-800 font-mono text-xs">
          <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Matched Tokens
          </span>
          <div className="flex flex-wrap gap-2">
            {matches.map((m, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-xs"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
