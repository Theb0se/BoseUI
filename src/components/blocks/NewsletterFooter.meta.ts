import type { PulseComponentMeta } from "../../types/component";

export const NewsletterFooterMeta: PulseComponentMeta = {
  title: "Newsletter Footer",
  description:
    "An ambient newsletter footer block framed by a bioluminescent Fireflies twilight forest, featuring a FloatingLabelInput email input, spring-morphing action button, and live confirmation toast.",
  tagline: "Ambient fireflies footer with floating-label input, morphing action button, and confirmation toast.",
  category: "Cards",
  badges: ["Block", "Footer", "Newsletter", "Inputs", "Fireflies", "MorphingButton"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "newsletter footer",
    "fireflies background",
    "floating label input",
    "morphing action button",
    "email subscribe",
    "ambient footer",
  ],
  features: [
    "Atmospheric Canvas 2D Fireflies backdrop with drifting bioluminescent motes and forest silhouette.",
    "Accessible FloatingLabelInput with smooth label elevation and validation feedback.",
    "Spring-physics MorphingActionButton transitioning between idle, loading, and success states.",
    "Integrated confirmation toast notification upon successful subscription dispatch.",
  ],
  accessibility: [
    "Form inputs have associated labels, ARIA descriptive text, and high-contrast color tones.",
    "Interactive buttons have 44px+ hit targets and clear keyboard focus rings.",
    "Full support for prefers-reduced-motion damping background particle velocity.",
  ],
  props: [
    {
      name: "title",
      type: "string",
      default: '"Stay in orbit with kinetic interface updates"',
      description: "Main invitation headline above the newsletter card.",
    },
    {
      name: "description",
      type: "string",
      default: '"Get notified about new high-performance WebGL shaders..."',
      description: "Supporting text explaining email frequency and privacy guarantees.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom classes applied to the root footer container.",
    },
  ],
  usageCode: `import { NewsletterFooter } from "@/components/ui/NewsletterFooter";

export function Example() {
  return (
    <NewsletterFooter
      title="Stay in orbit with kinetic interface updates"
    />
  );
}`,
};

export default NewsletterFooterMeta;
