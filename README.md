# ⚡ BoseUI (`boseui.site`)

> **"Kinetic UI components that make modern web interfaces feel alive."**
> Crafted with precision by **[Rishabh Bose](https://theb0se.vercel.app/)**.

**BoseUI** is a modern, open-source animated React component library and documentation platform built with **Next.js (App Router)**, **Strict TypeScript**, **Tailwind CSS**, and **Framer Motion**. Every component is engineered with real spring physics, `useReducedMotion()` accessibility compliance, and native **shadcn CLI Registry** support.

---

## ✨ Quick Install (`shadcn` CLI Native)

Install any BoseUI component directly into your codebase with zero runtime lock-in:

```bash
npx shadcn@latest add https://boseui.site/r/magnetic-button.json
npx shadcn@latest add https://boseui.site/r/spotlight-card.json
npx shadcn@latest add https://boseui.site/r/cursor-follower.json
```

---

## 🏗️ Architecture ("Single Source of Truth")

Adding any new component to BoseUI only requires adding files to `src/registry/`. There are **zero hardcoded switch statements** in the documentation pages, command palette, or API routes:

```text
bose-ui/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout, fonts (Inter + JetBrains Mono), CommandPalette provider
│   │   ├── page.tsx                    # BoseUI Landing Page
│   │   ├── docs/page.tsx               # Getting Started, CLI Installation & Architecture Guide
│   │   ├── components/
│   │   │   ├── page.tsx                # Component Directory Grid with category filter & live search
│   │   │   └── [slug]/page.tsx         # Dynamic Component Detail Page (SSG via generateStaticParams)
│   │   ├── r/[slug]/route.ts           # Dynamic API Route serving shadcn JSON registry manifests
│   │   ├── sitemap.ts                  # Auto-generated dynamic XML sitemap from registry
│   │   └── robots.ts                   # Search crawler directives
│   ├── components/
│   │   ├── layout/                     # Navbar, Footer ("Crafted by Rishabh Bose"), CommandPalette (⌘K)
│   │   ├── docs/                       # ComponentPreviewStage, CodeViewer, PropsTable, InstallTabs
│   │   └── sections/                   # HeroSection, InteractiveBentoShowcase, HowItWorks, FooterCTA
│   ├── registry/
│   │   ├── ui/                         # Pure reusable UI components (distributed to users)
│   │   ├── demos/                      # Interactive demo wrappers shown in the preview stage
│   │   ├── schema.ts                   # TypeScript interfaces for PulseComponentMeta & PropDef
│   │   └── index.ts                    # Central registry manifest
│   └── lib/
│       ├── utils.ts                    # cn() & copyToClipboard helpers
│       └── registry-server.ts          # Server-only fs utilities to read raw .tsx source code & parse imports
└── scripts/
    └── component-new.ts                # CLI scaffolding script (`npm run component:new <ComponentName>`)
```

---

## 🛠️ Development & Component Scaffolding

```bash
# 1. Start the development server
npm run dev

# 2. Scaffold a brand-new component + interactive demo stage
npm run component:new TiltCard

# 3. Typecheck and build static production bundle
npm run typecheck
npm run build
```

---

## 👤 Author

**Rishabh Bose**
- **Website**: [boseui.site](https://boseui.site)
- **Portfolio**: [theb0se.vercel.app](https://theb0se.vercel.app/)
- **GitHub**: [@Theb0se](https://github.com/Theb0se)
- **LinkedIn**: [linkedin.com/in/rishabhbose3107](https://www.linkedin.com/in/rishabhbose3107/)
