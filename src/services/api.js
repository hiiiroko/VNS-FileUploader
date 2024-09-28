import axios from 'axios';

const API_URL = 'http://localhost:3000';

const handleApiError = (error) => {
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
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteFile = async (fileId) => {
  try {
    const response = await axios.delete(`${API_URL}/files/${fileId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const downloadFile = async (fileId) => {
  try {
    const response = await axios.get(`${API_URL}/files/${fileId}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getUploadedFiles = async () => {
  try {
    const response = await axios.get(`${API_URL}/files`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};