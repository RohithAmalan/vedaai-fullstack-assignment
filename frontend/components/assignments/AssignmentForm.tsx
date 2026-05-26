'use client';

import { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Upload, X, FileText, Plus, Minus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { uploadFile, createAssignment } from '@/services/api';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { QuestionType } from '@/types/assignment.types';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  questionTypes: z.array(z.string()).min(1, 'Select at least one question type'),
  numberOfQuestions: z.number().min(1, 'Must be at least 1').max(100, 'Max 100 questions'),
  marksPerQuestion: z.number().min(1, 'Must be at least 1'),
  additionalInstructions: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const QUESTION_TYPES: { value: QuestionType; label: string; desc: string }[] = [
  { value: 'MCQ', label: 'MCQ', desc: 'Multiple Choice' },
  { value: 'Short Answer', label: 'Short Answer', desc: '2–4 sentences' },
  { value: 'Long Answer', label: 'Long Answer', desc: 'Detailed response' },
];

export default function AssignmentForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number; id: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const { setCurrentAssignmentId, setJobId, setGenerationStatus } = useAssignmentStore();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      numberOfQuestions: 10,
      marksPerQuestion: 2,
      questionTypes: [],
    },
  });

  const questionTypes = watch('questionTypes');
  const numberOfQuestions = watch('numberOfQuestions');
  const marksPerQuestion = watch('marksPerQuestion');

  const handleFileUpload = async (file: File) => {
    const allowed = ['application/pdf', 'text/plain'];
    if (!allowed.includes(file.type) && !file.name.endsWith('.txt') && !file.name.endsWith('.pdf')) {
      return;
    }
    setUploading(true);
    try {
      const res = await uploadFile(file);
      setUploadedFile({ name: file.name, size: file.size, id: res.fileId });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    setGenerationStatus('generating');
    try {
      const res = await createAssignment({
        ...values,
        questionTypes: values.questionTypes as QuestionType[],
        fileId: uploadedFile?.id,
      });
      setCurrentAssignmentId(res.assignmentId);
      setJobId(res.jobId);
      router.push(`/assignments/${res.assignmentId}`);
    } catch {
      setGenerationStatus('failed');
      setSubmitting(false);
    }
  };

  const toggleQuestionType = (type: string) => {
    const current = questionTypes || [];
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    setValue('questionTypes', updated, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title & Subject row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Assignment Title <span className="text-red-500">*</span>
          </label>
          <input
            {...register('title')}
            placeholder="e.g. Physics Chapter 5 Test"
            className={cn(
              'w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors',
              'placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary',
              errors.title ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
            )}
          />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            {...register('subject')}
            placeholder="e.g. Physics, Mathematics"
            className={cn(
              'w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors',
              'placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary',
              errors.subject ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
            )}
          />
          {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Source Material <span className="text-gray-400 font-normal">(Optional — PDF or Text)</span>
        </label>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFileUpload(file);
          }}
          onClick={() => fileRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors',
            dragOver ? 'border-primary bg-orange-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          )}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={24} className="text-primary animate-spin" />
              <p className="text-sm text-gray-500">Uploading file...</p>
            </div>
          ) : uploadedFile ? (
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <FileText size={18} className="text-red-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-400">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <Upload size={18} className="text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Drag & drop or <span className="text-primary">browse</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">PDF or TXT, max 10MB</p>
              </div>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.txt"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }}
        />
      </div>

      {/* Due Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Due Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          {...register('dueDate')}
          min={new Date().toISOString().split('T')[0]}
          className={cn(
            'w-full md:w-64 px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors',
            'focus:ring-2 focus:ring-primary/20 focus:border-primary',
            errors.dueDate ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
          )}
        />
        {errors.dueDate && <p className="mt-1 text-xs text-red-500">{errors.dueDate.message}</p>}
      </div>

      {/* Question Types */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Types <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {QUESTION_TYPES.map(({ value, label, desc }) => {
            const selected = questionTypes?.includes(value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleQuestionType(value)}
                className={cn(
                  'flex flex-col items-start px-4 py-3 rounded-xl border-2 text-left transition-all min-w-[130px]',
                  selected
                    ? 'border-primary bg-orange-50 text-primary'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                )}
              >
                <span className="text-sm font-semibold">{label}</span>
                <span className={cn('text-xs mt-0.5', selected ? 'text-primary/70' : 'text-gray-400')}>{desc}</span>
              </button>
            );
          })}
        </div>
        {errors.questionTypes && (
          <p className="mt-1.5 text-xs text-red-500">{errors.questionTypes.message as string}</p>
        )}
      </div>

      {/* Number of Questions & Marks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Number of Questions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Number of Questions <span className="text-red-500">*</span>
          </label>
          <Controller
            name="numberOfQuestions"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => field.onChange(Math.max(1, field.value - 1))}
                  className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <input
                  type="number"
                  value={field.value}
                  onChange={(e) => field.onChange(Math.max(1, Number(e.target.value)))}
                  min={1}
                  max={100}
                  className={cn(
                    'w-20 text-center px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors',
                    'focus:ring-2 focus:ring-primary/20 focus:border-primary',
                    errors.numberOfQuestions ? 'border-red-400' : 'border-gray-300'
                  )}
                />
                <button
                  type="button"
                  onClick={() => field.onChange(Math.min(100, field.value + 1))}
                  className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            )}
          />
          {errors.numberOfQuestions && (
            <p className="mt-1 text-xs text-red-500">{errors.numberOfQuestions.message}</p>
          )}
        </div>

        {/* Marks per Question */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Marks per Question <span className="text-red-500">*</span>
          </label>
          <Controller
            name="marksPerQuestion"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => field.onChange(Math.max(1, field.value - 1))}
                  className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <input
                  type="number"
                  value={field.value}
                  onChange={(e) => field.onChange(Math.max(1, Number(e.target.value)))}
                  min={1}
                  className={cn(
                    'w-20 text-center px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors',
                    'focus:ring-2 focus:ring-primary/20 focus:border-primary',
                    errors.marksPerQuestion ? 'border-red-400' : 'border-gray-300'
                  )}
                />
                <button
                  type="button"
                  onClick={() => field.onChange(field.value + 1)}
                  className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            )}
          />
          {errors.marksPerQuestion && (
            <p className="mt-1 text-xs text-red-500">{errors.marksPerQuestion.message}</p>
          )}
        </div>
      </div>

      {/* Total marks preview */}
      <div className="flex items-center gap-2 px-4 py-3 bg-orange-50 rounded-lg border border-orange-100">
        <span className="text-sm text-gray-600">Total Marks:</span>
        <span className="text-sm font-bold text-primary">
          {(numberOfQuestions || 0) * (marksPerQuestion || 0)}
        </span>
        <span className="text-gray-400 mx-1">·</span>
        <span className="text-sm text-gray-600">Estimated Time:</span>
        <span className="text-sm font-bold text-gray-700">
          {(numberOfQuestions || 0) * 2} mins
        </span>
      </div>

      {/* Additional Instructions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Additional Instructions{' '}
          <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <textarea
          {...register('additionalInstructions')}
          rows={3}
          placeholder="e.g. Focus on Chapter 3-5, include diagram-based questions..."
          className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none transition-colors placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={submitting}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all',
            submitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-primary-dark active:scale-95'
          )}
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generating...
            </>
          ) : (
            '✦  Generate Question Paper'
          )}
        </button>
      </div>
    </form>
  );
}
