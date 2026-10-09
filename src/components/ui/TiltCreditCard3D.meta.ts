import type { PulseComponentMeta } from "../../types/component";

export const TiltCreditCard3DMeta: PulseComponentMeta = {
  title: "Tilt Credit Card 3D",
  description:
    "Revolut and Apple Card-inspired premium 3D metal card with cursor-tilt gyroscope physics, rainbow holographic foil reflection, gold EMV chip, contactless RFID waves, and dual-side flip mechanics.",
  tagline: "Ultra-premium 3D metal credit card with dynamic cursor tilt and holographic foil reflection.",
  category: "Cards",
  badges: ["Fintech", "3D Physics", "Hologram"],
  createdAt: "2026-10-09",
  keywords: [
    "credit card",
    "3d tilt card",
    "apple card",
    "revolut card",
    "holographic foil",
    "metal card",
    "emv chip",
    "fintech card",
  ],
  features: [
    "Hooke's Law spring physics for cursor tilt tracking with realistic angular dampening.",
    "Dynamic rainbow prism holographic glare layer responding to pointer coordinates.",
    "Dual-sided card view with flip mechanics showing magnetic stripe, signature strip, and CVV.",
    "Debossed typography with customizable cardholder name and sensitive number masking.",
    "Four distinct material finishes: Titanium Metal, Obsidian Black, Rose Gold, and Holo Prism.",
  ],
  accessibility: [
    "Keyboard accessible flip action for accessing back-of-card security details.",
    "Masked digits by default for privacy, with toggleable screen-reader announcements.",
    "Respects reduced-motion preferences by dampening rotational angles.",
  ],
  props: [
    {
      name: "cardHolder",
      type: "string",
      default: '"ALEXANDER VANCE"',
      description: "Name embossed on the front of the credit card.",
    },
    {
      name: "cardNumber",
      type: "string",
      default: '"4532 8901 2345 7892"',
      description: "16-digit card number displayed on the card surface.",
    },
    {
      name: "expiry",
      type: "string",
      default: '"09/29"',
      description: "Expiration date in MM/YY format.",
    },
    {
      name: "cvv",
      type: "string",
      default: '"842"',
      description: "3-digit card verification value on the reverse signature strip.",
    },
    {
      name: "theme",
      type: '"titanium" | "obsidian" | "rosegold" | "holographic"',
      default: '"titanium"',
      description: "Visual texture and metallic gradient preset.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes to apply to the root container.",
    },
  ],
  usageCode: `import { TiltCreditCard3D } from "@/components/ui/TiltCreditCard3D";

export function Example() {
  return (
    <TiltCreditCard3D
      cardHolder="SOPHIA NAKAMOTO"
      cardNumber="4820 1934 8291 0422"
      expiry="12/30"
      cvv="719"
      theme="holographic"
    />
  );
}`,
};

export default TiltCreditCard3DMeta;
