import { Difficulty, QuestionType } from './assignment.types';

export interface Question {
  questionNumber: number;
  questionText: string;
  difficulty: Difficulty;
  marks: number;
  type: QuestionType;
  options?: string[];
}

export interface Section {
  sectionLabel: string;
  title: string;
  instruction: string;
  questions: Question[];
}

export interface StudentInfo {
  name: string;
  rollNumber: string;
  section: string;
}

export interface PaperMetadata {
  totalQuestions: number;
  totalMarks: number;
  estimatedTime: number;
  subject: string;
}

export interface GeneratedPaper {
  _id?: string;
  assignmentId?: string;
  studentInfo: StudentInfo;
  sections: Section[];
  metadata: PaperMetadata;
  createdAt?: string;
}
