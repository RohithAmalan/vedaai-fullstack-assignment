import { Assignment } from './assignment.types';
import { GeneratedPaper } from './question.types';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface CreateAssignmentResponse {
  success: boolean;
  assignmentId: string;
  jobId: string;
}

export interface UploadFileResponse {
  success: boolean;
  fileId: string;
  fileName: string;
  filePath: string;
  size: number;
}

export interface AssignmentStatusResponse {
  success: boolean;
  status: string;
  jobId?: string;
}

export interface AssignmentPaperResponse {
  success: boolean;
  paper: GeneratedPaper;
  assignment?: Assignment;
}

export interface AllAssignmentsResponse {
  success: boolean;
  assignments: Assignment[];
}

export type GenerationStatus = 'idle' | 'uploading' | 'generating' | 'completed' | 'failed';
