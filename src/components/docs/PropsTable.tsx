import React from "react";
import type { ComponentPropMeta } from "@/types/component";

export interface PropsTableProps {
  props: ComponentPropMeta[];
  features?: string[];
  accessibility?: string[];
}

export function PropsTable({ props }: PropsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-[#222222] dark:bg-[#0A0A0A]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:border-[#1F1F1F] dark:bg-[#111111] dark:text-neutral-400">
              <th className="px-5 py-3.5">Prop</th>
              <th className="px-5 py-3.5">Type</th>
              <th className="px-5 py-3.5">Default</th>
              <th className="px-5 py-3.5">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-[#1F1F1F]">
            {props.map((prop) => (
              <tr
                key={prop.name}
                className="transition-colors hover:bg-neutral-50/80 dark:hover:bg-[#121212]"
              >
                <td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-semibold text-black dark:text-white">
                  {prop.name}
                  {prop.required && (
                    <span className="ml-1 text-neutral-400">*</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-neutral-600 dark:text-neutral-300">
                  {prop.type}
                </td>
                <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                  <code className="rounded border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-black dark:border-[#262626] dark:bg-black dark:text-neutral-300">
                    {prop.default ?? "—"}
                  </code>
                </td>
                <td className="px-5 py-4 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
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
