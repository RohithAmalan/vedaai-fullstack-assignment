import { Request, Response } from 'express';
import Assignment from '../models/Assignment.model';
import GeneratedPaper from '../models/GeneratedPaper.model';
import { questionGenerationQueue } from '../queues/questionQueue';
import { emitToJob } from '../socket/socketServer';

export const createAssignment = async (req: Request, res: Response): Promise<void> => {
  const {
    title, subject, dueDate, questionTypes,
    numberOfQuestions, marksPerQuestion, additionalInstructions, fileId,
  } = req.body;

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
    status: 'pending',
  });

  const job = await questionGenerationQueue.add(
    'generate-questions',
    {
      assignmentId: String(assignment._id),
      config: {
        title,
        subject,
        dueDate,
        questionTypes,
        numberOfQuestions: Number(numberOfQuestions),
        marksPerQuestion: Number(marksPerQuestion),
        additionalInstructions,
        fileId,
      },
    },
    { jobId: `assignment-${assignment._id}` }
  );

  await Assignment.findByIdAndUpdate(assignment._id, { jobId: String(job.id) });

  emitToJob(String(assignment._id), 'assignment-created', {
    assignmentId: String(assignment._id),
    jobId: job.id,
  });

  res.status(201).json({
    success: true,
    assignmentId: assignment._id,
    jobId: job.id,
  });
};

export const getAssignmentStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const assignment = await Assignment.findById(id).lean();

  if (!assignment) {
    res.status(404).json({ success: false, message: 'Assignment not found' });
    return;
  }

  res.json({ success: true, status: assignment.status, jobId: assignment.jobId });
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

  const job = await questionGenerationQueue.add(
    'generate-questions',
    {
      assignmentId: id,
      config: {
        title: assignment.title,
        subject: assignment.subject,
        dueDate: assignment.dueDate.toISOString(),
        questionTypes: assignment.questionTypes as ('MCQ' | 'Short Answer' | 'Long Answer')[],
        numberOfQuestions: assignment.numberOfQuestions,
        marksPerQuestion: assignment.marksPerQuestion,
        additionalInstructions: assignment.additionalInstructions,
        fileId: assignment.fileId,
      },
    },
    { jobId: `assignment-${id}-regen-${Date.now()}` }
  );

  res.json({ success: true, jobId: job.id });
};
