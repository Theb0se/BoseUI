import { PULSE_COMPONENTS } from "@/registry/generated-catalog";
import type { PulseComponentCatalogEntry } from "@/types/component";

export type BlockCategory =
  | "All"
  | "Hero & Headers"
  | "Features & Bento"
  | "Dev Tools & Code"
  | "Pricing & Commerce"
  | "Interactive & 3D"
  | "Media & Social";

export const BLOCK_CATEGORIES: BlockCategory[] = [
  "All",
  "Hero & Headers",
  "Features & Bento",
  "Dev Tools & Code",
  "Pricing & Commerce",
  "Interactive & 3D",
  "Media & Social",
];

export const BLOCK_METADATA_MAP: Record<
  string,
  {
    category: BlockCategory;
    complexity: "High" | "Full Section" | "Multi-Step";
    tags: string[];
    description: string;
  }
> = {
  // --- 26 Composite Blocks ---
  "cosmic-launch-hero": {
    category: "Hero & Headers",
    complexity: "Full Section",
    tags: ["Cosmic", "Hero", "Starry Night", "Terminal", "Avatar Stack"],
    description:
      "Full landing hero composing a cosmic starfield canvas, shimmering headline, dual magnetic CTAs, copyable CLI install box, and avatar social proof.",
  },
  "dawn-hero": {
    category: "Hero & Headers",
    complexity: "Full Section",
    tags: ["Dawn", "Horizon Light", "Sticky SubNav", "Split Button", "Metrics"],
    description:
      "Volumetric sunrise horizon shader hero paired with a pinned sub-nav header, package manager SplitButton dropdown, and telemetry metric cards.",
  },
  "product-reveal-section": {
    category: "Hero & Headers",
    complexity: "Full Section",
    tags: ["Apple", "Hardware", "360 Spin", "Color Swatches", "Liquid Glass"],
    description:
      "Apple-inspired hardware inspection section hosting a 360° product sequence scrubber and titanium color finish swatches inside a liquid glass card.",
  },
  "developer-hero-section": {
    category: "Hero & Headers",
    complexity: "Full Section",
    tags: ["Stripe", "Gradient Mesh", "Terminal", "3D Globe Arcs", "DevTools"],
    description:
      "Stripe-inspired developer hero with an angled flowing gradient mesh, multi-language tabbed code block with terminal execution, and an interactive 3D globe.",
  },
  "ai-assistant-block": {
    category: "Hero & Headers",
    complexity: "Full Section",
    tags: ["AI", "Siri Glow", "Slash Commands", "Editor", "Generative"],
    description:
      "Siri-glow chromatic aura wrapping an intelligent copilot workspace with one-click suggestion pills and a Notion-style slash-command block editor.",
  },
  "mission-control-block": {
    category: "Interactive & 3D",
    complexity: "Full Section",
    tags: ["Radar", "Telemetry", "Rolling Ticker", "Security Quorum", "Tactical"],
    description:
      "Deep-tech mission control telemetry center combining a tactical Canvas 2D DigitalRadar sweep scope, cluster quorum cards, and 4 rolling number tickers.",
  },
  "calculator-pricing-block": {
    category: "Pricing & Commerce",
    complexity: "Full Section",
    tags: ["Pricing", "Calculator", "Liquid Tabs", "Volume Discounts", "Odometer"],
    description:
      "Interactive pricing calculator block with monthly vs. annual billing liquid tabs, granular usage sliders, rolling number ticker, and tier cards.",
  },
  "tier-compare-pricing-block": {
    category: "Pricing & Commerce",
    complexity: "Full Section",
    tags: ["Pricing", "Tiers", "Glow Cards", "Comparison Matrix", "Expandable"],
    description:
      "Three glow-border tier cards with highlight badges and an expandable disclosure tray revealing a detailed feature-by-feature comparison table.",
  },
  "usage-slider-pricing-block": {
    category: "Pricing & Commerce",
    complexity: "Full Section",
    tags: ["Pricing", "Kinetic Slider", "GPU Stepper", "Live Invoice", "Enterprise"],
    description:
      "Granular usage pricing configurator with kinetic API volume sliders, dedicated compute GPU steppers, and a real-time order invoice card.",
  },
  "plan-picker-block": {
    category: "Pricing & Commerce",
    complexity: "Full Section",
    tags: ["Bento Grid", "Hover Reveal", "Spotlight Mask", "Tier Specs", "Linear"],
    description:
      "Linear-style interactive plan picker where hovering each tier card projects a radial spotlight glow and reveals granular architecture specifications.",
  },
  "checkout-section-block": {
    category: "Pricing & Commerce",
    complexity: "Full Section",
    tags: ["Checkout", "Live Card Form", "3D Card", "Seat Stepper", "Fintech"],
    description:
      "Full SaaS checkout section with seat license steppers, an auto-flipping LiveCardForm with Luhn validation, and a holographic 3D metal card preview.",
  },
  "mega-navbar-block": {
    category: "Hero & Headers",
    complexity: "Full Section",
    tags: ["Navigation", "Morphing Menu", "Dynamic Island", "Search Pill"],
    description:
      "Complete header suite featuring a top DynamicIslandToast release banner, gliding Stripe-style MorphingMegaMenu, and an expandable search pill.",
  },
  "feature-bento-block": {
    category: "Features & Bento",
    complexity: "Full Section",
    tags: ["Bento Grid", "Expandable Bento", "Spotlight Card", "3D Gyroscope"],
    description:
      "Mixed-size responsive bento grid showcasing expandable highlight tiles, cursor-tracking spotlight masks, and gyroscope 3D tilt cards.",
  },
  "feature-walkthrough-block": {
    category: "Features & Bento",
    complexity: "Full Section",
    tags: ["Sticky Scroll", "Walkthrough", "Terminal Sync", "Steps"],
    description:
      "Step-by-step developer walkthrough section where navigating chapters dynamically updates the pinned tabbed code block with synchronized code.",
  },
  "testimonials-block": {
    category: "Media & Social",
    complexity: "Full Section",
    tags: ["Testimonials", "Reviews", "Stories", "Emoji Reactions", "Swipe"],
    description:
      "Customer reviews and social proof carousel with avatar badges, verified quotes, and an interactive Slack-style floating emoji reaction bar.",
  },
  "stats-strip-block": {
    category: "Features & Bento",
    complexity: "Full Section",
    tags: ["Metrics", "Odometer", "Sparkline", "SLA", "Ticker"],
    description:
      "High-impact metrics banner combining rolling number odometers ($4.8B+ gross volume), 99.99% uptime SLA, and an interactive scrubbable sparkline chart.",
  },
  "faq-accordion-block": {
    category: "Features & Bento",
    complexity: "Full Section",
    tags: ["FAQ", "Accordion", "Autocomplete", "Stacking Cards", "Search"],
    description:
      "Interactive FAQ section with instant autocomplete question filtering, accessible accordion disclosures, and a 3D stacking card deck toggle.",
  },
  "final-cta-block": {
    category: "Features & Bento",
    complexity: "Full Section",
    tags: ["CTA", "Black Hole", "Slide to Deploy", "Hold to Confirm", "Cosmic"],
    description:
      "Bottom high-conversion CTA block framed by a gravitational black hole canvas, featuring a kinetic slide-to-deploy button and hold-to-confirm action.",
  },
  "sign-in-card-block": {
    category: "Features & Bento",
    complexity: "Full Section",
    tags: ["Authentication", "Siri Glow", "Floating Label", "2FA PIN", "Security"],
    description:
      "Enterprise authentication card wrapped in a breathing Siri chromatic edge aura, featuring floating-label work email input and a 6-digit 2FA spring PIN code.",
  },
  "horizon-footer": {
    category: "Media & Social",
    complexity: "Full Section",
    tags: ["Footer", "Planet Horizon", "Cipher Scramble", "Navigation", "Wordmark"],
    description:
      "Orbital planetary horizon footer with glowing atmospheric limb, 4 structured link columns, newsletter signup, and a giant mechanical cipher wordmark.",
  },
  "blueprint-footer": {
    category: "Dev Tools & Code",
    complexity: "Full Section",
    tags: ["Vercel", "Blueprint", "Plus Crosses", "Keycap ⌘K", "System Status"],
    description:
      "Architectural blueprint footer framed with hairline grid borders, glowing '+' intersection crosses, Raycast KeycapChips ⌘K shortcut, and live uptime.",
  },
  "newsletter-footer": {
    category: "Media & Social",
    complexity: "Full Section",
    tags: ["Newsletter", "Fireflies", "Floating Label", "Morphing Button", "Toast"],
    description:
      "Ambient twilight forest footer with bioluminescent fireflies, floating-label email input, spring-morphing subscribe button, and confirmation toast.",
  },
  "social-dock-footer": {
    category: "Media & Social",
    complexity: "Full Section",
    tags: ["Apple", "macOS Dock", "Magnification", "Social Channels", "Footer"],
    description:
      "Apple-inspired social footer featuring a centered macOS DockMagnification bar with spring zoom physics for developer networks and operational SLAs.",
  },
  "dashboard-shell-block": {
    category: "Dev Tools & Code",
    complexity: "Full Section",
    tags: ["Dashboard", "File Tree", "Diff Viewer", "Pipeline", "Multiplayer"],
    description:
      "Developer application shell combining an explorer FileTree sidebar, dual-mode DiffViewer code review, automated DeploymentTimeline, and live cursors.",
  },
  "not-found-404-block": {
    category: "Interactive & 3D",
    complexity: "Full Section",
    tags: ["404 Error", "Asteroid Field", "Split Flap", "Search", "Recovery"],
    description:
      "Cosmic 404 error page block featuring a Canvas 2D asteroid belt with bolide meteors, mechanical 3D SplitFlapText cycling error codes, and quick search.",
  },
  "not-found404-block": {
    category: "Interactive & 3D",
    complexity: "Full Section",
    tags: ["404 Error", "Asteroid Field", "Split Flap", "Search", "Recovery"],
    description:
      "Cosmic 404 error page block featuring a Canvas 2D asteroid belt with bolide meteors, mechanical 3D SplitFlapText cycling error codes, and quick search.",
  },
  "docs-layout-block": {
    category: "Dev Tools & Code",
    complexity: "Full Section",
    tags: ["Docs", "File Tree", "Sticky SubNav", "Copy Code", "Command Menu"],
    description:
      "Complete documentation page template with a pinned StickySubNav table of contents, FileTree guide sidebar, CopyCodeBlock install tabs, and ⌘K search.",
  },

  // --- Previous Full Sections & Composite Patterns ---
  "gradient-mesh-hero": {
    category: "Hero & Headers",
    complexity: "Full Section",
    tags: ["Stripe", "Hero", "Diagonal Clip", "Liquid Gradient"],
    description: "Slanted flowing gradient mesh hero section with live preset switchers, typography, and CTAs.",
  },
  "sticky-sub-nav": {
    category: "Hero & Headers",
    complexity: "Full Section",
    tags: ["Apple", "Navigation", "Scroll Pinned", "Buy Bar"],
    description: "Product-level sub navigation that smoothly docks to the top of the viewport when scrolling past the hero.",
  },
  "morphing-mega-menu": {
    category: "Hero & Headers",
    complexity: "Full Section",
    tags: ["Stripe", "Navigation", "Spring Layout", "Multi-column"],
    description: "Single popover container that glides across nav items with spring physics and crossfading panels.",
  },
  "sticky-scroll-story": {
    category: "Features & Bento",
    complexity: "Full Section",
    tags: ["Apple", "Storytelling", "Pinned Scroll", "Media Sync"],
    description: "Editorial pinned scroll storytelling section where text chapters crossfade while media syncs in place.",
  },
  "hover-reveal-feature-grid": {
    category: "Features & Bento",
    complexity: "Full Section",
    tags: ["Linear", "Bento Grid", "Spotlight Mask", "Progressive Disclosure"],
    description: "Multi-tile bento feature grid featuring continuous mouse-tracking spotlight masks and progressive specification reveals.",
  },
  "plus-grid-border": {
    category: "Features & Bento",
    complexity: "Full Section",
    tags: ["Vercel", "Blueprint Grid", "Plus Crosses", "Hairline"],
    description: "Architectural blueprint grid with hairline border lines framing cards and glowing '+' intersection crosses.",
  },
  "accordion-stack-cards": {
    category: "Features & Bento",
    complexity: "Full Section",
    tags: ["Cards", "Stacking", "Expandable", "Spring"],
    description: "Physics-driven stacking card deck with synchronized layer expansion and detail disclosure.",
  },
  "product-compare-table": {
    category: "Pricing & Commerce",
    complexity: "Full Section",
    tags: ["Apple", "Stripe", "Comparison", "Sticky Header"],
    description: "Multi-tier product comparison table with sticky headers, highlight badges, and check/dash indicators.",
  },
  "pricing-calculator": {
    category: "Pricing & Commerce",
    complexity: "Full Section",
    tags: ["Stripe", "Pricing", "Slider", "Tier Breakdown"],
    description: "Interactive usage slider with live price calculation, tiered volume discounts, and annual savings toggle.",
  },
  "live-card-form": {
    category: "Pricing & Commerce",
    complexity: "Full Section",
    tags: ["Stripe", "Checkout", "3D Card", "Luhn Validation"],
    description: "Interactive payment checkout form paired with an authentic 3D credit card preview that flips on CVC focus.",
  },
  "deployment-timeline": {
    category: "Dev Tools & Code",
    complexity: "Full Section",
    tags: ["Vercel", "DevOps", "Streaming Log", "Pipeline"],
    description: "Deployment pipeline stepper with animated status spinners, elapsed timers, and live streaming build console.",
  },
  "diff-viewer": {
    category: "Dev Tools & Code",
    complexity: "Full Section",
    tags: ["GitHub", "GitLab", "Diff", "Split / Unified"],
    description: "Code diff reviewer supporting Split and Unified modes, syntax highlights, additions, and deletions.",
  },
  "tabbed-code-block": {
    category: "Dev Tools & Code",
    complexity: "Full Section",
    tags: ["Stripe", "Terminal", "Syntax", "Multi-Language"],
    description: "Multi-language code block with sliding tab underline, copy feedback, line highlights, and live execution console.",
  },
  "file-tree": {
    category: "Dev Tools & Code",
    complexity: "Full Section",
    tags: ["IDE", "File Explorer", "Keyboard Nav", "Hierarchy"],
    description: "Hierarchical file directory explorer with collapsible folders, filetype badges, and keyboard navigation.",
  },
  "product-sequence-scrubber": {
    category: "Interactive & 3D",
    complexity: "Full Section",
    tags: ["Apple", "360 Spin", "Exploded View", "Hardware"],
    description: "36-frame continuous vector hardware rotation and exploded assembly view scrubbed smoothly via scroll or slider.",
  },
  "isometric-city": {
    category: "Interactive & 3D",
    complexity: "Full Section",
    tags: ["Canvas 2D", "Isometric 3D", "Traffic Trails", "Cityscape"],
    description: "Procedural 3D-projected isometric night cityscape with glowing office windows, communication spires, and traffic light streaks.",
  },
  "digital-radar": {
    category: "Interactive & 3D",
    complexity: "Full Section",
    tags: ["Military CRT", "Phosphor Sweep", "Tactical", "Clutter Return"],
    description: "Tactical polar radar scope with circular range rings, rotating phosphor sweep beam, and target transponder callouts.",
  },
  "multiplayer-cursors": {
    category: "Interactive & 3D",
    complexity: "Full Section",
    tags: ["Figma", "Collaboration", "Live Cursors", "Chat Bubbles"],
    description: "Real-time collaborative canvas with animated multiplayer cursor pointers, user name tags, and live chat bubbles.",
  },
  "slash-command-menu": {
    category: "Interactive & 3D",
    complexity: "Full Section",
    tags: ["Notion", "Block Editor", "Command Menu", "Fuzzy Search"],
    description: "Notion-style rich-text block editor with '/' trigger command popover, fuzzy search, and keyboard navigation.",
  },
  "expanding-search-pill": {
    category: "Media & Social",
    complexity: "Full Section",
    tags: ["Airbnb", "Search Pill", "Spring Drawer", "Stays"],
    description: "Floating compact search pill that morphs with layout springs into an expanded multi-segment search drawer with popovers.",
  },
  "category-filter-scroller": {
    category: "Media & Social",
    complexity: "Full Section",
    tags: ["Airbnb", "Horizontal Scroller", "Filter Bar", "Active Pill"],
    description: "Horizontal category filter scroller with 13 categories, edge gradient fade masks, and sliding underline indicator.",
  },
  "now-playing-waveform": {
    category: "Media & Social",
    complexity: "Full Section",
    tags: ["Spotify", "Music Player", "Waveform", "Equalizer"],
    description: "Interactive audio player with 32 dancing frequency equalizer bars, vinyl sleeve, and scrubbable progress track.",
  },
  "swipe-cards": {
    category: "Media & Social",
    complexity: "Full Section",
    tags: ["Tinder", "Swipe Deck", "Gestures", "Like / Nope"],
    description: "Swipeable card deck with drag physics, rotational tilt proportional to delta X, and floating stamp overlays.",
  },
  "avatar-stack-presence": {
    category: "Media & Social",
    complexity: "Full Section",
    tags: ["Slack", "Figma", "Avatars", "Live Presence"],
    description: "Overlapping user avatar stack with live online/idle/offline status indicator dots, +N overflow, and member profile popover cards.",
  },
  "autoplay-story-carousel": {
    category: "Media & Social",
    complexity: "Full Section",
    tags: ["Apple News", "Instagram", "Story Carousel", "Progress Bars"],
    description: "Story carousel with sequential pill progress bars, directional tap navigation, hover to pause, and fluid slide transitions.",
  },
  "scrubbable-sparkline": {
    category: "Pricing & Commerce",
    complexity: "Full Section",
    tags: ["Robinhood", "Crypto / Stock", "Sparkline", "Live Ticker"],
    description: "Financial market line chart with interactive scrubbing cursor, live price ticker readout, and emerald/rose delta calculation.",
  },
};

export const BLOCK_SLUGS = new Set(Object.keys(BLOCK_METADATA_MAP));

export function isBlock(slug: string): boolean {
  return BLOCK_SLUGS.has(slug);
}

export function getBlockMetadata(slug: string) {
  return BLOCK_METADATA_MAP[slug] || null;
}

export interface PulseBlockDoc extends PulseComponentCatalogEntry {
  blockCategory: BlockCategory;
  complexity: "High" | "Full Section" | "Multi-Step";
  tags: string[];
}

export function getAllBlocks(): PulseBlockDoc[] {
  return PULSE_COMPONENTS.filter((comp) => isBlock(comp.slug)).map((comp) => {
    const meta = BLOCK_METADATA_MAP[comp.slug];
    return {
      ...comp,
      blockCategory: meta?.category || "Features & Bento",
      complexity: meta?.complexity || "Full Section",
      tags: meta?.tags || comp.badges,
    };
  });
}

export function getAllAtomicComponents(): PulseComponentCatalogEntry[] {
  return PULSE_COMPONENTS.filter((comp) => !isBlock(comp.slug));
}
