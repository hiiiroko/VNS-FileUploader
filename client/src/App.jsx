// src/App.jsx

import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import UploadArea from './components/UploadArea';
import FileList from './components/FileList';
import ControlPanel from './components/ControlPanel';
import { uploadFile, deleteFile, downloadFile, getUploadedFiles } from './services/api';

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
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
      toast.error(`获取文件列表失败: ${error.message}`);
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
        toast.error(`上传失败: ${file.name} - ${error.message}`);
      }
    }

    setIsUploading(false);
    setSelectedFiles([]);
    setUploadProgress(0);
    toast((t) => (
      <span>
        上传完成: <b>{successCount}</b>/{totalFiles} 文件成功上传
        <button
          className="ml-2 inline-block h-8 rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          onClick={() => toast.dismiss(t.id)}
        >
          关闭
        </button>
      </span>
    ), { duration: null });
    fetchUploadedFiles();
  };

  const handleClear = () => {
    setSelectedFiles([]);
  };

  const handleDelete = async (fileId, fileName) => {
    try {
      await deleteFile(fileId);
      setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
      toast.success('文件已删除');
      setSelectedFiles((prev) => prev.filter((file) => file.name !== fileName));
    } catch (error) {
      toast.error(`删除失败: ${error.message}`);
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
      toast.error(`下载失败: ${error.message}`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-2/5 p-4">
        <UploadArea onFileSelect={handleFileSelect} selectedFiles={selectedFiles} />
        <ControlPanel
          onUpload={handleUpload}
          onClear={handleClear}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          selectedFilesCount={selectedFiles.length}
        />
      </div>
      <div className="w-3/5 p-4">
        <FileList
          files={uploadedFiles}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />
      </div>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
    </div>
  );
}

export default App;