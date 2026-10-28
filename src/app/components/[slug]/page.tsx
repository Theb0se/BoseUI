import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Layers,
  CheckCircle2,
  ShieldCheck,
  FileCode2,
  Bug,
} from "lucide-react";
import { isBlock } from "@/lib/blocks";
import {
  PULSE_COMPONENTS,
  getCatalogComponentBySlug,
} from "@/registry/generated-catalog";
import { ComponentPreviewStage } from "@/components/docs/ComponentPreviewStage";
import { InstallTabs } from "@/components/docs/InstallTabs";
import { PropsTable } from "@/components/docs/PropsTable";
import { QuickCliCopyButton } from "@/components/docs/QuickCliCopyButton";
import { SITE_CONFIG } from "@/lib/utils";

export const dynamicParams = true;

export function generateStaticParams() {
  return PULSE_COMPONENTS.flatMap((comp) => [
    { slug: comp.slug },
    { slug: comp.componentName },
  ]);
}

export async function generateMetadata(context: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const { slug } = await Promise.resolve(context.params);
  const component = getCatalogComponentBySlug(slug);

  if (!component) {
    return {
      title: "Component Not Found",
    };
  }

  const canonicalUrl = `${SITE_CONFIG.url}/components/${component.slug}`;
  const fullTitle = `${component.title} — React Tailwind Framer Motion Component | ${SITE_CONFIG.name}`;
  const combinedKeywords = Array.from(
    new Set([
      ...component.badges,
      component.category,
      ...(component.keywords || []),
      "React",
      "Tailwind CSS",
      "Framer Motion",
      "shadcn",
      "BoseUI",
      "Rishabh Bose",
    ])
  );

  return {
    title: {
      absolute: fullTitle,
    },
    description: component.description,
    keywords: combinedKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description: component.description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      type: "article",
      authors: [SITE_CONFIG.author.name],
      images: [
        {
          url: SITE_CONFIG.ogImage,
          width: 1200,
          height: 630,
          alt: `${component.title} — ${SITE_CONFIG.name}`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: component.description,
      creator: "@Theb0se",
      images: [SITE_CONFIG.ogImage],
    },
  };
}

export default async function ComponentDetailPage(context: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const { slug } = await Promise.resolve(context.params);
  const comp = getCatalogComponentBySlug(slug);
  if (!comp) {
    notFound();
  }

  const currentIndex = PULSE_COMPONENTS.findIndex((c) => c.slug === comp.slug);
  const prevComp = currentIndex > 0 ? PULSE_COMPONENTS[currentIndex - 1] : null;
  const nextComp =
    currentIndex < PULSE_COMPONENTS.length - 1
      ? PULSE_COMPONENTS[currentIndex + 1]
      : null;

  const canonicalUrl = `${SITE_CONFIG.url}/components/${comp.slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: comp.title,
      description: comp.description,
      url: canonicalUrl,
      codeRepository: SITE_CONFIG.author.repo,
      programmingLanguage: ["TypeScript", "React", "JSX"],
      runtimePlatform: "Next.js / React",
      dateCreated: comp.createdAt,
      keywords: [
        ...comp.badges,
        comp.category,
        ...(comp.keywords || []),
      ].join(", "),
      author: {
        "@type": "Person",
        name: "Rishabh Bose",
        url: SITE_CONFIG.author.portfolio,
        sameAs: [SITE_CONFIG.author.github, SITE_CONFIG.author.linkedin],
      },
      license: "https://opensource.org/licenses/MIT",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: SITE_CONFIG.name,
          item: SITE_CONFIG.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Components",
          item: `${SITE_CONFIG.url}/components`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: comp.title,
          item: canonicalUrl,
        },
      ],
    },
  ];

  const hasFeatures = comp.features && comp.features.length > 0;
  const hasA11y = comp.accessibility && comp.accessibility.length > 0;

  // Related primitives from the same category or backfilled from catalog
  const relatedComponents = PULSE_COMPONENTS.filter(
    (c) => c.category === comp.category && c.slug !== comp.slug
  ).slice(0, 3);

  if (relatedComponents.length < 3) {
    const fallbackCandidates = PULSE_COMPONENTS.filter(
      (c) =>
        c.slug !== comp.slug &&
        !relatedComponents.some((r) => r.slug === c.slug)
    );
    relatedComponents.push(
      ...fallbackCandidates.slice(0, 3 - relatedComponents.length)
    );
  }

  return (
    <div className="mx-auto flex max-w-[1140px] gap-10 px-4 py-8 sm:px-8 lg:py-12">
      {/* Inject Schema.org JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Main Content Column */}
      <div className="min-w-0 flex-1">
        {/* Top Bar: Breadcrumb + Quick Prev/Next Buttons */}
        <div className="flex items-center justify-between gap-4">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-500"
          >
            <Link
              href="/components"
              className="transition-colors hover:text-neutral-950 dark:hover:text-white"
            >
              Components
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-600" />
            <Link
              href={`/components?category=${encodeURIComponent(comp.category)}`}
              className="text-neutral-500 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
            >
              {comp.category}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-600" />
            <span className="font-semibold text-neutral-950 dark:text-white">
              {comp.title}
            </span>
          </nav>

          {/* Compact Top Prev / Next Navigation */}
          <div className="flex items-center gap-1.5">
            {prevComp ? (
              <Link
                href={`/components/${prevComp.slug}`}
                title={`Previous: ${prevComp.title}`}
                aria-label={`Previous: ${prevComp.title}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-white dark:hover:text-white shadow-2xs"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-100 text-neutral-300 dark:border-neutral-900 dark:text-neutral-700">
                <ArrowLeft className="h-3.5 w-3.5" />
              </span>
            )}

            {nextComp ? (
              <Link
                href={`/components/${nextComp.slug}`}
                title={`Next: ${nextComp.title}`}
                aria-label={`Next: ${nextComp.title}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-white dark:hover:text-white shadow-2xs"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-100 text-neutral-300 dark:border-neutral-900 dark:text-neutral-700">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
        </div>

        {/* Title, Badges & Description */}
        <div className="mt-5 border-b border-neutral-200/80 pb-6 dark:border-neutral-800">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-4xl">
              {comp.title}
            </h1>
            <span className="rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 font-mono text-xs font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
              {comp.category}
            </span>
          </div>

          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-[15px]">
            {comp.description}
          </p>

          <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
            {comp.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Quick CLI 1-Click Install Bar */}
          <div className="mt-4 flex flex-wrap items-center gap-2.5 pt-1">
            <QuickCliCopyButton cliCommand={`npx bose-ui add ${comp.slug}`} />
            <a
              href={`/r/${comp.slug}.json`}
              target="_blank"
              rel="noopener noreferrer"
              title="View component registry JSON definition"
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200/90 bg-neutral-50/80 px-3 py-1.5 font-mono text-xs text-neutral-500 shadow-2xs backdrop-blur-sm transition-all hover:border-neutral-400 hover:bg-neutral-100/90 hover:text-neutral-950 dark:border-neutral-800/90 dark:bg-neutral-900/50 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:bg-neutral-900 dark:hover:text-white"
            >
              <span>/r/{comp.slug}.json</span>
              <ArrowUpRight className="h-3 w-3 opacity-60" />
            </a>
          </div>

          {isBlock(comp.slug) && (
            <div className="mt-4">
              <Link
                href={`/blocks/${comp.slug}`}
                className="inline-flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-1.5 font-mono text-xs font-medium text-amber-800 transition-colors hover:border-amber-500/40 hover:bg-amber-500/10 dark:text-amber-300"
              >
                <Layers className="h-3.5 w-3.5 text-amber-500" />
                <span>This item is a full-section Block · View in Dedicated Block Showcase</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
              </Link>
            </div>
          )}
        </div>

        {/* Section 1: Interactive Preview & Code Stage */}
        <section id="preview" className="mt-8 scroll-mt-24">
          <ComponentPreviewStage
            slug={comp.slug}
            sourceCode={comp.sourceCode}
            usageCode={comp.usageCode}
            filePath={comp.filePath}
          />
        </section>

        {/* Section 2: Installation */}
        <section id="installation" className="mt-12 scroll-mt-24 space-y-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-white">
              Installation
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              Install directly into your project using the shadcn CLI or copy the source code manually.
            </p>
          </div>
          <InstallTabs
            slug={comp.slug}
            sourceCode={comp.sourceCode}
            dependencies={comp.dependencies}
            usesCnUtility={true}
          />
        </section>

        {/* Section 3: Props Table */}
        <section id="props" className="mt-12 scroll-mt-24 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-white">
                Props
              </h2>
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                TypeScript props supported by <code className="font-mono text-neutral-800 dark:text-neutral-200">&lt;{comp.componentName} /&gt;</code>.
              </p>
            </div>
            <span className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[11px] text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
              {comp.props.length} {comp.props.length === 1 ? "prop" : "props"}
            </span>
          </div>
          <PropsTable props={comp.props} />
        </section>

        {/* Section 4: Features & Accessibility */}
        {(hasFeatures || hasA11y) && (
          <section
            id="details"
            className="mt-12 scroll-mt-24 grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {hasFeatures && (
              <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-2xs dark:border-neutral-800 dark:bg-neutral-950">
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-neutral-900 dark:text-white" />
                  <h3 className="text-sm font-semibold text-neutral-950 dark:text-white">
                    Key Features
                  </h3>
                </div>
                <ul className="space-y-2">
                  {comp.features.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {hasA11y && (
              <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-2xs dark:border-neutral-800 dark:bg-neutral-950">
                <div className="mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-neutral-900 dark:text-white" />
                  <h3 className="text-sm font-semibold text-neutral-950 dark:text-white">
                    Keyboard &amp; Accessibility
                  </h3>
                </div>
                <ul className="space-y-2">
                  {comp.accessibility.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Section 5: Related Primitives */}
        {relatedComponents.length > 0 && (
          <section id="related" className="mt-14 scroll-mt-24 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-white">
                  Related Primitives
                </h2>
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  More components in {comp.category} or commonly paired together.
                </p>
              </div>
              <Link
                href={`/components?category=${encodeURIComponent(comp.category)}`}
                className="group inline-flex items-center gap-1 text-xs font-medium text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
              >
                <span>View all {comp.category}</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedComponents.map((item) => (
                <Link
                  key={item.slug}
                  href={`/components/${item.slug}`}
                  className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-900/40 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700 dark:hover:shadow-neutral-950/50 shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[10px] font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                        {item.category}
                      </span>
                      <span className="flex h-5 w-5 items-center justify-center text-neutral-400 transition-colors group-hover:text-neutral-950 dark:group-hover:text-white">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <h3 className="mt-2.5 text-sm font-semibold text-neutral-950 transition-colors group-hover:text-neutral-950 dark:text-white dark:group-hover:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-1 border-t border-neutral-100 pt-2.5 dark:border-neutral-900">
                    {item.badges.slice(0, 3).map((badge) => (
                      <span
                        key={badge}
                        className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[9px] text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Prev / Next Component Pagination */}
        <div className="mt-14 grid grid-cols-1 gap-4 border-t border-neutral-200/80 pt-8 dark:border-neutral-800 sm:grid-cols-2">
          {prevComp ? (
            <Link
              href={`/components/${prevComp.slug}`}
              className="group flex items-center justify-between rounded-2xl border border-neutral-200/90 bg-white px-5 py-4 transition-colors hover:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-white shadow-2xs"
            >
              <ArrowLeft className="h-4 w-4 text-neutral-400 transition-transform group-hover:-translate-x-0.5 group-hover:text-neutral-950 dark:group-hover:text-white" />
              <div className="text-right">
                <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                  Previous
                </div>
                <div className="mt-0.5 text-sm font-semibold text-neutral-950 dark:text-white">
                  {prevComp.title}
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextComp ? (
            <Link
              href={`/components/${nextComp.slug}`}
              className="group flex items-center justify-between rounded-2xl border border-neutral-200/90 bg-white px-5 py-4 transition-colors hover:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-white shadow-2xs"
            >
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                  Next
                </div>
                <div className="mt-0.5 text-sm font-semibold text-neutral-950 dark:text-white">
                  {nextComp.title}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:text-neutral-950 dark:group-hover:text-white" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* Right Sticky On-This-Page TOC (Desktop XL) */}
      <aside className="hidden w-44 shrink-0 xl:block">
        <div className="sticky top-24 space-y-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            On this page
          </div>
          <ul className="space-y-2 border-l border-neutral-200 pl-3 text-xs dark:border-neutral-800">
            <li>
              <a
                href="#preview"
                className="text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
              >
                Preview &amp; Code
              </a>
            </li>
            <li>
              <a
                href="#installation"
                className="text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
              >
                Installation
              </a>
            </li>
            <li>
              <a
                href="#props"
                className="text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
              >
                Props ({comp.props.length})
              </a>
            </li>
            {(hasFeatures || hasA11y) && (
              <li>
                <a
                  href="#details"
                  className="text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                >
                  Features &amp; A11y
                </a>
              </li>
            )}
            {relatedComponents.length > 0 && (
              <li>
                <a
                  href="#related"
                  className="text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                >
                  Related Primitives
                </a>
              </li>
            )}
          </ul>

          <div className="pt-2 border-t border-neutral-200/80 dark:border-neutral-800/80">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Community
            </div>
            <ul className="mt-2 space-y-2 border-l border-neutral-200 pl-3 text-xs dark:border-neutral-800">
              <li>
                <a
                  href={`${SITE_CONFIG.author.repo}/blob/main/${comp.filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-neutral-500 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                >
                  <FileCode2 className="h-3 w-3" />
                  <span>Edit on GitHub</span>
                </a>
              </li>
              <li>
                <a
                  href={`${SITE_CONFIG.author.repo}/issues/new?title=%5BBug%5D%3A+Issue+with+${encodeURIComponent(comp.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-neutral-500 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                >
                  <Bug className="h-3 w-3" />
                  <span>Report an issue</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}
