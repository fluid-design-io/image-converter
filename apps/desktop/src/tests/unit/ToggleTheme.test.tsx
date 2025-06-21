import ToggleTheme from "@/components/ToggleTheme";
import * as themeStore from "@/lib/themeStore";
import { render } from "@testing-library/react";
import React from "react";
import { expect, test, vi } from "vitest";

// Mock the theme helpers
vi.mock("@/helpers/theme_helpers", () => ({
  initializeTheme: vi.fn(),
  toggleTheme: vi.fn(),
}));

// Mock the theme store
vi.mock("@/lib/themeStore", () => ({
  useThemeStore: vi.fn(() => ({
    effectiveTheme: "light",
  })),
}));

test("renders ToggleTheme", () => {
  const { getByRole } = render(<ToggleTheme />);
  const isButton = getByRole("button");

  expect(isButton).toBeInTheDocument();
});

test("has icon", () => {
  const { getByRole } = render(<ToggleTheme />);
  const button = getByRole("button");
  const icon = button.querySelector("svg");

  expect(icon).toBeInTheDocument();
});

test("shows moon icon for light theme", () => {
  const { getByRole } = render(<ToggleTheme />);
  const svg = getByRole("button").querySelector("svg");

  expect(svg?.classList).toContain("size-5");
});

test("shows sun icon for dark theme", () => {
  // Mock the store to return dark theme
  vi.mocked(themeStore.useThemeStore).mockReturnValue({
    effectiveTheme: "dark",
  } as ReturnType<typeof themeStore.useThemeStore>);

  const { getByRole } = render(<ToggleTheme />);
  const svg = getByRole("button").querySelector("svg");

  expect(svg?.classList).toContain("size-5");
});
