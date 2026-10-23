import type { PulseComponentMeta } from "../../types/component";

export const StickyPagesMeta: PulseComponentMeta = {
  title: "Sticky Pages",
  description:
    "Apple-style sticky stacking full-viewport pages with progressive scale shrinking, cumulative dimming overlays, smooth scroll transitions, and subtle top elevation borders.",
  tagline: "Apple-style sticky stacking cards that scale and dim on scroll.",
  category: "Cards",
  badges: ["New", "Interactive", "Scroll Physics", "Layout"],
  createdAt: "2026-10-23",
  featured: true,
  keywords: [
    "sticky pages",
    "stacking cards",
    "sticky scroll",
    "scroll shrink cards",
    "apple sticky cards",
    "viewport cards",
    "stacking sections",
  ],
  features: [
    "CSS position sticky stacking with progressive top offsets and dynamic viewport tracking.",
    "Hardware-accelerated scale reduction calculated per covered layer using requestAnimationFrame.",
    "Graduated dark dimming backdrop overlays reflecting exact layer overlap depths.",
    "Dual-mode support: structured pages array configuration or declarative nested JSX children.",
  ],
  accessibility: [
    "Retains native document scroll ergonomics with predictable touch, trackpad, and keyboard behavior.",
    "Uses accessible high-contrast text ratios across stacked panels with readable typography hierarchies.",
    "Leaves child elements interactive and focusable when not fully covered.",
  ],
  props: [
    {
      name: "pages",
      type: "StickyPageItem[]",
      description: "Structured array of page objects with id, title, subtitle, description, badge, and background styles.",
    },
    {
      name: "pageHeight",
      type: "string",
      default: '"100vh"',
      description: "Height specification of each sticky page or card section.",
    },
    {
      name: "topOffset",
      type: "number",
      default: "0",
      description: "Distance in pixels from viewport top where each page locks sticky.",
    },
    {
      name: "stackOffset",
      type: "number",
      default: "0",
      description: "Progressive pixel gap preserved between stacked page headers.",
    },
    {
      name: "rounded",
      type: "boolean",
      default: "true",
      description: "Apply rounded top corners (rounded-t-[2rem]) to stacked pages.",
    },
    {
      name: "shadow",
      type: "boolean",
      default: "true",
      description: "Apply top drop shadow when pages overlap previous layers.",
    },
    {
      name: "border",
      type: "boolean",
      default: "true",
      description: "Render subtle top highlight border on stacked cards.",
    },
    {
      name: "scaleStep",
      type: "number",
      default: "0.05",
      description: "Scale percentage delta by which each successive covering page shrinks lower layers.",
    },
    {
      name: "dim",
      type: "boolean",
      default: "true",
      description: "Gradually darken covered layers as they are occluded by subsequent pages.",
    },
  ],
  usageCode: `import { StickyPages } from "@/components/ui/StickyPages";

const demoPages = [
  {
    id: 1,
    badge: "Foundation",
    subtitle: "Architecture",
    title: "Engineered for Velocity",
    description: "Atomic primitives sculpted for instant responsiveness and tactile micro-interactions.",
    bg: "bg-slate-950",
  },
  {
    id: 2,
    badge: "Motion",
    subtitle: "Fluid Physics",
    title: "Organic Interpolation",
    description: "Every curve uses spring stiffness and mass damping modeled after real-world kinematics.",
    bg: "bg-violet-950",
  },
  {
    id: 3,
    badge: "Production",
    subtitle: "Enterprise",
    title: "Production Ready",
    description: "Zero external dependencies beyond standard peer primitives. Copy, paste, and deploy.",
    bg: "bg-zinc-950",
  },
];

export function Example() {
  return (
    <div className="w-full">
      <StickyPages pages={demoPages} pageHeight="80vh" />
    </div>
  );
}`,
};
