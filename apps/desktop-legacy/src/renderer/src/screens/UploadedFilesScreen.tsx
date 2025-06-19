/* eslint-disable react/no-array-index-key */
import DropZone from '@/components/drop-zone';
import ExportSettingsView from '@/components/export-settings/view';
import { columns } from '@/components/file-table/columns';
import MultiSelectToolbar from '@/components/file-table/multi-select-toolbar';
import Layout from '@/components/layout/layout';
import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { Heading, Text } from '@/components/ui/typography';
import UploadButton from '@/components/upload-button';
import { useFileStore } from '@/stores/fileStore';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUp, Loader } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

function UploadedFilesScreen() {
  const navigate = useNavigate();
  const { files, loading: filesLoading } = useFileStore();
  useEffect(() => {
    if (files.length === 0) {
      navigate('/');
    }
  }, [files, navigate]);
  return (
    <DropZone>
      {(loading, handleUpload) => (
        <Layout
          title="Uploaded Files"
          buttonGroups={[
            [
              {
                title: 'Add Files',
                description: 'Add files to convertion queue',
                type: 'component',
                component: (
                  <UploadButton
                    loading={loading || filesLoading}
                    onUpload={handleUpload}
                    variant="ghost"
                    icon
                  />
                ),
              },
            ],
            [
              {
                type: 'button',
                title: 'Convert',
                description: 'Convert selected images',
                // cmd symbol + enter symbol
                kbd: '⌘ + ↵',
                onClick: () => {},
                variant: 'default',
                id: 'convert-button',
                disabled: filesLoading,
              },
            ],
          ]}
        >
          <>
            <AnimatePresence mode="wait">
              {(loading || filesLoading) && (
                <motion.div
                  className="flex items-center justify-center h-full fixed inset-0 z-50 bg-muted/30 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Loader className="size-8 animate-spin" />
                </motion.div>
              )}
            </AnimatePresence>
            <ExportSettingsView />
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="secondary"
                  className="flex items-center justify-between w-full h-14 fixed inset-x-0 bottom-0 z-40 px-5 border-t rounded-t-none hover:bg-background"
                  size="sm"
                >
                  <div className="flex flex-col items-start">
                    <Heading type="h4" className="text-xs">
                      Uploaded Files
                    </Heading>
                    <Text
                      size="xs"
                      variant="muted"
                      className="text-xs text-muted-foreground"
                    >
                      {files.length} files
                    </Text>
                  </div>
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="p-0">
                <ScrollArea className="h-[calc(100vh-3.5rem)]">
                  <div className="p-5">
                    <DataTable
                      // eslint-disable-next-line react/no-unstable-nested-components
                      multiSelectComponent={(table) => (
                        <MultiSelectToolbar table={table} />
                      )}
                      columns={columns}
                      data={files}
                    />
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </>
        </Layout>
      )}
    </DropZone>
  );
}

export default UploadedFilesScreen;
