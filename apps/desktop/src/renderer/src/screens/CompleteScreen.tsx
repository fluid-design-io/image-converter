import Layout from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/typography';
import { Check, ChevronLeft, FolderIcon, Home } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

function CompleteScreen() {
  const { path } = useParams();
  const navigate = useNavigate();
  const handleOpenFolder = () => {
    if (!path) return;
    window.electron.ipcRenderer.emit('open-directory', path);
  };
  return (
    <Layout
      title="Conversion Complete"
      buttonGroups={[
        [
          {
            title: 'Home',
            onClick: () => navigate('/'),
            type: 'button',
            icon: Home,
          },
        ],
      ]}
    >
      <div className="flex flex-1 flex-col gap-4 items-center justify-center p-6 text-center text-sm text-muted-foreground">
        <div className="p-4 shadow-sm bg-green-600 dark:bg-green-400 rounded-full">
          <Check className="size-12 text-white" />
        </div>
        <Text>Your images have been converted successfully</Text>
        <Button onClick={handleOpenFolder} variant="default">
          <FolderIcon className="mr-2 size-4" />
          View Converted Images
        </Button>
        <Button variant="link" onClick={() => navigate('/')}>
          <ChevronLeft className="size-4 ml-2" />
          Back to Home
        </Button>
      </div>
    </Layout>
  );
}

export default CompleteScreen;
