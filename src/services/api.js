import axios from 'axios';

const API_URL = 'http://localhost:5000'; // 假设后端运行在5000端口

export const uploadFiles = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(percentCompleted);
        // 这里可以更新上传进度
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
};