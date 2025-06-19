import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { useImageConverterStore } from "@/lib/store";

// Mock the window.imageAPI
Object.defineProperty(window, "imageAPI", {
  value: {
    processImage: vi.fn(),
    selectFolder: vi.fn(),
    saveFile: vi.fn(),
    getDownloadsPath: vi.fn(),
  },
  writable: true,
});

describe("Image Converter Store", () => {
  beforeEach(() => {
    // Reset the store to initial state before each test
    useImageConverterStore.setState({
      currentOptions: {
        format: "jpeg",
        quality: 90,
        quantize: false,
      },
      destinationType: "downloads",
      customDestinationPath: "",
      presets: [],
      processedImages: [],
    });
  });

  it("should initialize with default options", () => {
    const store = useImageConverterStore.getState();

    expect(store.currentOptions.format).toBe("jpeg");
    expect(store.currentOptions.quality).toBe(90);
    expect(store.currentOptions.quantize).toBe(false);
    expect(store.destinationType).toBe("downloads");
    expect(store.presets).toEqual([]);
    expect(store.processedImages).toEqual([]);
  });

  it("should update current options", () => {
    const store = useImageConverterStore.getState();

    store.setCurrentOptions({ format: "png", quality: 80 });

    expect(store.currentOptions.format).toBe("png");
    expect(store.currentOptions.quality).toBe(80);
    expect(store.currentOptions.quantize).toBe(false); // Should remain unchanged
  });

  it("should add and remove presets", () => {
    const store = useImageConverterStore.getState();

    const presetOptions = {
      format: "webp" as const,
      quality: 85,
      quantize: false,
    };

    store.addPreset("Test Preset", presetOptions);

    expect(store.presets).toHaveLength(1);
    expect(store.presets[0].name).toBe("Test Preset");
    expect(store.presets[0].options).toEqual(presetOptions);

    const presetId = store.presets[0].id;
    store.removePreset(presetId);

    expect(store.presets).toHaveLength(0);
  });

  it("should load presets", () => {
    const store = useImageConverterStore.getState();

    const presetOptions = {
      format: "avif" as const,
      quality: 75,
      quantize: false,
    };

    store.addPreset("Test Preset", presetOptions);
    const presetId = store.presets[0].id;

    // Change current options
    store.setCurrentOptions({ format: "jpeg", quality: 50 });

    // Load preset
    store.loadPreset(presetId);

    expect(store.currentOptions.format).toBe("avif");
    expect(store.currentOptions.quality).toBe(75);
  });

  it("should manage processed images", () => {
    const store = useImageConverterStore.getState();

    const mockImage = {
      id: "test-id",
      fileName: "test.jpg",
      originalSize: 1000,
      processedSize: 500,
      originalData: new ArrayBuffer(1000),
      processedData: new ArrayBuffer(500),
      options: store.currentOptions,
      status: "completed" as const,
    };

    store.addProcessedImage(mockImage);

    expect(store.processedImages).toHaveLength(1);
    expect(store.processedImages[0].fileName).toBe("test.jpg");

    store.removeProcessedImage("test-id");

    expect(store.processedImages).toHaveLength(0);
  });
});
