import { useFileStore } from '@/stores/fileStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddFileListener() {
  const navigate = useNavigate();
  const { addFiles, clearFiles } = useFileStore();
  useEffect(() => {
    try {
      window.electron.ipcRenderer.on(
        'files-opened',
        // @ts-ignore
        async (filePaths: string[]) => {
          const filesData: { name: string; buffer: Buffer }[] =
            await window.electron.ipcRenderer.invoke('read-files', filePaths);
          const files = filesData.map((fileData) => {
            const file = new File([fileData.buffer], fileData.name, {
              type: `image/${fileData.name.split('.').pop()}`,
            });
            return file;
          });
          await addFiles(files);
          navigate('/uploaded');
        },
      );
      window.electron.ipcRenderer.on('clear-all', clearFiles);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('issue with on getting data', e);
    }
    return () => {
      window.electron.ipcRenderer.removeAllListeners('files-opened');
    };
  }, [addFiles, clearFiles, navigate]);
  return null;
}

export default AddFileListener;
