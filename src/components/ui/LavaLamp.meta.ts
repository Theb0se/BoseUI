import type { PulseComponentMeta } from "../../types/component";

export const LavaLampMeta: PulseComponentMeta = {
  title: "Lava Lamp",
  description:
    "True WebGL signed distance field (SDF) metaball lava lamp shader using polynomial smooth-minimum (smin) surface tension blending, 3D specular/Fresnel subsurface rim lighting, and pointer thermal attraction.",
  tagline: "WebGL SDF metaballs with smooth-minimum liquid tension and 3D rim glow.",
  category: "Backgrounds",
  badges: ["New", "WebGL SDF", "Metaballs"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "lava lamp shader",
    "webgl metaballs background",
    "signed distance field smin",
    "liquid wax blobs",
    "subsurface scattering shader",
  ],
  features: [
    "True polynomial smooth-minimum (`smin`) SDF blending with adjustable liquid surface tension.",
    "Finite-difference 3D hemisphere normal reconstruction for glassy specular highlights and Fresnel rim glow.",
    "Buoyant thermal wax cycle coupled with a gentle pointer heat attractor.",
  ],
  accessibility: [
    "Marks the WebGL metaball canvas with `aria-hidden='true'`.",
    "Interactive Magma, Cyber Acid, and Ultraviolet color presets are keyboard accessible.",
    "Dark translucent HUD container preserves legible contrast over bright molten blobs.",
  ],
  props: [
    {
      name: "blobCount",
      type: "number",
      default: "7",
      description: "Number of buoyant wax metaballs inside the vessel (3 to 12).",
    },
    {
      name: "primaryColor",
      type: "string",
      default: '"#FF3B00"',
      description: "Core molten wax hex color.",
    },
    {
      name: "secondaryColor",
      type: "string",
      default: '"#FFB800"',
      description: "Subsurface Fresnel rim and thermal highlight hex color.",
    },
    {
      name: "backgroundColor",
      type: "string",
      default: '"#0F071E"',
      description: "Ambient vessel background hex color.",
    },
    {
      name: "speed",
      type: "number",
      default: "1.0",
      description: "Thermal buoyancy convection speed multiplier.",
    },
    {
      name: "viscosity",
      type: "number",
      default: "0.45",
      description: "Smooth-minimum (`smin`) surface tension blending factor (0.15 to 0.85).",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground UI rendered above the lava lamp shader.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the root container.",
    },
  ],
  usageCode: `import { LavaLamp } from "@/components/ui/lava-lamp";

export function Example() {
  return (
    <LavaLamp
      blobCount={7}
      primaryColor="#FF3B00"
      secondaryColor="#FFB800"
      backgroundColor="#0F071E"
      speed={1.0}
      viscosity={0.45}
    />
  );
}`,
};

export default LavaLampMeta;
