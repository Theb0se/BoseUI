import React from "react";
import Link from "next/link";
import { CATALOG_INDEX } from "@/registry/catalog-index";

const CATEGORIES = [
  "Motion",
  "Buttons",
  "Cards",
  "Navigation",
  "Text",
  "Backgrounds",
  "Overlays",
  "Inputs",
] as const;

export function BrowseCategorySection() {
  // Compute real component counts for each category
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const comp of CATALOG_INDEX) {
      if (comp.category) {
        counts[comp.category] = (counts[comp.category] || 0) + 1;
      }
    }
    return counts;
  }, []);

  return (
    <section>
      <div className="border-b border-neutral-200 pb-3 dark:border-neutral-800">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-white">
          Browse by category
        </h2>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-4">
        {CATEGORIES.map((cat) => {
          const count = categoryCounts[cat] || 0;
          return (
            <Link
              key={cat}
              href={`/components?category=${encodeURIComponent(cat)}`}
              className="group flex items-center justify-between rounded-md border border-neutral-200 bg-white p-3 text-xs transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700"
            >
              <span className="font-medium text-neutral-950 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 transition-colors">
                {cat}
              </span>
              <span className="text-neutral-500 dark:text-neutral-500">
                {count} {count === 1 ? "component" : "components"}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
