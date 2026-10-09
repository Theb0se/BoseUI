import type { PulseComponentMeta } from "../../types/component";

export const LiveCardFormMeta: PulseComponentMeta = {
  title: "Live Card Form",
  description:
    "Interactive payment checkout form paired with a photorealistic 3D credit card that automatically flips 180° when CVC is focused, with brand detection and Luhn algorithm validation.",
  tagline: "Photorealistic 3D credit card with auto-flip CVC focus and Luhn validation.",
  category: "Inputs",
  badges: ["Stripe", "Payment", "3D Flip", "Luhn Validation", "Inputs"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "live card form",
    "credit card checkout",
    "stripe card input",
    "3d flip credit card",
    "luhn algorithm",
    "card brand detection",
    "payment ui",
  ],
  features: [
    "Photorealistic 3D credit card with EMV gold chip, wireless antenna, and realistic holographic sheen.",
    "Automatic 180° 3D flip (`rotateY(180deg)`) revealing magnetic stripe and signature strip when focusing CVC.",
    "Real-time card brand detection for Visa, Mastercard, American Express, and Discover with dynamic styling.",
    "Real-time card number masking and client-side Luhn checksum algorithm validation indicator.",
    "Interactive stage preset fillers for instant demo testing and flipping inspection.",
  ],
  accessibility: [
    "Fully accessible HTML5 form inputs with descriptive labels, autocomplete, and ARIA statuses.",
    "Keyboard-focusable inputs and interactive 3D card preview with Space/Enter toggle.",
    "Reduced motion support maintains input responsiveness without disorienting 3D animations.",
  ],
  props: [
    {
      name: "defaultAmount",
      type: "string",
      default: "'$89.00'",
      description: "Default transaction amount displayed on the payment CTA button.",
    },
    {
      name: "onSuccess",
      type: "() => void",
      description: "Callback invoked after successful simulated card payment authorization.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional CSS classes to apply to the root container.",
    },
  ],
  usageCode: `import { LiveCardForm } from "@/components/ui/LiveCardForm";

export function Example() {
  return (
    <div className="w-full">
      <LiveCardForm defaultAmount="$89.00" />
    </div>
  );
}`,
};

export default LiveCardFormMeta;
