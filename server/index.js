// server/index.js

// 使用 CommonJS 语法导入模块
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const createHttpError = require('http-errors');
const asyncHandler = require('express-async-handler');
const helmet = require('helmet');
const logger = require('./utils/logger.js'); // 修改为 CommonJS 导入
const rateLimit = require('express-rate-limit');

// 移除 __filename 和 __dirname 的定义，因为它们在 CommonJS 中是全局可用的

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

// 设置文件上传大小限制
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 限制文件大小为 5MB
});

// 使用 helmet 中间件
app.use(helmet());

// 设置速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 限制每个 IP 15 分钟内最多 100 个请求
});
app.use(limiter); // 应用速率限制中间件

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

// 使用 CommonJS 导出
module.exports = app;
