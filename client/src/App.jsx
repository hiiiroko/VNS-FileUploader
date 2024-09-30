// client/src/App.jsx

import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import UploadArea from './components/UploadArea';
import FileList from './components/FileList';
import ControlPanel from './components/ControlPanel';
import { uploadFile, deleteFile, downloadFile, getUploadedFiles, checkServerConnection } from './services/api';

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isServerConnected, setIsServerConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await checkServerConnection();
        setIsServerConnected(connected);
        if (!connected) {
          console.error('Cannot connect to server. Make sure the server is running.');
          toast.error('无法连接到服务器。请确保服务器正在运行。');
        } else {
          console.log('Server connected successfully');
          await fetchUploadedFiles();
        }
      } catch (error) {
        console.error('Error checking server connection:', error);
        toast.error(`服务器连接检查失败: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    checkConnection();
    const interval = setInterval(checkConnection, 5000); // 每5秒检查一次连接
    return () => clearInterval(interval);
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      const files = await getUploadedFiles();
      setUploadedFiles(files);
    } catch (error) {
      console.error('Error fetching uploaded files:', error);
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
        console.error(`Upload failed for ${file.name}:`, error);
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

  const handleDelete = async (fileId) => {
    try {
      await deleteFile(fileId);
      setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
      toast.success('文件已删除');
    } catch (error) {
      console.error('Error deleting file:', error);
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
      console.error('Error downloading file:', error);
      toast.error(`下载失败: ${error.message}`);
    }
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isServerConnected) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <p className="mb-4 text-xl font-bold text-red-500">无法连接到服务器</p>
        <p>请检查您的连接并重试</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-2/5 p-4">
        <div className={`mb-4 p-2 rounded ${isServerConnected ? 'bg-green-100' : 'bg-red-100'}`}>
          服务器状态: {isServerConnected ? '已连接' : '未连接'}
        </div>
        <UploadArea onFileSelect={handleFileSelect} selectedFiles={selectedFiles} />
        <ControlPanel
          onUpload={handleUpload}
          onClear={handleClear}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          selectedFilesCount={selectedFiles.length}
          isServerConnected={isServerConnected}
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