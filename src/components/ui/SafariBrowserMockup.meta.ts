import type { PulseComponentMeta } from "../../types/component";

export const SafariBrowserMockupMeta: PulseComponentMeta = {
  title: "Safari Browser Mockup",
  description:
    "macOS Safari browser chrome with traffic light controls, a central frosted unified address bar with SSL padlock, tab strip, and live viewport slot.",
  tagline: "Apple Safari browser chrome mockup with interactive address bar and tabs.",
  category: "Mockups",
  badges: ["New", "Apple", "Browser", "Software"],
  createdAt: "2026-10-12",
  featured: false,
  keywords: [
    "safari mockup",
    "browser mockup",
    "apple safari",
    "browser window",
    "chrome mockup",
    "address bar",
  ],
  features: [
    "macOS Safari unified toolbar with SSL padlock and traffic lights.",
    "Interactive address bar with reload button and URL editing.",
    "Optional tab strip bar with page title and icon.",
    "Responsive container that renders any landing page or screenshot.",
  ],
  accessibility: [
    "Input element has accessible aria-label.",
    "Buttons include standard accessible labels.",
  ],
  props: [
    {
      name: "url",
      type: "string",
      default: '"https://boseui.site"',
      description: "URL shown in the address bar.",
    },
    {
      name: "title",
      type: "string",
      default: '"BoseUI — Architectural UI Components"',
      description: "Active page title.",
    },
    {
      name: "showTabs",
      type: "boolean",
      default: "true",
      description: "Show Safari tab bar strip.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Viewport content.",
    },
  ],
  usageCode: `import { SafariBrowserMockup } from "@/components/ui/SafariBrowserMockup";

export function Example() {
  return (
    <SafariBrowserMockup url="https://yourproduct.com" title="Your Product">
      <div className="p-8">
        <h1>Your Landing Page Content</h1>
      </div>
    </SafariBrowserMockup>
  );
}`,
};

export default SafariBrowserMockupMeta;
