import React from "react";

export function FAQSection() {
  return (
    <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Common questions about using BoseUI in your React and Next.js projects.
          </p>
        </div>
        
        {/* We will structure this with semantic HTML for extraction by AEO */}
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">What is BoseUI?</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              BoseUI is an open-source, animation-first component library for modern React applications. It provides over 127 production-grade UI primitives built with Framer Motion and Tailwind CSS, designed to make interfaces feel alive with fluid spring mechanics.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">Is BoseUI free to use?</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Yes, BoseUI is completely free and open-source under the MIT license. You can use it in both personal and commercial projects without any restrictions.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">How do I install BoseUI components?</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              BoseUI has zero runtime lock-in. You can install components individually using the native shadcn CLI. For example, running <code>npx shadcn@latest add "https://boseui.site/r/magnetic-button.json"</code> will copy the component directly into your repository's components folder.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">Does BoseUI support Next.js App Router?</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Yes, BoseUI is fully compatible with Next.js 14+ App Router, React Server Components (RSC), and standard React setups. Components leverage 'use client' directives where animations or interactivity require client-side execution.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
