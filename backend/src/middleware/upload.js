const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Try to use Cloudinary if configured, otherwise use local storage
let upload;

try {
  const { uploadCloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
  
  if (isCloudinaryConfigured()) {
    // Use Cloudinary storage (for production)
    upload = uploadCloudinary;
    console.log('✅ Using Cloudinary for file uploads (Production mode)');
  } else {
    throw new Error('Cloudinary not configured, using local storage');
  }
} catch (error) {
  // Fallback to local storage (for development)
  console.log('ℹ️  Using local file storage (Development mode)');
  
  // Ensure uploads directory exists
  const uploadDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'report-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  };

  upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: fileFilter
  });
}

module.exports = upload;

