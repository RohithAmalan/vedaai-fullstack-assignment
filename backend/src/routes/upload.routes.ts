import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { uploadFile, deleteFile, uploadAudio } from '../controllers/upload.controller';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['.pdf', '.txt', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.webm'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext) || file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max for audio
});

const router = Router();

router.post('/', upload.single('file'), uploadFile);
router.post('/audio', upload.single('audio'), uploadAudio);
router.delete('/:fileId', deleteFile);

export default router;
