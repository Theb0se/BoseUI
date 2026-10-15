"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Server,
  Database,
  Layers,
  Sparkles,
  Zap,
  Activity,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SystemNode {
  id: string;
  name: string;
  role: string;
  type: "edge" | "compute" | "database" | "cache";
  latency: string;
  throughput: string;
  status: "healthy" | "busy" | "idle";
  connections: string[]; // Connected target IDs
}

export interface ArchitectureFlowchartNodeProps {
  /** Architecture diagram title */
  diagramTitle?: string;
  /** System nodes */
  nodes?: SystemNode[];
  className?: string;
}

const DEFAULT_NODES: SystemNode[] = [
  {
    id: "edge",
    name: "Cloudflare Edge",
    role: "Global CDN & WAF Filter",
    type: "edge",
    latency: "12ms",
    throughput: "4.8k req/s",
    status: "healthy",
    connections: ["compute"],
  },
  {
    id: "compute",
    name: "Next.js Edge Cluster",
    role: "Serverless V8 Workers",
    type: "compute",
    latency: "28ms",
    throughput: "3.2k req/s",
    status: "healthy",
    connections: ["db", "cache"],
  },
  {
    id: "cache",
    name: "Upstash Redis",
    role: "In-Memory Session Store",
    type: "cache",
    latency: "4ms",
    throughput: "8.1k ops/s",
    status: "busy",
    connections: [],
  },
  {
    id: "db",
    name: "Neon PostgreSQL",
    role: "Serverless Vector DB",
    type: "database",
    latency: "19ms",
    throughput: "1.4k qps",
    status: "healthy",
    connections: [],
  },
];

const NODE_ICONS = {
  edge: Globe,
  compute: Server,
  cache: Layers,
  database: Database,
};

const NODE_COLORS = {
  edge: "text-amber-500 border-amber-500/30 bg-amber-500/10",
  compute: "text-blue-500 border-blue-500/30 bg-blue-500/10",
  cache: "text-purple-500 border-purple-500/30 bg-purple-500/10",
  database: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10",
};

export function ArchitectureFlowchartNode({
  diagramTitle = "High-Throughput Global Microservices Architecture",
  nodes = DEFAULT_NODES,
  className,
}: ArchitectureFlowchartNodeProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("compute");

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col gap-6",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-500" />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-tight">{diagramTitle}</h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Click any infrastructure node to inspect active pipeline topology &amp; telemetry.
          </p>
        </div>

        <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          TOPOLOGY ACTIVE
        </span>
      </div>

      {/* Visual System Nodes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {nodes.map((node) => {
          const Icon = NODE_ICONS[node.type];
          const isSelected = selectedNodeId === node.id;
          const isConnected = selectedNode.connections.includes(node.id);

          return (
            <div
              key={node.id}
              onClick={() => setSelectedNodeId(node.id)}
              className={cn(
                "p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-4 relative overflow-hidden group shadow-xs",
                isSelected
                  ? "border-neutral-900 bg-neutral-100/80 ring-2 ring-neutral-400 dark:border-white dark:bg-neutral-900 dark:ring-neutral-600 shadow-sm"
                  : isConnected
                  ? "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20"
                  : "border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-100/70 dark:hover:bg-neutral-900/80"
              )}
            >
              {/* Connector Pin Badges */}
              <div className="flex items-start justify-between gap-2">
                <div
                  className={cn(
                    "p-2 rounded-xl border flex items-center justify-center shrink-0",
                    NODE_COLORS[node.type]
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300">
                  {node.type}
                </span>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 dark:text-white text-sm tracking-tight">{node.name}</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug">{node.role}</p>
              </div>

              {/* Metrics micro-bar */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                <span>{node.latency}</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{node.throughput}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Node Telemetry Banner */}
      <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <span className="font-bold text-neutral-900 dark:text-white text-sm">{selectedNode.name}</span>
            <span className="text-neutral-500 dark:text-neutral-400 ml-2">
              (Downstream targets:{" "}
              {selectedNode.connections.length > 0
                ? selectedNode.connections.join(", ")
                : "None (Sink Node)"}
              )
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <div>
            <span className="text-neutral-500 dark:text-neutral-400">RTT Latency:</span>{" "}
            <span className="font-bold text-neutral-900 dark:text-white">{selectedNode.latency}</span>
          </div>
          <div>
            <span className="text-neutral-500 dark:text-neutral-400">Throughput:</span>{" "}
            <span className="font-bold text-neutral-900 dark:text-white">{selectedNode.throughput}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
