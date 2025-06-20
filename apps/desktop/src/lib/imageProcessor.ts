import { updateFileExtension } from "@/utils";
import { type ImageProcessingOptions } from "../helpers/ipc/image/image-channels";

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

export interface ImageProcessingResult {
  success: boolean;
  processedData?: ArrayBuffer;
  processedSize?: number;
  error?: string;
}

export interface SaveFileResult {
  success: boolean;
  error?: string;
}

export class ImageProcessor {
  /**
   * Process a single image file
   */
  static async processImage(
    file: File,
    options: ImageProcessingOptions,
    onProgress?: (imageId: string, updates: Partial<ProcessedImage>) => void,
  ): Promise<ProcessedImage> {
    const imageId = crypto.randomUUID();

    // Create initial processed image entry
    const processedImage: ProcessedImage = {
      id: imageId,
      fileName: file.name,
      originalSize: file.size,
      processedSize: 0,
      originalData: await file.arrayBuffer(),
      processedData: new ArrayBuffer(0),
      options,
      status: "processing",
    };

    // Notify progress
    onProgress?.(imageId, { status: "processing" });

    try {
      // Process the image using the main process
      const response = await window.imageAPI.processImage({
        imageData: await file.arrayBuffer(),
        fileName: file.name,
        options,
      });

      if (response.success && response.processedData) {
        const updates = {
          processedData: response.processedData,
          processedSize: response.processedSize,
          status: "completed" as const,
        };

        Object.assign(processedImage, updates);
        onProgress?.(imageId, updates);
      } else {
        const errorUpdate = {
          status: "error" as const,
          error: response.error || "Processing failed",
        };

        Object.assign(processedImage, errorUpdate);
        onProgress?.(imageId, errorUpdate);
      }
    } catch (error) {
      const errorUpdate = {
        status: "error" as const,
        error: error instanceof Error ? error.message : "Unknown error",
      };

      Object.assign(processedImage, errorUpdate);
      onProgress?.(imageId, errorUpdate);
    }

    return processedImage;
  }

  /**
   * Process multiple image files
   */
  static async processImages(
    files: File[],
    options: ImageProcessingOptions,
    onProgress?: (imageId: string, updates: Partial<ProcessedImage>) => void,
  ): Promise<ProcessedImage[]> {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    const results: ProcessedImage[] = [];

    for (const file of imageFiles) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const result = await this.processImage(file, options, onProgress);
      results.push(result);
    }

    return results;
  }

  /**
   * Save a processed image to the specified destination
   */
  static async saveProcessedImage(
    fileName: string,
    data: ArrayBuffer,
    options: ImageProcessingOptions,
    destinationType: "same" | "downloads" | "custom",
    customDestinationPath?: string,
  ): Promise<SaveFileResult> {
    try {
      // Update file extension based on the target format
      const updatedFileName = updateFileExtension(fileName, options.format);
      let destinationPath: string;

      if (destinationType === "downloads") {
        const downloadsPath = await window.imageAPI.getDownloadsPath();
        destinationPath = `${downloadsPath}/${updatedFileName}`;
      } else if (destinationType === "custom" && customDestinationPath) {
        destinationPath = `${customDestinationPath}/${updatedFileName}`;
      } else {
        return {
          success: false,
          error: "Invalid destination type or missing custom path",
        };
      }

      const response = await window.imageAPI.saveFile({
        filePath: destinationPath,
        data,
      });

      return response;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error saving file",
      };
    }
  }

  /**
   * Process and optionally save images
   */
  static async processAndSaveImages(
    files: File[],
    options: ImageProcessingOptions,
    destinationType: "same" | "downloads" | "custom",
    customDestinationPath?: string,
    onProgress?: (imageId: string, updates: Partial<ProcessedImage>) => void,
  ): Promise<ProcessedImage[]> {
    const processedImages = await this.processImages(
      files,
      options,
      onProgress,
    );

    // Auto-save completed images if destination is set
    if (destinationType !== "same") {
      for (const image of processedImages) {
        if (image.status === "completed") {
          await this.saveProcessedImage(
            image.fileName,
            image.processedData,
            options,
            destinationType,
            customDestinationPath,
          );
        }
      }
    }

    return processedImages;
  }
}
