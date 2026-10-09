"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  Play,
  Terminal,
  Code2,
  ChevronRight,
  Sparkles,
  RotateCcw,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CodeSnippet {
  id: string;
  name: string;
  filename: string;
  code: string;
  highlightedLines?: number[];
  tokens: {
    line: number;
    parts: { text: string; color: string }[];
  }[];
}

const SNIPPETS: Record<string, CodeSnippet> = {
  curl: {
    id: "curl",
    name: "cURL",
    filename: "charge.sh",
    code: `curl https://api.pulse.dev/v1/charges \\
  -u sk_test_51Mz9x8K1x4LkdI: \\
  -d amount=2000 \\
  -d currency=usd \\
  -d source=tok_visa \\
  -d description="Standard subscription tier"`,
    highlightedLines: [3, 4],
    tokens: [
      {
        line: 1,
        parts: [
          { text: "curl ", color: "text-amber-400 font-bold" },
          { text: "https://api.pulse.dev/v1/charges", color: "text-emerald-300" },
          { text: " \\", color: "text-neutral-500" },
        ],
      },
      {
        line: 2,
        parts: [
          { text: "  -u ", color: "text-cyan-400" },
          { text: "sk_test_51Mz9x8K1x4LkdI:", color: "text-purple-300" },
          { text: " \\", color: "text-neutral-500" },
        ],
      },
      {
        line: 3,
        parts: [
          { text: "  -d ", color: "text-cyan-400" },
          { text: "amount", color: "text-neutral-200" },
          { text: "=", color: "text-neutral-400" },
          { text: "2000", color: "text-orange-300" },
          { text: " \\", color: "text-neutral-500" },
        ],
      },
      {
        line: 4,
        parts: [
          { text: "  -d ", color: "text-cyan-400" },
          { text: "currency", color: "text-neutral-200" },
          { text: "=", color: "text-neutral-400" },
          { text: "usd", color: "text-emerald-300" },
          { text: " \\", color: "text-neutral-500" },
        ],
      },
      {
        line: 5,
        parts: [
          { text: "  -d ", color: "text-cyan-400" },
          { text: "source", color: "text-neutral-200" },
          { text: "=", color: "text-neutral-400" },
          { text: "tok_visa", color: "text-purple-300" },
          { text: " \\", color: "text-neutral-500" },
        ],
      },
      {
        line: 6,
        parts: [
          { text: "  -d ", color: "text-cyan-400" },
          { text: "description", color: "text-neutral-200" },
          { text: "=", color: "text-neutral-400" },
          { text: '"Standard subscription tier"', color: "text-emerald-300" },
        ],
      },
    ],
  },
  node: {
    id: "node",
    name: "Node.js",
    filename: "charge.js",
    code: `import Pulse from "@pulse/sdk";
const pulse = new Pulse("sk_test_51Mz9x8K1x4LkdI");

const charge = await pulse.charges.create({
  amount: 2000,
  currency: "usd",
  source: "tok_visa",
  description: "Standard subscription tier",
});

console.log(charge.id);`,
    highlightedLines: [4, 5],
    tokens: [
      {
        line: 1,
        parts: [
          { text: "import ", color: "text-purple-400 font-bold" },
          { text: "Pulse ", color: "text-yellow-300" },
          { text: "from ", color: "text-purple-400 font-bold" },
          { text: '"@pulse/sdk"', color: "text-emerald-300" },
          { text: ";", color: "text-neutral-400" },
        ],
      },
      {
        line: 2,
        parts: [
          { text: "const ", color: "text-purple-400 font-bold" },
          { text: "pulse = ", color: "text-neutral-200" },
          { text: "new ", color: "text-purple-400" },
          { text: "Pulse", color: "text-yellow-300" },
          { text: '("sk_test_51Mz9x8K1x4LkdI");', color: "text-emerald-300" },
        ],
      },
      { line: 3, parts: [{ text: "", color: "text-neutral-400" }] },
      {
        line: 4,
        parts: [
          { text: "const ", color: "text-purple-400 font-bold" },
          { text: "charge = ", color: "text-neutral-200" },
          { text: "await ", color: "text-purple-400 font-bold" },
          { text: "pulse.charges.", color: "text-neutral-300" },
          { text: "create", color: "text-blue-400 font-semibold" },
          { text: "({", color: "text-neutral-300" },
        ],
      },
      {
        line: 5,
        parts: [
          { text: "  amount: ", color: "text-cyan-300" },
          { text: "2000", color: "text-orange-300" },
          { text: ",", color: "text-neutral-400" },
        ],
      },
      {
        line: 6,
        parts: [
          { text: "  currency: ", color: "text-cyan-300" },
          { text: '"usd"', color: "text-emerald-300" },
          { text: ",", color: "text-neutral-400" },
        ],
      },
      {
        line: 7,
        parts: [
          { text: "  source: ", color: "text-cyan-300" },
          { text: '"tok_visa"', color: "text-emerald-300" },
          { text: ",", color: "text-neutral-400" },
        ],
      },
      {
        line: 8,
        parts: [
          { text: "  description: ", color: "text-cyan-300" },
          { text: '"Standard subscription tier"', color: "text-emerald-300" },
        ],
      },
      { line: 9, parts: [{ text: "});", color: "text-neutral-300" }] },
      { line: 10, parts: [{ text: "", color: "text-neutral-400" }] },
      {
        line: 11,
        parts: [
          { text: "console.", color: "text-neutral-300" },
          { text: "log", color: "text-blue-400 font-semibold" },
          { text: "(charge.id);", color: "text-neutral-200" },
        ],
      },
    ],
  },
  python: {
    id: "python",
    name: "Python",
    filename: "charge.py",
    code: `import pulse

pulse.api_key = "sk_test_51Mz9x8K1x4LkdI"

charge = pulse.Charge.create(
    amount=2000,
    currency="usd",
    source="tok_visa",
    description="Standard subscription tier",
)

print(charge.id)`,
    highlightedLines: [5, 6],
    tokens: [
      {
        line: 1,
        parts: [
          { text: "import ", color: "text-purple-400 font-bold" },
          { text: "pulse", color: "text-yellow-300" },
        ],
      },
      { line: 2, parts: [{ text: "", color: "text-neutral-400" }] },
      {
        line: 3,
        parts: [
          { text: "pulse.api_key = ", color: "text-neutral-200" },
          { text: '"sk_test_51Mz9x8K1x4LkdI"', color: "text-emerald-300" },
        ],
      },
      { line: 4, parts: [{ text: "", color: "text-neutral-400" }] },
      {
        line: 5,
        parts: [
          { text: "charge = pulse.", color: "text-neutral-200" },
          { text: "Charge", color: "text-yellow-300" },
          { text: ".", color: "text-neutral-300" },
          { text: "create", color: "text-blue-400 font-semibold" },
          { text: "(", color: "text-neutral-300" },
        ],
      },
      {
        line: 6,
        parts: [
          { text: "    amount=", color: "text-cyan-300" },
          { text: "2000", color: "text-orange-300" },
          { text: ",", color: "text-neutral-400" },
        ],
      },
      {
        line: 7,
        parts: [
          { text: "    currency=", color: "text-cyan-300" },
          { text: '"usd"', color: "text-emerald-300" },
          { text: ",", color: "text-neutral-400" },
        ],
      },
      {
        line: 8,
        parts: [
          { text: "    source=", color: "text-cyan-300" },
          { text: '"tok_visa"', color: "text-emerald-300" },
          { text: ",", color: "text-neutral-400" },
        ],
      },
      {
        line: 9,
        parts: [
          { text: "    description=", color: "text-cyan-300" },
          { text: '"Standard subscription tier"', color: "text-emerald-300" },
          { text: ",", color: "text-neutral-400" },
        ],
      },
      { line: 10, parts: [{ text: ")", color: "text-neutral-300" }] },
      { line: 11, parts: [{ text: "", color: "text-neutral-400" }] },
      {
        line: 12,
        parts: [
          { text: "print", color: "text-blue-400 font-semibold" },
          { text: "(charge.id)", color: "text-neutral-200" },
        ],
      },
    ],
  },
  go: {
    id: "go",
    name: "Go",
    filename: "charge.go",
    code: `package main

import (
  "fmt"
  "github.com/pulse/pulse-go"
  "github.com/pulse/pulse-go/charge"
)

func main() {
  pulse.Key = "sk_test_51Mz9x8K1x4LkdI"
  params := &pulse.ChargeParams{
    Amount:   pulse.Int64(2000),
    Currency: pulse.String("usd"),
  }
  ch, _ := charge.New(params)
  fmt.Println(ch.ID)
}`,
    highlightedLines: [11, 12],
    tokens: [
      {
        line: 1,
        parts: [
          { text: "package ", color: "text-purple-400 font-bold" },
          { text: "main", color: "text-neutral-200" },
        ],
      },
      { line: 2, parts: [{ text: "", color: "text-neutral-400" }] },
      {
        line: 3,
        parts: [{ text: "import (", color: "text-purple-400 font-bold" }],
      },
      {
        line: 4,
        parts: [
          { text: '  "fmt"', color: "text-emerald-300" },
        ],
      },
      {
        line: 5,
        parts: [
          { text: '  "github.com/pulse/pulse-go"', color: "text-emerald-300" },
        ],
      },
      {
        line: 6,
        parts: [{ text: ")", color: "text-purple-400 font-bold" }],
      },
      { line: 7, parts: [{ text: "", color: "text-neutral-400" }] },
      {
        line: 8,
        parts: [
          { text: "func ", color: "text-purple-400 font-bold" },
          { text: "main", color: "text-blue-400 font-semibold" },
          { text: "() {", color: "text-neutral-200" },
        ],
      },
      {
        line: 9,
        parts: [
          { text: "  pulse.Key = ", color: "text-neutral-300" },
          { text: '"sk_test_51Mz9x8K1x4LkdI"', color: "text-emerald-300" },
        ],
      },
      {
        line: 10,
        parts: [
          { text: "  params := &pulse.ChargeParams{", color: "text-neutral-300" },
        ],
      },
      {
        line: 11,
        parts: [
          { text: "    Amount:   ", color: "text-cyan-300" },
          { text: "pulse.Int64(2000)", color: "text-orange-300" },
          { text: ",", color: "text-neutral-400" },
        ],
      },
      {
        line: 12,
        parts: [
          { text: "    Currency: ", color: "text-cyan-300" },
          { text: 'pulse.String("usd")', color: "text-emerald-300" },
          { text: ",", color: "text-neutral-400" },
        ],
      },
      { line: 13, parts: [{ text: "  }", color: "text-neutral-300" }] },
      {
        line: 14,
        parts: [
          { text: "  ch, _ := charge.New(params)", color: "text-neutral-200" },
        ],
      },
      {
        line: 15,
        parts: [
          { text: "  fmt.Println(ch.ID)", color: "text-neutral-200" },
        ],
      },
      { line: 16, parts: [{ text: "}", color: "text-neutral-200" }] },
    ],
  },
};

export interface TabbedCodeBlockProps {
  className?: string;
  defaultLang?: string;
  showLineNumbers?: boolean;
}

export function TabbedCodeBlock({
  className,
  defaultLang = "node",
  showLineNumbers = true,
}: TabbedCodeBlockProps) {
  const [activeLang, setActiveLang] = useState<string>(defaultLang);
  const [hasCopied, setHasCopied] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(showLineNumbers);
  const [highlightActive, setHighlightActive] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [runResponse, setRunResponse] = useState<string | null>(null);

  const snippet = SNIPPETS[activeLang] || SNIPPETS.node;

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleRun = () => {
    setIsRunning(true);
    setTerminalOpen(true);
    setTimeout(() => {
      setIsRunning(false);
      setRunResponse(
        JSON.stringify(
          {
            id: `ch_3Mtw12LkdIwHu7ix_${Math.random().toString(36).substring(2, 7)}`,
            object: "charge",
            amount: 2000,
            amount_captured: 2000,
            currency: "usd",
            paid: true,
            status: "succeeded",
            outcome: {
              network_status: "approved_by_network",
              risk_level: "normal",
              seller_message: "Payment complete.",
            },
            created: Math.floor(Date.now() / 1000),
          },
          null,
          2
        )
      );
    }, 700);
  };

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-neutral-800 bg-[#080a14] p-6 text-white flex flex-col justify-between shadow-2xl selection:bg-indigo-500/30",
        className
      )}
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 h-72 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />
      </div>

      {/* Code Card Shell */}
      <div className="relative z-10 w-full max-w-4xl mx-auto rounded-2xl border border-neutral-800/90 bg-[#0a0d1d]/90 shadow-2xl backdrop-blur-xl overflow-hidden">
        {/* Header Bar with Mac Dots, Tabs, Actions */}
        <div className="flex flex-wrap items-center justify-between border-b border-neutral-800/80 px-4 py-2.5 bg-neutral-900/50">
          {/* Left: Window controls + Language tabs */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>

            {/* Sliding Underline Tabs */}
            <div className="flex items-center space-x-1" role="tablist">
              {Object.values(SNIPPETS).map((snip) => {
                const isActive = activeLang === snip.id;
                return (
                  <button
                    key={snip.id}
                    onClick={() => setActiveLang(snip.id)}
                    role="tab"
                    aria-selected={isActive}
                    className={cn(
                      "relative px-3 py-1 text-xs font-mono font-medium rounded-md transition-colors",
                      isActive
                        ? "text-white"
                        : "text-neutral-400 hover:text-neutral-200"
                    )}
                  >
                    {snip.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeCodeTabUnderline"
                        className="absolute bottom-0 left-1 right-1 h-0.5 bg-indigo-400 rounded-full"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Filename, Copy Button & Run Button */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline font-mono text-[11px] text-neutral-400 bg-neutral-800/60 px-2 py-0.5 rounded border border-neutral-700/60">
              {snippet.filename}
            </span>

            <button
              onClick={handleCopy}
              title="Copy code"
              className="p-1.5 rounded-lg border border-neutral-700/70 bg-neutral-800/60 text-neutral-300 hover:text-white hover:bg-neutral-700/60 transition-colors flex items-center gap-1.5 text-xs font-mono"
            >
              {hasCopied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-[11px]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span className="text-[11px]">Copy</span>
                </>
              )}
            </button>

            <button
              onClick={handleRun}
              disabled={isRunning}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>Run API</span>
            </button>
          </div>
        </div>

        {/* Code Lines Body */}
        <div className="p-4 overflow-x-auto font-mono text-[13px] leading-relaxed select-text bg-[#080b18]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLang}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {snippet.tokens.map((lineData) => {
                const isHighlighted =
                  highlightActive &&
                  snippet.highlightedLines?.includes(lineData.line);

                return (
                  <div
                    key={lineData.line}
                    className={cn(
                      "flex items-center rounded px-2 py-0.5 transition-colors",
                      isHighlighted
                        ? "bg-indigo-950/40 border-l-2 border-indigo-400 font-medium"
                        : "border-l-2 border-transparent hover:bg-white/[0.02]"
                    )}
                  >
                    {lineNumbers && (
                      <span className="w-8 shrink-0 text-right pr-4 text-neutral-600 select-none text-xs">
                        {lineData.line}
                      </span>
                    )}
                    <span className="flex-1 whitespace-pre">
                      {lineData.parts.map((p, idx) => (
                        <span key={idx} className={p.color}>
                          {p.text}
                        </span>
                      ))}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Interactive Run Console Terminal Output */}
        <AnimatePresence>
          {terminalOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="border-t border-neutral-800 bg-neutral-950/95 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-900 bg-neutral-900/40 text-xs">
                <div className="flex items-center gap-2 text-neutral-400 font-mono">
                  <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-neutral-300 font-medium">Terminal Response Output</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono">
                    HTTP 200 OK
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRunResponse(null)}
                    className="text-neutral-500 hover:text-neutral-300 text-[11px]"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setTerminalOpen(false)}
                    className="text-neutral-500 hover:text-neutral-300 text-[11px]"
                  >
                    Hide
                  </button>
                </div>
              </div>

              <div className="p-4 font-mono text-xs text-neutral-300 overflow-x-auto max-h-48 overflow-y-auto">
                {isRunning ? (
                  <div className="flex items-center gap-2 text-indigo-400 animate-pulse">
                    <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
                    <span>Executing POST /v1/charges against sandbox cluster...</span>
                  </div>
                ) : runResponse ? (
                  <pre className="text-emerald-300 leading-snug whitespace-pre">
                    {runResponse}
                  </pre>
                ) : (
                  <div className="text-neutral-500 italic">
                    Press "Run API" above to dispatch a test charge and observe the JSON outcome.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Stage Controls */}
      <div className="relative z-20 mt-6 pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-neutral-400 font-medium">Language:</span>
          {Object.values(SNIPPETS).map((snip) => (
            <button
              key={snip.id}
              onClick={() => setActiveLang(snip.id)}
              className={cn(
                "px-2.5 py-1 rounded font-mono transition-colors",
                activeLang === snip.id
                  ? "bg-indigo-600 text-white font-semibold"
                  : "bg-neutral-800/80 text-neutral-400 hover:text-white"
              )}
            >
              {snip.name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setLineNumbers(!lineNumbers)}
            className={cn(
              "px-2.5 py-1 rounded border text-xs font-medium transition-colors",
              lineNumbers
                ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                : "bg-neutral-800/60 border-neutral-700 text-neutral-400"
            )}
          >
            Line Numbers: {lineNumbers ? "ON" : "OFF"}
          </button>

          <button
            onClick={() => setHighlightActive(!highlightActive)}
            className={cn(
              "px-2.5 py-1 rounded border text-xs font-medium transition-colors",
              highlightActive
                ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                : "bg-neutral-800/60 border-neutral-700 text-neutral-400"
            )}
          >
            Highlight Lines: {highlightActive ? "ON" : "OFF"}
          </button>

          <button
            onClick={() => setTerminalOpen(!terminalOpen)}
            className={cn(
              "px-2.5 py-1 rounded border text-xs font-medium transition-colors",
              terminalOpen
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                : "bg-neutral-800/60 border-neutral-700 text-neutral-400"
            )}
          >
            Terminal: {terminalOpen ? "Open" : "Closed"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TabbedCodeBlock;
