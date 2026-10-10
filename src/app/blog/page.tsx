import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog";
import { ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog | Frontend Development & UI Design",
  description: "Read the latest articles on frontend development, React, Kinetic UI, and building accessible web applications.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/blog`,
  },
  openGraph: {
    title: "Blog | BoseUI",
    description: "Read the latest articles on frontend development and Kinetic UI.",
    url: `${SITE_CONFIG.url}/blog`,
    type: "website",
  }
};

export default function BlogIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-8 lg:py-24">
      <header className="mb-16">
        <h1 className="text-3xl font-medium tracking-tight text-neutral-950 dark:text-white sm:text-4xl">
          Writing
        </h1>
        <p className="mt-4 text-base text-neutral-500 dark:text-neutral-400">
          Thoughts, research, and insights on frontend engineering, kinetic UI, and building software that feels alive.
        </p>
      </header>

      <div className="flex flex-col border-t border-neutral-200 dark:border-neutral-800">
        {BLOG_POSTS.map((post) => (
          <article 
            key={post.slug} 
            className="group relative flex flex-col items-baseline justify-between border-b border-neutral-200 py-8 transition-opacity hover:opacity-75 dark:border-neutral-800 sm:flex-row"
          >
            <div className="flex flex-col items-start gap-x-6 sm:w-1/4">
              <time dateTime={post.date} className="text-sm text-neutral-400 dark:text-neutral-500">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            
            <div className="mt-4 sm:mt-0 sm:w-3/4">
              <h2 className="text-lg font-medium text-neutral-900 dark:text-white">
                <Link href={`/blog/${post.slug}`}>
                  <span className="absolute inset-0" />
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 line-clamp-2">
                {post.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
