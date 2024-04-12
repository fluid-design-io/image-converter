import { create } from 'zustand';
import { Settings, Preset } from '@/types/settings';

const Store = window.require('electron-store');
const settingsStore = new Store();

export interface SettingsState extends Settings {
  addPreset: (preset: Preset) => void;
  removePreset: (name: string) => void;
  updatePreset: (name: string, data: Partial<Preset>) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  presets: settingsStore.get('presets'),
  addPreset: (preset) => {
    const updatedPresets = [...settingsStore.get('presets'), preset];
    settingsStore.set('presets', updatedPresets);
    set({ presets: updatedPresets });
  },

  removePreset: (name) => {
    const updatedPresets = settingsStore
      .get('presets')
      .filter((p: Preset) => p.name !== name);
    settingsStore.set('presets', updatedPresets);
    set({ presets: updatedPresets });
  },

  updatePreset: (name, data) => {
    const presets = settingsStore.get('presets');
    const updatedPresets = presets.map((p: Preset) => {
      if (p.name === name) {
        return { ...p, ...data };
      }
      return p;
    });
    settingsStore.set('presets', updatedPresets);
    set({ presets: updatedPresets });
  },
}));
