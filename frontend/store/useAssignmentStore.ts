import { create } from 'zustand';
import { AssignmentFormData, Assignment } from '@/types/assignment.types';
import { GeneratedPaper } from '@/types/question.types';
import { GenerationStatus } from '@/types/api.types';

interface AssignmentStore {
  formData: Partial<AssignmentFormData>;
  uploadedFile: File | null;
  uploadedFileId: string | null;
  currentAssignmentId: string | null;
  jobId: string | null;
  generationStatus: GenerationStatus;
  progress: number;
  generatedPaper: GeneratedPaper | null;
  assignments: Assignment[];

  setFormData: (data: Partial<AssignmentFormData>) => void;
  setUploadedFile: (file: File | null) => void;
  setUploadedFileId: (id: string | null) => void;
  setCurrentAssignmentId: (id: string | null) => void;
  setJobId: (id: string | null) => void;
  setGenerationStatus: (status: GenerationStatus) => void;
  setProgress: (progress: number) => void;
  setGeneratedPaper: (paper: GeneratedPaper | null) => void;
  setAssignments: (assignments: Assignment[]) => void;
  reset: () => void;
}

const initialState = {
  formData: {},
  uploadedFile: null,
  uploadedFileId: null,
  currentAssignmentId: null,
  jobId: null,
  generationStatus: 'idle' as GenerationStatus,
  progress: 0,
  generatedPaper: null,
  assignments: [],
};

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  ...initialState,

  setFormData: (data) => set((s) => ({ formData: { ...s.formData, ...data } })),
  setUploadedFile: (file) => set({ uploadedFile: file }),
  setUploadedFileId: (id) => set({ uploadedFileId: id }),
  setCurrentAssignmentId: (id) => set({ currentAssignmentId: id }),
  setJobId: (id) => set({ jobId: id }),
  setGenerationStatus: (status) => set({ generationStatus: status }),
  setProgress: (progress) => set({ progress }),
  setGeneratedPaper: (paper) => set({ generatedPaper: paper }),
  setAssignments: (assignments) => set({ assignments }),
  reset: () => set(initialState),
}));
