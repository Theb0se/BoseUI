import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar } from "@/components/layout/Sidebar";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/components",
}));

describe("Sidebar component", () => {
  beforeEach(() => {
    // Reset any mocks if necessary
  });

  it("renders overview navigation links", () => {
    render(<Sidebar />);

    expect(screen.getByText("Components")).toBeInTheDocument();
    expect(screen.getByText("Documentation & CLI")).toBeInTheDocument();
    expect(screen.getByText("Contributing")).toBeInTheDocument();
  });

  it("renders category accordion headers", () => {
    render(<Sidebar />);

    expect(screen.getByText("Buttons")).toBeInTheDocument();
    expect(screen.getByText("Cards & Bento")).toBeInTheDocument();
    expect(screen.getByText("Navigation & Docks")).toBeInTheDocument();
    expect(screen.getByText("Inputs & Forms")).toBeInTheDocument();
    expect(screen.getByText("Text & Typography")).toBeInTheDocument();
  });

  it("filters components when search query is typed", () => {
    render(<Sidebar />);

    const searchInput = screen.getByPlaceholderText("Filter 104 components...");
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "magnetic" } });

    // Should find matching component
    expect(screen.getByText("Magnetic Button")).toBeInTheDocument();

    // Matches count indicator should appear
    expect(screen.getByText(/Matches/)).toBeInTheDocument();
  });

  it("shows empty state when no components match query", () => {
    render(<Sidebar />);

    const searchInput = screen.getByPlaceholderText("Filter 104 components...");
    fireEvent.change(searchInput, { target: { value: "nonexistentxyz123" } });

    expect(screen.getByText("No components found")).toBeInTheDocument();
    expect(screen.getByText(/No matches for/)).toBeInTheDocument();
  });

  it("toggles category accordion on header click", () => {
    render(<Sidebar />);

    // Initially Buttons category is open and shows Magnetic Button
    expect(screen.getByText("Magnetic Button")).toBeInTheDocument();

    const buttonsHeader = screen.getByRole("button", { name: /Buttons/i });
    fireEvent.click(buttonsHeader);

    // After collapse, Magnetic Button is no longer visible
    expect(screen.queryByText("Magnetic Button")).not.toBeInTheDocument();

    // Re-expanding brings it back
    fireEvent.click(buttonsHeader);
    expect(screen.getByText("Magnetic Button")).toBeInTheDocument();
  });
});
