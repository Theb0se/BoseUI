"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Star,
  Quote,
  CheckCircle2,
  Building2,
  MessageSquare,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CustomerTestimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
  verified: boolean;
  metrics: { label: string; value: string };
  initialReactions: {
    emoji: string;
    count: number;
    reactedByMe: boolean;
  }[];
}

const CUSTOMER_TESTIMONIALS: CustomerTestimonial[] = [
  {
    id: "review-1",
    name: "Elena Rostova",
    role: "VP of Product Engineering",
    company: "Aether Cloud",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    quote:
      "Replacing our custom motion curves with Bose UI cut interaction jank by 94%. Our design team and engineers finally share the exact same Hooke's Law physics vocabulary.",
    rating: 5,
    verified: true,
    metrics: { label: "Design System Velocity", value: "+340%" },
    initialReactions: [
      { emoji: "🚀", count: 48, reactedByMe: true },
      { emoji: "🔥", count: 32, reactedByMe: false },
      { emoji: "❤️", count: 19, reactedByMe: false },
    ],
  },
  {
    id: "review-2",
    name: "Marcus Vance",
    role: "Staff Design Systems Architect",
    company: "LinearFlow",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    quote:
      "The zero-dependency approach is revolutionary. We copied the MegaNavbar and Bento cards directly into our Monorepo and had our marketing redesign live within 48 hours.",
    rating: 5,
    verified: true,
    metrics: { label: "Time to Production", value: "2 Days" },
    initialReactions: [
      { emoji: "🔥", count: 57, reactedByMe: true },
      { emoji: "🎉", count: 24, reactedByMe: false },
      { emoji: "❤️", count: 15, reactedByMe: false },
    ],
  },
  {
    id: "review-3",
    name: "Sophia Sterling",
    role: "Head of Frontend",
    company: "NovaPay Global",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    quote:
      "Our checkout completion increased by 18% after swapping standard dropdowns for these kinetic spring cards. Users literally comment on how responsive the UI feels.",
    rating: 5,
    verified: true,
    metrics: { label: "Checkout Conversion", value: "+18.2%" },
    initialReactions: [
      { emoji: "❤️", count: 62, reactedByMe: true },
      { emoji: "🚀", count: 41, reactedByMe: false },
      { emoji: "🔥", count: 29, reactedByMe: false },
    ],
  },
];

const STORY_SLIDES = [
  {
    id: "story-1",
    tag: "CASE STUDY · FINTECH",
    title: "NovaPay scaled to 45M transactions with 0 frame drops",
    subtitle:
      "Discover how NovaPay utilized our animated ticker numbers and bento blocks to build real-time banking telemetry that delights millions.",
    stats: [
      { label: "Daily Transactions", value: "45M+" },
      { label: "Frame Budget Latency", value: "< 7.8ms" },
    ],
    date: "Case Study 2026",
  },
  {
    id: "story-2",
    tag: "CASE STUDY · DEVTOOLS",
    title: "Aether Cloud reduced design system debt by 70%",
    subtitle:
      "A complete walkthrough of migrating legacy UI kits to pure TypeScript spring physics primitives with zero CSS bundle footprint.",
    stats: [
      { label: "Code Repositories", value: "24 Monorepos" },
      { label: "Deployment Speed", value: "3.2x Faster" },
    ],
    date: "Case Study 2026",
  },
  {
    id: "story-3",
    tag: "CUSTOMER SUCCESS",
    title: "LinearFlow launched their 2026 overhaul in 48 hours",
    subtitle:
      "Empowered designers and engineers to speak the same declarative physics parameters without tedious back-and-forth reviews.",
    stats: [
      { label: "Components Replaced", value: "48 Primitives" },
      { label: "Lighthouse Score", value: "100/100" },
    ],
    date: "Case Study 2026",
  },
];

export interface TestimonialsBlockProps {
  /** Eyebrow section tag */
  eyebrow?: string;
  /** Main section headline */
  title?: string;
  /** Section summary copy */
  description?: string;
  className?: string;
}

export function TestimonialsBlock({
  eyebrow = "SOCIAL PROOF & REVIEWS",
  title = "Loved by High-Velocity Engineering Teams",
  description = "Join thousands of product creators and design engineers building fluid, physics-based user interfaces.",
  className,
}: TestimonialsBlockProps) {
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [reactions, setReactions] = useState(
    CUSTOMER_TESTIMONIALS.map((t) => [...t.initialReactions])
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStoryIndex((prev) => (prev + 1) % STORY_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const activeReview = CUSTOMER_TESTIMONIALS[activeReviewIndex];
  const activeStory = STORY_SLIDES[activeStoryIndex];

  const handleToggleReaction = (reviewIdx: number, emojiIdx: number) => {
    setReactions((prev) => {
      const copy = [...prev];
      const reviewReactions = [...copy[reviewIdx]];
      const item = { ...reviewReactions[emojiIdx] };
      if (item.reactedByMe) {
        item.count -= 1;
        item.reactedByMe = false;
      } else {
        item.count += 1;
        item.reactedByMe = true;
      }
      reviewReactions[emojiIdx] = item;
      copy[reviewIdx] = reviewReactions;
      return copy;
    });
  };

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[540px] overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-950 p-6 sm:p-10 lg:p-12 text-neutral-100 shadow-2xl dark:border-neutral-800",
        className
      )}
    >
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-rose-600/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* Section Header */}
      <div className="relative z-10 mx-auto max-w-3xl text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/90 px-3 py-1 text-xs font-mono text-neutral-300 backdrop-blur-md mb-4">
          <Users className="h-3.5 w-3.5 text-rose-400" />
          <span>{eyebrow}</span>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h2>

        <p className="mt-3.5 text-sm text-neutral-400 sm:text-base leading-relaxed">
          {description}
        </p>

        {/* Aggregate Ratings Banner */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400">
          <div className="flex items-center gap-1.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
              ))}
            </div>
            <span className="font-semibold text-white">4.98 / 5.0</span>
            <span>across 1,400+ reviews</span>
          </div>
          <span className="hidden sm:inline text-neutral-700">•</span>
          <div className="flex items-center gap-1 text-emerald-400 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>100% Enterprise Verified</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Story Carousel + Customer Review Card */}
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Featured Enterprise Stories */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between min-h-[380px]">
              <div>
                <div className="pb-4 border-b border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <Sparkles className="h-3.5 w-3.5" />
                    FEATURED_ENTERPRISE_STORIES
                  </span>
                  <div className="flex gap-1.5">
                    {STORY_SLIDES.map((s, idx) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setActiveStoryIndex(idx)}
                        className={cn(
                          "h-1.5 rounded-full transition-all",
                          idx === activeStoryIndex ? "w-6 bg-blue-500" : "w-1.5 bg-neutral-700 hover:bg-neutral-500"
                        )}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                    {activeStory.tag}
                  </span>
                  <h3 className="mt-2 text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                    {activeStory.title}
                  </h3>
                  <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
                    {activeStory.subtitle}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-neutral-800/80 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {activeStory.stats.map((st, i) => (
                    <div key={i}>
                      <div className="text-[11px] font-mono text-neutral-500">{st.label}</div>
                      <div className="text-base font-bold font-mono text-white">{st.value}</div>
                    </div>
                  ))}
                </div>
                <span className="text-xs font-mono text-neutral-500">{activeStory.date}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Customer Testimonial Card with Reactions */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            
            {/* Review Switcher Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {CUSTOMER_TESTIMONIALS.map((t, idx) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveReviewIndex(idx)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
                    idx === activeReviewIndex
                      ? "bg-white text-neutral-950 font-semibold shadow-md"
                      : "border border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:text-white"
                  )}
                >
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{t.company}</span>
                </button>
              ))}
            </div>

            {/* Selected Testimonial Card */}
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              {/* Quote Mark & Rating */}
              <div className="flex items-center justify-between">
                <Quote className="h-8 w-8 text-neutral-700" />
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(activeReview.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
              </div>

              {/* Quote Copy */}
              <p className="mt-5 text-base sm:text-lg text-neutral-200 font-normal leading-relaxed italic">
                "{activeReview.quote}"
              </p>

              {/* Author Info */}
              <div className="mt-6 flex items-center justify-between border-t border-neutral-800/80 pt-5">
                <div className="flex items-center gap-3.5">
                  <img
                    src={activeReview.avatar}
                    alt={activeReview.name}
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-neutral-700"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                      {activeReview.name}
                      {activeReview.verified && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
                      )}
                    </h4>
                    <p className="text-xs text-neutral-400">
                      {activeReview.role} · <span className="text-neutral-300 font-medium">{activeReview.company}</span>
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[11px] text-neutral-500">{activeReview.metrics.label}</span>
                  <span className="font-mono text-sm font-bold text-emerald-400">
                    {activeReview.metrics.value}
                  </span>
                </div>
              </div>

              {/* Interactive Reaction Pills */}
              <div className="mt-6 pt-5 border-t border-neutral-800/70">
                <div className="mb-2 flex items-center justify-between text-xs text-neutral-400">
                  <span className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-500">
                    <MessageSquare className="h-3 w-3 text-rose-400" />
                    COMMUNITY_REACTIONS
                  </span>
                  <span className="text-[11px] text-neutral-500">Click emoji to react</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {reactions[activeReviewIndex].map((r, emojiIdx) => (
                    <button
                      key={r.emoji}
                      type="button"
                      onClick={() => handleToggleReaction(activeReviewIndex, emojiIdx)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all",
                        r.reactedByMe
                          ? "border border-rose-500/40 bg-rose-500/15 text-rose-300 shadow-sm"
                          : "border border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white hover:border-neutral-700"
                      )}
                    >
                      <span>{r.emoji}</span>
                      <span className="font-mono text-[11px]">{r.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default TestimonialsBlock;
