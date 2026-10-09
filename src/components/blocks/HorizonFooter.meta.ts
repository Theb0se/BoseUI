import type { PulseComponentMeta } from "../../types/component";

export const HorizonFooterMeta: PulseComponentMeta = {
  title: "Horizon Footer",
  description:
    "A cinematic landing footer block framed by a planetary horizon canvas backdrop, four multi-column navigation link groups, responsive newsletter subscription, and a giant mechanical CipherScrambleText brand wordmark.",
  tagline: "Orbital planetary horizon footer with multi-column links and giant cipher scramble wordmark.",
  category: "Navigation",
  badges: ["Block", "Footer", "Navigation", "Shader", "Cipher"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "horizon footer",
    "planet horizon",
    "cipher scramble text",
    "footer block",
    "orbital background",
    "newsletter footer",
  ],
  features: [
    "Ambient orbital PlanetHorizon backdrop with curved planetary limb and solar cresting flare.",
    "Four responsive link columns with status badges for features and hiring announcements.",
    "Newsletter subscription form with tactile state transition to subscribed confirmation.",
    "Giant CipherScrambleText brand wordmark displaying mechanical decoding animation.",
  ],
  accessibility: [
    "High-contrast text links exceeding WCAG 2.1 AA 4.5:1 ratio against the dark space gradient.",
    "Full semantic HTML5 <footer>, <nav>, and <form> elements with ARIA labeling.",
    "All interactive elements comply with 44px+ touch target size requirements.",
    "Reduced-motion friendly with static text rendering fallback for the cipher scramble effect.",
  ],
  props: [
    {
      name: "columns",
      type: "FooterColumn[]",
      description: "Array of navigation column categories and child link items.",
    },
    {
      name: "wordmark",
      type: "string",
      default: '"BOSEUI"',
      description: "Text string decoded inside the giant scrambled wordmark header.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom classes applied to the footer container.",
    },
  ],
  usageCode: `import { HorizonFooter } from "@/components/ui/HorizonFooter";

export function Example() {
  return (
    <HorizonFooter
      wordmark="BOSEUI"
    />
  );
}`,
};

export default HorizonFooterMeta;
