import express from 'express';
import multer from 'multer';
import cors from 'cors';
// import path from 'path';
import fs from 'fs';
import process from 'process';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

const uploadedFiles = [];

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const fileInfo = {
    id: Date.now().toString(),
    name: file.originalname,
    path: file.path,
    size: file.size,
    uploadedAt: new Date(),
  };
  uploadedFiles.push(fileInfo);
  res.json(fileInfo);
});

app.delete('/files/:id', (req, res) => {
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

app.get('/files/:id', (req, res) => {
  const fileId = req.params.id;
  const file = uploadedFiles.find(file => file.id === fileId);
  if (file) {
    res.download(file.path, file.name);
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});