import axios from 'axios';

const API_URL = 'http://localhost:3000'; // 假定服务器运行在3000端口

export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }, // 直接定义常用的header
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted); // 调用传入的回调函数来处理进度
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error; // 记录错误后继续抛出
  }
};

export const deleteFile = async (fileId) => {
  try {
    const response = await axios.delete(`${API_URL}/files/${fileId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error; // 记录错误后继续抛出
  }
};

export const downloadFile = async (fileId) => {
  try {
    const response = await axios.get(`${API_URL}/files/${fileId}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error; // 记录错误后继续抛出
  }
};