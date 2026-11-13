import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import React from "react";

// Test key primitives across categories
import { MagneticButton } from "@/components/ui/MagneticButton";
import { RippleBurstButton } from "@/components/ui/RippleBurstButton";
import { HoldToConfirmButton } from "@/components/ui/HoldToConfirmButton";
import { SplitButton } from "@/components/ui/SplitButton";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { TiltCreditCard3D } from "@/components/ui/TiltCreditCard3D";
import { AnimatedTabs } from "@/components/ui/AnimatedTabs";
import { FileDropzone } from "@/components/ui/FileDropZone";
import { RollingNumberTicker } from "@/components/ui/RollingNumberTicker";
import { ScrubbableNumberInput } from "@/components/ui/ScrubbableNumberInput";
import { SpringBadgePill } from "@/components/ui/SpringBadgePill";
import { AgentStatusBadge } from "@/components/ui/AgentStatusBadge";

describe("Component Smoke Tests", () => {
  it("renders MagneticButton without throwing", () => {
    const { container } = render(<MagneticButton>Click me</MagneticButton>);
    expect(container).toBeTruthy();
  });

  it("renders RippleBurstButton without throwing", () => {
    const { container } = render(<RippleBurstButton label="Burst" />);
    expect(container).toBeTruthy();
  });

  it("renders HoldToConfirmButton without throwing", () => {
    const { container } = render(<HoldToConfirmButton label="Hold to Delete" />);
    expect(container).toBeTruthy();
  });

  it("renders SplitButton without throwing", () => {
    const { container } = render(
      <SplitButton
        label="Publish"
        options={[
          { label: "Draft", value: "draft" },
          { label: "Schedule", value: "schedule" },
        ]}
      />
    );
    expect(container).toBeTruthy();
  });

  it("renders SpotlightCard without throwing", () => {
    const { container } = render(
      <SpotlightCard>
        <p>Card Content</p>
      </SpotlightCard>
    );
    expect(container).toBeTruthy();
  });

  it("renders TiltCreditCard3D without throwing", () => {
    const { container } = render(
      <TiltCreditCard3D cardHolder="Alex Mercer" theme="titanium" />
    );
    expect(container).toBeTruthy();
  });

  it("renders AnimatedTabs without throwing", () => {
    const { container } = render(<AnimatedTabs />);
    expect(container).toBeTruthy();
  });

  it("renders FileDropzone without throwing", () => {
    const { container } = render(<FileDropzone />);
    expect(container).toBeTruthy();
  });

  it("renders RollingNumberTicker without throwing", () => {
    const { container } = render(<RollingNumberTicker value={1337} />);
    expect(container).toBeTruthy();
  });

  it("renders ScrubbableNumberInput without throwing", () => {
    const { container } = render(
      <ScrubbableNumberInput label="Velocity" value={100} />
    );
    expect(container).toBeTruthy();
  });

  it("renders SpringBadgePill without throwing", () => {
    const { container } = render(<SpringBadgePill label="New Feature" />);
    expect(container).toBeTruthy();
  });

  it("renders AgentStatusBadge without throwing", () => {
    const { container } = render(<AgentStatusBadge status="reading-docs" />);
    expect(container).toBeTruthy();
  });
});
