import { Preset } from '@/types/preset';
import { ExportSetting, Settings } from '@/types/settings';
import Store from 'electron-store';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

const settingsStore = window.electron.store as Store<Settings>;

export interface SettingsState extends Settings {
  addPreset: (preset: Preset) => string;
  removePreset: (id: string) => void;
  updatePreset: (id: string, data: Partial<Preset>) => void;
  setExportSettings: (settings: ExportSetting[]) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  presets: settingsStore.get('presets'),
  addPreset: (preset) => {
    const presetWithUUID = { ...preset, id: uuidv4() };
    const updatedPresets = [
      ...(settingsStore?.get('presets') || []),
      presetWithUUID,
    ];
    settingsStore.set('presets', updatedPresets);
    set({ presets: updatedPresets });
    return presetWithUUID.id;
  },

  removePreset: (id) => {
    const updatedPresets = settingsStore
      .get('presets')
      .filter((p: Preset) => p.id !== id);
    settingsStore.set('presets', updatedPresets);
    set({ presets: updatedPresets });
  },

  updatePreset: (id, data) => {
    const presets = settingsStore.get('presets');
    const updatedPresets = presets.map((p: Preset) => {
      if (p.id === id) {
        return { ...p, ...data };
      }
      return p;
    });
    settingsStore.set('presets', updatedPresets);
    set({ presets: updatedPresets });
  },
  exportSettings: settingsStore.get('exportSettings') || ['file-settings'],
  /**
   * Toggle export settings to default open as the accordion
   */
  setExportSettings: (settings) => {
    settingsStore.set('exportSettings', settings);
    set({ exportSettings: settings });
  },
}));
