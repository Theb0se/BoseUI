import type { PulseComponentMeta } from "../../types/component";

export const TiltPinInputMeta: PulseComponentMeta = {
  title: "Tilt Pin Input",
  description:
    "Tactile OTP digit pin input with spring keystroke lifts, auto-advance focus, paste parsing, and harmonic error shake mechanics.",
  tagline: "Tactile OTP pin input with keystroke spring lifts and error shake.",
  category: "Inputs",
  badges: ["New", "Micro-interaction", "Auth UI"],
  createdAt: "2026-10-10",
  featured: false,
  keywords: [
    "pin input",
    "otp input",
    "digit input",
    "shake input",
    "framer motion input",
  ],
  features: [
    "Harmonic shake animation across digit boxes upon invalid code submission.",
    "Spring-pressured vertical lift and scaling on active focused digits.",
    "Smart clipboard paste parsing that distributes code across boxes seamlessly.",
    "Full backspace backwards navigation and keyboard controls.",
  ],
  accessibility: [
    "Individual digit boxes labeled with aria-label='Digit X of Y'.",
    "Numeric inputMode='numeric' optimized for mobile virtual keypads.",
    "Respects prefers-reduced-motion for shake effects.",
  ],
  props: [
    {
      name: "length",
      type: "number",
      default: "4",
      description: "Total number of code digits.",
    },
    {
      name: "onComplete",
      type: "(pin: string) => void",
      description: "Callback fired when all digits are entered.",
    },
    {
      name: "onChange",
      type: "(pin: string) => void",
      description: "Callback fired on every digit entry.",
    },
    {
      name: "hasError",
      type: "boolean",
      default: "false",
      description: "Triggers harmonic error shake when true.",
    },
    {
      name: "masked",
      type: "boolean",
      default: "false",
      description: "Masks numbers with dots for sensitive pins.",
    },
  ],
  usageCode: `import { TiltPinInput } from "@/components/ui/tilt-pin-input";

export function Example() {
  return (
    <TiltPinInput
      length={6}
      onComplete={(pin) => console.log("PIN Verified:", pin)}
    />
  );
}`,
};

export default TiltPinInputMeta;
