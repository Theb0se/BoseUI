"use client";

import React, { useState } from "react";
import { Sparkles, Bot, Wand2, Terminal, Code2, ArrowUpRight, Cpu, Send, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AiAssistantBlockProps {
  title?: string;
  tagline?: string;
  className?: string;
}

const AI_SUGGESTIONS = [
  { label: "Audit WCAG 2.1 AA", icon: Sparkles, query: "/audit WCAG compliance" },
  { label: "Refactor Tailwind Tokens", icon: Wand2, query: "/refactor design tokens" },
  { label: "Generate React 19 Hook", icon: Code2, query: "/create useKineticSpring" },
  { label: "Profile WebGL Frame Time", icon: Cpu, query: "/profile shader performance" },
];

export function AiAssistantBlock({
  title = "Intelligent Copilot for Modern Interfaces",
  tagline = "Summon generative reasoning, slash commands, and multi-modal canvas tools with physical edge feedback.",
  className,
}: AiAssistantBlockProps) {
  const [activeQuery, setActiveQuery] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSelectSuggestion = (query: string) => {
    setActiveQuery(query);
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(activeQuery || "npx boseui@latest add");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[680px] overflow-hidden rounded-3xl bg-neutral-950 p-6 md:p-12 text-white border border-neutral-800 shadow-2xl",
        className
      )}
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(147,51,234,0.12),transparent_70%)]" />

      {/* Header section */}
      <div className="relative mx-auto max-w-4xl text-center space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-mono text-purple-300">
          <Bot className="h-3.5 w-3.5 text-purple-400" />
          <span>Siri-Grade Chromatic Intelligence</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
          {title}
        </h2>

        <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          {tagline}
        </p>

        {/* Suggestion action pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {AI_SUGGESTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleSelectSuggestion(item.query)}
                className="group inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/80 px-3.5 py-2 text-xs font-medium text-neutral-300 backdrop-blur-md transition-all hover:border-purple-500/40 hover:bg-neutral-800 hover:text-white"
              >
                <Icon className="h-3.5 w-3.5 text-purple-400 transition-transform group-hover:scale-110" />
                <span>{item.label}</span>
                <ArrowUpRight className="h-3 w-3 text-neutral-500 group-hover:text-neutral-300" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Main card stage */}
      <div className="relative mx-auto max-w-4xl">
        <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-cyan-500/30">
          <div className="relative bg-neutral-900/90 rounded-2xl border border-neutral-800/80 p-5 sm:p-7 backdrop-blur-xl">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-3 w-3 items-center justify-center">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                </div>
                <span className="text-xs font-mono text-neutral-400">
                  Agent Context: Autonomous Codebase Sandbox
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-neutral-800/80 px-2.5 py-1 text-[11px] font-mono text-neutral-400">
                  <Terminal className="h-3 w-3 text-cyan-400" />
                  <span>Interactive Assistant Console</span>
                </span>
              </div>
            </div>

            {/* Prompt Bar & Terminal Preview */}
            <div className="min-h-[280px] flex flex-col justify-between gap-6">
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 font-mono text-xs text-neutral-300 leading-relaxed">
                <div className="text-neutral-500 mb-2">// Active execution stdout stream</div>
                <div className="flex items-center gap-2 text-cyan-400">
                  <span className="select-none">$</span>
                  <span>{activeQuery || "boseui assistant --ready"}</span>
                </div>
                {isExecuting ? (
                  <div className="mt-3 flex items-center gap-2 text-purple-400">
                    <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                    <span>Analyzing AST design tokens and generating optimized code...</span>
                  </div>
                ) : (
                  <div className="mt-3 text-neutral-400">
                    ✔ Ready for next instruction. Select any prompt suggestion above or input command below.
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-950/80 p-2">
                <input
                  type="text"
                  value={activeQuery}
                  onChange={(e) => setActiveQuery(e.target.value)}
                  placeholder="Type a command or design request..."
                  className="flex-1 bg-transparent px-3 py-1.5 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-800 text-xs font-mono text-neutral-200 hover:text-white transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Send className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiAssistantBlock;
