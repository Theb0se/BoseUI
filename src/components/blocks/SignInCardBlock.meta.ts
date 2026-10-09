import type { PulseComponentMeta } from "../../types/component";

export const SignInCardBlockMeta: PulseComponentMeta = {
  title: "AI Aura Sign-In Card",
  description:
    "High-security authentication card wrapped in a breathing Siri-style chromatic focus aura, featuring floating label email input and an elastic 6-digit 2FA OTP pin verification field.",
  tagline: "Chromatic Siri glow focus aura with 2FA OTP pin input.",
  category: "Inputs",
  badges: ["Block", "Auth", "Security", "Siri Glow"],
  createdAt: "2026-10-09",
  keywords: [
    "sign in block",
    "authentication card",
    "2fa otp",
    "pin input",
    "siri glow",
    "login form",
  ],
  features: [
    "Breathing multi-layer chromatic perimeter aura that intensifies on focus.",
    "Smooth floating label input for work email addresses.",
    "Spring-animated 6-digit PIN input with automatic focus progression.",
    "Instant feedback states for invalid codes or successful verification.",
  ],
  accessibility: [
    "Accessible autocomplete attributes for email and one-time-code.",
    "Screen-reader announcements for verification status.",
    "High-contrast focus rings and accessible 44px touch targets.",
  ],
  props: [
    {
      name: "title",
      type: "string",
      default: '"Welcome back"',
      description: "Header title displayed on the authentication card.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom CSS container classes.",
    },
  ],
  usageCode: `import { SignInCardBlock } from "@/components/ui/SignInCardBlock";

export default function AuthPage() {
  return <SignInCardBlock title="Welcome back" />;
}`,
};
