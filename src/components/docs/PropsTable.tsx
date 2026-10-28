import React from "react";
import type { ComponentPropMeta } from "@/types/component";

export interface PropsTableProps {
  props: ComponentPropMeta[];
  features?: string[];
  accessibility?: string[];
}

export function PropsTable({ props }: PropsTableProps) {
  if (!props || props.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-6 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-[#0A0A0A]">
        This component accepts standard HTML attributes and requires no custom props.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-2xs dark:border-neutral-800 dark:bg-[#0A0A0A]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200/80 bg-neutral-50/70 font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400">
              <th className="px-5 py-3.5">Prop</th>
              <th className="px-5 py-3.5">Type</th>
              <th className="px-5 py-3.5">Default</th>
              <th className="px-5 py-3.5">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
            {props.map((prop) => (
              <tr
                key={prop.name}
                className="transition-colors hover:bg-neutral-50/60 dark:hover:bg-neutral-900/40"
              >
                <td className="whitespace-nowrap px-5 py-3.5 align-top font-mono text-xs font-semibold text-neutral-950 dark:text-white">
                  <span>{prop.name}</span>
                  {prop.required && (
                    <span
                      title="Required prop"
                      className="ml-1.5 rounded bg-neutral-900 px-1.5 py-0.5 font-sans text-[10px] font-medium text-white dark:bg-white dark:text-black"
                    >
                      required
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 align-top">
                  <code className="inline-block rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[11px] text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
                    {prop.type}
                  </code>
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 align-top font-mono text-xs text-neutral-500 dark:text-neutral-400">
                  {prop.default ? (
                    <code className="rounded border border-neutral-200 bg-neutral-100/80 px-2 py-0.5 text-[11px] text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
                      {prop.default}
                    </code>
                  ) : (
                    <span className="text-neutral-400 dark:text-neutral-600">—</span>
                  )}
                </td>
                <td className="min-w-[220px] px-5 py-3.5 align-top text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {prop.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
