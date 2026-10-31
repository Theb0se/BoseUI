import type { PulseComponentMeta } from "../../types/component";

export const CTABannerMeta: PulseComponentMeta = {
  title: "CTA Banner",
  description:
    "Full-width call-to-action section with a self-contained flickering canvas grid background masked radially so the grid is denser at the edges and fades toward the center. Includes an email signup form with loading, success, and validation states animated via Framer Motion AnimatePresence.",
  tagline: "Full-width email CTA with animated flickering grid, multi-state button, and form validation.",
  category: "Cards",
  badges: ["Canvas", "Framer Motion", "Form", "A11y Ready"],
  createdAt: "2026-10-31",
  featured: true,
  keywords: [
    "cta banner",
    "call to action",
    "email signup",
    "flickering grid cta",
    "framer motion form",
    "newsletter signup",
    "animated button states",
    "loading state",
    "success state",
    "form validation",
  ],
  features: [
    "Self-contained InternalGridCanvas — no external FlickeringGrid import; single file drop-in.",
    "Radial mask-image makes grid denser at edges and transparent at center so text stays readable.",
    "AnimatePresence button label swap: idle → loading spinner (animated rotate) → success checkmark (SVG pathLength).",
    "Input shake animation on validation failure using Framer Motion x keyframes.",
    "AnimatePresence height + opacity transition on inline error message.",
    "Slow floating glow blob using infinite repeating animate with ease-in-out y oscillation.",
    "Stagger entrance: badge, heading, subheading, form fade+rise with staggerChildren.",
    "Accessible: aria-invalid, aria-describedby, aria-live='polite', sr-only label, focus-visible rings.",
    "Respects prefers-reduced-motion; all animations bypass when enabled.",
  ],
  accessibility: [
    "Email input has sr-only <label>, aria-invalid and aria-describedby linked to inline error.",
    "aria-live='polite' div announces success and error states to screen readers.",
    "Button aria-label updates to match current state (idle / loading / success).",
    "All interactive elements have clearly visible focus-visible rings.",
    "Decorative canvas and glow blob marked aria-hidden='true'.",
    "prefers-reduced-motion respected — all Framer Motion animations are bypassed.",
  ],
  props: [
    {
      name: "heading",
      type: "string",
      default: "undefined",
      description: "Bold headline rendered inside the banner.",
    },
    {
      name: "subheading",
      type: "string",
      default: "undefined",
      description: "Muted supporting copy rendered beneath the headline.",
    },
    {
      name: "placeholder",
      type: "string",
      default: '"Enter your email"',
      description: "Placeholder text for the email input.",
    },
    {
      name: "buttonLabel",
      type: "string",
      default: '"Get started"',
      description: "Label for the submit button in its idle state.",
    },
    {
      name: "onSubmit",
      type: "(email: string) => Promise<void> | void",
      default: "undefined",
      description: "Async callback called with the validated email string on form submit.",
    },
    {
      name: "accentColor",
      type: "string",
      default: '"#6366f1"',
      description: "CSS color used for the grid squares, glow blob, and submit button background.",
    },
    {
      name: "className",
      type: "string",
      default: "undefined",
      description: "Additional Tailwind CSS classes merged into the outer container.",
    },
  ],
  usageCode: `import { CTABanner } from "@/components/ui/CTABanner";

export default function NewsletterSection() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <CTABanner
        heading="Ship beautiful interfaces faster"
        subheading="Join 12,000+ engineers who build with BoseUI components every week."
        placeholder="you@company.com"
        buttonLabel="Join the waitlist"
        accentColor="#6366f1"
        onSubmit={async (email) => {
          await fetch("/api/subscribe", {
            method: "POST",
            body: JSON.stringify({ email }),
          });
        }}
      />
    </div>
  );
}`,
};

export default CTABannerMeta;
