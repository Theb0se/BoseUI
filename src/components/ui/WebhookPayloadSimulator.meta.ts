import type { PulseComponentMeta } from "../../types/component";

export const WebhookPayloadSimulatorMeta: PulseComponentMeta = {
  title: "Webhook Payload Simulator",
  description:
    "Stripe and GitHub inspired webhook inspection card with HMAC-SHA256 signature auto-signing, event topic selectors, formatted JSON payload viewer, and live test delivery dispatcher.",
  tagline: "Signed test webhook event dispatcher with HMAC signature verification.",
  category: "Cards",
  badges: ["New", "DevTools", "API", "Webhooks"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "webhook simulator",
    "stripe webhook",
    "hmac signature",
    "event payload",
    "api test tool",
    "delivery status",
  ],
  features: [
    "Pre-configured standard events (payment_intent, subscription, invoice).",
    "Simulated HMAC header generation with auto-signed hash indicator.",
    "Interactive Dispatch trigger with simulated round-trip HTTP latency.",
    "One-click copy for the formatted JSON event body.",
  ],
  accessibility: [
    "Accessible select menus with keyboard selection.",
    "High-contrast delivery response indicators with dual color and icon cues.",
  ],
  props: [
    {
      name: "defaultTargetUrl",
      type: "string",
      default: '"https://app.acme.com/api/webhooks/stripe"',
      description: "Default receiving endpoint URL.",
    },
    {
      name: "defaultEventType",
      type: "string",
      default: '"payment_intent.succeeded"',
      description: "Initial webhook event topic selected.",
    },
    {
      name: "hmacSecret",
      type: "string",
      default: '"whsec_94b8109d72c1a8e"',
      description: "Mock HMAC signing secret key.",
    },
  ],
  usageCode: `import { WebhookPayloadSimulator } from "@/components/ui/WebhookPayloadSimulator";

export function Example() {
  return (
    <WebhookPayloadSimulator
      defaultEventType="payment_intent.succeeded"
      defaultTargetUrl="https://app.acme.com/api/webhooks/stripe"
    />
  );
}`,
};

export default WebhookPayloadSimulatorMeta;
