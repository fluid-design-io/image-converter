import { useFileStore } from '@/stores/fileStore';
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
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div
      className="flex-1 flex flex-col"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {children(loading, handleUpload)}
    </div>
  );
}

export default DropZone;
