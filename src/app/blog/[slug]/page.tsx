import React from "react";
import { notFound } from "next/navigation";
import { getBlogPost, BLOG_POSTS } from "@/lib/blog";
import { SITE_CONFIG } from "@/lib/utils";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getBlogPost(params.slug);
  
  if (!post) {
    return {};
  }

  return {
    title: post.title,
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
    "headline": post.title,
    "description": post.description,
    "author": {
      "@type": "Person",
      "name": post.author,
      "url": SITE_CONFIG.author.portfolio,
    },
    "datePublished": post.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.url}/blog/${post.slug}`
    }
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-8 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Minimal Back Navigation */}
      <div className="mb-14">
        <a 
          href="/blog" 
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to overview
        </a>
      </div>

      <header className="mb-14 flex flex-col items-start">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-5xl leading-[1.15]">
          {post.title}
        </h1>
        
        {/* Minimal Author Meta */}
        <div className="mt-8 flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800" />
            <span className="font-medium text-neutral-900 dark:text-white">{post.author}</span>
          </div>
          <span>&middot;</span>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric"
            })}
          </time>
          <span>&middot;</span>
          <span>5 min read</span>
        </div>
      </header>

      {/* Main Content - Strictly constrained prose for optimal reading */}
      <div 
        className="prose prose-neutral prose-lg dark:prose-invert max-w-none 
          prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-neutral-900 dark:prose-headings:text-white
          prose-p:text-neutral-700 dark:prose-p:text-neutral-300 prose-p:leading-relaxed 
          prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-xl prose-img:border prose-img:border-neutral-200 dark:prose-img:border-neutral-800
          prose-pre:bg-neutral-50 prose-pre:border prose-pre:border-neutral-200 dark:prose-pre:bg-neutral-900 dark:prose-pre:border-neutral-800
          prose-code:text-neutral-900 dark:prose-code:text-white prose-code:before:content-none prose-code:after:content-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      {/* Minimal Footer */}
      <footer className="mt-16 flex items-center justify-between border-t border-neutral-200 pt-8 dark:border-neutral-800">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Written by <span className="font-medium text-neutral-900 dark:text-white">{post.author}</span>
        </p>
        <a 
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${SITE_CONFIG.url}/blog/${post.slug}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          Share on X
        </a>
      </footer>
    </article>
  );
}
