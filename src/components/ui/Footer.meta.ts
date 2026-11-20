import type { PulseComponentMeta } from "../../types/component";

export const FooterMeta: PulseComponentMeta = {
  title: "Footer",
  description:
    "Comprehensive kinetic multi-column footer featuring an interactive newsletter subscription form, magnetic social buttons, live system status, and responsive navigation links.",
  tagline: "Kinetic multi-column footer with interactive newsletter physics, status pill, and social links.",
  category: "Navigation",
  badges: ["New", "Multi-column", "Interactive", "A11y Ready"],
  createdAt: "2026-11-20",
  featured: true,
  keywords: [
    "footer",
    "navigation footer",
    "footer navigation",
    "multi-column footer",
    "newsletter footer",
    "framer motion footer",
    "site footer",
  ],
  features: [
    "Multi-column responsive navigation grid with kinetic spring link translations on hover.",
    "Integrated interactive newsletter signup form with loading spinner, success checkmark, and error states.",
    "Live operational status pill with glowing pulsating radar dot.",
    "Social media links with spring scale lift, ambient hover borders, and active press states.",
    "Custom brand mission slot, dynamic copyright year, and legal policy links.",
  ],
  accessibility: [
    "Semantic <footer role='contentinfo' aria-label='Site Footer'> landmark.",
    "Full form accessibility with descriptive aria-label on input and submit controls.",
    "External links include security rel='noreferrer noopener' and clear link descriptions.",
    "High contrast ratios meeting WCAG AA standards across dark and light modes.",
  ],
  props: [
    {
      name: "brandName",
      type: "string",
      default: '"BoseUI"',
      description: "Brand title rendered at the top of the identity column.",
    },
    {
      name: "description",
      type: "string",
      default: '"Kinetic UI components engineered to make modern web interfaces feel alive and tactile."',
      description: "Short brand statement or product value proposition.",
    },
    {
      name: "columns",
      type: "FooterColumn[]",
      default: "DEFAULT_COLUMNS",
      description: "Array of navigation columns, each with titles, links, and optional badges.",
    },
    {
      name: "socials",
      type: "FooterSocial[]",
      default: "DEFAULT_SOCIALS",
      description: "Social media profiles with icons and external targets.",
    },
    {
      name: "statusText",
      type: "string",
      default: '"All systems operational"',
      description: "Text label for the live service operational indicator.",
    },
    {
      name: "showNewsletter",
      type: "boolean",
      default: "true",
      description: "Whether to display the kinetic newsletter subscription box.",
    },
    {
      name: "onNewsletterSubmit",
      type: "(email: string) => Promise<boolean> | boolean | void",
      description: "Async handler triggered when a user submits an email address.",
    },
  ],
  usageCode: `import { Footer } from "@/components/ui/Footer";

export function Example() {
  return (
    <Footer
      brandName="BoseUI"
      description="Kinetic UI components engineered to make modern web interfaces feel alive."
      onNewsletterSubmit={async (email) => {
        console.log("Subscribed:", email);
      }}
    />
  );
}`,
};

export default FooterMeta;
