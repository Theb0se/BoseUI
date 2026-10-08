"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepItem {
  id: string;
  title: string;
  description: string;
  detail?: string;
}

export interface StepperProps {
  /** Array of steps to render in the wizard */
  steps?: StepItem[];
  /** Controlled active step index (0-based) */
  activeStep?: number;
  /** Initial active step index for uncontrolled mode. Default: 0 */
  defaultStep?: number;
  /** Callback fired when active step changes */
  onStepChange?: (stepIndex: number) => void;
  /** Callback fired when the final step is completed */
  onComplete?: () => void;
  /** Allow clicking directly on step circles to jump between steps. Default: true */
  allowStepClick?: boolean;
  className?: string;
}

const DEFAULT_STEPS: StepItem[] = [
  {
    id: "workspace",
    title: "Workspace",
    description: "Configure your project name and repository region.",
    detail: "Connected to us-east-1 production cluster with automatic backups enabled.",
  },
  {
    id: "tokens",
    title: "Design Tokens",
    description: "Sync Tailwind CSS colors, radius, and typography scales.",
    detail: "Monochrome light & dark CSS variables verified in globals.css.",
  },
  {
    id: "deploy",
    title: "Ship & Verify",
    description: "Run pre-flight checks and publish your component registry.",
    detail: "All TypeScript checks passed. Ready to deploy to production.",
  },
];

export function Stepper({
  steps = DEFAULT_STEPS,
  activeStep: controlledStep,
  defaultStep = 0,
  onStepChange,
  onComplete,
  allowStepClick = true,
  className,
}: StepperProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const isControlled = controlledStep !== undefined;

  const [internalStep, setInternalStep] = useState(defaultStep);
  const [direction, setDirection] = useState<1 | -1>(1);

  const currentStep = isControlled ? controlledStep : internalStep;
  const totalSteps = steps.length;
  const isComplete = currentStep >= totalSteps;

  const goToStep = (next: number) => {
    const clamped = Math.max(0, Math.min(totalSteps, next));
    setDirection(clamped >= currentStep ? 1 : -1);
    if (!isControlled) {
      setInternalStep(clamped);
    }
    onStepChange?.(clamped);
    if (clamped === totalSteps) {
      onComplete?.();
    }
  };

  const progressPct =
    totalSteps <= 1
      ? 100
      : Math.min(100, (Math.min(currentStep, totalSteps - 1) / (totalSteps - 1)) * 100);

  const activeItem = steps[Math.min(currentStep, totalSteps - 1)];

  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-[#262626] dark:bg-[#0A0A0A]",
        className
      )}
    >
      {/* Step Header Track */}
      <div className="relative mb-6">
        {/* Background Connector Line */}
        <div className="absolute left-4 right-4 top-4 h-0.5 bg-neutral-200 dark:bg-[#222222]" />

        {/* Animated Progress Fill Line */}
        <motion.div
          initial={false}
          animate={{ width: `calc(${progressPct}% - 16px)` }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 320, damping: 30 }
          }
          className="absolute left-4 top-4 h-0.5 bg-black dark:bg-white"
        />

        {/* Step Nodes */}
        <div className="relative z-10 flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = currentStep > index;
            const isCurrent = currentStep === index;

            return (
              <div key={step.id} className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  disabled={!allowStepClick}
                  onClick={() => allowStepClick && goToStep(index)}
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white",
                    allowStepClick ? "cursor-pointer" : "cursor-default",
                    isCompleted || isCurrent
                      ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                      : "border-neutral-300 bg-white text-neutral-400 dark:border-[#262626] dark:bg-[#0A0A0A] dark:text-neutral-500"
                  )}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isCompleted ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="num"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="font-mono"
                      >
                        {index + 1}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
                <span
                  className={cn(
                    "text-[11px] font-medium transition-colors",
                    isCurrent || isCompleted
                      ? "text-black dark:text-white"
                      : "text-neutral-400 dark:text-neutral-500"
                  )}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Body Content */}
      <div className="min-h-[108px] overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4 dark:border-[#1F1F1F] dark:bg-[#111111]">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          {isComplete ? (
            <motion.div
              key="completed-state"
              initial={
                shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }
              }
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="flex flex-col items-start gap-1.5"
            >
              <div className="inline-flex items-center gap-1.5 rounded-full bg-black px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white dark:bg-white dark:text-black">
                <Check className="h-3 w-3" />
                All Steps Complete
              </div>
              <h4 className="text-sm font-semibold text-black dark:text-white">
                Setup Finished Successfully
              </h4>
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                Your configuration is live and ready. You can review any previous step or reset the wizard.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={activeItem.id}
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: direction * 18 }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: direction * -18 }
              }
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  Step {currentStep + 1} of {totalSteps}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-black dark:text-white">
                {activeItem.title}
              </h4>
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                {activeItem.description}
              </p>
              {activeItem.detail && (
                <p className="mt-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 font-mono text-[11px] text-neutral-500 dark:border-[#222222] dark:bg-[#0A0A0A] dark:text-neutral-400">
                  {activeItem.detail}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Controls */}
      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          disabled={currentStep === 0}
          onClick={() => goToStep(currentStep - 1)}
          className="inline-flex h-9 items-center gap-1 rounded-xl border border-neutral-200 px-3 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100 disabled:pointer-events-none disabled:opacity-40 dark:border-[#262626] dark:text-neutral-300 dark:hover:bg-[#161616]"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Back
        </button>

        {isComplete ? (
          <button
            type="button"
            onClick={() => goToStep(0)}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-100 px-3.5 text-xs font-semibold text-black transition-colors hover:bg-neutral-200 dark:border-[#262626] dark:bg-[#161616] dark:text-white dark:hover:bg-[#222222]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Wizard
          </button>
        ) : (
          <button
            type="button"
            onClick={() => goToStep(currentStep + 1)}
            className="inline-flex h-9 items-center gap-1 rounded-xl bg-black px-4 text-xs font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
          >
            <span>{currentStep === totalSteps - 1 ? "Complete" : "Continue"}</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Stepper;
