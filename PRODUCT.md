# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users: Frontend developers, design engineers, and full-stack creators building production React / Next.js web applications, SaaS dashboards, and marketing landing pages.
Situation & Job: They need tactile feedback, fluid spring mechanics, and micro-interactions that elevate standard UI into unforgettable software, without bloating their bundle with an all-or-nothing monolithic npm dependency.

## Product Purpose

BoseUI is an open-source, animation-first component library and design system for modern React applications. It provides 127+ production-grade primitives and 26 pre-engineered application blocks engineered with kinetic physics, spring mechanics, and WebGL/canvas simulations to make interfaces feel alive and tactile. Success means developers can easily discover, preview, copy, or CLI-install modular, zero-runtime-lock-in components directly into their codebases.

## Positioning

Unlike traditional static component libraries or heavy monolithic animated packages, BoseUI pairs deep kinetic physics and tactile micro-interactions (magnetic cursor pull, 3D tilt, spring mechanics, WebGL caustics/fluid simulations) with native `shadcn/ui` registry compatibility. Developers own the raw source code (`npx shadcn add "https://boseui.site/r/<component>.json"`), ensuring zero vendor lock-in, full Tailwind customizability, and minimal bundle impact.

## Operating Context

- Consumed via standard modern web development workflows: CLI installation (`npx shadcn add ...`) or copy-pasting source into `@/components/ui`.
- Evaluated via the BoseUI documentation site (`boseui.site`), component catalog (`/components`), dynamic slug routes (`/components/[slug]`), and interactive block previews (`/blocks`).
- Internal component lifecycle managed through dedicated TypeScript scripts: `component:new` scaffolding, `registry:generate`, `registry:validate`, and automated SEO/llms.txt synchronization (`npm run sync`).

## Capabilities and Constraints

- **Capabilities**: 127+ interactive UI primitives across 9 functional categories (Buttons, Cards & Bentos, Navigation & Docks, Inputs & Forms, Fintech & Metrics, Typography & Text, Cosmic & Simulations, Water & Nature, DevTools & Blueprints); 26 composite application blocks; centralized preview harnesses via `src/components/docs/preview.tsx`; automated shadcn-compatible JSON registry builder.
- **Constraints**: React 18 / Next.js 14 App Router, TypeScript strict typing, Tailwind CSS styling, Framer Motion animation engine; zero external CSS runtime requirements.
- **Terminology**: Primitives (individual UI elements), Blocks (composed sections/pages), Kinetic (physics-based, spring-driven movement), Registry (shadcn-compatible JSON manifests).

## Brand Commitments

- **Name**: BoseUI (author: Rishabh Bose, `@Theb0se`).
- **Tagline**: Kinetic React Components Engineered to Make Interfaces Feel Alive.
- **Tone & Voice**: Technical precision, craftsmanship, fluid energy, and developer-first clarity.
- **Visual Assets**: Canonical logo/wordmark, OG images (`/OG.png`), animated showcase previews (`/showcase/*.gif`).

## Evidence on Hand

- 127+ fully implemented UI primitives in `src/components/ui/` with companion `.meta.ts` metadata files.
- 26 pre-engineered application blocks in `src/components/blocks/`.
- Generated shadcn JSON manifests for every primitive in `public/r/` and complete catalog index in `public/registry.json`.
- Canonical showcase site deployed at `https://boseui.site`.
- Machine-readable discovery assets: `public/llms.txt`, `public/sitemap.xml`.

## Product Principles

- **Physics over Flash**: Micro-interactions must feel physically grounded (springs, magnetic pull, inertia, natural damping) rather than arbitrary decorative animations.
- **Zero Runtime Lock-In**: Provide uncompiled, clean source code directly into developer repositories via shadcn registry conventions; never enforce a closed npm runtime dependency.
- **Tactile Responsiveness**: Prioritize immediate, fluid user feedback on interaction (hover, press, drag, scrub) to make web software feel alive and responsive.
- **Strict Architecture Integrity**: Every component primitive maintains decoupled metadata, typed props schemas, and unified preview harnesses.

## Accessibility & Inclusion

- Accessible motion defaults using Framer Motion's `useReducedMotion()` fallbacks across animated primitives.
- WCAG-compliant contrast ratios and keyboard navigation support for interactive elements.
- Semantic HTML markup with appropriate ARIA roles across form inputs, dialogs, and navigation docks.
