/* eslint-disable no-use-before-define */
import { useFileStore } from '@/stores/fileStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Images } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

function DropZone({
  children,
  onFilesAdded = () => {},
}: {
  children: (
    loading: boolean,
    handleUpload: (files: File[]) => Promise<void>,
  ) => React.ReactNode;
  onFilesAdded?: () => void;
}) {
  const { addFiles, loading } = useFileStore();
  const [isDragging, setIsDragging] = React.useState(false);

  const handleUpload = async (files: File[]) => {
    try {
      await addFiles(files);
    } catch (error) {
      toast.error('Failed to upload files');
    } finally {
      onFilesAdded?.();
    }
  };
  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    if (!event.dataTransfer.files.length) return;
    if (loading) return;
    event.preventDefault();
    event.stopPropagation();
    const files = Array.from(event.dataTransfer.files);
    await handleUpload(files);
    setIsDragging(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  return (
    <div
      className="flex-1 flex flex-col relative"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragging(false)}
    >
      <DragOverlay show={isDragging} />
      {children(loading, handleUpload)}
    </div>
  );
}

export default DropZone;

function DragOverlay({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-x-0 inset-y-0 bg-muted/90 z-[60] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="flex flex-col gap-4 justify-center items-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{
              type: 'spring',
              bounce: 0.1,
            }}
          >
            <Images className="size-8 text-muted-foreground" />
            <span>Drop files to upload</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
