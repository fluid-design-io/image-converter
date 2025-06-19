import { Table } from '@tanstack/react-table';

import { FileWithPreview, useFileStore } from '@/stores/fileStore';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';

function MultiSelectToolbar<T extends FileWithPreview>({
  table,
}: {
  table: Table<T>;
}) {
  const { removeFile } = useFileStore();

  const handleDeleteRows = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const ids = selectedRows.map((row) => row.original.id);
    try {
      await Promise.all(ids.map(removeFile));
      toast.info(`${ids.length} files deleted`);
      table.toggleAllRowsSelected(false);
    } catch (error) {
      toast.error('Failed to delete files');
    }
  };
  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        className="h-8 text-destructive hover:text-destructive-foreground hover:bg-destructive border-destructive/20"
        onClick={handleDeleteRows}
      >
        <Trash className="mr-2 size-4" />
        Delete
      </Button>
    </div>
  );
}

export default MultiSelectToolbar;
