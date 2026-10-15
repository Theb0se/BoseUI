"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  Terminal,
  RotateCcw,
  Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface InteractiveApiEndpointBarProps {
  /** HTTP Method */
  defaultMethod?: HttpMethod;
  /** Base URL and route path */
  defaultEndpoint?: string;
  /** Query or route params */
  defaultParams?: Record<string, string>;
  /** Mock response payload */
  mockResponse?: Record<string, unknown> | unknown[];
  /** Mock response latency in ms */
  latencyMs?: number;
  /** Mock HTTP status code */
  statusCode?: number;
  /** Callback when request is triggered */
  onRequest?: (method: HttpMethod, endpoint: string) => void;
  className?: string;
}

const METHOD_STYLES: Record<HttpMethod, { bg: string; text: string; border: string }> = {
  GET: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    text: "text-emerald-700 dark:text-emerald-400 font-bold",
    border: "border-emerald-500/30",
  },
  POST: {
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
    text: "text-blue-700 dark:text-blue-400 font-bold",
    border: "border-blue-500/30",
  },
  PUT: {
    bg: "bg-amber-500/10 dark:bg-amber-500/20",
    text: "text-amber-700 dark:text-amber-400 font-bold",
    border: "border-amber-500/30",
  },
  PATCH: {
    bg: "bg-purple-500/10 dark:bg-purple-500/20",
    text: "text-purple-700 dark:text-purple-400 font-bold",
    border: "border-purple-500/30",
  },
  DELETE: {
    bg: "bg-rose-500/10 dark:bg-rose-500/20",
    text: "text-rose-700 dark:text-rose-400 font-bold",
    border: "border-rose-500/30",
  },
};

const DEFAULT_SAMPLE_RESPONSE = {
  status: "success",
  data: {
    id: "usr_94b1e84a",
    name: "Alex Mercer",
    role: "Staff Infrastructure Engineer",
    organization: "Acme Cloud Corp",
    verified: true,
    created_at: "2026-10-12T14:20:00Z",
  },
  metadata: {
    cached: true,
    region: "us-east-1",
    compute_node: "edge-lambda-44",
  },
};

export function InteractiveApiEndpointBar({
  defaultMethod = "GET",
  defaultEndpoint = "https://api.boseui.com/v1/users/usr_94b1e84a",
  defaultParams = { include_metadata: "true", depth: "2" },
  mockResponse = DEFAULT_SAMPLE_RESPONSE,
  latencyMs = 28,
  statusCode = 200,
  onRequest,
  className,
}: InteractiveApiEndpointBarProps) {
  const [method, setMethod] = useState<HttpMethod>(defaultMethod);
  const [endpoint, setEndpoint] = useState(defaultEndpoint);
  const [isLoading, setIsLoading] = useState(false);
  const [hasExecuted, setHasExecuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [activeTab, setActiveTab] = useState<"body" | "headers" | "params">("body");

  const handleSend = () => {
    setIsLoading(true);
    onRequest?.(method, endpoint);
    setTimeout(() => {
      setIsLoading(false);
      setHasExecuted(true);
      setIsExpanded(true);
    }, 450);
  };

  const handleCopyUrl = () => {
    navigator.clipboard?.writeText(endpoint);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyCurl = () => {
    const curl = `curl -X ${method} "${endpoint}" \\
  -H "Authorization: Bearer <API_KEY>" \\
  -H "Content-Type: application/json"`;
    navigator.clipboard?.writeText(curl);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 transition-all",
        className
      )}
    >
      {/* Top Bar: Method + Endpoint + Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 sm:p-4 bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800">
        {/* Method Select */}
        <div className="flex items-center gap-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as HttpMethod)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-mono border uppercase tracking-wider focus:outline-none transition-all cursor-pointer",
              METHOD_STYLES[method].bg,
              METHOD_STYLES[method].text,
              METHOD_STYLES[method].border
            )}
          >
            {(["GET", "POST", "PUT", "PATCH", "DELETE"] as HttpMethod[]).map((m) => (
              <option key={m} value={m} className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white font-mono">
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Input Bar */}
        <div className="flex-1 relative flex items-center min-w-0">
          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="w-full bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 px-3.5 py-1.5 text-xs font-mono text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all pr-20"
            placeholder="https://api.example.com/v1/..."
          />
          <div className="absolute right-2 flex items-center gap-1 text-neutral-400 dark:text-neutral-500">
            <button
              onClick={handleCopyUrl}
              title="Copy URL"
              className="p-1 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
            >
              {copiedUrl ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={handleCopyCurl}
              title="Copy as cURL"
              className="p-1 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
            >
              {copiedCurl ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Terminal className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 active:scale-95 transition-all shadow-xs disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RotateCcw className="h-3.5 w-3.5 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Send</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Response Status Bar (When executed) */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-neutral-950 text-xs border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            <span>Response Payload</span>
          </button>

          {hasExecuted && (
            <div className="flex items-center gap-2 animate-fade-in">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-semibold border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {statusCode} OK
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                <Clock className="h-3 w-3" />
                {latencyMs}ms
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {(["body", "headers", "params"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setIsExpanded(true);
              }}
              className={cn(
                "px-2.5 py-0.5 text-[11px] font-medium rounded-lg capitalize transition-colors",
                activeTab === tab && isExpanded
                  ? "bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Expandable JSON / Headers Body */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/40 font-mono text-xs overflow-hidden"
          >
            {activeTab === "body" && (
              <div className="p-4 max-h-72 overflow-y-auto">
                <pre className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  <code>{JSON.stringify(mockResponse, null, 2)}</code>
                </pre>
              </div>
            )}

            {activeTab === "headers" && (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-500 dark:text-neutral-400">content-type:</span>{" "}
                  <span className="text-neutral-900 dark:text-white">application/json; charset=utf-8</span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-500 dark:text-neutral-400">cache-control:</span>{" "}
                  <span className="text-neutral-900 dark:text-white">s-maxage=3600, stale-while-revalidate</span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-500 dark:text-neutral-400">x-edge-region:</span>{" "}
                  <span className="text-neutral-900 dark:text-white">iad1-aws-edge</span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-500 dark:text-neutral-400">x-request-id:</span>{" "}
                  <span className="text-neutral-900 dark:text-white">req_01j7b99c2e01a8</span>
                </div>
              </div>
            )}

            {activeTab === "params" && (
              <div className="p-4 flex flex-col gap-2 text-[11px]">
                {Object.entries(defaultParams).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <span className="font-semibold text-neutral-900 dark:text-white">{key}:</span>
                    <span className="text-neutral-500 dark:text-neutral-400">{val}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
