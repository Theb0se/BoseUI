import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getBlogPost, BLOG_POSTS } from "@/lib/blog";
import { SITE_CONFIG } from "@/lib/utils";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getBlogPost(params.slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} · ${SITE_CONFIG.name}`,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `${SITE_CONFIG.url}/blog/${post.slug}`,
    },
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${SITE_CONFIG.url}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Person",
      name: post.author,
      url: SITE_CONFIG.author.portfolio,
    },
    datePublished: post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.url}/blog/${post.slug}`,
    },
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back Navigation */}
      <div className="mb-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to writing</span>
        </Link>
      </div>

      <header className="mb-12 border-b border-neutral-200/80 pb-8 dark:border-neutral-800">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-4xl lg:text-5xl leading-[1.12]">
          {post.title}
        </h1>

        {/* Author Meta */}
        <div className="mt-6 flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="font-medium text-neutral-900 dark:text-white">
              {post.author}
            </span>
          </div>
          <span>&middot;</span>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </header>

      {/* Post Content */}
      <div className="prose prose-neutral dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300">
        <div
          dangerouslySetInnerHTML={{ __html: post.content }}
          className="space-y-6 leading-relaxed"
        />
      </div>
    </article>
  );
}
