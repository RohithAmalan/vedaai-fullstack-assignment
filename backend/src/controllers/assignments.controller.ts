import { Request, Response } from 'express';
import Assignment from '../models/Assignment.model';
import GeneratedPaper from '../models/GeneratedPaper.model';
import { emitToJob } from '../socket/socketServer';
import { generateQuestionPaper } from '../services/groqService';
import { extractTextFromFile } from '../services/pdfService';
import path from 'path';
import os from 'os';
import fs from 'fs';

const processGenerationAsync = async (assignmentId: string, config: any) => {
  try {
    // Wait 2 seconds to ensure the frontend has time to connect to the WebSocket after page load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    emitToJob(assignmentId, 'generation-started', { assignmentId, progress: 0 });
    await Assignment.findByIdAndUpdate(assignmentId, { status: 'processing' });

    const assignmentDoc = await Assignment.findById(assignmentId).lean();
    const extractedText = assignmentDoc?.fileContext;

    emitToJob(assignmentId, 'generation-progress', { assignmentId, progress: 30 });
    const paper = await generateQuestionPaper(config, extractedText);

    emitToJob(assignmentId, 'generation-progress', { assignmentId, progress: 70 });
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
    emitToJob(assignmentId, 'generation-complete', {
      assignmentId,
      paperId: savedPaper?._id,
      paper,
    });
  } catch (err: any) {
    console.error('Generation Failed:', err);
    await Assignment.findByIdAndUpdate(assignmentId, { 
      status: 'failed', 
      error: err.message || 'Unknown error' 
    });
    emitToJob(assignmentId, 'generation-failed', {
      assignmentId,
      error: err.message,
    });
  }
};

export const createAssignment = async (req: Request, res: Response): Promise<void> => {
  const {
    title, subject, dueDate, questionTypes,
    numberOfQuestions, marksPerQuestion, additionalInstructions, fileId,
  } = req.body;

  let extractedText;
  if (fileId) {
    const files = fs.readdirSync(os.tmpdir());
    const matchingFile = files.find(f => f.startsWith(fileId));
    if (matchingFile) {
      try {
        extractedText = await extractTextFromFile(path.join(os.tmpdir(), matchingFile));
      } catch {
        extractedText = undefined;
      }
    }
  }

  const assignment = await Assignment.create({
    title,
    subject,
    dueDate: new Date(dueDate),
    questionTypes,
    numberOfQuestions: Number(numberOfQuestions),
    marksPerQuestion: Number(marksPerQuestion),
    additionalInstructions,
    fileId,
    filePath: fileId ? `uploads/${fileId}` : undefined,
    fileContext: extractedText,
    status: 'pending',
  });

  const assignmentIdStr = String(assignment._id);
  const jobId = `job-${Date.now()}`;
  
  processGenerationAsync(assignmentIdStr, {
    title, subject, dueDate, questionTypes,
    numberOfQuestions: Number(numberOfQuestions),
    marksPerQuestion: Number(marksPerQuestion),
    additionalInstructions, fileId,
  });

  await Assignment.findByIdAndUpdate(assignment._id, { jobId });

  emitToJob(assignmentIdStr, 'assignment-created', {
    assignmentId: assignmentIdStr,
    jobId,
  });

  res.status(201).json({
    success: true,
    assignmentId: assignment._id,
    jobId,
  });
};

export const getAssignmentStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const assignment = await Assignment.findById(id).lean();

  if (!assignment) {
    res.status(404).json({ success: false, message: 'Assignment not found' });
    return;
  }

  res.json({ success: true, status: assignment.status, jobId: assignment.jobId, error: assignment.error });
};

export const getAssignmentPaper = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const paper = await GeneratedPaper.findOne({ assignmentId: id }).lean();
  const assignment = await Assignment.findById(id).lean();

  if (!paper) {
    res.status(404).json({ success: false, message: 'Paper not found' });
    return;
  }

  res.json({ success: true, paper, assignment });
};

export const deleteAssignment = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const assignment = await Assignment.findByIdAndDelete(id);

  if (!assignment) {
    res.status(404).json({ success: false, message: 'Assignment not found' });
    return;
  }

  await GeneratedPaper.deleteMany({ assignmentId: id });

  res.json({ success: true, message: 'Assignment deleted' });
};

export const getAllAssignments = async (_req: Request, res: Response): Promise<void> => {
  const assignments = await Assignment.find().sort({ createdAt: -1 }).lean();
  res.json({ success: true, assignments });
};

export const regenerateAssignment = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const assignment = await Assignment.findById(id).lean();

  if (!assignment) {
    res.status(404).json({ success: false, message: 'Assignment not found' });
    return;
  }

  await Assignment.findByIdAndUpdate(id, { status: 'pending' });

  const jobId = `job-${Date.now()}`;
  
  processGenerationAsync(id, {
    title: assignment.title,
    subject: assignment.subject,
    dueDate: assignment.dueDate.toISOString(),
    questionTypes: assignment.questionTypes,
    numberOfQuestions: assignment.numberOfQuestions,
    marksPerQuestion: assignment.marksPerQuestion,
    additionalInstructions: assignment.additionalInstructions,
    fileId: assignment.fileId,
  });

  res.json({ success: true, jobId });
};
