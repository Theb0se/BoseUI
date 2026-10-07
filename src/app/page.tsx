import React from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { InteractiveBentoShowcase } from "@/components/sections/InteractiveBentoShowcase";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FooterCTA } from "@/components/sections/FooterCTA";

export default function HomePage() {
  return (
    <div className="bg-white dark:bg-black">
      <HeroSection />
      <InteractiveBentoShowcase />
      <HowItWorks />
      <FooterCTA />
    </div>
  );
}
