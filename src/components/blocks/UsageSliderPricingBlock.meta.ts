import type { PulseComponentMeta } from "../../types/component";

export const UsageSliderPricingBlockMeta: PulseComponentMeta = {
  title: "Usage Slider Pricing Block",
  description:
    "A granular usage-based pricing configurator composing KineticSlider for API volume, ScrubbableNumberInput for developer seats, and StepperSliderControl for GPU accelerators, dynamically calculating real-time cluster costs.",
  tagline: "Granular infrastructure pricing configurator with kinetic sliders, scrubbers, and live cost breakdown.",
  category: "Cards",
  badges: ["Block", "Pricing", "Kinetic", "Slider", "Interactive"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "usage pricing",
    "infrastructure calculator",
    "kinetic slider",
    "scrubbable input",
    "stepper slider",
    "saas pricing block",
    "cloud cost estimator",
  ],
  features: [
    "Composes three specialized kinetic controls: KineticSlider, ScrubbableNumberInput, and StepperSliderControl.",
    "Real-time itemized cost calculation across API traffic, user seats, and compute accelerators.",
    "Dynamic summary card reflecting immediate cluster investment with breakdown lines.",
    "Hooke's Law physics applied across drag, scrub, and step interactions.",
    "Fully responsive two-column grid with dark and light mode optimization.",
  ],
  accessibility: [
    "Accessible range sliders and number inputs with clear semantic labels.",
    "Full keyboard navigation and scrubbable drag support.",
    "High-contrast color indicators and legible monospace typography for numbers.",
  ],
  props: [
    {
      name: "defaultRequests",
      type: "number",
      default: "500000",
      description: "Initial monthly request volume.",
    },
    {
      name: "defaultSeats",
      type: "number",
      default: "8",
      description: "Initial collaborator seats count.",
    },
    {
      name: "defaultGpus",
      type: "number",
      default: "2",
      description: "Initial dedicated GPU accelerators count.",
    },
    {
      name: "title",
      type: "string",
      default: '"Precision usage-based infrastructure estimator"',
      description: "Header title text.",
    },
    {
      name: "description",
      type: "string",
      default: '"Tune requests, developer seats, and dedicated AI accelerators..."',
      description: "Subtitle description text.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom classes to append to the root block container.",
    },
  ],
  usageCode: `import { UsageSliderPricingBlock } from "@/components/ui/UsageSliderPricingBlock";

export function InfrastructurePricing() {
  return (
    <div className="w-full max-w-6xl mx-auto py-12">
      <UsageSliderPricingBlock
        defaultRequests={500000}
        defaultSeats={10}
        defaultGpus={4}
      />
    </div>
  );
}`,
};
