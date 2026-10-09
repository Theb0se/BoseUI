"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Github,
  Twitter,
  Disc as Discord,
  Send,
} from "lucide-react";
import { Fireflies } from "@/components/ui/Fireflies";
import { FloatingLabelInput } from "@/components/ui/FloatingLabelInput";
import { MorphingActionButton } from "@/components/ui/MorphingActionButton";
import { cn } from "@/lib/utils";

export interface NewsletterFooterProps {
  title?: string;
  description?: string;
  className?: string;
}

export function NewsletterFooter({
  title = "Stay in orbit with kinetic interface updates",
  description = "Get notified about new high-performance WebGL shaders, composite blocks, and motion engineering breakdowns every month.",
  className,
}: NewsletterFooterProps) {
  const [email, setEmail] = useState("");
  const [subscribedToast, setSubscribedToast] = useState(false);

  return (
    <footer
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[600px] overflow-hidden rounded-3xl bg-[#050811] text-white border border-neutral-800 shadow-2xl flex flex-col justify-between",
        className
      )}
    >
      {/* Background Bioluminescent Fireflies Atmosphere */}
      <div className="absolute inset-0 pointer-events-none opacity-45">
        <Fireflies
          count={40}
          glowColor="#A7F3D0"
          showForest={true}
          interactive={true}
          className="h-full w-full rounded-none border-0"
        >
          <div className="hidden" />
        </Fireflies>
      </div>

      {/* Main Center Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 text-center my-auto w-full">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-mono text-emerald-300 mb-6 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span>ZERO-SPAM · CURATED DEV DIGEST</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
          {title}
        </h2>

        <p className="mt-4 text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
          {description}
        </p>

        {/* Newsletter Interactive Form Card */}
        <div className="mt-8 mx-auto max-w-md rounded-2xl border border-white/10 bg-neutral-900/80 p-5 sm:p-6 backdrop-blur-xl shadow-2xl text-left">
          <div className="space-y-4">
            <FloatingLabelInput
              label="Work Email Address"
              value={email}
              defaultValue=""
              onChange={(val) => setEmail(val)}
              type="email"
              helperText="We respect your privacy. Unsubscribe anytime with 1 click."
              className="bg-neutral-950/60"
            />

            <div className="flex justify-end pt-2">
              <div onClick={() => setSubscribedToast(true)}>
                <MorphingActionButton
                  idleLabel="Subscribe to Digest"
                  loadingLabel="Registering..."
                  successLabel="Subscribed!"
                  className="w-full sm:w-auto"
                />
              </div>
            </div>
          </div>

          {/* Toast Stack confirmation */}
          {subscribedToast && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>You&apos;re subscribed! Check your inbox for the welcome digest.</span>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              SOC2 &amp; GDPR Compliant
            </span>
            <span>Monthly Frequency</span>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Social Links */}
      <div className="relative z-10 border-t border-neutral-800/80 bg-neutral-950/60 px-6 py-6 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} BoseUI Systems</span>
            <span className="text-neutral-600">/</span>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <span className="text-neutral-600">/</span>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>

          <div className="flex items-center gap-4 text-neutral-300">
            <a href="#" aria-label="GitHub" className="hover:text-white transition-colors">
              <Github className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-white transition-colors">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Discord" className="hover:text-white transition-colors">
              <Discord className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default NewsletterFooter;
