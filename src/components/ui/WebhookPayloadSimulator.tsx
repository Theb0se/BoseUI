"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Webhook,
  Send,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  ShieldCheck,
  RotateCcw,
  Clock,
  Sparkles,
  KeyRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface WebhookEventPayload {
  id: string;
  type: string;
  created: number;
  data: Record<string, unknown>;
}

export interface WebhookPayloadSimulatorProps {
  /** Target webhook destination URL */
  defaultTargetUrl?: string;
  /** Initial selected webhook event type */
  defaultEventType?: string;
  /** Mock HMAC secret key */
  hmacSecret?: string;
  /** Callback when dispatch is triggered */
  onDispatch?: (event: WebhookEventPayload, success: boolean) => void;
  className?: string;
}

const SAMPLE_EVENTS: Record<string, WebhookEventPayload> = {
  "payment_intent.succeeded": {
    id: "evt_1P8xK0Lkd8",
    type: "payment_intent.succeeded",
    created: 1728734200,
    data: {
      amount: 14900,
      currency: "usd",
      customer: "cus_N0Qz82K19",
      payment_method_types: ["card", "apple_pay"],
      status: "succeeded",
      receipt_email: "alex@acme.inc",
    },
  },
  "customer.subscription.created": {
    id: "evt_3M19aB98kL",
    type: "customer.subscription.created",
    created: 1728734240,
    data: {
      customer: "cus_N0Qz82K19",
      plan: "pro_annual",
      status: "active",
      current_period_end: 1760270400,
    },
  },
  "invoice.payment_failed": {
    id: "evt_9X4kL18aa1",
    type: "invoice.payment_failed",
    created: 1728734310,
    data: {
      attempt_count: 2,
      next_payment_attempt: 1728907200,
      charge: "ch_3M1a2b",
      failure_reason: "card_declined_insufficient_funds",
    },
  },
};

export function WebhookPayloadSimulator({
  defaultTargetUrl = "https://app.acme.com/api/webhooks/stripe",
  defaultEventType = "payment_intent.succeeded",
  hmacSecret = "whsec_94b8109d72c1a8e",
  onDispatch,
  className,
}: WebhookPayloadSimulatorProps) {
  const [eventType, setEventType] = useState(defaultEventType);
  const [targetUrl, setTargetUrl] = useState(defaultTargetUrl);
  const [isSending, setIsSending] = useState(false);
  const [lastResult, setLastResult] = useState<{
    status: number;
    latency: number;
    timestamp: string;
    verified: boolean;
  } | null>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const currentPayload = SAMPLE_EVENTS[eventType] || SAMPLE_EVENTS["payment_intent.succeeded"];

  const handleDispatch = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      const isSuccess = eventType !== "invoice.payment_failed";
      const result = {
        status: isSuccess ? 200 : 500,
        latency: Math.floor(Math.random() * 40) + 18,
        timestamp: new Date().toLocaleTimeString(),
        verified: true,
      };
      setLastResult(result);
      onDispatch?.(currentPayload, isSuccess);
    }, 550);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(JSON.stringify(currentPayload, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 flex flex-col gap-5",
        className
      )}
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Webhook className="h-4 w-4 text-neutral-900 dark:text-white" />
            <h3 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-white">
              Webhook Payload Simulator
            </h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Dispatch signed test webhooks and inspect delivery response headers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-900 text-[11px] font-mono text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800">
            <KeyRound className="h-3 w-3 text-neutral-700 dark:text-neutral-300" />
            {hmacSecret.slice(0, 10)}••••
          </span>
        </div>
      </div>

      {/* Target URL & Event Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-1 flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Event Topic
          </label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 px-3 py-2 text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 cursor-pointer shadow-xs"
          >
            {Object.keys(SAMPLE_EVENTS).map((evt) => (
              <option key={evt} value={evt}>
                {evt}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Destination Endpoint
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="flex-1 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 px-3 py-2 text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 shadow-xs"
              placeholder="https://..."
            />
            <button
              onClick={handleDispatch}
              disabled={isSending}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 text-xs font-semibold active:scale-95 transition-all shadow-xs disabled:opacity-50 shrink-0"
            >
              {isSending ? (
                <RotateCcw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              <span>Dispatch</span>
            </button>
          </div>
        </div>
      </div>

      {/* Signature & Headers Banner */}
      <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis">
          <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
          <span className="text-neutral-600 dark:text-neutral-400 text-[11px] truncate">
            Stripe-Signature: t=1728734200,v1=9c4a8f2e0... (HMAC-SHA256)
          </span>
        </div>
        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0 font-semibold">
          Auto-Signed
        </span>
      </div>

      {/* JSON Payload Inspector */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-neutral-500 dark:text-neutral-400">HTTP POST Payload (JSON)</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
          >
            {copiedPayload ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            <span>Copy JSON</span>
          </button>
        </div>

        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 max-h-56 overflow-y-auto font-mono text-xs text-neutral-700 dark:text-neutral-300">
          <pre>
            <code>{JSON.stringify(currentPayload, null, 2)}</code>
          </pre>
        </div>
      </div>

      {/* Dispatch Response Feedback */}
      <AnimatePresence>
        {lastResult && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={cn(
              "flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border text-xs font-mono",
              lastResult.status === 200
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400"
            )}
          >
            <div className="flex items-center gap-2">
              {lastResult.status === 200 ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <XCircle className="h-4 w-4 text-rose-500" />
              )}
              <span className="font-bold">
                HTTP {lastResult.status} {lastResult.status === 200 ? "OK • Delivered" : "Internal Server Error"}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] opacity-80">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {lastResult.latency}ms
              </span>
              <span>{lastResult.timestamp}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
