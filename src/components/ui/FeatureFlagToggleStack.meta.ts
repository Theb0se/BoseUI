import type { PulseComponentMeta } from "../../types/component";

export const FeatureFlagToggleStackMeta: PulseComponentMeta = {
  title: "Feature Flag Toggle Stack",
  description:
    "LaunchDarkly and PostHog inspired feature flag management card with master kill-switch toggles, gradual traffic allocation sliders (0% to 100%), targeting rule badges, and environment scopes.",
  tagline: "Feature flag rollout controller with gradual traffic allocation sliders.",
  category: "Cards",
  badges: ["New", "DevTools", "Flags", "Rollouts"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "feature flag",
    "launchdarkly card",
    "traffic rollout",
    "kill switch",
    "posthog feature flags",
    "gradual rollout",
  ],
  features: [
    "Master boolean toggles for instant kill-switch feature disarming.",
    "Granular 0% to 100% traffic allocation sliders.",
    "Targeting rules chips (e.g. Beta users, Internal IP scopes).",
    "Environment scope pills for Production vs Staging.",
  ],
  accessibility: [
    "Keyboard accessible toggle switch and range inputs.",
    "Semantic text descriptions and percentage indicators.",
  ],
  props: [
    {
      name: "initialFlags",
      type: "FeatureFlag[]",
      description: "Initial list of feature flags.",
    },
    {
      name: "onChange",
      type: "(flags: FeatureFlag[]) => void",
      description: "Callback invoked on flag state updates.",
    },
  ],
  usageCode: `import { FeatureFlagToggleStack } from "@/components/ui/FeatureFlagToggleStack";

export function Example() {
  return (
    <FeatureFlagToggleStack />
  );
}`,
};

export default FeatureFlagToggleStackMeta;
