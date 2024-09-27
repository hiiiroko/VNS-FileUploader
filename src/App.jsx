// App.jsx

import React, { useState, useEffect } from 'react';
import UploadArea from './components/UploadArea';
import FileList from './components/FileList';
import ControlPanel from './components/ControlPanel';
import Toast from './components/Toast';
import { uploadFile, deleteFile, downloadFile, getUploadedFiles } from './services/api';

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      const files = await getUploadedFiles();
      setUploadedFiles(files);
    } catch (error) {
      setToastMessage(`获取文件列表失败: ${error.message}`);
    }
  };

  const handleFileSelect = (files) => {
    const newFiles = files.filter(file => 
      !uploadedFiles.some(uploadedFile => uploadedFile.name === file.name) &&
      !selectedFiles.some(selectedFile => selectedFile.name === file.name)
    );
    setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const handleUpload = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    let successCount = 0;
    let totalFiles = selectedFiles.length;

    for (const file of selectedFiles) {
      try {
        const uploadedFile = await uploadFile(file, (progress) => {
          setUploadProgress(Math.round((successCount + progress / 100) / totalFiles * 100));
        });
        setUploadedFiles((prev) => [...prev, uploadedFile]);
        successCount++;
      } catch (error) {
        setToastMessage(`上传失败: ${file.name} - ${error.message}`);
      }
    }

    setIsUploading(false);
    setSelectedFiles([]);
    setUploadProgress(0);
    setToastMessage(`上传完成: ${successCount}/${totalFiles} 文件成功上传`);
    fetchUploadedFiles(); // Refresh the uploaded files list
  };

  const handleClear = () => {
    setSelectedFiles([]);
  };

  const handleDelete = async (fileId, fileName) => {
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
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
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
