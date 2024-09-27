import React, { useState } from 'react';
import UploadArea from './components/UploadArea';
import FileList from './components/FileList';
import ControlPanel from './components/ControlPanel';
import Toast from './components/Toast';
import { uploadFile, deleteFile, downloadFile } from './services/api';

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (files) => {
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    setIsUploading(true);
    for (const file of selectedFiles) {
      try {
        const uploadedFile = await uploadFile(file, (progress) => {
          setUploadProgress(progress);
        });
        setUploadedFiles((prev) => [...prev, uploadedFile]);
      } catch (error) {
        setToastMessage(`上传失败: ${error.message}`);
      }
    }
    setIsUploading(false);
    setSelectedFiles([]);
    setToastMessage('上传成功！');
  };

  const handleClear = () => {
    setSelectedFiles([]);
  };

  const handleDelete = async (fileId) => {
    try {
      await deleteFile(fileId);
      setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
      setToastMessage('文件已删除');
    } catch (error) {
      setToastMessage(`删除失败: ${error.message}`);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const blob = await downloadFile(fileId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setToastMessage(`下载失败: ${error.message}`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-4">
        <UploadArea onFileSelect={handleFileSelect} selectedFiles={selectedFiles} />
        <ControlPanel 
          onUpload={handleUpload} 
          onClear={handleClear} 
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          selectedFilesCount={selectedFiles.length}
        />
      </div>
      <div className="flex-1 p-4">
        <FileList 
          files={uploadedFiles} 
          onDelete={handleDelete} 
          onDownload={handleDownload} 
        />
      </div>
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
    </div>
  );
}

export default App;