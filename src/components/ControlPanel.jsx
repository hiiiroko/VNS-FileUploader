import React from 'react';

function ControlPanel({ onUpload, onClear, isUploading }) {
  return (
    <div className="mt-4 flex justify-between">
      <button 
        onClick={onUpload}
        className={`bg-blue-500 text-white px-4 py-2 rounded ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isUploading}
      >
        {isUploading ? '上传中...' : '上传文件'}
      </button>
      <button 
        onClick={onClear}
        className="bg-orange-500 text-white px-4 py-2 rounded"
        disabled={isUploading}
      >
        清空文件
      </button>
    </div>
  );
}

export default ControlPanel;