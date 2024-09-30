// server/index.js

import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import createHttpError from 'http-errors';
import asyncHandler from 'express-async-handler';
import helmet from 'helmet';
import logger from './utils/logger.js'; // 添加 logger 导入

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// 确定上传目录
const uploadDir = path.join(__dirname, 'uploads');

// 确保上传目录存在
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

logger.info(`Upload directory: ${uploadDir}`);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // 使用 Buffer 来正确处理中文文件名
    const originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, Date.now() + '-' + originalname);
  },
});

const upload = multer({ storage: storage });

// 使用 helmet 中间件
app.use(helmet());

// 设置 CORS 选项
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions)); // 使用带有选项的 cors

app.use(express.json());

let uploadedFiles = [];

app.post('/upload', upload.single('file'), asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) {
    logger.warn('No file received');
    throw createHttpError(400, 'No file uploaded.');
  }
  // 使用 Buffer 来正确处理中文文件名
  const originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
  const fileInfo = {
    id: Date.now().toString(),
    name: originalname,
    path: file.path,
    size: file.size,
    uploadedAt: new Date(),
  };
  uploadedFiles.push(fileInfo);
  logger.info(`File uploaded: ${fileInfo.name}`);
  res.json(fileInfo);
}));

app.get('/files', asyncHandler(async (req, res) => {
  logger.info('Received request for file list');
  logger.info(`Sending file list: ${JSON.stringify(uploadedFiles)}`);
  res.json(uploadedFiles);
}));

app.delete('/files/:id', asyncHandler(async (req, res) => {
  const fileId = req.params.id;
  const fileIndex = uploadedFiles.findIndex((file) => file.id === fileId);
  if (fileIndex !== -1) {
    const file = uploadedFiles[fileIndex];
    fs.unlinkSync(file.path);
    uploadedFiles.splice(fileIndex, 1);
    res.json({ message: 'File deleted successfully' });
  } else {
    logger.warn('File not found');
    throw createHttpError(404, 'File not found');
  }
}));

app.get('/files/:id', asyncHandler(async (req, res) => {
  const fileId = req.params.id;
  const file = uploadedFiles.find((file) => file.id === fileId);
  if (file) {
    res.download(file.path, file.name);
  } else {
    logger.warn('File not found');
    throw createHttpError(404, 'File not found');
  }
}));

app.get('/', (req, res) => {
  res.send('Server is running');
});

const server = app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  logger.info('Shutting down server...');
  server.close(() => {
    logger.info('Server shut down');
    process.exit(0);
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  logger.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      message: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    },
  });
});

export default app;