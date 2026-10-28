import type { PulseComponentMeta } from "../../types/component";

export const CylinderCarouselMeta: PulseComponentMeta = {
  title: "Cylinder Carousel",
  description:
    "Interactive 3D cylindrical carousel with real-time radial perspective transforms, inertia pan physics, depth blur, and active card path animations.",
  tagline: "3D cylinder carousel with tactile pan physics and dynamic depth blur.",
  category: "Cards",
  badges: ["3D Cylinder", "Pan Physics", "Depth Blur", "Spring Inertia"],
  createdAt: "2026-10-28",
  featured: true,
  keywords: [
    "cylinder carousel",
    "3d carousel react",
    "framer motion 3d",
    "cylindrical card slider",
    "pan gesture carousel",
    "rotational 3d cards",
  ],
  features: [
    "Trigonometric 3D radial arrangement calculating exact cylinder radius from card width and gap.",
    "Dynamic depth blur, saturation, opacity, and specular sheen based on angular distance from stage center.",
    "Spring-damped inertia panning with velocity projection and tap-to-advance edge navigation.",
    "Strictly prop-driven architecture: pass custom cards, content, and gradients directly via props.",
  ],
  accessibility: [
    "Full keyboard navigation with Left and Right arrow keys to rotate cards.",
    "Accessible role='group' and aria-roledescription='slide' with descriptive labels on cards.",
    "Respects prefers-reduced-motion by bypassing spring physics and instantly snapping to the selected card.",
  ],
  props: [
    {
      name: "cards",
      type: "CylinderCardItem[]",
      default: "[]",
      description: "Array of card objects with titles, badges, backgrounds, and content passed via props.",
    },
    {
      name: "cardWidth",
      type: "number",
      default: "280",
      description: "Width of each card on the cylinder in pixels.",
    },
    {
      name: "cardHeight",
      type: "number",
      default: "360",
      description: "Height of each card on the cylinder in pixels.",
    },
    {
      name: "gap",
      type: "number",
      default: "70",
      description: "Circumferential spacing between neighboring cards in pixels.",
    },
    {
      name: "perspective",
      type: "number",
      default: "1400",
      description: "CSS 3D perspective distance in pixels controlling depth curvature.",
    },
    {
      name: "initialIndex",
      type: "number",
      default: "0",
      description: "Initial zero-based index of the active card facing front.",
    },
    {
      name: "springStiffness",
      type: "number",
      default: "120",
      description: "Spring stiffness coefficient governing rotational snap responsiveness.",
    },
    {
      name: "damping",
      type: "number",
      default: "20",
      description: "Spring damping coefficient governing angular oscillation decay.",
    },
    {
      name: "mass",
      type: "number",
      default: "0.9",
      description: "Virtual mass factor applied to the carousel inertia simulation.",
    },
    {
      name: "showControls",
      type: "boolean",
      default: "true",
      description: "Whether to render navigation chevrons and pagination dots.",
    },
    {
      name: "showDots",
      type: "boolean",
      default: "true",
      description: "Whether to render the progress dot indicators between chevrons.",
    },
  ],
  usageCode: `import {
  CylinderCarousel,
  DEFAULT_CYLINDER_BACKGROUNDS,
  type CylinderCardItem,
} from "@/components/ui/cylinder-carousel";

const customCards: CylinderCardItem[] = [
  {
    id: "physics",
    title: "Kinetic Physics",
    pill: "120 FPS",
    bg: DEFAULT_CYLINDER_BACKGROUNDS[0],
    content: ({ active }) => (
      <div className="flex h-full flex-col items-center justify-center text-white">
        <p className="text-5xl font-bold">120Hz</p>
        <p className="mt-2 text-xs text-white/80">Hooke's Law Momentum</p>
      </div>
    ),
  },
  {
    id: "components",
    title: "Catalog",
    pill: "v2.0",
    bg: DEFAULT_CYLINDER_BACKGROUNDS[1],
    content: () => (
      <div className="flex h-full flex-col items-center justify-center text-white">
        <p className="text-6xl font-bold">113+</p>
        <p className="mt-2 text-xs text-white/80">Kinetic Primitives</p>
      </div>
    ),
  },
  {
    id: "a11y",
    title: "Inclusive",
    pill: "WCAG AA",
    bg: DEFAULT_CYLINDER_BACKGROUNDS[2],
    dark: true,
    content: () => (
      <div className="flex h-full flex-col items-center justify-center text-neutral-900">
        <p className="text-3xl font-bold">A11y First</p>
        <p className="mt-2 text-xs text-neutral-600">Keyboard & Screen-Reader Ready</p>
      </div>
    ),
  },
];

export function Example() {
  return <CylinderCarousel cards={customCards} />;
}`,
};

export default CylinderCarouselMeta;
