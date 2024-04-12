import { Toaster } from '@/components/ui/sonner';
import AddFileListener from '@/listeners/AddFileListener';
import HomeScreen from '@/screens/HomeScreen';
import UploadedFilesScreen from '@/screens/UploadedFilesScreen';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './globals.css';

export default function App() {
  return (
    <>
      <Router>
        <AddFileListener />
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/uploaded" element={<UploadedFilesScreen />} />
        </Routes>
      </Router>
      <Toaster position="top-center" richColors />
    </>
  );
}
