import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog";
import { ArrowUpRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog · Frontend Engineering & Kinetic UI",
  description:
    "Articles and insights on frontend engineering, Framer Motion spring physics, React design systems, and accessible micro-interactions.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/blog`,
  },
  openGraph: {
    title: `Blog · ${SITE_CONFIG.name}`,
    description:
      "Articles and insights on frontend engineering, spring physics, and Kinetic UI.",
    url: `${SITE_CONFIG.url}/blog`,
    type: "website",
  },
};

export default function BlogIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <header className="mb-12 border-b border-neutral-200/80 pb-8 dark:border-neutral-800">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-4xl">
          Writing
        </h1>
        <p className="mt-3 text-base text-neutral-600 dark:text-neutral-400">
          Thoughts, technical deep-dives, and research on frontend engineering, kinetic UI, and building software that feels alive.
        </p>
      </header>

      <div className="flex flex-col divide-y divide-neutral-200/80 dark:divide-neutral-800">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.slug}
            className="group relative flex flex-col items-baseline justify-between py-8 transition-all sm:flex-row sm:gap-8"
          >
            <div className="sm:w-1/4">
              <time
                dateTime={post.date}
                className="font-mono text-xs text-neutral-500 dark:text-neutral-400"
              >
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </div>

            <div className="mt-2 sm:mt-0 sm:w-3/4">
              <h2 className="flex items-center gap-1.5 text-base font-semibold text-neutral-950 dark:text-white sm:text-lg">
                <Link href={`/blog/${post.slug}`}>
                  <span className="absolute inset-0" />
                  {post.title}
                </Link>
                <ArrowUpRight className="h-4 w-4 text-neutral-400 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 line-clamp-2">
                {post.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
