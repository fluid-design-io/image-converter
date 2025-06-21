import { ThemeMode } from "@/types/theme-mode";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ThemeState {
  // Theme preferences
  system: ThemeMode;
  local: ThemeMode | null;

  // Computed values
  effectiveTheme: "dark" | "light";

  // Actions
  setSystemTheme: (theme: ThemeMode) => void;
  setLocalTheme: (theme: ThemeMode | null) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  syncThemeWithLocal: () => void;
  getEffectiveTheme: () => "dark" | "light";
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // Initial state
      system: "system",
      local: null,
      effectiveTheme: "light",

      // Actions
      setSystemTheme: (theme) =>
        set((state) => ({
          ...state,
          system: theme,
          effectiveTheme: get().getEffectiveTheme(),
        })),

      setLocalTheme: (theme) =>
        set((state) => ({
          ...state,
          local: theme,
          effectiveTheme: get().getEffectiveTheme(),
        })),

      setTheme: (theme) =>
        set((state) => ({
          ...state,
          local: theme,
          effectiveTheme: get().getEffectiveTheme(),
        })),

      toggleTheme: () => {
        const { local } = get();
        const newTheme = local === "dark" ? "light" : "dark";
        set((state) => ({
          ...state,
          local: newTheme,
          effectiveTheme: newTheme,
        }));
      },

      syncThemeWithLocal: () => {
        const { local } = get();
        if (!local) {
          set((state) => ({
            ...state,
            local: "system",
            effectiveTheme: get().getEffectiveTheme(),
          }));
        }
      },

      getEffectiveTheme: () => {
        const { local, system } = get();
        if (local === "dark" || local === "light") {
          return local;
        }
        // If local is null or "system", use the system theme
        return system === "dark" ? "dark" : "light";
      },
    }),
    {
      name: "theme-storage",
      partialize: (state) => ({
        local: state.local,
      }),
    },
  ),
);
