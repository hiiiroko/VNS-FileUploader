// server/index.js

import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { app } from 'electron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createServer() {
  const expressApp = express();
  
  // 确定上传目录
  const uploadDir = app.isPackaged 
    ? path.join(process.resourcesPath, 'uploads')
    : path.join(__dirname, 'uploads');

  // 确保上传目录存在
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  console.log(`Upload directory: ${uploadDir}`);

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
      // 使用 Buffer 来正确处理中文文件名
      const originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
      cb(null, Date.now() + '-' + originalname)
    }
  });

  const upload = multer({ storage: storage });

  expressApp.use(cors());
  expressApp.use(express.json());

  let uploadedFiles = [];

  expressApp.post('/upload', upload.single('file'), (req, res) => {
    console.log('Received upload request');
    const file = req.file;
    if (!file) {
      console.log('No file received');
      return res.status(400).send('No file uploaded.');
    }
    // 使用 Buffer 来正确处理中文文件名
    const originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    console.log(`File received: ${originalname}`);
    const fileInfo = {
      id: Date.now().toString(),
      name: originalname,
      path: file.path,
      size: file.size,
      uploadedAt: new Date(),
    };
    uploadedFiles.push(fileInfo);
    console.log(`File info added to list: ${JSON.stringify(fileInfo)}`);
    res.json(fileInfo);
  });

  expressApp.get('/files', (req, res) => {
    console.log('Received request for file list');
    console.log(`Sending file list: ${JSON.stringify(uploadedFiles)}`);
    res.json(uploadedFiles);
  });

  expressApp.delete('/files/:id', (req, res) => {
    const fileId = req.params.id;
    const fileIndex = uploadedFiles.findIndex(file => file.id === fileId);
    if (fileIndex !== -1) {
      const file = uploadedFiles[fileIndex];
      fs.unlinkSync(file.path);
      uploadedFiles.splice(fileIndex, 1);
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  });

  expressApp.get('/files/:id', (req, res) => {
    const fileId = req.params.id;
    const file = uploadedFiles.find(file => file.id === fileId);
    if (file) {
      res.download(file.path, file.name);
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  });

  return expressApp;
}

// 如果直接运行此文件，启动服务器
if (import.meta.url === `file://${process.argv[1]}`) {
  const PORT = process.env.PORT || 3000;
  const app = createServer();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}