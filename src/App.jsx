import React from 'react';
import UploadArea from './components/UploadArea';
import FileList from './components/FileList';
import ControlPanel from './components/ControlPanel';
import Toast from './components/Toast';
import { uploadFiles } from './services/api';

function App() {
  const [selectedFiles, setSelectedFiles] = React.useState([]);
  const [uploadedFiles, setUploadedFiles] = React.useState([]);
  const [toastMessage, setToastMessage] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileSelect = (files) => {
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setToastMessage('请先选择文件');
      return;
    }
    setIsUploading(true);
    try {
      const result = await uploadFiles(selectedFiles);
      setUploadedFiles([...uploadedFiles, ...result.uploadedFiles]);
      setSelectedFiles([]);
      setToastMessage('上传成功！');
    } catch (error) {
      setToastMessage('上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setSelectedFiles([]);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-4">
        <UploadArea onFileSelect={handleFileSelect} selectedFiles={selectedFiles} />
        <ControlPanel onUpload={handleUpload} onClear={handleClear} isUploading={isUploading} />
      </div>
      <div className="flex-1 p-4">
        <FileList files={uploadedFiles} />
      </div>
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
    </div>
  );
}

export default App;