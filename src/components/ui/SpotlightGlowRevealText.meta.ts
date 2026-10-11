import type { PulseComponentMeta } from "../../types/component";

export const SpotlightGlowRevealTextMeta: PulseComponentMeta = {
  title: "Spotlight Glow Reveal Text",
  description:
    "Cinematic stealth typography that stays subtly dimmed until illuminated by the user's cursor torchlight spotlight mask.",
  tagline: "Cinematic cursor torchlight typography with radial mask illumination.",
  category: "Text",
  badges: ["New", "Spotlight", "Dark Mode"],
  createdAt: "2026-10-10",
  featured: false,
  keywords: [
    "spotlight text",
    "glow reveal text",
    "torch text",
    "radial mask text",
    "cinematic typography",
  ],
  features: [
    "Real-time hardware-accelerated CSS radial-gradient mask tracking cursor position.",
    "Dual-layer composition: Dimmed ambient background layer with full specular specular overlay.",
    "Soft drop-shadow bloom glow centered on illuminated letterforms.",
    "Smooth entry and exit opacity transitions when mouse enters or leaves.",
  ],
  accessibility: [
    "Masked overlay hidden from screen readers via aria-hidden='true'.",
    "Base text retains standard contrast and DOM accessibility.",
  ],
  props: [
    {
      name: "text",
      type: "string",
      description: "Text phrase to illuminate with spotlight.",
    },
    {
      name: "radius",
      type: "number",
      default: "120",
      description: "Spotlight beam diameter in pixels.",
    },
    {
      name: "glowColor",
      type: "string",
      default: '"rgba(255,255,255,0.95)"',
      description: "Specular accent illumination tint.",
    },
    {
      name: "dimmedOpacity",
      type: "number",
      default: "0.18",
      description: "Resting opacity of unlit ambient text.",
    },
  ],
  usageCode: `import { SpotlightGlowRevealText } from "@/components/ui/spotlight-glow-reveal-text";

export function Example() {
  return (
    <SpotlightGlowRevealText
      text="SHINE A LIGHT ON SECRETS"
      className="text-4xl uppercase"
    />
  );
}`,
};

export default SpotlightGlowRevealTextMeta;
