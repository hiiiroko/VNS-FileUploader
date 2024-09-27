import React from 'react';
import { formatDate } from '../utils/fileHelpers';

function FileList({ files, onDelete, onDownload }) {
  const truncateFileName = (name, maxLength = 30) => {
    if (name.length <= maxLength) return name;
    const extension = name.split('.').pop();
    const nameWithoutExtension = name.slice(0, -(extension.length + 1));
    return `${nameWithoutExtension.slice(0, maxLength - 3 - extension.length)}...${extension}`;
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">已上传文件</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">文件名</th>
              <th className="py-2 px-4 text-left">上传时间</th>
              <th className="py-2 px-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id} className="border-b">
                <td className="py-2 px-4">
                  <div className="group relative">
                    <span className="font-semibold" title={file.name}>{truncateFileName(file.name)}</span>
                    <div className="absolute left-0 -top-8 bg-white shadow-md p-2 rounded hidden group-hover:block z-10">
                      {file.name}
                    </div>
                  </div>
                </td>
                <td className="py-2 px-4 text-gray-600 text-sm">{formatDate(file.uploadedAt)}</td>
                <td className="py-2 px-4 text-right">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FileList;