import mongoose, { Schema, Document } from 'mongoose';
import { AssignmentConfig } from '../types';

export interface IAssignment extends Document {
  title: string;
  subject: string;
  dueDate: Date;
  questionTypes: string[];
  numberOfQuestions: number;
  marksPerQuestion: number;
  additionalInstructions?: string;
  fileId?: string;
  filePath?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  jobId?: string;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    dueDate: { type: Date, required: true },
    questionTypes: [{ type: String }],
    numberOfQuestions: { type: Number, required: true, min: 1 },
    marksPerQuestion: { type: Number, required: true, min: 1 },
    additionalInstructions: { type: String, trim: true },
    fileId: { type: String },
    filePath: { type: String },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    jobId: { type: String },
    error: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
