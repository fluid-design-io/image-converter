// stores/fileStore.ts
import { isImageFile } from '@/validation/file-validation';
import { produce } from 'immer';
import { ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

export type FilePreview = {
  preview?: FileReader['result'];
  id: string;
  name: string;
  size: number;
  type: string;
  dimensions: { width: number; height: number };
  lastModified: number;
};

export type FileWithPreview = File & FilePreview;

export interface FileState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  files: FileWithPreview[];
  addFiles: (newFiles: File[]) => Promise<void>;
  clearFiles: () => void;
  removeFile: (fileId: string) => void;
}

const getImage = (
  file: File,
): Promise<{ width: number; height: number; preview: string }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.width, height: img.height, preview: img.src });
    };
  });
};

const createFileWithPreview = (file: File): Promise<FileWithPreview> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = await getImage(file);
      resolve({
        ...file,
        id: uuidv4(),
        preview: event.target?.result,
        path: file.path,
        name: file.name,
        size: file.size,
        type: file.type,
        dimensions: { width: img.width, height: img.height },
        lastModified: file.lastModified,
      });
    };
    reader.readAsDataURL(file);
  });
};

export const useFileStore = create<FileState>((set, get) => ({
  files: [],
  addFiles: async (newFiles) => {
    set({ loading: true });
    let hasError = false;
    // warn if non-image files are added, skip them and add only image files
    const imageFiles = newFiles.filter((file) => {
      const { success } = isImageFile(file);
      if (!success) {
        hasError = true;
      }
      return success;
    });

    const filesWithPreview = await Promise.all(
      imageFiles.map(createFileWithPreview),
    );

    const newFilesNames = filesWithPreview.map((file) => file.name);
    const filteredFiles = get().files.filter(
      (file) => !newFilesNames.includes(file.name),
    );

    const replacedFileCount = get().files.length - filteredFiles.length;
    const skippedFileCount = newFiles.length - imageFiles.length;
    const addedFileCount = filesWithPreview.length;

    const messages = [];
    if (addedFileCount) {
      messages.push(
        `Added ${addedFileCount} new ${addedFileCount > 1 ? 'files' : 'file'}`,
      );
    }
    if (replacedFileCount) {
      messages.push(
        `Replaced ${replacedFileCount} ${
          replacedFileCount > 1 ? 'files' : 'file'
        } with the same name`,
      );
    }
    if (hasError) {
      messages.push(
        `Skipped ${skippedFileCount} non-image ${
          skippedFileCount > 1 ? 'files' : 'file'
        }`,
      );
    }

    const toastMsg = messages.join(', ');

    toast.info(toastMsg, {
      icon: <ImageIcon className="size-4" />,
    });

    // notify submenu `clear-all` to enable
    window.electron.ipcRenderer.emit('files-added');

    // setting new files
    set(
      produce((state) => {
        state.files = [...filteredFiles, ...filesWithPreview];
        state.loading = false;
      }),
    );
  },
  clearFiles: () => set({ files: [] }),
  removeFile: (fileId) =>
    set(
      produce((state) => {
        state.files = state.files.filter(
          (file: FileWithPreview) => file.id !== fileId,
        );
      }),
    ),
  loading: false,
  setLoading: (loading) => set({ loading }),
}));
