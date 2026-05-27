import {
  CreateAssignmentResponse,
  UploadFileResponse,
  AssignmentStatusResponse,
  AssignmentPaperResponse,
  AllAssignmentsResponse,
} from '@/types/api.types';
import { AssignmentFormData } from '@/types/assignment.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
};

export const uploadFile = (file: File): Promise<UploadFileResponse> => {
  const form = new FormData();
  form.append('file', file);
  return request<UploadFileResponse>('/api/upload', { method: 'POST', body: form });
};

export const createAssignment = (data: AssignmentFormData): Promise<CreateAssignmentResponse> =>
  request<CreateAssignmentResponse>('/api/assignments/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const getAllAssignments = (): Promise<AllAssignmentsResponse> =>
  request<AllAssignmentsResponse>('/api/assignments');

export const getAssignmentStatus = (id: string): Promise<AssignmentStatusResponse> =>
  request<AssignmentStatusResponse>(`/api/assignments/${id}/status`);

export const getAssignmentPaper = (id: string): Promise<AssignmentPaperResponse> =>
  request<AssignmentPaperResponse>(`/api/assignments/${id}/paper`);

export const regenerateAssignment = (id: string): Promise<CreateAssignmentResponse> =>
  request<CreateAssignmentResponse>(`/api/assignments/${id}/regenerate`, { method: 'POST' });

export const deleteAssignment = (id: string): Promise<{ success: boolean; message: string }> =>
  request<{ success: boolean; message: string }>(`/api/assignments/${id}`, { method: 'DELETE' });
