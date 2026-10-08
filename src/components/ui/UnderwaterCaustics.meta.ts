import type { PulseComponentMeta } from "../../types/component";

export const UnderwaterCausticsMeta: PulseComponentMeta = {
  title: "Underwater Caustics",
  description:
    "Shimmering underwater caustic light network powered by a real-time WebGL fragment shader with subtle chromatic dispersion, diagonal volumetric God-ray sunbeams, and buoyant rising bubbles.",
  tagline: "Refracted GLSL cellular caustics, sunbeams, and rising bubbles.",
  category: "Backgrounds",
  badges: ["New", "WebGL Shader", "Volumetric Rays"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "underwater caustics",
    "pool water shader",
    "webgl caustics background",
    "sunbeams god rays",
    "rising water bubbles",
  ],
  features: [
    "5-iteration domain-warped trigonometric GLSL caustic solver with RGB chromatic dispersion.",
    "Volumetric diagonal sunbeams attenuating smoothly with water depth.",
    "Buoyant rising bubbles on an overlay 2D canvas with horizontal sine oscillation and specular glints.",
  ],
  accessibility: [
    "Both WebGL and 2D bubble canvases are marked `aria-hidden='true'`.",
    "Interactive Lagoon, Cenote, and Abyssal presets are fully keyboard operable.",
    "Maintains strong contrast for foreground white text via abyssal depth vignettes.",
  ],
  props: [
    {
      name: "waterColor",
      type: "string",
      default: '"#0369A1"',
      description: "Primary underwater hex color used for surface-to-floor light attenuation.",
    },
    {
      name: "causticIntensity",
      type: "number",
      default: "1.0",
      description: "Brightness multiplier for the refracted caustic network and sunbeams.",
    },
    {
      name: "speed",
      type: "number",
      default: "1.0",
      description: "Animation speed multiplier for caustic undulation and bubble ascent.",
    },
    {
      name: "bubbleCount",
      type: "number",
      default: "35",
      description: "Number of buoyant rising bubbles with horizontal sine wobble.",
    },
    {
      name: "sunbeams",
      type: "boolean",
      default: "true",
      description: "Toggles diagonal volumetric sunbeams radiating from the water surface.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground content rendered above the underwater scene.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the root container.",
    },
  ],
  usageCode: `import { UnderwaterCaustics } from "@/components/ui/underwater-caustics";

export function Example() {
  return (
    <UnderwaterCaustics
      waterColor="#0369A1"
      causticIntensity={1.1}
      speed={1.0}
      bubbleCount={35}
      sunbeams
    />
  );
}`,
};

export default UnderwaterCausticsMeta;
