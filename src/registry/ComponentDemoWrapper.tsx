"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export function createComponentDemo(
  slug: string,
  Component: React.ComponentType<any>
): React.ComponentType<{ className?: string }> {
  return function AutoComponentDemo({ className }: { className?: string }) {
    switch (slug) {
      case "magnetic-button":
        return (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Component variant="primary" size="md">
              <Sparkles className="h-4 w-4" />
              <span>Magnetic Primary</span>
            </Component>
            <Component variant="outline" size="md">
              <span>Outline</span>
            </Component>
          </div>
        );

      case "split-button":
        return (
          <Component
            label="Deploy Release"
            options={[
              { value: "preview", label: "Deploy Preview" },
              { value: "staging", label: "Deploy to Staging" },
              { value: "rollback", label: "Rollback Production" },
            ]}
            className={className}
          />
        );

      case "spotlight-card":
        return (
          <Component enableTilt className={className ?? "w-full max-w-sm"}>
            <div className="text-sm font-semibold text-black dark:text-white">
              Spotlight Card
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
              Move your cursor across this surface to reveal the radial glow and
              1px border mask.
            </p>
          </Component>
        );

      case "hold-to-confirm-button":
        return (
          <Component
            label="Hold to Purge Cache"
            confirmedLabel="Cache Purged"
            holdDuration={1400}
            className={className}
          />
        );

      case "toast-stack":
        return <Component position="bottom-right" className={className} />;

      case "drawer":
        return (
          <Component
            side="right"
            triggerLabel="Open Drawer"
            className={className}
          />
        );

      case "modal-popup":
        return <Component triggerLabel="Open Dialog" className={className} />;

      case "command-menu":
        return (
          <Component triggerLabel="Search commands..." className={className} />
        );

      default:
        return <Component className={className} />;
    }
  };
}
