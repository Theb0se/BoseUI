import type { PulseComponentMeta } from "../../types/component";

export const MorphingActionButtonMeta: PulseComponentMeta = {
  title: "Morphing Action Button",
  description:
    "Multi-phase stateful pill button that morphs its bounding width across Idle, Compiling, and Published states using spring layout projection.",
  tagline: "Stateful width-morphing pill button with spring layout projection.",
  category: "Buttons",
  badges: ["New", "Stateful Morph", "Layout Spring"],
  createdAt: "2026-10-07",
  featured: true,
  keywords: [
    "morphing action button",
    "stateful loading button",
    "animated submit button",
    "framer motion button",
    "pill width morph",
  ],
  features: [
    "Seamless bounding-width interpolation between Idle, Loading, Success, and Error states via Framer Motion layout.",
    "Directional vertical label swap powered by AnimatePresence mode='popLayout'.",
    "Optional harmonic error shake state.",
  ],
  accessibility: [
    "Uses aria-live='polite' so screen readers announce state transitions as they occur.",
    "Preserves keyboard focus across all state transitions.",
    "Disables width spring oscillation and horizontal shake when prefers-reduced-motion is enabled.",
  ],
  props: [
    {
      name: "idleLabel",
      type: "string",
      default: '"Publish Registry"',
      description: "Button text rendered in the resting idle state.",
    },
    {
      name: "loadingLabel",
      type: "string",
      default: '"Compiling..."',
      description: "Button text rendered during the async loading phase.",
    },
    {
      name: "successLabel",
      type: "string",
      default: '"Published v2.4"',
      description: "Button text rendered when the action succeeds.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "380",
      description: "Spring stiffness coefficient for pill width projection.",
    },
    {
      name: "damping",
      type: "number",
      default: "26",
      description: "Spring damping coefficient for pill width projection.",
    },
  ],
  usageCode: `import { MorphingActionButton } from "@/components/ui/morphing-action-button";

export function Example() {
  return (
    <MorphingActionButton
      idleLabel="Publish Registry"
      loadingLabel="Compiling..."
      successLabel="Published v2.4"
    />
  );
}`,
};

export default MorphingActionButtonMeta;
