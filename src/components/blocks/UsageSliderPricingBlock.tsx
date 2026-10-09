"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Server,
  Users,
  Cpu,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Sparkles,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { KineticSlider } from "@/components/ui/KineticSlider";
import { ScrubbableNumberInput } from "@/components/ui/ScrubbableNumberInput";
import { StepperSliderControl } from "@/components/ui/StepperSliderControl";

export interface UsageSliderPricingBlockProps {
  /** Initial request volume. Default: 500000 */
  defaultRequests?: number;
  /** Initial seat licenses count. Default: 8 */
  defaultSeats?: number;
  /** Initial GPU nodes count. Default: 2 */
  defaultGpus?: number;
  /** Title header text */
  title?: string;
  /** Subtitle description text */
  description?: string;
  className?: string;
}

export function UsageSliderPricingBlock({
  defaultRequests = 500_000,
  defaultSeats = 8,
  defaultGpus = 2,
  title = "Precision usage-based infrastructure estimator",
  description = "Tune requests, developer seats, and dedicated AI accelerators. Pay exclusively for provisioned resources.",
  className,
}: UsageSliderPricingBlockProps) {
  const [requests, setRequests] = useState<number>(defaultRequests);
  const [seats, setSeats] = useState<number>(defaultSeats);
  const [gpus, setGpus] = useState<number>(defaultGpus);

  // Financial rates
  const BASE_CLUSTER_FEE = 49;
  const REQUEST_RATE_PER_100K = 4; // $4 per 100K calls
  const SEAT_RATE = 15; // $15 per seat/mo
  const GPU_RATE = 120; // $120 per GPU node/mo

  const requestsCost = useMemo(() => {
    return Math.round((requests / 100_000) * REQUEST_RATE_PER_100K);
  }, [requests]);

  const seatsCost = useMemo(() => {
    return seats * SEAT_RATE;
  }, [seats]);

  const gpusCost = useMemo(() => {
    return gpus * GPU_RATE;
  }, [gpus]);

  const totalMonthlyCost = useMemo(() => {
    return BASE_CLUSTER_FEE + requestsCost + seatsCost + gpusCost;
  }, [requestsCost, seatsCost, gpusCost]);

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[540px] overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-[#07080D] p-6 sm:p-8 md:p-10 text-neutral-900 dark:text-white shadow-xl flex flex-col justify-between",
        className
      )}
    >
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute -top-40 right-1/4 w-[600px] h-[320px] bg-emerald-500/10 dark:bg-emerald-600/15 blur-[120px] rounded-full"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <Sliders className="h-3.5 w-3.5" />
          <span>GRANULAR RESOURCE CONFIGURATOR</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {title}
        </h2>

        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Main 2-column configuration grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-stretch">
        {/* Left column: 3 interactive sliders / scrubbers */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-md p-6 sm:p-8">
          {/* 1. KineticSlider for Request Invocations */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Server className="h-4 w-4 text-emerald-500" />
                API Request Volume
              </span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">
                ${REQUEST_RATE_PER_100K} per 100K ops
              </span>
            </div>
            <KineticSlider
              label="Monthly Invocations"
              min={100_000}
              max={5_000_000}
              step={50_000}
              unit="reqs"
              value={requests}
              onChange={(val: number) => setRequests(val)}
              className="pt-1"
            />
          </div>

          {/* 2. ScrubbableNumberInput for Seats */}
          <div className="space-y-2 border-t border-neutral-200/80 dark:border-neutral-800/80 pt-5">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-blue-500" />
                Collaborator Seats
              </span>
              <span className="font-mono text-blue-600 dark:text-blue-400">
                ${SEAT_RATE}/user/mo
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                Scrub horizontally or click buttons to adjust team licenses.
              </div>
              <ScrubbableNumberInput
                label="Team Seats"
                min={1}
                max={64}
                step={1}
                unit="seats"
                value={seats}
                onChange={(val: number) => setSeats(val)}
              />
            </div>
          </div>

          {/* 3. StepperSliderControl for GPU Nodes */}
          <div className="space-y-2 border-t border-neutral-200/80 dark:border-neutral-800/80 pt-5">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-purple-500" />
                Dedicated A100 GPU Clusters
              </span>
              <span className="font-mono text-purple-600 dark:text-purple-400">
                ${GPU_RATE}/GPU/mo
              </span>
            </div>
            <StepperSliderControl
              label="Compute Accelerators"
              min={0}
              max={16}
              step={1}
              unit="GPUs"
              value={gpus}
              onChange={(val: number) => setGpus(val)}
            />
          </div>
        </div>

        {/* Right column: Dynamic cost summary card */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-gradient-to-b from-white to-emerald-50/40 dark:from-neutral-900/90 dark:to-emerald-950/20 p-6 sm:p-8 shadow-lg">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Provisioned Estimate
                </span>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mt-0.5">
                  Cluster Cost Summary
                </h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>

            {/* Total Price Display */}
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-black/50 p-5">
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                Total monthly commitment
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl sm:text-5xl font-mono font-extrabold tracking-tight text-neutral-900 dark:text-white">
                  ${totalMonthlyCost.toLocaleString()}
                </span>
                <span className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  / month
                </span>
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Zero setup fees • Per-second compute metering</span>
              </div>
            </div>

            {/* Itemized Line Items */}
            <div className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400 border-t border-neutral-200/80 dark:border-neutral-800/80 pt-4">
              <div className="flex justify-between items-center">
                <span>Base High-Availability VPC</span>
                <span className="font-mono text-neutral-900 dark:text-neutral-200 font-medium">
                  ${BASE_CLUSTER_FEE}.00
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>API Calls ({requests.toLocaleString()} reqs)</span>
                <span className="font-mono text-neutral-900 dark:text-neutral-200 font-medium">
                  ${requestsCost}.00
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Developer Seats ({seats} users)</span>
                <span className="font-mono text-neutral-900 dark:text-neutral-200 font-medium">
                  ${seatsCost}.00
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>GPU Accelerators ({gpus} units)</span>
                <span className="font-mono text-neutral-900 dark:text-neutral-200 font-medium">
                  ${gpusCost}.00
                </span>
              </div>
            </div>
          </div>

          {/* Checkout CTA */}
          <div className="pt-6 space-y-3">
            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold px-5 py-3 text-sm shadow-md shadow-emerald-600/25 transition-all cursor-pointer group"
            >
              <span>Provision Configured Cluster</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Instant provisioning • 99.99% SLA • Cancel any cycle</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info Strip */}
      <div className="relative z-10 border-t border-neutral-200/60 dark:border-neutral-800/60 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 gap-2">
        <div className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-neutral-400" />
          <span>Need reserved instance discounts for 1-year or 3-year commitments?</span>
        </div>
        <a
          href="#enterprise"
          className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium inline-flex items-center gap-1"
        >
          <span>Calculate Enterprise Volume Discount</span>
          <ArrowRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
