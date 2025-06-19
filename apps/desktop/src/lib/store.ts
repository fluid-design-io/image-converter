import { create } from "zustand";
import { persist } from "zustand/middleware";
import { produce } from "immer";
import { type ImageProcessingOptions } from "../helpers/ipc/image/image-channels";

export interface Preset {
  id: string;
  name: string;
  options: ImageProcessingOptions;
}

export interface ProcessedImage {
  id: string;
  fileName: string;
  originalSize: number;
  processedSize: number;
  originalData: ArrayBuffer;
  processedData: ArrayBuffer;
  options: ImageProcessingOptions;
  status: "processing" | "completed" | "error";
  error?: string;
}

export interface ImageConverterState {
  // Current processing options
  currentOptions: ImageProcessingOptions;

  // Destination settings
  destinationType: "same" | "downloads" | "custom";
  customDestinationPath: string;

  // Presets
  presets: Preset[];

  // Processed images
  processedImages: ProcessedImage[];

  // Actions
  setCurrentOptions: (options: Partial<ImageProcessingOptions>) => void;
  setDestinationType: (type: "same" | "downloads" | "custom") => void;
  setCustomDestinationPath: (path: string) => void;

  // Preset actions
  addPreset: (name: string, options: ImageProcessingOptions) => void;
  removePreset: (id: string) => void;
  loadPreset: (id: string) => void;

  // Image actions
  addProcessedImage: (image: ProcessedImage) => void;
  updateProcessedImage: (id: string, updates: Partial<ProcessedImage>) => void;
  removeProcessedImage: (id: string) => void;
  clearProcessedImages: () => void;
}

const defaultOptions: ImageProcessingOptions = {
  format: "jpeg",
  quality: 90,
  quantize: false,
};

export const useImageConverterStore = create<ImageConverterState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentOptions: defaultOptions,
      destinationType: "downloads",
      customDestinationPath: "",
      presets: [],
      processedImages: [],

      // Actions
      setCurrentOptions: (options) =>
        set(
          produce((state) => {
            Object.assign(state.currentOptions, options);
          }),
        ),

      setDestinationType: (type) =>
        set(
          produce((state) => {
            state.destinationType = type;
          }),
        ),

      setCustomDestinationPath: (path) =>
        set(
          produce((state) => {
            state.customDestinationPath = path;
          }),
        ),

      // Preset actions
      addPreset: (name, options) =>
        set(
          produce((state) => {
            state.presets.push({
              id: crypto.randomUUID(),
              name,
              options,
            });
          }),
        ),

      removePreset: (id) =>
        set(
          produce((state) => {
            state.presets = state.presets.filter(
              (preset: Preset) => preset.id !== id,
            );
          }),
        ),

      loadPreset: (id) => {
        const preset = get().presets.find((p) => p.id === id);
        if (preset) {
          set(
            produce((state) => {
              state.currentOptions = preset.options;
            }),
          );
        }
      },

      // Image actions
      addProcessedImage: (image) =>
        set(
          produce((state) => {
            state.processedImages.push(image);
          }),
        ),

      updateProcessedImage: (id, updates) =>
        set(
          produce((state) => {
            const image = state.processedImages.find(
              (img: ProcessedImage) => img.id === id,
            );
            if (image) {
              Object.assign(image, updates);
            }
          }),
        ),

      removeProcessedImage: (id) =>
        set(
          produce((state) => {
            state.processedImages = state.processedImages.filter(
              (img: ProcessedImage) => img.id !== id,
            );
          }),
        ),

      clearProcessedImages: () =>
        set(
          produce((state) => {
            state.processedImages = [];
          }),
        ),
    }),
    {
      name: "image-converter-storage",
      partialize: (state) => ({
        currentOptions: state.currentOptions,
        destinationType: state.destinationType,
        customDestinationPath: state.customDestinationPath,
        presets: state.presets,
      }),
    },
  ),
);
