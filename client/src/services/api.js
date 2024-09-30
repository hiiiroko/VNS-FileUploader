// src/services/api.js

import axios from 'axios';

// 根据环境变量设置 API URL
const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000'
  : 'http://localhost:3000';

// 创建一个带有默认配置的 axios 实例
const api = axios.create({
  baseURL: API_URL,
  timeout: 5000, // 5 seconds timeout
});

// 处理 API 错误的函数
const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    throw new Error(error.response.data.message || 'Server error');
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error('No response from server. Please try again later.');
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new Error('Error setting up the request. Please try again.');
  }
};

export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      },
    });
    console.log('Upload response:', response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteFile = async (fileId) => {
  try {
    const response = await api.delete(`/files/${fileId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const downloadFile = async (fileId) => {
  try {
    const response = await api.get(`/files/${fileId}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getUploadedFiles = async () => {
  try {
    const response = await api.get('/files');
    console.log('Get files response:', response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};