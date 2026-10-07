import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import {
  PULSE_COMPONENTS,
  getCatalogComponentBySlug,
} from "@/registry/generated-catalog";
import { ComponentPreviewStage } from "@/components/docs/ComponentPreviewStage";
import { InstallTabs } from "@/components/docs/InstallTabs";
import { PropsTable } from "@/components/docs/PropsTable";
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
      "Pulse UI",
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
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: component.description,
      creator: "@Theb0se",
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-8 lg:py-12">
      {/* Inject Schema.org JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Minimal Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 font-mono text-xs text-neutral-500"
      >
        <Link
          href="/components"
          className="transition-colors hover:text-black dark:hover:text-white"
        >
          Components
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-600" />
        <span className="font-medium text-black dark:text-white">
          {comp.title}
        </span>
      </nav>

      {/* Clean Title & Description */}
      <div className="mt-4">
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
          {comp.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
          {comp.description}
        </p>
      </div>

      {/* Section 1: Interactive Preview & Code Stage */}
      <section id="preview" className="mt-8">
        <ComponentPreviewStage
          slug={comp.slug}
          sourceCode={comp.sourceCode}
          usageCode={comp.usageCode}
          filePath={comp.filePath}
        />
      </section>

      {/* Section 2: Installation */}
      <section id="installation" className="mt-12 space-y-3">
        <h2 className="text-lg font-semibold tracking-tight text-black dark:text-white">
          Installation
        </h2>
        <InstallTabs
          slug={comp.slug}
          sourceCode={comp.sourceCode}
          dependencies={comp.dependencies}
          usesCnUtility={true}
        />
      </section>

      {/* Section 3: Props Table */}
      <section id="props" className="mt-12 space-y-3">
        <h2 className="text-lg font-semibold tracking-tight text-black dark:text-white">
          Props
        </h2>
        <PropsTable props={comp.props} />
      </section>

      {/* Prev / Next Component Pagination */}
      <div className="mt-14 grid grid-cols-1 gap-4 border-t border-neutral-200 pt-8 dark:border-[#1F1F1F] sm:grid-cols-2">
        {prevComp ? (
          <Link
            href={`/components/${prevComp.slug}`}
            className="group flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-5 py-4 transition-colors hover:border-black dark:border-[#222222] dark:bg-[#0A0A0A] dark:hover:border-white"
          >
            <ArrowLeft className="h-4 w-4 text-neutral-400 transition-transform group-hover:-translate-x-0.5 group-hover:text-black dark:group-hover:text-white" />
            <div className="text-right">
              <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                Previous
              </div>
              <div className="mt-0.5 text-sm font-semibold text-black dark:text-white">
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
            className="group flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-5 py-4 transition-colors hover:border-black dark:border-[#222222] dark:bg-[#0A0A0A] dark:hover:border-white"
          >
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                Next
              </div>
              <div className="mt-0.5 text-sm font-semibold text-black dark:text-white">
                {nextComp.title}
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:text-black dark:group-hover:text-white" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
