import { toggleTheme } from "@/helpers/theme_helpers";
import { IconMoon } from "@tabler/icons-react";
import React from "react";

export default function ToggleTheme() {
  return (
    <button onClick={toggleTheme} className="p-1">
      <span className="sr-only">Toggle theme</span>
      <IconMoon className="size-5" />
    </button>
  );
}
