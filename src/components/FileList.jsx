import React from 'react';
import { formatDate } from '../utils/fileHelpers';

function FileList({ files, onDelete, onDownload }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">已上传文件</h2>
      <ul>
        {files.map((file) => (
          <li key={file.id} className="mb-2 flex items-center justify-between">
            <div>
              <span className="font-semibold">{file.name}</span>
              <span className="text-gray-400 ml-2 text-sm">{formatDate(file.uploadedAt)}</span>
            </div>
            <div>
              <button
                onClick={() => onDownload(file.id, file.name)}
                className="text-blue-500 hover:text-blue-600 mr-2"
              >
                下载
              </button>
              <button
                onClick={() => onDelete(file.id)}
                className="text-red-500 hover:text-red-600"
              >
                删除
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileList;