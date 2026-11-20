import React from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedComponentsSection } from "@/components/sections/RecentlyAddedSection";
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
        <div className="pointer-events-none absolute inset-0 overflow-hidden max-h-screen">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)]" />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[850px] rounded-full bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl" />
        </div>
        {/* 100vh Hero Section */}
        <HeroSection />

        {/* Subsequent content sections */}
        <div className="space-y-20 sm:space-y-28 py-12 sm:py-20">
          <div id="featured-components" className="scroll-mt-16">
            <span id="recently-added" className="sr-only" />
            <FeaturedComponentsSection />
          </div>
          <BrowseCategorySection />
          <HowItWorksSection />
          <FAQSection />
        </div>
      </div >
    </>
  );
}
