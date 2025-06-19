import { contextBridge, ipcRenderer } from "electron";
import {
  IMAGE_CHANNELS,
  type ProcessImageRequest,
  type ProcessImageResponse,
  type SelectFolderResponse,
  type SaveFileRequest,
  type SaveFileResponse,
} from "./image-channels";

export function exposeImageContext() {
  contextBridge.exposeInMainWorld("imageAPI", {
    processImage: (
      request: ProcessImageRequest,
    ): Promise<ProcessImageResponse> =>
      ipcRenderer.invoke(IMAGE_CHANNELS.PROCESS_IMAGE, request),

    selectFolder: (): Promise<SelectFolderResponse> =>
      ipcRenderer.invoke(IMAGE_CHANNELS.SELECT_FOLDER),

    saveFile: (request: SaveFileRequest): Promise<SaveFileResponse> =>
      ipcRenderer.invoke(IMAGE_CHANNELS.SAVE_FILE, request),

    getDownloadsPath: (): Promise<string> =>
      ipcRenderer.invoke(IMAGE_CHANNELS.GET_DOWNLOADS_PATH),
  });
}
