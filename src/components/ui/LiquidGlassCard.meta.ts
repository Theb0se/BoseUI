import type { PulseComponentMeta } from "../../types/component";

export const LiquidGlassCardMeta: PulseComponentMeta = {
  title: "Liquid Glass Card",
  description:
    "Ultra-premium translucent frosted glass card featuring dynamic specular highlight cursor tracking, 3D perspective tilt, chromatic edge refraction, double-layer backdrop blur, and tactile click feedback.",
  tagline: "Apple-inspired frosted glass card with 3D cursor tilt and chromatic refraction.",
  category: "Cards",
  badges: ["New", "Liquid Glass", "3D Tilt", "Specular Highlight", "visionOS"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "liquid glass card",
    "frosted glass",
    "glassmorphism",
    "apple card",
    "specular highlight",
    "3d tilt card",
    "chromatic refraction",
    "visionos glass",
  ],
  features: [
    "Continuous 3D perspective tilt reacting to cursor coordinates with spring smoothing.",
    "Dynamic radial specular glare tracking cursor light source across card surface.",
    "Chromatic prismatic refraction along card perimeter borders.",
    "Double-layer backdrop blur creating rich depth over ambient saturated backdrops.",
    "Tactile spring click compression and customizable frost density and tilt sensitivity.",
  ],
  accessibility: [
    "Retains high contrast content legibility across bright and dark backgrounds.",
    "Suppresses aggressive 3D perspective tilts when `prefers-reduced-motion` is active.",
    "Accessible focus outlines when keyboard navigated.",
  ],
  props: [
    {
      name: "title",
      type: "string",
      default: '"Apple Card Titanium"',
      description: "Default headline or card title.",
    },
    {
      name: "subtitle",
      type: "string",
      default: '"Mastercard • 7492 • World Elite"',
      description: "Secondary descriptive text or card subtext.",
    },
    {
      name: "blurStrength",
      type: "number",
      default: "24",
      description: "Backdrop blur radius in pixels.",
    },
    {
      name: "tiltFactor",
      type: "number",
      default: "1.0",
      description: "Multiplier determining sensitivity of 3D tilt response.",
    },
    {
      name: "chromaticEdge",
      type: "boolean",
      default: "true",
      description: "Whether to render chromatic rainbow refraction along card borders.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Custom content rendered inside the frosted glass card container.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the root container.",
    },
  ],
  usageCode: `import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";

export function Example() {
  return (
    <LiquidGlassCard
      title="Titanium Card"
      tiltFactor={1.2}
      chromaticEdge={true}
    >
      <div className="p-4">
        <h3 className="text-lg font-bold text-white">Apple Card</h3>
        <p className="text-xs text-white/80">3% Daily Cash Back</p>
      </div>
    </LiquidGlassCard>
  );
}`,
};

export default LiquidGlassCardMeta;
