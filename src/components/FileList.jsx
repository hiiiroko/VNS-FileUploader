import React from 'react';

function FileList({ files }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">已上传文件</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index} className="mb-2">
            <span>{file.name}</span>
            {/* 占位符：这里将来会添加删除和下载按钮 */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileList;