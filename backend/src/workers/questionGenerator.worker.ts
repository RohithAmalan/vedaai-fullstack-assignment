import dotenv from 'dotenv';
dotenv.config();

import { Worker, Job } from 'bullmq';
import { redisConnection } from '../queues/questionQueue';
import { connectDB } from '../config/db';
import Assignment from '../models/Assignment.model';
import GeneratedPaper from '../models/GeneratedPaper.model';
import { generateQuestionPaper } from '../services/groqService';
import { extractTextFromFile } from '../services/pdfService';
import { emitToJob } from '../socket/socketServer';
import { JobPayload } from '../types';

const worker = new Worker<JobPayload>(
  'question-generation',
  async (job: Job<JobPayload>) => {
    const { assignmentId, config, fileText } = job.data;

    emitToJob(assignmentId, 'generation-started', { assignmentId, progress: 0 });
    await job.updateProgress(10);

    await Assignment.findByIdAndUpdate(assignmentId, { status: 'processing' });

    let extractedText = fileText;
    const assignment = await Assignment.findById(assignmentId);

    if (!extractedText && assignment?.filePath) {
      try {
        extractedText = await extractTextFromFile(assignment.filePath);
      } catch {
        extractedText = undefined;
      }
    }

    emitToJob(assignmentId, 'generation-progress', { assignmentId, progress: 30 });
    await job.updateProgress(30);

    const paper = await generateQuestionPaper(config, extractedText);

    emitToJob(assignmentId, 'generation-progress', { assignmentId, progress: 70 });
    await job.updateProgress(70);

    const existing = await GeneratedPaper.findOne({ assignmentId });
    let savedPaper;

    if (existing) {
      savedPaper = await GeneratedPaper.findByIdAndUpdate(
        existing._id,
        { ...paper, assignmentId },
        { new: true }
      );
    } else {
      savedPaper = await GeneratedPaper.create({ ...paper, assignmentId });
    }

    await Assignment.findByIdAndUpdate(assignmentId, { status: 'completed' });

    emitToJob(assignmentId, 'generation-progress', { assignmentId, progress: 100 });
    await job.updateProgress(100);

    emitToJob(assignmentId, 'generation-complete', {
      assignmentId,
      paperId: savedPaper?._id,
      paper,
    });

    return { success: true, paperId: savedPaper?._id };
  },
  { connection: redisConnection, concurrency: 3 }
);

worker.on('failed', async (job, err) => {
  if (job) {
    await Assignment.findByIdAndUpdate(job.data.assignmentId, { status: 'failed' });
    emitToJob(job.data.assignmentId, 'generation-failed', {
      assignmentId: job.data.assignmentId,
      error: err.message,
    });
  }
});

console.log('Question generation worker started');
