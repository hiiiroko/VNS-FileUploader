import React from 'react';

function UploadArea({ onFileSelect, selectedFiles }) {
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    onFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div 
      className="border-2 border-dashed border-gray-300 p-4 text-center"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <p>将文件拖到这里，或者</p>
      <input 
        type="file" 
        multiple 
        onChange={(e) => onFileSelect(Array.from(e.target.files))}
        className="hidden"
        id="fileInput"
      />
      <label htmlFor="fileInput" className="cursor-pointer text-blue-500">选择文件</label>
      {selectedFiles.length > 0 && (
        <ul className="mt-4 text-left">
          {selectedFiles.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UploadArea;