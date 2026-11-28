"use client";

import React from "react";
import { useBattery } from "../hooks/use-battery";

export function UseBatteryDemo() {
  const { isSupported, loading, level, charging } = useBattery();

  return (
    <div className="w-full max-w-md text-center">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-900/50">
        {loading ? (
          <span>Checking battery status...</span>
        ) : !isSupported ? (
          <span className="text-neutral-500">
            Battery Status API not supported in this browser.
          </span>
        ) : (
          <div className="space-y-1">
            <div className="text-lg font-bold text-neutral-950 dark:text-white">
              {level !== null ? `${Math.round(level * 100)}%` : "—"}
            </div>
            <div className="text-neutral-500">
              {charging ? "Charging" : "On Battery"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
