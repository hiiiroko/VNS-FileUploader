import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { Throttle } from 'stream-throttle';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

let uploadedFiles = [];

app.post('/upload', (req, res) => {
  let speedLimit = parseInt(req.headers['x-speed-limit']) || Infinity;
  
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

  const upload = multer({ storage: storage }).single('file');

  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const file = req.file;
    const fileInfo = {
      id: Date.now().toString(),
      name: file.originalname,
      path: file.path,
      size: file.size,
      uploadedAt: new Date(),
    };

    const readStream = fs.createReadStream(file.path);
    const throttle = new Throttle({ rate: speedLimit });
    const writeStream = fs.createWriteStream(file.path + '.throttled');

    readStream
      .pipe(throttle)
      .pipe(writeStream)
      .on('finish', () => {
        fs.unlinkSync(file.path);
        fs.renameSync(file.path + '.throttled', file.path);
        uploadedFiles.push(fileInfo);
        res.json(fileInfo);
      });
  });
});

app.get('/files', (req, res) => {
  res.json(uploadedFiles);
});

app.get('/files/:id', (req, res) => {
  const fileId = req.params.id;
  const speedLimit = parseInt(req.query.speedLimit) || Infinity;
  
  const file = uploadedFiles.find(file => file.id === fileId);
  if (file) {
    const stat = fs.statSync(file.path);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const fileStream = fs.createReadStream(file.path, { start, end });
      const throttle = new Throttle({ rate: speedLimit });
      
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'application/octet-stream',
      });
      
      fileStream.pipe(throttle).pipe(res);
    } else {
      const fileStream = fs.createReadStream(file.path);
      const throttle = new Throttle({ rate: speedLimit });
      
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'application/octet-stream',
      });
      
      fileStream.pipe(throttle).pipe(res);
    }
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

app.delete('/files/:id', (req, res) => {
  const fileId = req.params.id;
  const fileIndex = uploadedFiles.findIndex(file => file.id === fileId);
  
  if (fileIndex !== -1) {
    const file = uploadedFiles[fileIndex];
    fs.unlink(file.path, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error deleting file from server' });
      }
      uploadedFiles.splice(fileIndex, 1);
      res.json({ message: 'File deleted successfully' });
    });
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});