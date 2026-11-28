import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Package,
} from "lucide-react";
import { HOOKS_REGISTRY, getHookBySlug } from "@/hooks-lib/registry";
import { HookDemoRenderer } from "@/hooks-lib/demos";
import { CodeViewer } from "@/components/docs/CodeViewer";
import { SITE_CONFIG } from "@/lib/utils";

export const dynamicParams = true;

export function generateStaticParams() {
  return HOOKS_REGISTRY.flatMap((hook) => [
    { slug: hook.slug },
    { slug: hook.name },
  ]);
}

export async function generateMetadata(context: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const { slug } = await Promise.resolve(context.params);
  const hook = getHookBySlug(slug);

  if (!hook) {
    return {
      title: "Hook Not Found",
    };
  }

  const canonicalUrl = `${SITE_CONFIG.url}/hooks/${hook.slug}`;
  const fullTitle = `${hook.name} — Zero-Dependency React Hook | ${SITE_CONFIG.name}`;

  return {
    title: {
      absolute: fullTitle,
    },
    description: hook.description,
    keywords: Array.from(
      new Set([...hook.tags, hook.category, "React Hook", "TypeScript", "BoseUI"])
    ),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description: hook.description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      type: "article",
      images: [
        {
          url: SITE_CONFIG.ogImage,
          width: 1200,
          height: 630,
          alt: `${hook.name} — ${SITE_CONFIG.name}`,
          type: "image/png",
        },
      ],
    },
  };
}

function readHookSource(filePath: string): string {
  try {
    const absPath = path.join(process.cwd(), filePath);
    return fs.readFileSync(absPath, "utf-8");
  } catch {
    return "// Source file could not be read.";
  }
}

export default async function HookDetailPage(context: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const { slug } = await Promise.resolve(context.params);
  const hook = getHookBySlug(slug);

  if (!hook) {
    notFound();
  }

  const sourceCode = readHookSource(hook.filePath);
  const currentIndex = HOOKS_REGISTRY.findIndex((h) => h.slug === hook.slug);
  const prevHook = currentIndex > 0 ? HOOKS_REGISTRY[currentIndex - 1] : null;
  const nextHook =
    currentIndex < HOOKS_REGISTRY.length - 1
      ? HOOKS_REGISTRY[currentIndex + 1]
      : null;

  return (
    <div className="mx-auto flex max-w-[1140px] gap-10 px-4 py-8 sm:px-8 lg:py-12">
      {/* Main Content Column */}
      <div className="min-w-0 flex-1">
        {/* Top Bar: Breadcrumb + Quick Prev/Next */}
        <div className="flex items-center justify-between gap-4">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-500"
          >
            <Link
              href="/hooks"
              className="transition-colors hover:text-neutral-950 dark:hover:text-white"
            >
              Hooks
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-600" />
            <span className="text-neutral-500 dark:text-neutral-400">
              {hook.category}
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-600" />
            <span className="font-mono font-semibold text-neutral-950 dark:text-white">
              {hook.name}
            </span>
          </nav>

          <div className="flex items-center gap-1.5">
            {prevHook ? (
              <Link
                href={`/hooks/${prevHook.slug}`}
                title={`Previous: ${prevHook.name}`}
                aria-label={`Previous: ${prevHook.name}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 shadow-2xs transition-colors hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-white dark:hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-100 text-neutral-300 dark:border-neutral-900 dark:text-neutral-700">
                <ArrowLeft className="h-3.5 w-3.5" />
              </span>
            )}

            {nextHook ? (
              <Link
                href={`/hooks/${nextHook.slug}`}
                title={`Next: ${nextHook.name}`}
                aria-label={`Next: ${nextHook.name}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 shadow-2xs transition-colors hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-white dark:hover:text-white"
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

        {/* a. Title, Badges & Description */}
        <div className="mt-5 border-b border-neutral-200/80 pb-6 dark:border-neutral-800">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-mono text-3xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-4xl">
              {hook.name}
            </h1>
            <span className="rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 font-mono text-xs font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
              {hook.category}
            </span>
          </div>

          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-[15px]">
            {hook.description}
          </p>

          <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
            {hook.ssrSafe && (
              <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
                <ShieldCheck className="h-3 w-3" />
                SSR Safe
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[10px] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
              <Package className="h-3 w-3" />
              {hook.dependencies.length === 0
                ? "0 deps"
                : `${hook.dependencies.length} deps`}
            </span>
            <span className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[10px] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
              {hook.sizeBytes} bytes
            </span>
            {hook.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* b. Live Demo */}
        <section id="demo" className="mt-8 scroll-mt-24 space-y-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-white">
              Live Demo
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              Interactive preview running <code className="font-mono">{hook.name}</code> directly in the browser.
            </p>
          </div>
          <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-2xs dark:border-neutral-800 dark:bg-[#0A0A0A] sm:p-10">
            <HookDemoRenderer slug={hook.slug} />
          </div>
        </section>

        {/* c. Install (Copy-paste source) */}
        <section id="install" className="mt-12 scroll-mt-24 space-y-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-white">
              Install
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              Copy and paste the hook into{" "}
              <code className="font-mono text-neutral-800 dark:text-neutral-200">
                hooks/{hook.slug}.ts
              </code>
              . No external packages required.
            </p>
          </div>
          <CodeViewer
            code={sourceCode}
            filename={`${hook.slug}.ts`}
            language="ts"
            maxHeight="460px"
          />
        </section>

        {/* d. Usage Example */}
        {hook.examples.length > 0 && (
          <section id="usage" className="mt-12 scroll-mt-24 space-y-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-white">
                Usage Example
              </h2>
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                {hook.examples[0].title}
              </p>
            </div>
            <CodeViewer
              code={hook.examples[0].code}
              filename="example.tsx"
              language="tsx"
              maxHeight="360px"
            />
          </section>
        )}

        {/* e. API Table (Params & Returns) */}
        <section id="api" className="mt-12 scroll-mt-24 space-y-6">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-white">
              API Reference
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              Parameters and return values for{" "}
              <code className="font-mono text-neutral-800 dark:text-neutral-200">
                {hook.name}
              </code>
              .
            </p>
          </div>

          {/* Parameters Table */}
          <div className="space-y-2">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Parameters
            </h3>
            <div className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-2xs dark:border-neutral-800 dark:bg-[#0A0A0A]">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200/80 bg-neutral-50/70 font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400">
                      <th className="px-5 py-3.5">Param</th>
                      <th className="px-5 py-3.5">Type</th>
                      <th className="px-5 py-3.5">Default</th>
                      <th className="px-5 py-3.5">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                    {hook.params.map((param) => (
                      <tr
                        key={param.name}
                        className="transition-colors hover:bg-neutral-50/60 dark:hover:bg-neutral-900/40"
                      >
                        <td className="whitespace-nowrap px-5 py-3.5 align-top font-mono text-xs font-semibold text-neutral-950 dark:text-white">
                          <span>{param.name}</span>
                          {param.required && (
                            <span className="ml-1.5 rounded bg-neutral-900 px-1.5 py-0.5 font-sans text-[10px] font-medium text-white dark:bg-white dark:text-black">
                              required
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 align-top">
                          <code className="inline-block rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[11px] text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
                            {param.type}
                          </code>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 align-top font-mono text-xs text-neutral-500 dark:text-neutral-400">
                          {param.default ? (
                            <code className="rounded border border-neutral-200 bg-neutral-100/80 px-2 py-0.5 text-[11px] text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
                              {param.default}
                            </code>
                          ) : (
                            <span className="text-neutral-400 dark:text-neutral-600">
                              —
                            </span>
                          )}
                        </td>
                        <td className="min-w-[220px] px-5 py-3.5 align-top text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                          {param.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Returns Table */}
          <div className="space-y-2">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Returns
            </h3>
            <div className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-2xs dark:border-neutral-800 dark:bg-[#0A0A0A]">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200/80 bg-neutral-50/70 font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400">
                      <th className="px-5 py-3.5">Value</th>
                      <th className="px-5 py-3.5">Type</th>
                      <th className="px-5 py-3.5">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                    {hook.returns.map((ret) => (
                      <tr
                        key={ret.name}
                        className="transition-colors hover:bg-neutral-50/60 dark:hover:bg-neutral-900/40"
                      >
                        <td className="whitespace-nowrap px-5 py-3.5 align-top font-mono text-xs font-semibold text-neutral-950 dark:text-white">
                          {ret.name}
                        </td>
                        <td className="px-5 py-3.5 align-top">
                          <code className="inline-block rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[11px] text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
                            {ret.type}
                          </code>
                        </td>
                        <td className="min-w-[240px] px-5 py-3.5 align-top text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                          {ret.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* f. Notes and Edge Cases */}
        {hook.notes.length > 0 && (
          <section id="notes" className="mt-12 scroll-mt-24">
            <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-2xs dark:border-neutral-800 dark:bg-neutral-950">
              <div className="mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-neutral-900 dark:text-white" />
                <h2 className="text-sm font-semibold text-neutral-950 dark:text-white">
                  Notes &amp; Edge Cases
                </h2>
              </div>
              <ul className="space-y-2">
                {hook.notes.map((note, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-600" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* g. Previous / Next Navigation */}
        <div className="mt-14 grid grid-cols-1 gap-4 border-t border-neutral-200/80 pt-8 dark:border-neutral-800 sm:grid-cols-2">
          {prevHook ? (
            <Link
              href={`/hooks/${prevHook.slug}`}
              className="group flex items-center justify-between rounded-2xl border border-neutral-200/90 bg-white px-5 py-4 shadow-2xs transition-colors hover:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-white"
            >
              <ArrowLeft className="h-4 w-4 text-neutral-400 transition-transform group-hover:-translate-x-0.5 group-hover:text-neutral-950 dark:group-hover:text-white" />
              <div className="text-right">
                <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                  Previous
                </div>
                <div className="mt-0.5 font-mono text-sm font-semibold text-neutral-950 dark:text-white">
                  {prevHook.name}
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextHook ? (
            <Link
              href={`/hooks/${nextHook.slug}`}
              className="group flex items-center justify-between rounded-2xl border border-neutral-200/90 bg-white px-5 py-4 shadow-2xs transition-colors hover:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-white"
            >
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                  Next
                </div>
                <div className="mt-0.5 font-mono text-sm font-semibold text-neutral-950 dark:text-white">
                  {nextHook.name}
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
                href="#demo"
                className="text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
              >
                Live Demo
              </a>
            </li>
            <li>
              <a
                href="#install"
                className="text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
              >
                Install
              </a>
            </li>
            {hook.examples.length > 0 && (
              <li>
                <a
                  href="#usage"
                  className="text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                >
                  Usage Example
                </a>
              </li>
            )}
            <li>
              <a
                href="#api"
                className="text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
              >
                API Reference
              </a>
            </li>
            {hook.notes.length > 0 && (
              <li>
                <a
                  href="#notes"
                  className="text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                >
                  Notes &amp; Edge Cases
                </a>
              </li>
            )}
          </ul>
        </div>
      </aside>
    </div>
  );
}
