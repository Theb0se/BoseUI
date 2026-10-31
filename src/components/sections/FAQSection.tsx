"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "What is BoseUI?",
    answer:
      "BoseUI is a collection of React components with spring animations built using Framer Motion, Tailwind CSS, and TypeScript. You can copy and paste code directly or install components via the shadcn CLI.",
  },
  {
    question: "Is BoseUI free to use?",
    answer:
      "Yes. BoseUI is open source under the MIT license. You can use it in personal and commercial projects for free.",
  },
  {
    question: "How do I install components?",
    answer:
      "Run npx shadcn@latest add https://boseui.site/r/<component>.json with npm, pnpm, or bun. The source file is copied directly into your project's component directory.",
  },
  {
    question: "Does BoseUI support Next.js App Router?",
    answer:
      "Yes. All components work with the Next.js 14+ App Router, React Server Components, and standard client-side React frameworks.",
  },
  {
    question: "Can I customize the components?",
    answer:
      "Yes. Because the component code lives in your project, you have complete control over the Tailwind classes, spring physics, and TypeScript props.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section>
      <div className="border-b border-neutral-200 pb-3 dark:border-neutral-800">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-white">
          Frequently asked questions
        </h2>
      </div>

      <div className="mt-4 divide-y divide-neutral-200 border-b border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={faq.question} className="py-3">
              <button
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between py-1 text-left text-sm font-medium text-neutral-950 transition-colors hover:text-neutral-600 dark:text-white dark:hover:text-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-neutral-950 dark:text-white" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="pt-2 pb-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
