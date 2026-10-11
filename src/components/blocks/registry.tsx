"use client";

import React from "react";
import * as Blocks from "./index";

export const BLOCK_COMPONENTS: Record<string, React.ComponentType<any>> = {
  "ai-assistant-block": Blocks.AiAssistantBlock,
  "blueprint-footer": Blocks.BlueprintFooter,
  "calculator-pricing-block": Blocks.CalculatorPricingBlock,
  "checkout-section-block": Blocks.CheckoutSectionBlock,
  "cosmic-launch-hero": Blocks.CosmicLaunchHero,
  "dashboard-shell-block": Blocks.DashboardShellBlock,
  "dawn-hero": Blocks.DawnHero,
  "developer-hero-section": Blocks.DeveloperHeroSection,
  "docs-layout-block": Blocks.DocsLayoutBlock,
  "faq-accordion-block": Blocks.FaqAccordionBlock,
  "feature-bento-block": Blocks.FeatureBentoBlock,
  "feature-walkthrough-block": Blocks.FeatureWalkthroughBlock,
  "final-cta-block": Blocks.FinalCtaBlock,
  "horizon-footer": Blocks.HorizonFooter,
  "mega-navbar-block": Blocks.MegaNavbarBlock,
  "mission-control-block": Blocks.MissionControlBlock,
  "newsletter-footer": Blocks.NewsletterFooter,
  "not-found404-block": Blocks.NotFound404Block,
  "plan-picker-block": Blocks.PlanPickerBlock,
  "product-reveal-section": Blocks.ProductRevealSection,
  "sign-in-card-block": Blocks.SignInCardBlock,
  "social-dock-footer": Blocks.SocialDockFooter,
  "stats-strip-block": Blocks.StatsStripBlock,
  "testimonials-block": Blocks.TestimonialsBlock,
  "tier-compare-pricing-block": Blocks.TierComparePricingBlock,
  "usage-slider-pricing-block": Blocks.UsageSliderPricingBlock,
};

export function getBlockComponent(slug: string): React.ComponentType<any> | null {
  return BLOCK_COMPONENTS[slug] || null;
}
