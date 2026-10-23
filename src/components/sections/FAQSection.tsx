"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "What is BoseUI?",
    answer:
      "BoseUI is an open-source, animation-first component library for modern React applications. It provides production-grade UI primitives built with Framer Motion, Tailwind CSS, and TypeScript, engineered to make interfaces feel tactile and alive with fluid spring mechanics.",
  },
  {
    question: "Is BoseUI free to use?",
    answer:
      "Yes, BoseUI is 100% free and open-source under the MIT license. You can freely use all components in personal, freelance, client, and high-scale commercial production applications without any attribution or licensing costs.",
  },
  {
    question: "How do I install BoseUI components?",
    answer:
      "BoseUI has zero runtime lock-in. You install components directly using the native shadcn CLI (e.g. npx shadcn@latest add https://boseui.site/r/magnetic-button.json). The full TypeScript source code is copied straight into your repository so you maintain 100% ownership and customization control.",
  },
  {
    question: "Does BoseUI support Next.js App Router & Server Components?",
    answer:
      "Yes. BoseUI is fully tested and compatible with Next.js 14+ App Router, React Server Components (RSC), and standard React setups. Interactive components include the 'use client' directive while remaining lean and performance-focused.",
  },
  {
    question: "Can I customize the Tailwind styles and animations?",
    answer:
      "Absolutely. Because you own the component code inside your project, you can easily change Tailwind class names, CSS color variables, Framer Motion spring physics (stiffness, damping, mass), or extend the component API to suit your brand.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="border-b border-neutral-200 bg-white py-20 dark:border-[#1A1A1A] dark:bg-black sm:py-24">
      <div className="mx-auto max-w-[1280px] border-x border-neutral-200 px-5 dark:border-[#1A1A1A] sm:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 font-mono text-[11px] text-neutral-600 dark:border-[#222222] dark:bg-[#0A0A0A] dark:text-neutral-400">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-black dark:text-white sm:text-4xl">
              Everything you need to know.
            </h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Have questions about how BoseUI fits into your React stack? Here are the answers.
            </p>
          </div>

          {/* Accordion List */}
          <div className="mt-12 divide-y divide-neutral-200 border-y border-neutral-200 dark:divide-[#1A1A1A] dark:border-[#1A1A1A]">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={faq.question} className="py-4">
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between text-left transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white rounded-lg p-2"
                  >
                    <span className="text-base font-medium text-neutral-900 group-hover:text-black dark:text-neutral-200 dark:group-hover:text-white">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-black dark:text-white" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-2 pb-3 pt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
