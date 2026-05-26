import mongoose, { Schema, Document } from 'mongoose';
import { GeneratedPaper } from '../types';

export interface IGeneratedPaper extends Document, GeneratedPaper {
  assignmentId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const QuestionSchema = new Schema({
  questionNumber: { type: Number, required: true },
  questionText: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  marks: { type: Number, required: true },
  type: { type: String, enum: ['MCQ', 'Short Answer', 'Long Answer'], required: true },
  options: [{ type: String }],
});

const SectionSchema = new Schema({
  sectionLabel: { type: String, required: true },
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  questions: [QuestionSchema],
});

const GeneratedPaperSchema = new Schema<IGeneratedPaper>(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
    studentInfo: {
      name: { type: String, default: '' },
      rollNumber: { type: String, default: '' },
      section: { type: String, default: '' },
    },
    sections: [SectionSchema],
    metadata: {
      totalQuestions: { type: Number, required: true },
      totalMarks: { type: Number, required: true },
      estimatedTime: { type: Number, required: true },
      subject: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IGeneratedPaper>('GeneratedPaper', GeneratedPaperSchema);
