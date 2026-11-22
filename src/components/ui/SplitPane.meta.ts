import type { PulseComponentMeta } from "../../types/component";

export const SplitPaneMeta: PulseComponentMeta = {
  title: "Split Pane",
  description:
    "A fluid, accessible split pane component supporting horizontal and vertical orientations, pointer-capture dragging, double-click collapse, keyboard navigation, and localStorage persistence.",
  tagline: "Resizable dual-pane layout with pointer capture, collapse support, and keyboard accessibility.",
  category: "Navigation",
  badges: ["New", "A11y Ready", "Pointer Capture", "Persistent"],
  createdAt: "2026-11-22",
  featured: true,
  keywords: [
    "split pane",
    "resizable pane",
    "splitter",
    "divider",
    "collapsible pane",
    "drag resize",
    "dual pane",
    "layout",
  ],
  features: [
    "Supports both horizontal (columns) and vertical (rows) splitting directions.",
    "Hardware-accelerated pointer capture resizing with touch, mouse, and pen support.",
    "Full-screen transparent drag overlay preventing iframe or text-selection interruptions.",
    "Double-click divider or press Enter to collapse or expand with smooth 200ms ease-out transitions.",
    "Instant 0ms latency during dragging with zero layout shift.",
    "Automatic percentage scaling when container resizes.",
    "Responsive breakpoint switching from horizontal to stacked vertical on mobile screens.",
    "LocalStorage persistence key support to remember pane sizes across visits.",
    "Full nesting support for complex multi-split IDE or dashboard layouts.",
  ],
  accessibility: [
    "Divider uses role='separator' with dynamic aria-orientation, aria-valuenow, aria-valuemin, and aria-valuemax.",
    "Keyboard accessible with Tab focus: Arrow keys resize by 10px (Shift for 50px increments).",
    "Home and End keys jump immediately to minSize and maxSize.",
    "Enter key toggles collapsible state.",
    "High-contrast visible focus ring on the divider.",
  ],
  props: [
    {
      name: "direction",
      type: '"horizontal" | "vertical"',
      default: '"horizontal"',
      description: "Layout direction of the panes.",
    },
    {
      name: "defaultSize",
      type: "number | string",
      default: '"50%"',
      description: "Initial size of Pane A in pixels (number) or percentage (string).",
    },
    {
      name: "minSize",
      type: "number",
      default: "120",
      description: "Minimum allowable size for Pane A in pixels.",
    },
    {
      name: "maxSize",
      type: "number | string",
      description: "Maximum allowable size for Pane A in pixels or percentage.",
    },
    {
      name: "minSizeB",
      type: "number",
      default: "120",
      description: "Minimum allowable size for Pane B in pixels.",
    },
    {
      name: "collapsible",
      type: "boolean",
      default: "false",
      description: "Whether Pane A can collapse on double-click or Enter key.",
    },
    {
      name: "collapsedSize",
      type: "number",
      default: "0",
      description: "Size of Pane A when collapsed in pixels.",
    },
    {
      name: "responsiveBreakpoint",
      type: "number",
      description: "Screen width in pixels below which layout collapses into vertical stack.",
    },
    {
      name: "onResize",
      type: "(size: number) => void",
      description: "Callback fired continuously during dragging with new pixel size.",
    },
    {
      name: "onResizeEnd",
      type: "(size: number) => void",
      description: "Callback fired when the drag operation completes.",
    },
    {
      name: "persistKey",
      type: "string",
      description: "LocalStorage key to save and restore pane sizes across reloads.",
    },
  ],
  usageCode: `import { SplitPane } from "@/components/ui/SplitPane";

export function Example() {
  return (
    <div className="h-96 w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <SplitPane
        direction="horizontal"
        defaultSize="35%"
        minSize={150}
        collapsible
        persistKey="demo-split-pane"
      >
        <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 h-full">
          <h3 className="font-semibold text-sm">Sidebar Navigation</h3>
          <p className="text-xs text-neutral-500 mt-1">Double click divider to collapse.</p>
        </div>
        <div className="p-4 h-full">
          <h3 className="font-semibold text-sm">Main Content Editor</h3>
          <p className="text-xs text-neutral-500 mt-1">Drag the divider to adjust pane ratio.</p>
        </div>
      </SplitPane>
    </div>
  );
}`,
};
