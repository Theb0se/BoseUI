import type { PulseComponentMeta } from "../../types/component";

export const GlowBorderCardMeta: PulseComponentMeta = {
  title: "Glow Border Card",
  description:
    "High-gloss feature cards with thin glowing gradient borders and interactive face overlays that dynamically illuminate and follow cursor coordinates using radial gradient masking.",
  tagline: "High-gloss cards with cursor-following radial gradient borders and reactive sheen overlays.",
  category: "Cards",
  badges: ["Stripe", "Glow Card", "Pointer Tracking", "Cards", "Masking"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "glow border card",
    "stripe card glow",
    "cursor tracking border",
    "radial gradient border",
    "neon border card",
    "feature card grid",
  ],
  features: [
    "Real-time pointer tracking calculating coordinates directly to illuminate 1px border edges.",
    "Integrated face sheen overlay providing a subtle tactile glass refraction beneath the cursor.",
    "Customizable theme presets: Stripe Indigo/Cyan, Electric Violet, Emerald Glow, and Golden Amber.",
    "Smooth CSS hover lift transformation with layout stability and zero reflow.",
    "Interactive stage controls to tweak glow radii, intensity, palette themes, and elevation.",
  ],
  accessibility: [
    "Retains visible 1px borders in high-contrast modes for users with vision accommodations.",
    "Fully keyboard accessible with standard focus outlines and tab navigation.",
    "Subtle animation that respects prefers-reduced-motion without disorienting flickers.",
  ],
  props: [
    {
      name: "defaultRadius",
      type: "number",
      default: "280",
      description: "Radius in pixels of the illuminated radial gradient circle around the pointer.",
    },
    {
      name: "defaultIntensity",
      type: "number",
      default: "0.5",
      description: "Opacity coefficient for the illuminated face sheen overlay (0.2 to 1.0).",
    },
    {
      name: "className",
      type: "string",
      description: "Optional CSS classes to apply to the root container.",
    },
  ],
  usageCode: `import { GlowBorderCard } from "@/components/ui/GlowBorderCard";

export function Example() {
  return (
    <div className="w-full">
      <GlowBorderCard defaultRadius={280} defaultIntensity={0.5} />
    </div>
  );
}`,
};

export default GlowBorderCardMeta;
