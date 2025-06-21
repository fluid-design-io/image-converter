import { useThemeStore } from "@/lib/themeStore";
import { ThemeMode } from "@/types/theme-mode";

export interface ThemePreferences {
  system: ThemeMode;
  local: ThemeMode | null;
}

export async function getCurrentTheme(): Promise<ThemePreferences> {
  const currentTheme = await window.themeMode.current();
  const { local } = useThemeStore.getState();

  // Update system theme in store
  useThemeStore.getState().setSystemTheme(currentTheme);

  return {
    system: currentTheme,
    local: local,
  };
}

export async function setTheme(newTheme: ThemeMode) {
  switch (newTheme) {
    case "dark":
      await window.themeMode.dark();
      updateDocumentTheme(true);
      break;
    case "light":
      await window.themeMode.light();
      updateDocumentTheme(false);
      break;
    case "system": {
      const isDarkMode = await window.themeMode.system();
      updateDocumentTheme(isDarkMode);
      break;
    }
  }

  // Update store instead of localStorage
  useThemeStore.getState().setTheme(newTheme);
}

export async function toggleTheme() {
  const isDarkMode = await window.themeMode.toggle();
  const newTheme = isDarkMode ? "dark" : "light";

  updateDocumentTheme(isDarkMode);

  // Update store instead of localStorage
  useThemeStore.getState().setTheme(newTheme);
}

export async function syncThemeWithLocal() {
  const { local } = useThemeStore.getState();
  if (!local) {
    setTheme("system");
    return;
  }

  await setTheme(local);
}

export async function initializeTheme() {
  const { local } = useThemeStore.getState();
  const currentTheme = await window.themeMode.current();

  // Update system theme
  useThemeStore.getState().setSystemTheme(currentTheme);

  // If no local theme is set, use system
  if (!local) {
    await setTheme("system");
  } else {
    await setTheme(local);
  }
}

function updateDocumentTheme(isDarkMode: boolean) {
  if (!isDarkMode) {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
  }
}
