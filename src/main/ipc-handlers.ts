import { dialog, ipcMain } from 'electron';
import { processImages } from './image-process';
import { getCommonPaths } from './util';

/**
 * Register IPC event handlers
 */
export const registerIpcHandlers = () => {
  /**
   * IPC handler to open a directory dialog
   * @returns {Promise<string>} The selected directory path
   */
  ipcMain.on('open-directory-dialog', (event) => {
    dialog
      .showOpenDialog({
        properties: ['openDirectory'],
      })
      .then((result) => {
        if (
          !result.canceled &&
          result.filePaths &&
          result.filePaths.length > 0
        ) {
          event.reply('directory-selected', result.filePaths[0]);
        }
        return result;
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to open directory dialog:', err);
      });
  });

  /**
   * IPC handler to read files from the file system
   */
  ipcMain.handle('get-common-paths', async () => getCommonPaths());

  /**
   * Register the IPC handler for processing images
   */
  ipcMain.handle('process-images', async (event, filePaths, preset) => {
    try {
      return await processImages(filePaths, preset);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error processing images:', error);
      throw error;
    }
  });
};
