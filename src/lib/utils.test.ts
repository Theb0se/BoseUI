import { describe, it, expect } from "vitest";
import { cn, SITE_CONFIG } from "./utils";

describe("Utils - cn", () => {
  it("merges class names correctly", () => {
    expect(cn("px-2 py-1", "bg-red-500")).toBe("px-2 py-1 bg-red-500");
  });

  it("handles conditional classes", () => {
    expect(cn("base-class", true && "active", false && "inactive")).toBe("base-class active");
  });

  it("handles tailwind class conflicts correctly", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });
});

describe("Site Config", () => {
  it("has valid metadata fields", () => {
    expect(SITE_CONFIG.name).toBe("BoseUI");
    expect(SITE_CONFIG.url).toBe("https://boseui.site");
    expect(SITE_CONFIG.author.name).toBe("Rishabh Bose");
  });
});
