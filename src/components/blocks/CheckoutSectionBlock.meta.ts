import type { PulseComponentMeta } from "../../types/component";

export const CheckoutSectionBlockMeta: PulseComponentMeta = {
  title: "Checkout Section Block",
  description:
    "An enterprise payment and checkout block integrating LiveCardForm with auto-flipping 3D card preview, seat license stepper configuration, dynamic invoice summary, and interactive TiltCreditCard3D preview with theme swatches.",
  tagline: "Fintech enterprise checkout with live flipping card form, seat stepper, and 3D card summary.",
  category: "Cards",
  badges: ["Block", "Checkout", "Fintech", "Payment", "CardForm", "3DCard"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "checkout section",
    "live card form",
    "tilt credit card 3d",
    "fintech checkout",
    "enterprise license",
    "payment block",
  ],
  features: [
    "Interactive LiveCardForm supporting Luhn validation, brand detection (Visa/Mastercard/Amex), and 180° flip on CVC focus.",
    "Dynamic seat license stepper updating tax and total order sums in real-time.",
    "3D holographic TiltCreditCard3D preview reacting to pointer tilt with selectable metal themes.",
    "Accessible payment confirmation workflow with processing state and receipt badges.",
  ],
  accessibility: [
    "Form fields comply with WCAG AA contrast guidelines and provide explicit aria-labels.",
    "Stepper and action buttons provide 44px+ touch targets on mobile viewports.",
    "Live region alerts screen readers when order totals and seat counts update.",
    "Reduced-motion friendly with dampened 3D card tilt and smooth transitions.",
  ],
  props: [
    {
      name: "productTitle",
      type: "string",
      default: '"Pulse Architecture Enterprise License"',
      description: "Title of the product being purchased in the checkout section.",
    },
    {
      name: "basePrice",
      type: "number",
      default: "49",
      description: "Base price per seat license billed monthly.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom classes applied to the root container.",
    },
  ],
  usageCode: `import { CheckoutSectionBlock } from "@/components/ui/CheckoutSectionBlock";

export function Example() {
  return (
    <CheckoutSectionBlock
      productTitle="Pulse Architecture Enterprise License"
      basePrice={49}
    />
  );
}`,
};

export default CheckoutSectionBlockMeta;
