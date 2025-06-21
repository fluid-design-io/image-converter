import { toggleTheme } from "@/helpers/theme_helpers";
import { useThemeStore } from "@/lib/themeStore";
import { IconMoon, IconSun } from "@tabler/icons-react";
import React from "react";

export default function ToggleTheme() {
  const { effectiveTheme } = useThemeStore();

  return (
    <button onClick={toggleTheme} className="p-1">
      <span className="sr-only">Toggle theme</span>
      {effectiveTheme === "dark" ? (
        <IconSun className="size-5" />
      ) : (
        <IconMoon className="size-5" />
      )}
    </button>
  );
}
