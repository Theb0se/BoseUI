import type { PulseComponentMeta } from "../../types/component";

export const NotFound404BlockMeta: PulseComponentMeta = {
  title: "Not Found 404 Block",
  description:
    "A cosmic 404 error page block featuring an AsteroidField parallax backdrop with glowing bolide meteors, mechanical 3D SplitFlapText cycling error signals, quick registry search, and responsive recovery actions.",
  tagline: "Cosmic 404 block with asteroid field canvas, split-flap airport text, and search recovery.",
  category: "Cards",
  badges: ["Block", "NotFound", "404", "SplitFlap", "Space", "AsteroidField"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "404 block",
    "not found",
    "asteroid field",
    "split flap text",
    "cosmic 404",
    "error page",
    "space error",
  ],
  features: [
    "Canvas 2D AsteroidField background with craggy multi-depth asteroid drift and high-speed meteors.",
    "SplitFlapText physical flip-disc display cycling through animated error messages.",
    "Integrated registry search input to quickly direct users back to active components.",
    "High-contrast return home and blocks navigation buttons with subtle hover springs.",
  ],
  accessibility: [
    "Error status and mechanical flipper are accompanied by screen-reader accessible aria-live regions.",
    "Search input and recovery buttons provide 44px+ touch targets and full keyboard focus rings.",
    "High contrast ratios meeting WCAG AA requirements on all text elements.",
    "Reduced-motion friendly with simplified text presentation and canvas parallax dampening.",
  ],
  props: [
    {
      name: "title",
      type: "string",
      default: '"Orbit coordinates lost in deep space"',
      description: "Primary headline statement for the 404 page.",
    },
    {
      name: "description",
      type: "string",
      default: '"The requested navigation beacon or component route does not exist..."',
      description: "Descriptive help text explaining the missing route.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom classes applied to the root container.",
    },
  ],
  usageCode: `import { NotFound404Block } from "@/components/ui/NotFound404Block";

export function Example() {
  return (
    <NotFound404Block
      title="Orbit coordinates lost in deep space"
    />
  );
}`,
};

export default NotFound404BlockMeta;
