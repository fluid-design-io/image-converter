/* eslint-disable no-nested-ternary */
/* eslint-disable import/prefer-default-export */
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileWithPreview, useFileStore } from '@/stores/fileStore';
import { MoreHorizontal } from 'lucide-react';
import { getRowRange } from '../table/helper';
import { Text } from '../ui/typography';

export const columns: ColumnDef<FileWithPreview>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row, table }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          // onChange={row.getToggleSelectedHandler()}
          onClick={(e: any): void => {
            if (e.shiftKey) {
              const { rows, rowsById } = table.getRowModel();
              const { rowSelection } = table.getState();
              const lastSelectedRowIndex =
                Math.max(...Object.keys(rowSelection).map(Number)) ?? 0;
              const rowsToToggle = getRowRange(
                rows,
                row.index,
                lastSelectedRowIndex,
              );
              const isCellSelected = rowsById?.[row.id]?.getIsSelected();
              rowsToToggle.forEach((_row) =>
                _row.toggleSelected(!isCellSelected),
              );
            } else {
              row.toggleSelected();
            }
          }}
          aria-label="Select row"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: 'Preview',
    accessorKey: 'preview',
    cell: ({ row }) => {
      const imageUrl = row.getValue('preview') as string;
      return imageUrl ? (
        <img
          src={imageUrl}
          alt="Preview"
          className="size-12 rounded-lg object-cover"
        />
      ) : (
        <div className="size-12 rounded-lg bg-foreground/30" />
      );
    },
  },
  {
    header: 'Name',
    accessorKey: 'name',
    cell: ({ row }) => {
      const value = row.getValue('name');
      const name = value as string;
      return <Text className="line-clamp-1 max-w-xs">{name}</Text>;
    },
    size: 320,
  },
  {
    header: 'Size',
    accessorKey: 'size',
    cell: ({ row }) => {
      const value = row.getValue('size');
      const size = value as number;
      const sizeText =
        size < 1024
          ? `${size} B`
          : size < 1024 * 1024
            ? `${(size / 1024).toFixed(2)} KB`
            : `${(size / 1024 / 1024).toFixed(2)} MB`;
      return (
        <Text variant="inline-code" className="text-muted-foreground">
          {sizeText}
        </Text>
      );
    },
  },
  {
    header: 'Dimensions',
    accessorKey: 'dimensions',
    cell: ({ row }) => {
      const value = row.getValue('dimensions');
      const dimensions = value as { width: number; height: number };
      return (
        <Text variant="inline-code" className="text-muted-foreground">
          {dimensions.width} x {dimensions.height}
        </Text>
      );
    },
  },
  {
    header: 'Type',
    accessorKey: 'type',
    cell: ({ row }) => {
      const value = row.getValue('type') as string;
      const type = value.split('/')[1];
      return (
        <Text variant="inline-code" className="text-muted-foreground">
          {type}
        </Text>
      );
    },
  },
  {
    header: 'Last Modified',
    accessorKey: 'lastModified',
    cell: ({ row }) => {
      const value = row.getValue('lastModified');
      const lastModified = value as number;
      const text = new Date(lastModified).toLocaleDateString();
      return (
        <Text variant="inline-code" className="text-muted-foreground">
          {text}
        </Text>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { removeFile } = useFileStore();
      const fileId = row.original.id;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => removeFile(fileId)}>
              Remove file
            </DropdownMenuItem>
            {/* <DropdownMenuSeparator /> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
