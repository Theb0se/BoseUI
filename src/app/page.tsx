import React from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { TechTrustStrip } from "@/components/sections/TechTrustStrip";
import { CategoryExplorerSection } from "@/components/sections/CategoryExplorerSection";
import { InteractiveBentoShowcase } from "@/components/sections/InteractiveBentoShowcase";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FAQSection } from "@/components/sections/FAQSection";
import { FooterCTA } from "@/components/sections/FooterCTA";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "BoseUI",
    "operatingSystem": "Any",
    "applicationCategory": "DeveloperApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Person",
      "name": "Rishabh Bose"
    },
    "description": "Kinetic React Components Engineered to Make Interfaces Feel Alive. An open-source, animation-first component library for modern React applications."
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is BoseUI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "BoseUI is an open-source, animation-first component library for modern React applications. It provides production-grade UI primitives built with Framer Motion and Tailwind CSS, designed to make interfaces feel alive with fluid spring mechanics."
        }
      },
      {
        "@type": "Question",
        "name": "Is BoseUI free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, BoseUI is completely free and open-source under the MIT license. You can use it in both personal and commercial projects without any restrictions."
        }
      },
      {
        "@type": "Question",
        "name": "How do I install BoseUI components?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "BoseUI has zero runtime lock-in. You can install components individually using the native shadcn CLI. For example, running `npx shadcn@latest add \"https://boseui.site/r/magnetic-button.json\"` will copy the component directly into your repository."
        }
      },
      {
        "@type": "Question",
        "name": "Does BoseUI support Next.js App Router?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, BoseUI is fully compatible with Next.js 14+ App Router, React Server Components (RSC), and standard React setups."
        }
      }
    ]
  }
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-white dark:bg-black">
        <HeroSection />
        <TechTrustStrip />
        <CategoryExplorerSection />
        <InteractiveBentoShowcase />
        <HowItWorks />
        <FAQSection />
        <FooterCTA />
      </div>
    </>
  );
}

