const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.array('files'), (req, res) => {
  res.json({ 
    message: 'Files uploaded successfully', 
    uploadedFiles: req.files.map(file => ({
      name: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype
    }))
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));