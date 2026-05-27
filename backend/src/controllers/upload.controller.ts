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

import Groq from 'groq-sdk';

export const uploadAudio = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No audio uploaded' });
    return;
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: process.env.GROQ_AUDIO_MODEL || 'whisper-large-v3-turbo',
      response_format: 'json',
      language: 'en',
      prompt: 'This is a clear, English dictation of assignment instructions. Ignore any background noise, throat clearing, or filler words like um, uh.',
      temperature: 0,
    });

    // Optionally delete the temp audio file after transcribing
    fs.unlinkSync(req.file.path);

    res.json({ success: true, text: transcription.text });
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ success: false, message: 'Transcription failed' });
  }
};

export const deleteFile = async (req: Request, res: Response): Promise<void> => {
  const { fileId } = req.params;
  const filePath = path.join(process.cwd(), 'uploads', fileId);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  res.json({ success: true });
};
