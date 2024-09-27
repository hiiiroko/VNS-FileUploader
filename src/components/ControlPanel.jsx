// src/components/ControlPanel.jsx

import React from 'react';

function ControlPanel({ onUpload, onClear, isUploading, uploadProgress, selectedFilesCount }) {
  return (
    <div className="mt-4">
      <div className="flex justify-between mb-2">
        <button 
          onClick={onUpload}
          disabled={isUploading || selectedFilesCount === 0}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            (isUploading || selectedFilesCount === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
        >
          {isUploading ? '上传中...' : '上传文件'}
        </button>
        <button 
          onClick={onClear}
          disabled={isUploading || selectedFilesCount === 0}
          className={`bg-orange-500 text-white px-4 py-2 rounded ${
            (isUploading || selectedFilesCount === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600'
          }`}
        >
          清空文件
        </button>
      </div>
      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{width: `${uploadProgress}%`}}
          ></div>
        </div>
      )}
      {selectedFilesCount > 0 && !isUploading && (
        <p className="text-sm text-gray-600">已选中 {selectedFilesCount} 个文件</p>
      )}
    </div>
  );
}

export default ControlPanel;