export const IMAGE_CHANNELS = {
  PROCESS_IMAGE: "process-image",
  SELECT_FOLDER: "select-folder",
  SAVE_FILE: "save-file",
  GET_DOWNLOADS_PATH: "get-downloads-path",
} as const;

export type ImageProcessingOptions = {
  format: "jpeg" | "png" | "webp" | "avif";
  quality: number;
  resize?: {
    type: "fixed_width" | "fixed_height" | "max_width" | "max_height";
    width?: number;
    height?: number;
  };
  quantize?: boolean;
};

export type ProcessImageRequest = {
  imageData: ArrayBuffer;
  fileName: string;
  options: ImageProcessingOptions;
};

export type ProcessImageResponse = {
  success: boolean;
  processedData?: ArrayBuffer;
  originalSize: number;
  processedSize: number;
  error?: string;
};

export type SelectFolderResponse = {
  success: boolean;
  path?: string;
  error?: string;
};

export type SaveFileRequest = {
  filePath: string;
  data: ArrayBuffer;
};

export type SaveFileResponse = {
  success: boolean;
  error?: string;
};
