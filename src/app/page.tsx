import React from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { RecentlyAddedSection } from "@/components/sections/RecentlyAddedSection";
import { BrowseCategorySection } from "@/components/sections/BrowseCategorySection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { FAQSection } from "@/components/sections/FAQSection";

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
      "priceCurrency": "USD",
    },
    "author": {
      "@type": "Person",
      "name": "Rishabh Bose",
    },
    "description":
      "React components with spring animations. Copy-paste into your project. Built with Framer Motion, Tailwind and TypeScript. Free and open source.",
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
          "text":
            "BoseUI is a collection of React components with spring animations built using Framer Motion, Tailwind CSS, and TypeScript. You can copy and paste code directly or install components via the shadcn CLI.",
        },
      },
      {
        "@type": "Question",
        "name": "Is BoseUI free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Yes. BoseUI is open source under the MIT license. You can use it in personal and commercial projects for free.",
        },
      },
      {
        "@type": "Question",
        "name": "How do I install BoseUI components?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Run npx shadcn@latest add https://boseui.site/r/<component>.json with npm, pnpm, or bun. The source file is copied directly into your project.",
        },
      },
      {
        "@type": "Question",
        "name": "Does BoseUI support Next.js App Router?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Yes. All components work with the Next.js 14+ App Router, React Server Components, and client transitions.",
        },
      },
    ],
  },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
        {/* 100vh Hero Section */}
        <HeroSection />

        {/* Subsequent content sections */}
        <div className="space-y-20 sm:space-y-28 py-12 sm:py-20">
          <div id="recently-added" className="scroll-mt-16">
            <RecentlyAddedSection />
          </div>
          <BrowseCategorySection />
          <HowItWorksSection />
          <FAQSection />
        </div>
      </div>
    </>
  );
}
