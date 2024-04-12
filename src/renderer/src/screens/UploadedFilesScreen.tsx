/* eslint-disable react/no-array-index-key */
import DropZone from '@/components/drop-zone';
import ExportSettingsView from '@/components/export-settings/view';
import { columns } from '@/components/file-table/columns';
import MultiSelectToolbar from '@/components/file-table/multi-select-toolbar';
import Layout from '@/components/layout/layout';
import { DataTable } from '@/components/table/data-table';
import UploadButton from '@/components/upload-button';
import { useFileStore } from '@/stores/fileStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UploadedFilesScreen() {
  const navigate = useNavigate();
  const { files } = useFileStore();
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
                    loading={loading}
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
                onClick: () => {
                  // eslint-disable-next-line no-console
                  console.log('Convert');
                },
                variant: 'default',
                id: 'convert-button',
              },
            ],
          ]}
        >
          <>
            <AnimatePresence mode="wait">
              {loading && (
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
            <DataTable
              // eslint-disable-next-line react/no-unstable-nested-components
              multiSelectComponent={(table) => (
                <MultiSelectToolbar table={table} />
              )}
              columns={columns}
              data={files}
            />
          </>
        </Layout>
      )}
    </DropZone>
  );
}

export default UploadedFilesScreen;
