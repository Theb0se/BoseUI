import type { PulseComponentMeta } from "../../types/component";

export const ElasticSnapSortableMeta: PulseComponentMeta = {
  title: "Elastic Snap Sortable",
  description:
    "Reorderable priority queue where list items swap positions with Hooke's Law layout spring projection and full keyboard arrow-key control.",
  tagline: "Spring-projected reorderable list with keyboard arrow sorting.",
  category: "Motion",
  badges: ["New", "Layout Reorder", "Keyboard Sort"],
  createdAt: "2026-10-07",
  featured: false,
  keywords: [
    "elastic snap sortable",
    "animated sortable list",
    "reorderable list framer motion",
    "priority queue ui",
    "layout projection list",
  ],
  features: [
    "Automatic FLIP layout projection via Framer Motion layout prop when rows swap positions.",
    "Full keyboard reordering using ArrowUp and ArrowDown keys directly on focused list items.",
    "Tactile up/down stepper triggers for single-click touch and pointer sorting.",
  ],
  accessibility: [
    "Implements role='list' and role='listitem' with live position announcements in aria-label.",
    "Supports ArrowUp and ArrowDown keyboard reordering without requiring pointer drag dexterity.",
    "Snaps reordered rows instantaneously when prefers-reduced-motion is enabled.",
  ],
  props: [
    {
      name: "items",
      type: "SortableTaskItem[]",
      description: "Initial array of task items containing id, title, and priority tag.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "380",
      description: "Spring stiffness coefficient for row swap layout projection.",
    },
    {
      name: "damping",
      type: "number",
      default: "26",
      description: "Spring damping coefficient controlling row settle oscillation.",
    },
  ],
  usageCode: `import { ElasticSnapSortable } from "@/components/ui/elastic-snap-sortable";

export function Example() {
  return (
    <ElasticSnapSortable stiffness={380} damping={26} />
  );
}`,
};

export default ElasticSnapSortableMeta;
