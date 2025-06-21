import { produce } from "immer";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type ImageProcessingOptions } from "../helpers/ipc/image/image-channels";
import { ImageProcessor, type ProcessedImage } from "./imageProcessor";

export interface Preset {
  id: string;
  name: string;
  options: ImageProcessingOptions;
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

  // Processing state
  isProcessing: boolean;
  processingProgress: {
    current: number;
    total: number;
  };

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

  // Processing actions
  processImages: (files: File[]) => Promise<void>;
  setIsProcessing: (isProcessing: boolean) => void;
  setProcessingProgress: (progress: { current: number; total: number }) => void;
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
      isProcessing: false,
      processingProgress: { current: 0, total: 0 },

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

      // Processing actions
      setIsProcessing: (isProcessing) =>
        set(
          produce((state) => {
            state.isProcessing = isProcessing;
          }),
        ),

      setProcessingProgress: (progress) =>
        set(
          produce((state) => {
            state.processingProgress = progress;
          }),
        ),

      processImages: async (files: File[]) => {
        const state = get();
        const imageFiles = files.filter((file) =>
          file.type.startsWith("image/"),
        );

        set(
          produce((state) => {
            state.isProcessing = true;
            state.processingProgress = { current: 0, total: imageFiles.length };
          }),
        );

        try {
          // Create progress callback to update store
          const onProgress = (
            imageId: string,
            updates: Partial<ProcessedImage>,
          ) => {
            set(
              produce((state) => {
                const image = state.processedImages.find(
                  (img: ProcessedImage) => img.id === imageId,
                );
                if (image) {
                  Object.assign(image, updates);
                }

                // Update progress when image is completed or errored
                if (
                  updates.status === "completed" ||
                  updates.status === "error"
                ) {
                  state.processingProgress.current += 1;
                }
              }),
            );
          };

          // Process images using the ImageProcessor service
          const processedImages = await ImageProcessor.processAndSaveImages(
            imageFiles,
            state.currentOptions,
            state.destinationType,
            state.customDestinationPath,
            onProgress,
          );

          // Add all processed images to store
          set(
            produce((state) => {
              state.processedImages.push(...processedImages);
            }),
          );
        } finally {
          set(
            produce((state) => {
              state.isProcessing = false;
              state.processingProgress = { current: 0, total: 0 };
            }),
          );
        }
      },
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
