"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  Search,
  Sparkles,
  Layers,
  List,
  CheckCircle2,
  Code2,
  Shield,
  Zap,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Autocomplete, type AutocompleteOption } from "@/components/ui/Autocomplete";
import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import {
  AccordionStackCards,
  type StackCardItem,
} from "@/components/ui/AccordionStackCards";

export interface FaqQuestion {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  answer: string;
  metric?: string;
}

const FAQ_DATA: FaqQuestion[] = [
  {
    id: "faq-install",
    category: "Architecture",
    title: "How do I install Pulse UI components in existing projects?",
    subtitle: "CLI Scaffolding & Zero Lock-in",
    answer:
      "Run `npx pulse-ui@latest init` to configure your Tailwind tokens and animation presets, then run `npx pulse-ui add <component>` to copy clean, un-minified TypeScript files directly into your project. You own 100% of the source code.",
    metric: "0kb External CSS",
  },
  {
    id: "faq-spring",
    category: "Performance",
    title: "How do the Hooke's Law spring physics work?",
    subtitle: "Mathematical Precision & 120Hz Fluidity",
    answer:
      "Rather than fixed cubic-bezier time curves that feel robotic, Pulse UI uses mathematical spring solvers with customizable stiffness and damping constants. Animations preserve user velocity when interrupted mid-gesture.",
    metric: "< 1.2ms Solver Latency",
  },
  {
    id: "faq-tailwind",
    category: "Architecture",
    title: "Is Pulse UI compatible with Tailwind CSS v4?",
    subtitle: "Modern CSS Variables & Tokens",
    answer:
      "Yes. Every component uses semantic class tokens that reference standard CSS theme variables. Switching between light, dark, and high-contrast system modes requires zero manual overrides.",
    metric: "100% Tokenized",
  },
  {
    id: "faq-accessibility",
    category: "Accessibility",
    title: "What accessibility standards are met out of the box?",
    subtitle: "WCAG AAA & Full Keyboard Navigation",
    answer:
      "All disclosure elements, tabs, dropdowns, and dialogs implement full ARIA 1.2 semantics with appropriate `aria-expanded`, `aria-controls`, focus rings, and automatic fallback behavior under `prefers-reduced-motion`.",
    metric: "WCAG AAA Ready",
  },
  {
    id: "faq-commercial",
    category: "Licensing",
    title: "Can I use these blocks in client and enterprise projects?",
    subtitle: "Commercial MIT License",
    answer:
      "Yes. The entire component library is licensed under the MIT license. You are free to use, modify, and distribute these components in unlimited commercial, SaaS, and personal client applications.",
    metric: "MIT Permissive",
  },
];

export interface FaqAccordionBlockProps {
  /** Eyebrow badge over section */
  eyebrow?: string;
  /** Section headline */
  title?: string;
  /** Section descriptive copy */
  description?: string;
  className?: string;
}

export function FaqAccordionBlock({
  eyebrow = "FREQUENTLY ASKED QUESTIONS",
  title = "Searchable Knowledge Base & FAQ",
  description = "Instant fuzzy search, category filtering, and an interactive toggle between disclosure list and 3D stacked deck layouts.",
  className,
}: FaqAccordionBlockProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"accordion" | "deck">("accordion");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(FAQ_DATA.map((q) => q.category)));
    return ["All", ...cats];
  }, []);

  // Format options for Autocomplete component
  const autocompleteOptions: AutocompleteOption[] = useMemo(
    () =>
      FAQ_DATA.map((q) => ({
        value: q.id,
        label: q.title,
        description: `${q.category} · ${q.subtitle}`,
        category: q.category,
      })),
    []
  );

  // Filter questions based on selected category and search query
  const filteredQuestions = useMemo(() => {
    return FAQ_DATA.filter((q) => {
      const matchesCategory =
        selectedCategory === "All" || q.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        q.id === searchQuery ||
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Map to Accordion items schema
  const accordionItems: AccordionItem[] = useMemo(
    () =>
      filteredQuestions.map((q) => ({
        id: q.id,
        title: q.title,
        subtitle: `${q.category} · ${q.subtitle}`,
        content: (
          <div className="space-y-3 pt-1">
            <p className="text-sm leading-relaxed text-neutral-300">
              {q.answer}
            </p>
            {q.metric && (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-2.5 py-0.5 text-[11px] font-mono text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                <span>{q.metric}</span>
              </div>
            )}
          </div>
        ),
      })),
    [filteredQuestions]
  );

  // Map to AccordionStackCards schema
  const stackCardItems: StackCardItem[] = useMemo(
    () =>
      filteredQuestions.map((q, idx) => ({
        id: q.id,
        badge: `0${idx + 1} // ${q.category.toUpperCase()}`,
        title: q.title,
        metric: q.metric ?? "VERIFIED",
        subtitle: q.answer,
      })),
    [filteredQuestions]
  );

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[540px] overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-950 p-6 sm:p-10 lg:p-12 text-neutral-100 shadow-2xl dark:border-neutral-800",
        className
      )}
    >
      {/* Background Radial Atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-36 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-600/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "26px 26px",
          }}
        />
      </div>

      {/* Section Header */}
      <div className="relative z-10 mx-auto max-w-3xl text-center mb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/90 px-3 py-1 text-xs font-mono text-neutral-300 backdrop-blur-md mb-4">
          <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
          <span>{eyebrow}</span>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h2>

        <p className="mt-3.5 text-sm text-neutral-400 sm:text-base leading-relaxed">
          {description}
        </p>

        {/* View Mode Toggle & Filter Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {/* Autocomplete Search Trigger */}
          <div className="w-full max-w-md">
            <Autocomplete
              options={autocompleteOptions}
              value={searchQuery}
              onChange={(val) => setSearchQuery(val)}
              placeholder="Filter by question, topic, or keyword..."
              emptyMessage="No questions matching your search"
              className="text-left"
            />
          </div>

          {/* Layout Toggle: Accordion vs Deck */}
          <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-900/80 p-1">
            <button
              type="button"
              onClick={() => setViewMode("accordion")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                viewMode === "accordion"
                  ? "bg-white text-neutral-950 font-semibold shadow-sm"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              <List className="h-3.5 w-3.5" />
              <span>List Accordion</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("deck")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                viewMode === "deck"
                  ? "bg-white text-neutral-950 font-semibold shadow-sm"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Stacked Deck</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                selectedCategory === cat
                  ? "bg-cyan-500 text-neutral-950 font-semibold shadow-sm"
                  : "border border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="flex items-center gap-1 rounded-full border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-xs text-neutral-300 hover:text-white"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Clear Filter</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Stage */}
      <div className="relative z-10 mx-auto max-w-4xl">
        {filteredQuestions.length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-12 text-center">
            <Search className="mx-auto h-8 w-8 text-neutral-600" />
            <p className="mt-3 text-sm text-neutral-400">
              No matching questions found for "{searchQuery}".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-neutral-200"
            >
              Reset Search & Categories
            </button>
          </div>
        ) : viewMode === "accordion" ? (
          /* Standard Accordion View */
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            <Accordion
              items={accordionItems}
              allowMultiple={true}
              defaultOpenIds={["faq-install"]}
              className="w-full divide-neutral-800"
            />
          </div>
        ) : (
          /* Stacked Deck View */
          <div className="flex flex-col items-center justify-center rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
            <div className="mb-4 text-xs font-mono text-neutral-400 flex items-center gap-2">
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              <span>INTERACTIVE_3D_DECK · HOVER OR CLICK TO EXPAND</span>
            </div>
            <AccordionStackCards
              items={stackCardItems.slice(0, 4)}
              className="w-full flex justify-center"
            />
          </div>
        )}
      </div>
    </div>
  );
}
