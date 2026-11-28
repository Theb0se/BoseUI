"use client";

import React from "react";
import { useNetworkStatus } from "../hooks/use-network-status";

export function UseNetworkStatusDemo() {
  const { online, effectiveType, downlink, rtt } = useNetworkStatus();

  return (
    <div className="w-full max-w-md space-y-2 rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-900/50">
      <div className="flex justify-between">
        <span className="text-neutral-500">Status</span>
        <span className={online ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}>
          {online ? "Online" : "Offline"}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-neutral-500">Effective Type</span>
        <span className="text-neutral-950 dark:text-white">{effectiveType ?? "N/A"}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-neutral-500">Downlink</span>
        <span className="text-neutral-950 dark:text-white">
          {downlink !== null ? `${downlink} Mbps` : "N/A"}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-neutral-500">RTT</span>
        <span className="text-neutral-950 dark:text-white">
          {rtt !== null ? `${rtt} ms` : "N/A"}
        </span>
      </div>
    </div>
  );
}
