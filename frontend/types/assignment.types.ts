export type QuestionType = string;
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type AssignmentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface AssignmentFormData {
  title: string;
  subject: string;
  dueDate: string;
  questionTypes: QuestionType[];
  numberOfQuestions: number;
  marksPerQuestion: number;
  additionalInstructions?: string;
  classLevel?: string;
  fileId?: string;
}

export interface Assignment {
  _id: string;
  title: string;
  subject: string;
  dueDate: string;
  questionTypes: QuestionType[];
  numberOfQuestions: number;
  marksPerQuestion: number;
  additionalInstructions?: string;
  classLevel?: string;
  fileId?: string;
  status: AssignmentStatus;
  jobId?: string;
  createdAt: string;
  updatedAt: string;
}
