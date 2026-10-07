"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepSpec {
  id: string;
  label: string;
  caption: string;
}

export interface KineticStepIndicatorProps {
  /** Array of workflow steps. */
  steps?: StepSpec[];
  /** Initial active 0-based step index. Default: 1 */
  defaultStep?: number;
  /** Spring stiffness coefficient for connector liquid fill. Default: 320 */
  stiffness?: number;
  /** Spring damping coefficient for connector liquid fill. Default: 25 */
  damping?: number;
  className?: string;
}

const DEFAULT_STEPS: StepSpec[] = [
  { id: "scaffold", label: "Scaffold", caption: "Two-file .tsx + .meta.ts" },
  { id: "physics", label: "Spring Solver", caption: "Hooke's Law tuning" },
  { id: "registry", label: "Sync CLI", caption: "Shadcn v2 JSON" },
  { id: "ship", label: "Verify", caption: "100/100 SEO audit" },
];

export function KineticStepIndicator({
  steps = DEFAULT_STEPS,
  defaultStep = 1,
  stiffness = 320,
  damping = 25,
  className,
}: KineticStepIndicatorProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [currentStep, setCurrentStep] = useState<number>(defaultStep);

  return (
    <div
      role="group"
      aria-label="Workflow progress steps"
      className={cn(
        "w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-5 dark:border-[#222222] dark:bg-[#0A0A0A]",
        className
      )}
    >
      {/* Nodes & Liquid Connector Tubes */}
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <React.Fragment key={step.id}>
              <motion.button
                type="button"
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Step ${idx + 1}: ${step.label} — ${step.caption}`}
                onClick={() => setCurrentStep(idx)}
                animate={{
                  scale: isCurrent && !shouldReduceMotion ? 1.12 : 1,
                }}
                transition={{ type: "spring", stiffness, damping }}
                className={cn(
                  "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white",
                  isCompleted || isCurrent
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-neutral-200 bg-neutral-50 text-neutral-400 hover:border-neutral-400 dark:border-[#262626] dark:bg-[#141414]"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
              </motion.button>

              {idx < steps.length - 1 && (
                <div className="relative mx-2 h-1 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-[#1F1F1F]">
                  <motion.div
                    initial={false}
                    animate={{
                      scaleX: idx < currentStep ? 1 : 0,
                    }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness, damping }
                    }
                    className="h-full w-full origin-left bg-black dark:bg-white"
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Active Step Telemetry Readout */}
      <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs dark:border-[#1B1B1B]">
        <div>
          <span className="font-semibold text-black dark:text-white">
            {steps[currentStep]?.label}
          </span>
          <span className="ml-2 text-neutral-500 dark:text-neutral-400">
            {steps[currentStep]?.caption}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            className="rounded-lg border border-neutral-200 px-2 py-1 text-[11px] font-semibold text-black disabled:opacity-30 dark:border-[#262626] dark:text-white"
          >
            Prev
          </button>
          <button
            type="button"
            disabled={currentStep === steps.length - 1}
            onClick={() =>
              setCurrentStep((s) => Math.min(steps.length - 1, s + 1))
            }
            className="rounded-lg bg-black px-2.5 py-1 text-[11px] font-semibold text-white disabled:opacity-30 dark:bg-white dark:text-black"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default KineticStepIndicator;
