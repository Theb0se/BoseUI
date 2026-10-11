<div align="center">

# ⚡ BoseUI

### Kinetic React Components Engineered to Make Interfaces Feel Alive

[![Next.js](https://img.shields.io/badge/Next.js-14.2_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7_Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.15-black?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![shadcn/ui compatible](https://img.shields.io/badge/shadcn%2Fui-Registry_Compatible-black?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

<br />

**[Explore Documentation & Live Demos →](https://boseui.site)** · **[Component Catalog →](https://boseui.site/components)** · **[Report Bug](https://github.com/Theb0se/bose-ui/issues)** · **[Request Component](https://github.com/Theb0se/bose-ui/issues)**

<br />

### 🌊 See it in action

| [Magnetic Button](https://boseui.site/components/magnetic-button) | [Spotlight Card](https://boseui.site/components/spotlight-card) | [Ocean Waves](https://boseui.site/components/ocean-waves) |
|:---:|:---:|:---:|
| <a href="https://boseui.site/components/magnetic-button"><img src="/showcase/button.gif" width="280" alt="Magnetic Button Demo" /></a> | <a href="https://boseui.site/components/spotlight-card"><img src="/showcase/card.gif" width="280" alt="Spotlight Card Demo" /></a> | <a href="https://boseui.site/components/ocean-waves"><img src="/showcase/waves.gif" width="280" alt="Ocean Waves WebGL Demo" /></a> |
| *Smooth hover physics that pull toward the cursor* | *Interactive 3D tilt with cursor-following spotlight* | *60fps WebGL fluid simulation* |


</div>

---

## 💡 What is BoseUI?

**BoseUI** is an open-source, animation-first component library and design system for modern React applications. Built for developers and product designers who demand tactile feedback, fluid spring mechanics, and micro-interactions that elevate standard UI into unforgettable software.

- 🚀 **127+ Production-Grade Primitives**: Buttons, cards, docks, menus, text effects, inputs, and WebGL / Canvas physics simulations.
- 🧩 **26 Pre-Engineered Application Blocks**: Curated heroes, pricing calculators, feature bentos, command docks, and authentication shells.
- ⚡ **Zero Runtime Lock-In**: Copy-paste individual components or install via the native `shadcn` CLI directly into your project.
- 🎯 **Strictly Typed & Accessible**: 100% TypeScript coverage with `useReducedMotion()` fallbacks and WCAG-compliant contrast.
- 🎛️ **Centralized Preview Architecture**: Decoupled component primitives from preview harnesses via `src/components/docs/preview.tsx`.

---

## 📦 Installation via `shadcn` CLI

BoseUI is fully compatible with the official **shadcn registry protocol**. You do not need to install an npm package that bloats your bundle. Simply add the component directly to your repository:

```bash
# Add tactile interactive buttons
npx shadcn@latest add "https://boseui.site/r/magnetic-button.json"
npx shadcn@latest add "https://boseui.site/r/hold-to-confirm-button.json"
npx shadcn@latest add "https://boseui.site/r/kinetic-swipe-button.json"

# Add dynamic cards & surfaces
npx shadcn@latest add "https://boseui.site/r/tilt-credit-card3-d.json"
npx shadcn@latest add "https://boseui.site/r/glow-border-card.json"
npx shadcn@latest add "https://boseui.site/r/liquid-glass-card.json"

# Add navigation & overlays
npx shadcn@latest add "https://boseui.site/r/morphing-mega-menu.json"
npx shadcn@latest add "https://boseui.site/r/dock-magnification.json"
npx shadcn@latest add "https://boseui.site/r/command-menu.json"

# Add high-performance cosmic & fluid backgrounds
npx shadcn@latest add "https://boseui.site/r/black-hole.json"
npx shadcn@latest add "https://boseui.site/r/ocean-waves.json"
npx shadcn@latest add "https://boseui.site/r/matrix-rain.json"
```

The CLI automatically places the source code in your `@/components/ui` directory and installs required peer dependencies (`framer-motion`, `lucide-react`, `clsx`, `tailwind-merge`).

---

## 🎨 Component Library Showcase

BoseUI organizes components into distinct functional disciplines:

| Category | Highlights |
| :--- | :--- |
| **Buttons** | `MagneticButton`, `RippleBurstButton`, `HoldToConfirmButton`, `KineticSwipeButton`, `SplitButton` |
| **Cards & Bentos** | `TiltCreditCard3D`, `GlowBorderCard`, `PlusGridBorder`, `LiquidGlassCard`, `ExpandableBentoCard`, `SpotlightCard` |
| **Navigation & Docks** | `MorphingMegaMenu`, `DockMagnification`, `ElasticDock`, `ExpandingSearchPill`, `StickySubNav`, `SegmentedRangePicker` |
| **Inputs & Forms** | `LiveCardForm`, `ColorFinishPicker`, `SpringPinInput`, `ScrubbableNumberInput`, `ElasticTagInput`, `SlashCommandMenu` |
| **Fintech & Metrics** | `RollingNumberTicker`, `ScrubbableSparkline`, `PricingCalculator`, `KineticRollingCounter` |
| **Typography & Text** | `ShimmerText`, `SplitFlapText`, `CipherScrambleText`, `VariableProximityText` |
| **Cosmic & Simulations** | `BlackHole`, `PlanetHorizon`, `WormholeTunnel`, `SolarFlare`, `AsteroidField`, `ConstellationMap` |
| **Water & Nature** | `Waterfall`, `OceanWaves`, `UnderwaterCaustics`, `WaterRipples`, `LavaLamp`, `Fireflies`, `Thunderstorm` |
| **DevTools & Blueprints** | `TabbedCodeBlock`, `DiffViewer`, `DeploymentTimeline`, `KeycapChips`, `MultiplayerCursors` |

---

## 🏗️ Architecture & Project Structure

BoseUI is engineered around a **Single Source of Truth** registry pattern:

```text
bose-ui/
├── public/
│   ├── r/                      # Generated shadcn JSON manifests (127+ components)
│   ├── registry.json           # Comprehensive machine-readable registry index
│   ├── sitemap.xml             # Auto-generated canonical sitemap (100/100 SEO score)
│   └── llms.txt                # Curated context index for LLM agents & coding assistants
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout, Inter & JetBrains Mono typography, providers
│   │   ├── page.tsx            # BoseUI showcase home page
│   │   ├── docs/page.tsx       # Documentation guide & CLI manual
│   │   ├── components/         # Component directory and dynamic [slug] routes
│   │   └── blocks/             # Composed full-page application blocks
│   ├── components/
│   │   ├── ui/                 # 127 pure, production-grade UI primitives (.tsx + .meta.ts)
│   │   ├── blocks/             # 26 composite section & application blocks
│   │   ├── docs/               # ComponentPreviewStage, CodeViewer, PropsTable, preview.tsx
│   │   └── layout/             # Navbar, Footer, CommandPalette (⌘K)
│   ├── registry/
│   │   ├── generated-catalog.tsx # Auto-generated catalog consumed by documentation
│   │   └── generated-demos.tsx   # Auto-generated demo index
│   ├── types/
│   │   └── component.ts        # Type contracts (PulseComponentMeta, ComponentPropMeta)
│   └── lib/
│       └── utils.ts            # cn() utility, copy helpers, site configuration
└── scripts/
    ├── component-new.ts        # CLI scaffolding generator
    ├── generate-registry.ts    # Registry builder & dependency graph analyzer
    ├── generate-seo.ts         # Sitemap, robots.txt, and llms.txt generator
    └── validate-registry.ts    # JSON schema and component contract validator
```

---

## 🛠️ Local Development

### 1. Prerequisites

- **Node.js**: `v18.17.0` or higher (Node 20+ recommended)
- **Package Manager**: `npm`, `pnpm`, or `bun`

### 2. Setup

```bash
# Clone the repository
git clone https://github.com/Theb0se/bose-ui.git

# Navigate into the project
cd bose-ui

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:3000` to preview the component library locally.

---

## 🚀 Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js local development server with Turbopack / HMR |
| `npm run build` | Runs full registry sync, SEO generation, typecheck, and Next.js static build |
| `npm run typecheck` | Runs strict TypeScript verification (`tsc --noEmit`) |
| `npm run sync` | Runs registry generator, SEO generator, registry validator, and SEO audit |
| `npm run component:new <Name>` | Scaffolds a new UI primitive, meta configuration, and registers it |
| `npm run registry:generate` | Compiles raw `.tsx` primitives into public shadcn JSON manifests |
| `npm run registry:validate` | Validates props, metadata integrity, and dependency graphs |
| `npm run seo:generate` | Generates sitemap, robots.txt, and llms.txt |

---

## 🪄 Creating a New Component

To add a new component to BoseUI:

```bash
npm run component:new MagneticToggle
```

This creates:
1. `src/components/ui/MagneticToggle.tsx` (the pure UI primitive)
2. `src/components/ui/MagneticToggle.meta.ts` (metadata, features, badges, props schema)
3. Registers the preview case inside `src/components/docs/preview.tsx`
4. Automatically runs `npm run sync` to generate the shadcn JSON registry manifest in `public/r/magnetic-toggle.json`.

---

## 🤝 Contributing

We welcome community contributions! Please read our [**Contributing Guide (CONTRIBUTING.md)**](CONTRIBUTING.md) for details on code style, commit conventions, component standards, and the pull request review process.

---

## 📄 License

BoseUI is open-source software licensed under the [MIT License](LICENSE).

---

<div align="center">

Crafted with care by **[Rishabh Bose](https://theb0se.vercel.app/)**

[Website](https://boseui.site) · [GitHub](https://github.com/Theb0se) · [LinkedIn](https://www.linkedin.com/in/rishabhbose3107/) · [X (Twitter)](https://x.com/theb0se)

</div>
