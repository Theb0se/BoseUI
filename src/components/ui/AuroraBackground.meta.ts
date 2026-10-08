import type { PulseComponentMeta } from "../../types/component";

export const AuroraBackgroundMeta: PulseComponentMeta = {
  title: "Aurora",
  description:
    "macOS-inspired northern lights background using 3 to 5 large 60px blurred color blobs with screen blend mode drifting on offset keyframe loops.",
  tagline: "Screen-blended aurora blobs on offset keyframe loops.",
  category: "Backgrounds",
  badges: ["New", "CSS Only", "macOS Look"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "aurora background",
    "northern lights css",
    "macos wallpaper gradient",
    "blurred blobs background",
    "screen blend mode",
  ],
  features: [
    "Uses `filter: blur(60px)` and `mix-blend-mode: screen` across 4 offset radial color layers.",
    "Pure CSS keyframe drift with zero JavaScript per-frame overhead.",
    "Includes Borealis, Sonoma, and Polar color palette presets in the interactive preview.",
  ],
  accessibility: [
    "Marks decorative aurora blob layers with `aria-hidden='true'`.",
    "Maintains high foreground text contrast over the dark `#04060E` base canvas.",
    "Preset selector buttons are keyboard focusable.",
  ],
  props: [
    {
      name: "colors",
      type: "string[]",
      default: '["#10B981", "#06B6D4", "#8B5CF6", "#3B82F6"]',
      description: "Array of 3 to 5 hex or RGB color strings for the aurora blobs.",
    },
    {
      name: "speed",
      type: "number",
      default: "1",
      description: "Speed multiplier for the keyframe drift cycle.",
    },
    {
      name: "intensity",
      type: "number",
      default: "0.75",
      description: "Overall opacity intensity of the aurora layer (0.2 to 1).",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground content rendered above the aurora.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the container.",
    },
  ],
  usageCode: `import { AuroraBackground } from "@/components/ui/aurora-background";

export function Example() {
  return (
    <AuroraBackground
      colors={["#10B981", "#06B6D4", "#8B5CF6", "#3B82F6"]}
      speed={1}
      intensity={0.75}
    />
  );
}`,
};

export default AuroraBackgroundMeta;
