// client/src/components/UploadArea.jsx

import React, { useRef } from 'react';
import { formatFileSize, formatDate } from '../utils/fileHelpers';

function UploadArea({ onFileSelect, selectedFiles }) {
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    onFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    onFileSelect(files);
  };

  return (
    <div 
      className="border-2 border-dashed border-gray-300 p-4 text-center rounded-lg h-96 flex flex-col justify-center items-center"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <p className="text-gray-600 mb-2">将文件拖到这里，或者</p>
      <input 
        type="file" 
        multiple 
        onChange={handleFileInputChange}
        className="hidden"
        ref={fileInputRef}
      />
      <button 
        onClick={() => fileInputRef.current.click()} 
        className="cursor-pointer text-blue-500 hover:text-blue-600"
      >
        选择文件
      </button>
      {selectedFiles.length > 0 && (
        <ul className="mt-4 text-left w-full overflow-y-auto max-h-64">
          {selectedFiles.map((file, index) => (
            <li key={index} className="mb-2 text-sm">
              <span className="font-semibold">{file.name}</span>
              <span className="text-gray-500 ml-2">({formatFileSize(file.size)})</span>
              <span className="text-gray-400 ml-2">{formatDate(new Date())}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UploadArea;