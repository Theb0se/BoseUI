import type { PulseComponentMeta } from "../../types/component";

export const InteractiveApiEndpointBarMeta: PulseComponentMeta = {
  title: "Interactive API Endpoint Bar",
  description:
    "Postman and Scalar inspired monospace live HTTP request runner with method pills (GET, POST, PUT, DELETE), endpoint path editing, status latency indicators, and expandable JSON response viewer.",
  tagline: "Live HTTP request runner with expandable JSON response payload.",
  category: "Cards",
  badges: ["New", "DevTools", "API", "Network"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "api runner",
    "http endpoint bar",
    "rest client",
    "json response viewer",
    "curl copy",
    "postman style",
  ],
  features: [
    "Support for GET, POST, PUT, PATCH, and DELETE methods with color-coded badges.",
    "Live mock execution with simulated latency and animated loading spinner.",
    "Expandable JSON response body, HTTP headers, and query parameters tabs.",
    "One-click copy for endpoint URL and formatted cURL command.",
  ],
  accessibility: [
    "Full keyboard navigation and semantic form controls.",
    "High contrast status badges with accessible ARIA live states.",
  ],
  props: [
    {
      name: "defaultMethod",
      type: '"GET" | "POST" | "PUT" | "PATCH" | "DELETE"',
      default: '"GET"',
      description: "Default HTTP method selected.",
    },
    {
      name: "defaultEndpoint",
      type: "string",
      default: '"https://api.boseui.com/v1/users/usr_94b1e84a"',
      description: "Endpoint URL route displayed in the input field.",
    },
    {
      name: "latencyMs",
      type: "number",
      default: "28",
      description: "Simulated response latency in milliseconds.",
    },
    {
      name: "statusCode",
      type: "number",
      default: "200",
      description: "Simulated HTTP response status code.",
    },
  ],
  usageCode: `import { InteractiveApiEndpointBar } from "@/components/ui/InteractiveApiEndpointBar";

export function Example() {
  return (
    <InteractiveApiEndpointBar
      defaultMethod="GET"
      defaultEndpoint="https://api.boseui.com/v1/users/usr_94b1e84a"
      latencyMs={24}
    />
  );
}`,
};

export default InteractiveApiEndpointBarMeta;
