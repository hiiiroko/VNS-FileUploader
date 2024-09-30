// client/src/services/api.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    throw new Error(error.response.data.message || 'Server error');
  } else if (error.request) {
    throw new Error('No response from server. Please check if the server is running.');
  } else {
    throw new Error('Error setting up the request. Please try again.');
  }
};

export const checkServerConnection = async () => {
  try {
    await api.get('/');
    return true;
  } catch (error) {
    console.error('Server connection check failed:', error);
    return false;
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