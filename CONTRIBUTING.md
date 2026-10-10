# 🤝 Contributing to BoseUI

Thank you for your interest in contributing to **BoseUI**! Whether you are designing new kinetic components, reporting bugs, enhancing documentation, or polishing physics curves, your help is deeply appreciated.

BoseUI is built with high standards for visual craftsmanship, animation physics, TypeScript rigor, and developer experience. This guide will walk you through setting up your environment, authoring components, and submitting your contributions.

---

## 🧭 Table of Contents

1. [Code of Conduct](#-code-of-conduct)
2. [Development Setup](#-development-setup)
3. [Component Architecture Standards](#-component-architecture-standards)
4. [Step-by-Step: Adding a New Component](#-step-by-step-adding-a-new-component)
5. [Preview & Documentation Architecture](#-preview--documentation-architecture)
6. [Design & Animation Guidelines](#-design--animation-guidelines)
7. [Git & Pull Request Workflow](#-git--pull-request-workflow)
8. [Quality Checklist](#-quality-checklist)

---

## 📜 Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free experience for everyone. Be respectful, constructive, and kind in all issues, pull requests, and discussions.

---

## 💻 Development Setup

### Prerequisites

- **Node.js**: `v18.17.0` or higher (Node.js 20 LTS recommended)
- **Package Manager**: `npm` (supported: `pnpm`, `bun`)
- **Git**: Installed and configured

### Fork & Clone

```bash
# 1. Fork the repository on GitHub: https://github.com/Theb0se/bose-ui

# 2. Clone your personal fork
git clone https://github.com/<your-username>/bose-ui.git
cd bose-ui

# 3. Add the upstream remote
git remote add upstream https://github.com/Theb0se/bose-ui.git

# 4. Install project dependencies
npm install

# 5. Start the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the documentation platform and interactive showcase.

---

## 📐 Component Architecture Standards

Every component in BoseUI follows four non-negotiable architectural rules:

### 1. Pure Primitives in `src/components/ui/`
- Every UI component file (`<ComponentName>.tsx`) must be a **pure, composable React primitive**.
- **Do NOT embed test HUDs, sliders, or internal debugging state** inside the UI primitive.
- All preview-specific test controls belong in `src/components/docs/preview.tsx`.

### 2. Matching Metadata in `<ComponentName>.meta.ts`
- Every UI component must have an accompanying `<ComponentName>.meta.ts` file.
- The metadata file defines the title, category, description, feature bullet points, accessibility notes, usage code snippet, and **100% of the props accepted by the TypeScript interface**.

### 3. Native shadcn Registry Support
- When running `npm run sync`, each primitive is analyzed for dependencies and compiled into `public/r/<slug>.json`.
- Keep dependencies minimal: rely on `react`, `framer-motion`, `lucide-react`, `clsx`, and `tailwind-merge`. Avoid large third-party runtime bundles whenever possible.

### 4. Accessibility & Reduced Motion
- Always wrap animations or use Framer Motion's `useReducedMotion()` hook to respect user operating system motion preferences:
```tsx
import { useReducedMotion } from "framer-motion";

const shouldReduceMotion = useReducedMotion();
```
- Interactive controls must include semantic HTML, keyboard navigation (`Enter` / `Space`), and appropriate ARIA attributes.

---

## 🚀 Step-by-Step: Adding a New Component

We provide a built-in scaffolding CLI that sets up files according to our convention:

### Step 1: Scaffold Files

Run the scaffolding script with your component's name in `PascalCase`:

```bash
npm run component:new KineticCard
```

This automatically creates:
- `src/components/ui/KineticCard.tsx`
- `src/components/ui/KineticCard.meta.ts`

### Step 2: Implement the Component (`KineticCard.tsx`)

Follow this structural template:

```tsx
"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface KineticCardProps {
  /** Optional title heading */
  title?: string;
  /** Primary description copy */
  description?: string;
  /** Spring physics stiffness (default: 300) */
  stiffness?: number;
  /** Spring physics damping (default: 25) */
  damping?: number;
  /** Optional container style overrides */
  className?: string;
  /** Child elements */
  children?: React.ReactNode;
}

export function KineticCard({
  title,
  description,
  stiffness = 300,
  damping = 25,
  className,
  children,
}: KineticCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness, damping }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm",
        "dark:border-neutral-800/80 dark:bg-neutral-950 dark:text-white",
        className
      )}
    >
      {title && <h3 className="text-base font-semibold">{title}</h3>}
      {description && (
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      )}
      {children}
    </motion.div>
  );
}

export default KineticCard;
```

### Step 3: Complete the Metadata (`KineticCard.meta.ts`)

Document every prop accepted by the component's interface:

```typescript
import type { PulseComponentMeta } from "../../types/component";

export const kineticCardMeta: PulseComponentMeta = {
  title: "Kinetic Card",
  description: "Physics-driven surface with responsive spring elevation and dynamic lighting.",
  tagline: "Tactile surface with micro-elevation mechanics",
  category: "Cards",
  badges: ["Kinetic", "Spring Physics", "Micro-interaction"],
  createdAt: "2026-10-10",
  keywords: ["card", "kinetic", "spring", "motion", "elevation"],
  features: [
    "Sub-pixel spring elevation on hover with inertia dampening",
    "Zero runtime lock-in with native shadcn CLI distribution",
    "Respects prefers-reduced-motion accessibility standards",
  ],
  accessibility: [
    "Graceful degradation when prefers-reduced-motion is enabled",
    "High contrast text tokens compliant with WCAG AA ratios",
  ],
  props: [
    {
      name: "title",
      type: "string",
      defaultValue: "undefined",
      description: "Optional title heading",
      required: false,
    },
    {
      name: "description",
      type: "string",
      defaultValue: "undefined",
      description: "Primary description copy",
      required: false,
    },
    {
      name: "stiffness",
      type: "number",
      defaultValue: "300",
      description: "Spring physics stiffness tension",
      required: false,
    },
    {
      name: "damping",
      type: "number",
      defaultValue: "25",
      description: "Spring physics damping coefficient",
      required: false,
    },
  ],
  usageCode: `import { KineticCard } from "@/components/ui/KineticCard";

export function Example() {
  return (
    <KineticCard
      title="Realtime Stream"
      description="Sub-millisecond event ingestion across global edge regions."
    />
  );
}`,
};

export default kineticCardMeta;
```

---

## 🎛️ Preview & Documentation Architecture

BoseUI uses a centralized preview system in [`src/components/docs/preview.tsx`](src/components/docs/preview.tsx). This allows you to provide an interactive test stage with parameter toggles or simulated state **without polluting the reusable component primitive**.

Add a case for your component slug:

```tsx
// Inside src/components/docs/preview.tsx
import { KineticCard } from "@/components/ui/KineticCard";

// Inside ComponentPreview({ slug, className }: ComponentPreviewProps):
case "kinetic-card":
  return (
    <div className="w-full max-w-md p-4">
      <KineticCard
        title="Predictive Scaling"
        description="Autonomous workload balancing based on real-time traffic surges."
        className={className}
      />
    </div>
  );
```

---

## 🎨 Design & Animation Guidelines

When building or updating components, keep these design values in mind:

| Principle | Implementation Guidance |
| :--- | :--- |
| **Physics over Easing** | Favor Framer Motion spring physics (`type: "spring", stiffness: 350, damping: 28`) over flat `ease-in-out` transitions. |
| **Tactile Restraint** | Animations should feel snappy and purposeful (150ms–350ms feel). Avoid exaggerated wobbles that delay user intent. |
| **Sub-pixel Hairlines** | Use `border-neutral-200/80` in light mode and `border-neutral-800/80` or `border-white/10` in dark mode. |
| **Contrast Compliance** | Body text must maintain at least 4.5:1 contrast; large headlines at least 3:1. |
| **Mobile & Touch** | Ensure interactive targets are at least 44×44px on mobile viewports. |

---

## 🔄 Syncing & Validation

Before committing, run the full validation suite:

```bash
# 1. Typecheck the entire project
npm run typecheck

# 2. Sync and validate all registry manifests, sitemaps, and props
npm run sync

# 3. Verify static build succeeds
npm run build
```

The `npm run sync` command will:
- Parse all `.tsx` primitives and extract imports.
- Validate that all `.meta.ts` props match their TypeScript definitions.
- Generate public JSON files in `public/r/`.
- Update `public/sitemap.xml`, `public/robots.txt`, and `public/llms.txt`.
- Output a comprehensive SEO and metadata health report.

---

## 🔀 Git & Pull Request Workflow

### Branching Convention

Create a focused feature branch from `main`:

```bash
git checkout -b feat/kinetic-card
# or
git checkout -b fix/sparkline-cursor-offset
# or
git checkout -b docs/add-cli-guide
```

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat(ui): add KineticCard primitive and metadata`
- `fix(cards): correct tilt angle calculation in TiltCreditCard3D`
- `docs(readme): add installation guide for pnpm and bun`
- `perf(webgl): optimize fragment shader loops in BlackHole`
- `refactor(docs): streamline preview switchboard`

### Submitting Your Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feat/kinetic-card
   ```
2. Open a Pull Request against the `main` branch of `Theb0se/bose-ui`.
3. Fill out the PR template:
   - What does this PR do?
   - Live preview link or screen recording of the animation.
   - Confirmation that `npm run typecheck` and `npm run build` pass.

---

## ✅ Quality Checklist

Before submitting your PR, ensure:

- [ ] Component is located in `src/components/ui/<Name>.tsx` as a pure, clean primitive.
- [ ] Metadata exists in `src/components/ui/<Name>.meta.ts` with all props documented.
- [ ] Preview case is added to `src/components/docs/preview.tsx`.
- [ ] Component respects `useReducedMotion()`.
- [ ] Light mode and dark mode color tokens are balanced.
- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm run sync` passes with 100% SEO / registry health.
- [ ] `npm run build` generates all static routes successfully.

---

## 💬 Questions & Community

Need help with animation physics, shaders, or component design?
- Open an [Issue on GitHub](https://github.com/Theb0se/bose-ui/issues).
- Connect with creator **Rishabh Bose** on [LinkedIn](https://www.linkedin.com/in/rishabhbose3107/) or [Twitter / X](https://x.com/theb0se).

Thank you for helping make the web feel alive with **BoseUI**! ⚡
