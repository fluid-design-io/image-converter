import DropZone from '@/components/drop-zone';
import Layout from '@/components/layout/layout';
import UploadButton from '@/components/upload-button';
import { useNavigate } from 'react-router-dom';

function HomeScreen() {
  const navigate = useNavigate();
  const handleFilesAdded = () => {
    navigate('/uploaded');
  };
  return (
    <Layout title="Image Converter">
      <DropZone onFilesAdded={handleFilesAdded}>
        {(loading, handleUpload) => (
          <div className="flex flex-col gap-2 h-full items-center justify-center p-6 text-center text-sm text-muted-foreground border-dashed border-2 rounded-lg w-full">
            <span>Drag & drop your image here</span>
            <span>or</span>
            <UploadButton loading={loading} onUpload={handleUpload} />
          </div>
        )}
      </DropZone>
    </Layout>
  );
}

export default HomeScreen;
