import type { PulseComponentMeta } from "../../types/component";

export const MeshGradientMeta: PulseComponentMeta = {
  title: "Mesh Gradient",
  description:
    "Apple Music and macOS-inspired fluid multi-point mesh gradient where 5 color nodes orbit on independent trajectories and blend seamlessly.",
  tagline: "Apple Music style fluid multi-point mesh gradient.",
  category: "Backgrounds",
  badges: ["New", "Apple Music UI", "CSS Mesh"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "mesh gradient",
    "apple music background",
    "macos fluid gradient",
    "animated color mesh",
    "gradient wallpaper css",
  ],
  features: [
    "Blends 5 orbiting color control points using high-radius Gaussian blur and saturation boost.",
    "Includes Apple Music, Sequoia, and Obsidian palette presets in the interactive preview.",
    "Optional micro-grain overlay to prevent color banding on 8-bit displays.",
  ],
  accessibility: [
    "Marks decorative mesh control points and grain layers with `aria-hidden='true'`.",
    "Maintains readable foreground typography with subtle backdrop blur badges.",
    "Palette switcher buttons support keyboard navigation.",
  ],
  props: [
    {
      name: "colors",
      type: "string[]",
      default: '["#FF2D55", "#5856D6", "#FF9500", "#AF52DE", "#00C7BE"]',
      description: "Array of 4 to 5 hex colors for the mesh nodes.",
    },
    {
      name: "speed",
      type: "number",
      default: "1",
      description: "Orbit animation speed multiplier.",
    },
    {
      name: "blur",
      type: "number",
      default: "70",
      description: "Gaussian blur radius in pixels used to fuse the color points.",
    },
    {
      name: "grain",
      type: "boolean",
      default: "true",
      description: "Overlays a subtle film grain texture.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground content rendered above the mesh.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the container.",
    },
  ],
  usageCode: `import { MeshGradient } from "@/components/ui/mesh-gradient";

export function Example() {
  return (
    <MeshGradient
      colors={["#FF2D55", "#5856D6", "#FF9500", "#AF52DE", "#00C7BE"]}
      speed={1}
      blur={70}
    />
  );
}`,
};

export default MeshGradientMeta;
