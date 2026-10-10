import type { PulseComponentMeta } from "../../types/component";

export const SpringPinInputMeta: PulseComponentMeta = {
  title: "Spring Pin Input",
  description:
    "Tactile OTP verification code input with per-digit spring impulse bounce, staggered completion wave, and harmonic error shake.",
  tagline: "Tactile OTP slots with spring bounce and staggered completion wave.",
  category: "Inputs",
  badges: ["New", "OTP Input", "Harmonic Shake"],
  createdAt: "2026-10-07",
  featured: true,
  keywords: [
    "spring pin input",
    "otp input react",
    "verification code input",
    "animated pin input",
    "framer motion otp",
  ],
  features: [
    "Auto-advancing numeric slots with Hooke's Law vertical bounce on each keystroke.",
    "Staggered completion wave across all slots when the final digit is entered, plus full clipboard paste support.",
    "Damped horizontal harmonic shake when a non-numeric key is pressed.",
  ],
  accessibility: [
    "Wraps slots in role='group' with individual aria-label='Digit X of N' attributes and inputMode='numeric'.",
    "Supports Backspace auto-retreat, ArrowLeft/ArrowRight navigation, and multi-digit clipboard paste.",
    "Disables vertical bounce and horizontal error shake when prefers-reduced-motion is enabled.",
  ],
  props: [
    {
      name: "length",
      type: "number",
      default: "6",
      description: "Number of verification code character slots.",
    },
    {
      name: "defaultValue",
      type: "string",
      default: '"482"',
      description: "Initial digits pre-populated in the verification slots.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "420",
      description: "Spring stiffness coefficient for keystroke slot bounce.",
    },
    {
      name: "damping",
      type: "number",
      default: "22",
      description: "Spring damping coefficient controlling slot oscillation decay.",
    },
  
    {
      name: "onComplete",
      type: "(pin: string) => void",
      defaultValue: "undefined",
      description: "Callback executed once all PIN code digits are filled",
      required: false,
    },
  ],
  usageCode: `import { SpringPinInput } from "@/components/ui/spring-pin-input";

export function Example() {
  return (
    <SpringPinInput
      length={6}
      defaultValue="482"
      onComplete={(code) => console.log("Verified:", code)}
    />
  );
}`,
};

export default SpringPinInputMeta;
