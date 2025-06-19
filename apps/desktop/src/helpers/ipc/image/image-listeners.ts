import { ipcMain, dialog } from "electron";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { app } from "electron";
import {
  IMAGE_CHANNELS,
  type ProcessImageRequest,
  type ProcessImageResponse,
  type SelectFolderResponse,
  type SaveFileRequest,
  type SaveFileResponse,
} from "./image-channels";

export function addImageEventListeners() {
  // Process image with sharp
  ipcMain.handle(
    IMAGE_CHANNELS.PROCESS_IMAGE,
    async (
      _event,
      request: ProcessImageRequest,
    ): Promise<ProcessImageResponse> => {
      try {
        const { imageData, fileName, options } = request;
        const buffer = Buffer.from(imageData);

        let sharpInstance = sharp(buffer);

        // Apply resize if specified
        if (options.resize) {
          const { type, width, height } = options.resize;

          switch (type) {
            case "fixed_width":
              if (width) {
                sharpInstance = sharpInstance.resize(width, null, {
                  withoutEnlargement: true,
                });
              }
              break;
            case "fixed_height":
              if (height) {
                sharpInstance = sharpInstance.resize(null, height, {
                  withoutEnlargement: true,
                });
              }
              break;
            case "max_width":
              if (width) {
                sharpInstance = sharpInstance.resize(width, null, {
                  withoutEnlargement: true,
                });
              }
              break;
            case "max_height":
              if (height) {
                sharpInstance = sharpInstance.resize(null, height, {
                  withoutEnlargement: true,
                });
              }
              break;
          }
        }

        // Apply format and quality
        let processedBuffer: Buffer;

        switch (options.format) {
          case "jpeg":
            processedBuffer = await sharpInstance
              .jpeg({ quality: options.quality })
              .toBuffer();
            break;
          case "png":
            processedBuffer = await sharpInstance
              .png({
                quality: options.quality,
                ...(options.quantize && {
                  palette: true,
                  colors: 256,
                }),
              })
              .toBuffer();
            break;
          case "webp":
            processedBuffer = await sharpInstance
              .webp({ quality: options.quality })
              .toBuffer();
            break;
          case "avif":
            processedBuffer = await sharpInstance
              .avif({ quality: options.quality })
              .toBuffer();
            break;
          default:
            throw new Error(`Unsupported format: ${options.format}`);
        }

        return {
          success: true,
          processedData: processedBuffer.buffer.slice(
            processedBuffer.byteOffset,
            processedBuffer.byteOffset + processedBuffer.byteLength,
          ) as ArrayBuffer,
          originalSize: buffer.length,
          processedSize: processedBuffer.length,
        };
      } catch (error) {
        console.error("Image processing error:", error);
        return {
          success: false,
          originalSize: 0,
          processedSize: 0,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
  );

  // Select folder dialog
  ipcMain.handle(
    IMAGE_CHANNELS.SELECT_FOLDER,
    async (): Promise<SelectFolderResponse> => {
      try {
        const result = await dialog.showOpenDialog({
          properties: ["openDirectory"],
          title: "Select Output Folder",
        });

        if (!result.canceled && result.filePaths.length > 0) {
          return {
            success: true,
            path: result.filePaths[0],
          };
        }

        return {
          success: false,
          error: "No folder selected",
        };
      } catch (error) {
        console.error("Folder selection error:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
  );

  // Save file to disk
  ipcMain.handle(
    IMAGE_CHANNELS.SAVE_FILE,
    async (_event, request: SaveFileRequest): Promise<SaveFileResponse> => {
      try {
        const { filePath, data } = request;
        const buffer = Buffer.from(data);

        // Ensure directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(filePath, buffer);

        return {
          success: true,
        };
      } catch (error) {
        console.error("File save error:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
  );

  // Get downloads folder path
  ipcMain.handle(
    IMAGE_CHANNELS.GET_DOWNLOADS_PATH,
    async (): Promise<string> => {
      return app.getPath("downloads");
    },
  );
}
