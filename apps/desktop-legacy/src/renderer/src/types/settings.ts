import { Preset } from './preset';

export type ExportSetting =
  | 'file-settings'
  | 'image-sizing'
  | 'export-location';

// types/settingsType.ts
export interface ConversionSettings {
  format: string; // e.g., 'jpg', 'png'
  size: number; // max width or height
  enlarge: boolean;
  quality: number; // 0-100 for jpg
  namingOptions: string; // e.g., 'original', 'custom'
}

export interface Settings {
  presets: Preset[];
  exportSettings: Array<ExportSetting>;
}
