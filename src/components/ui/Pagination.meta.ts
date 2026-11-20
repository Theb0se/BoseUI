import type { PulseComponentMeta } from "../../types/component";

export const PaginationMeta: PulseComponentMeta = {
  title: "Pagination",
  description:
    "Kinetic spring-animated pagination component featuring a sliding active selection capsule, smart ellipsis windowing, jump-to-page input, and full arrow-key keyboard navigation.",
  tagline: "Kinetic spring pagination with sliding active pill and keyboard navigation.",
  category: "Navigation",
  badges: ["New", "Spring Physics", "Shared Layout", "WAI-ARIA"],
  createdAt: "2026-11-20",
  featured: false,
  keywords: [
    "pagination",
    "animated pagination",
    "page switcher",
    "spring pagination",
    "framer motion pagination",
    "navigation controls",
  ],
  features: [
    "Shared layoutId active selection pill that fluidly glides across page numbers with spring physics.",
    "Smart ellipsis windowing with interactive fast-forward / rewind preview buttons.",
    "First, previous, next, and last page skip controls with disabled tactile states.",
    "Optional direct jump-to-page input with boundary validation.",
    "Optional total items range counter ('Showing 1-10 of 120 items').",
    "Reduced motion fallback with immediate zero-latency transitions.",
  ],
  accessibility: [
    "Complies with WAI-ARIA Pagination design pattern with semantic <nav role='navigation'>.",
    "Provides aria-current='page' on the active page button and descriptive aria-labels on controls.",
    "Full keyboard navigation: ArrowLeft, ArrowRight, Home, and End keys cycle through pages.",
    "High-contrast focus-visible rings for keyboard users.",
  ],
  props: [
    {
      name: "totalPages",
      type: "number",
      default: "10",
      description: "Total number of pages available.",
    },
    {
      name: "currentPage",
      type: "number",
      default: "1",
      description: "Controlled current active page number (1-indexed).",
    },
    {
      name: "siblingCount",
      type: "number",
      default: "1",
      description: "Number of page buttons displayed on each side of the active page.",
    },
    {
      name: "showControls",
      type: "boolean",
      default: "true",
      description: "Whether to render previous and next chevron buttons.",
    },
    {
      name: "showEdgeControls",
      type: "boolean",
      default: "true",
      description: "Whether to render first and last skip buttons.",
    },
    {
      name: "showQuickJumper",
      type: "boolean",
      default: "false",
      description: "Whether to display the direct page jump numeric input.",
    },
    {
      name: "onPageChange",
      type: "(page: number) => void",
      description: "Callback invoked whenever the active page changes.",
    },
  ],
  usageCode: `import { Pagination } from "@/components/ui/Pagination";
import { useState } from "react";

export function Example() {
  const [page, setPage] = useState(1);

  return (
    <Pagination
      totalPages={20}
      currentPage={page}
      onPageChange={setPage}
      showEdgeControls={true}
    />
  );
}`,
};

export default PaginationMeta;
