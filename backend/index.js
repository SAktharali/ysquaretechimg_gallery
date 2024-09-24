const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const ImageModal = require('./modals/ImageModal');

const app = express();

app.use(cors());
app.use('/uploads', express.static('uploads'));  // Serve uploaded images statically
app.use(express.json());

// Connect to MongoDB
const db = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/img_gallery', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB is connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};
db();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Route to upload image
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    const image = new ImageModal({
      name: req.file.filename,
      imageUrl: `/uploads/${req.file.filename}`,
    });
    await image.save();
    res.status(200).json({ message: 'Image uploaded successfully', image });
  } catch (err) {
    res.status(500).json({ error: 'Error uploading image' });
  }
});

// Route to get all images
app.get('/api/images', async (req, res) => {
  try {
    const images = await ImageModal.find();
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching images' });
  }
});

// Route to delete an image
app.delete('/api/delete/:id', async (req, res) => {
  try {
    const image = await ImageModal.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Remove image file from the uploads folder
    const filePath = path.join(__dirname, image.imageUrl);
    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error deleting file', err });
      }
    });

    // Delete image record from MongoDB
    await ImageModal.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting image' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
