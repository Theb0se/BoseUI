"use client";

import React from "react";
import { useOrientation } from "../hooks/use-orientation";

export function UseOrientationDemo() {
  const { angle, type } = useOrientation();

  return (
    <div className="w-full max-w-md text-center">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="text-sm font-bold text-neutral-950 dark:text-white">
          {type}
        </div>
        <div className="mt-1 text-neutral-500">Angle: {angle}°</div>
      </div>
    </div>
  );
}
