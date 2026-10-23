"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Globe2, Terminal, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DeveloperHeroSectionProps {
  headline?: string;
  tagline?: string;
  className?: string;
}

const CODE_SNIPPETS = {
  typescript: `import { BoseUIClient } from "@boseui/sdk";

const client = new BoseUIClient({
  apiKey: process.env.BOSE_SECRET_KEY,
  environment: "production",
});

// Initialize real-time financial stream
const stream = await client.transactions.stream({
  currency: "usd",
  limit: 100,
});

for await (const tx of stream) {
  console.log(\`Settled \${tx.id}: $\${tx.amount / 100}\`);
}`,
  curl: `curl https://api.boseui.com/v1/settlements \\
  -u sk_live_948f0e21a8...: \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 250000,
    "currency": "usd",
    "destination": "acct_8492019",
    "instant_payout": true
  }'`,
  python: `from boseui import BoseClient

client = BoseClient(api_key="sk_live_948f0e21a8...")

# Create automated split payout
payout = client.payouts.create(
    amount=250000,
    currency="usd",
    destination="acct_8492019",
    speed="instant"
)
print(f"Payout confirmed: {payout.status}")`,
};

export function DeveloperHeroSection({
  headline = "The financial infrastructure built for developers.",
  tagline = "Accept payments, send payouts, and automate financial workflows globally with a battle-tested API designed for reliability at scale.",
  className,
}: DeveloperHeroSectionProps) {
  const [activeLang, setActiveLang] = useState<"typescript" | "curl" | "python">("typescript");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(CODE_SNIPPETS[activeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[720px] overflow-hidden rounded-3xl bg-neutral-950 text-white border border-neutral-800 shadow-2xl",
        className
      )}
    >
      {/* Top Gradient Mesh Hero Section */}
      <div className="relative overflow-hidden border-b border-neutral-800 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370f_1px,transparent_1px),linear-gradient(to_bottom,#1f29370f_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left Column: Headline and Badges */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-mono text-cyan-300 backdrop-blur-md">
                <Zap className="h-3.5 w-3.5 text-cyan-400" />
                <span>BoseUI API v2.4 Released</span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.08]">
                {headline}
              </h1>

              <p className="text-base text-neutral-300 leading-relaxed max-w-xl">
                {tagline}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="/docs"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-neutral-950 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Start Building</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#network"
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/10"
                >
                  <Globe2 className="h-4 w-4 text-cyan-400" />
                  <span>Explore Global Backbone</span>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-mono text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  99.999% SLA
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-cyan-400" />
                  PCI-DSS Level 1
                </span>
                <span className="flex items-center gap-1.5">
                  <Terminal className="h-4 w-4 text-purple-400" />
                  Sub-20ms Latency
                </span>
              </div>
            </div>

            {/* Right Column: Developer Code Block Terminal */}
            <div className="lg:col-span-6 w-full">
              <div className="overflow-hidden rounded-2xl border border-white/15 bg-neutral-900/90 shadow-2xl backdrop-blur-xl">
                {/* Code Window Header */}
                <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950/80 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono text-xs text-neutral-400">sdk-stream.ts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex rounded-lg bg-neutral-800/80 p-0.5 text-xs font-mono">
                      {(["typescript", "curl", "python"] as const).map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setActiveLang(lang)}
                          className={cn(
                            "rounded-md px-2.5 py-1 transition-all",
                            activeLang === lang
                              ? "bg-neutral-700 text-white shadow-sm"
                              : "text-neutral-400 hover:text-white"
                          )}
                        >
                          {lang === "typescript" ? "TypeScript" : lang === "curl" ? "cURL" : "Python"}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="rounded-md border border-neutral-700 bg-neutral-800 p-1.5 text-neutral-300 hover:text-white transition-colors"
                      title="Copy Code"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
                {/* Code Body */}
                <pre className="overflow-x-auto p-4 text-xs font-mono leading-relaxed text-neutral-200">
                  <code>{CODE_SNIPPETS[activeLang]}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Global Infrastructure Showcase */}
      <div id="network" className="relative border-t border-neutral-800 bg-[#080808] px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-6">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                Resilient Global Backbone
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">
                Global Transaction Routing &amp; Edge Settlement
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
              <span>San Francisco · New York · London · Tokyo · Singapore</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 items-center">
            <div className="lg:col-span-8">
              <div className="relative min-h-[340px] rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 overflow-hidden flex flex-col justify-between">
                {/* Global Topology SVG Graphic */}
                <svg className="w-full h-56" viewBox="0 0 800 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Subtle Grid / Latitudes */}
                  <line x1="50" y1="75" x2="750" y2="75" stroke="#334155" strokeWidth="0.5" strokeDasharray="4 4" />
                  <line x1="50" y1="150" x2="750" y2="150" stroke="#334155" strokeWidth="0.5" strokeDasharray="4 4" />
                  <line x1="50" y1="225" x2="750" y2="225" stroke="#334155" strokeWidth="0.5" strokeDasharray="4 4" />

                  {/* Arcs between key regions */}
                  <path d="M 160 140 Q 280 60 400 110" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6 6" className="animate-pulse" />
                  <path d="M 400 110 Q 520 70 640 130" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 6" />
                  <path d="M 160 140 Q 380 20 640 130" stroke="#818cf8" strokeWidth="1.5" strokeOpacity="0.7" />
                  <path d="M 400 110 Q 560 220 700 170" stroke="#34d399" strokeWidth="1.5" strokeDasharray="4 4" />

                  {/* Nodes */}
                  {/* San Francisco */}
                  <circle cx="160" cy="140" r="7" fill="#06b6d4" fillOpacity="0.3" />
                  <circle cx="160" cy="140" r="3.5" fill="#06b6d4" />
                  <text x="135" y="165" fill="#94a3b8" fontSize="11" fontFamily="monospace">SFO (Edge-01)</text>

                  {/* New York / London */}
                  <circle cx="400" cy="110" r="7" fill="#38bdf8" fillOpacity="0.3" />
                  <circle cx="400" cy="110" r="3.5" fill="#38bdf8" />
                  <text x="375" y="95" fill="#94a3b8" fontSize="11" fontFamily="monospace">LON (Core-01)</text>

                  {/* Tokyo */}
                  <circle cx="640" cy="130" r="7" fill="#818cf8" fillOpacity="0.3" />
                  <circle cx="640" cy="130" r="3.5" fill="#818cf8" />
                  <text x="625" y="115" fill="#94a3b8" fontSize="11" fontFamily="monospace">TYO (Edge-02)</text>

                  {/* Singapore */}
                  <circle cx="700" cy="170" r="7" fill="#34d399" fillOpacity="0.3" />
                  <circle cx="700" cy="170" r="3.5" fill="#34d399" />
                  <text x="680" y="195" fill="#94a3b8" fontSize="11" fontFamily="monospace">SIN (Edge-03)</text>
                </svg>

                <div className="flex items-center justify-between text-xs font-mono text-neutral-400 border-t border-neutral-800/80 pt-3">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    All Edge Regions Operational
                  </span>
                  <span>Average Inter-region ping: 38ms</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md">
                <p className="text-xs font-mono text-neutral-400">Global Processing Capacity</p>
                <p className="mt-1 text-3xl font-bold text-white">$4.8B+</p>
                <p className="mt-1 text-xs text-neutral-400">Monthly gross volume routed across 140+ countries.</p>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md">
                <p className="text-xs font-mono text-neutral-400">Average P99 Settlement Latency</p>
                <p className="mt-1 text-3xl font-bold text-cyan-400">14.2 ms</p>
                <p className="mt-1 text-xs text-neutral-400">Decentralized edge compute with automated failover.</p>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md">
                <p className="text-xs font-mono text-neutral-400">Zero-Downtime Releases</p>
                <p className="mt-1 text-3xl font-bold text-emerald-400">99.999%</p>
                <p className="mt-1 text-xs text-neutral-400">Multi-cloud consensus with zero maintenance windows.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DeveloperHeroSection;
