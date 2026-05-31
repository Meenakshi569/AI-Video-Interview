import multer from 'multer';
import { AppError } from './error.middleware.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype?.startsWith('video/') || file.mimetype?.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new AppError('Only video or audio files are allowed', 400), false);
  }
};

export const uploadRecording = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter,
}).single('recording');
