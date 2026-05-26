import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import Assignment from '../models/Assignment.model';

export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No file uploaded' });
    return;
  }

  res.json({
    success: true,
    fileId: req.file.filename,
    fileName: req.file.originalname,
    filePath: req.file.path,
    size: req.file.size,
  });
};

export const deleteFile = async (req: Request, res: Response): Promise<void> => {
  const { fileId } = req.params;
  const filePath = path.join(process.cwd(), 'uploads', fileId);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  res.json({ success: true });
};
