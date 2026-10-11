import type { PulseComponentMeta } from "../../types/component";

export const ElasticSwipeSliderMeta: PulseComponentMeta = {
  title: "Elastic Swipe Slider",
  description:
    "Swipe-to-confirm slider control with gesture resistance, rubber-band recoil physics, and a morphing confirmation checkpoint.",
  tagline: "Swipe-to-confirm slider with rubber-band gesture physics.",
  category: "Buttons",
  badges: ["New", "Gesture UI", "Swipe Action"],
  createdAt: "2026-10-10",
  featured: true,
  keywords: [
    "swipe to confirm",
    "slide to confirm",
    "gesture slider",
    "elastic slider",
    "framer motion drag",
  ],
  features: [
    "Horizontal drag gesture with elastic boundary resistance and spring recoil on abort.",
    "Progressive opacity decay on the track label as the thumb approaches trigger threshold.",
    "Animated transformation into an emerald confirmed badge with reset capability.",
    "Customizable width, labels, and confirmation callbacks.",
  ],
  accessibility: [
    "Full mouse and touch drag gesture compatibility.",
    "Keyboard accessible via reset button.",
    "Reduced motion safeguards on confirmation scale transitions.",
  ],
  props: [
    {
      name: "label",
      type: "string",
      default: '"Slide to Confirm"',
      description: "Resting instruction label.",
    },
    {
      name: "confirmedLabel",
      type: "string",
      default: '"Confirmed"',
      description: "Label shown upon reaching 85%+ swipe threshold.",
    },
    {
      name: "onConfirm",
      type: "() => void",
      description: "Callback fired when the slider is triggered.",
    },
    {
      name: "width",
      type: "number",
      default: "280",
      description: "Track width in pixels.",
    },
    {
      name: "disabled",
      type: "boolean",
      default: "false",
      description: "Disables drag interaction when true.",
    },
  ],
  usageCode: `import { ElasticSwipeSlider } from "@/components/ui/elastic-swipe-slider";

export function Example() {
  return (
    <ElasticSwipeSlider
      label="Slide to Deploy"
      confirmedLabel="Deployed"
      onConfirm={() => console.log("Deployment initiated")}
    />
  );
}`,
};

export default ElasticSwipeSliderMeta;
