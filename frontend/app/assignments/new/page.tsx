'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, X, CalendarPlus, Mic, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import MobileNav from '@/components/layout/MobileNav';
import { uploadFile, createAssignment } from '@/services/api';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { cn } from '@/lib/utils';

/* ─── Question type options ─────────────────────────────────────── */
const Q_TYPE_OPTIONS = [
  { label: 'Multiple Choice Questions', value: 'MCQ' },
  { label: 'Short Questions', value: 'Short Answer' },
  { label: 'Long Questions', value: 'Long Answer' },
  { label: 'Diagram/Graph-Based Questions', value: 'Short Answer' },
  { label: 'Numerical Problems', value: 'Short Answer' },
  { label: 'Essay Questions', value: 'Long Answer' },
] as const;

interface QRow {
  id: string;
  label: string;
  backendType: string;
  count: number;
  marks: number;
  dropdownOpen: boolean;
}

const makeRow = (id: string): QRow => ({
  id,
  label: 'Multiple Choice Questions',
  backendType: 'MCQ',
  count: 4,
  marks: 1,
  dropdownOpen: false,
});

/* ─── Stepper ────────────────────────────────────────────────────── */
function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-0">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-lg font-light"
      >
        −
      </button>
      <span className="w-7 text-center text-[14px] font-semibold text-gray-900">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-lg font-light"
      >
        +
      </button>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────── */
export default function NewAssignmentPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number; id: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [rows, setRows] = useState<QRow[]>([makeRow('1'), { ...makeRow('2'), label: 'Short Questions', backendType: 'Short Answer', count: 3, marks: 2, dropdownOpen: false }]);
  
  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const { setCurrentAssignmentId, setJobId, setGenerationStatus } = useAssignmentStore();

  const totalQuestions = rows.reduce((s, r) => s + r.count, 0);
  const totalMarks = rows.reduce((s, r) => s + r.count * r.marks, 0);

  /* Audio Recording Logic */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setIsTranscribing(true);
        
        try {
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/upload/audio`, {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();
          if (data.success && data.text) {
            setAdditionalInfo((prev) => (prev ? prev + ' ' + data.text : data.text));
          }
        } catch (error) {
          console.error('Transcription failed:', error);
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied or error:', err);
      alert('Could not access microphone.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  /* File upload */
  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const res = await uploadFile(file);
      setUploadedFile({ name: file.name, size: file.size, id: res.fileId });
    } finally {
      setUploading(false);
    }
  };

  /* Row helpers */
  const addRow = () => setRows((r) => [...r, makeRow(String(Date.now()))]);
  const removeRow = (id: string) => setRows((r) => r.filter((x) => x.id !== id));

  const updateCount = (id: string, delta: number) =>
    setRows((r) => r.map((x) => (x.id === id ? { ...x, count: Math.max(1, x.count + delta) } : x)));
  const setCount = (id: string, v: number) =>
    setRows((r) => r.map((x) => (x.id === id ? { ...x, count: v } : x)));

  const updateMarks = (id: string, delta: number) =>
    setRows((r) => r.map((x) => (x.id === id ? { ...x, marks: Math.max(1, x.marks + delta) } : x)));
  const setMarks = (id: string, v: number) =>
    setRows((r) => r.map((x) => (x.id === id ? { ...x, marks: v } : x)));

  const toggleDropdown = (id: string) =>
    setRows((r) => r.map((x) => (x.id === id ? { ...x, dropdownOpen: !x.dropdownOpen } : { ...x, dropdownOpen: false })));

  const selectType = (id: string, opt: typeof Q_TYPE_OPTIONS[number]) =>
    setRows((r) => r.map((x) => (x.id === id ? { ...x, label: opt.label, backendType: opt.value, dropdownOpen: false } : x)));

  /* Submit */
  const handleNext = async () => {
    if (!title || !subject || !dueDate || rows.length === 0) return;
    setSubmitting(true);
    setGenerationStatus('generating');

    const breakdown = rows.map((r) => `${r.count} ${r.label} (${r.marks} mark${r.marks > 1 ? 's' : ''} each)`).join(', ');
    const instructions = [`Generate: ${breakdown}.`, additionalInfo].filter(Boolean).join(' ');

    try {
      const types = rows.map((r) => r.label);
      const res = await createAssignment({
        title,
        subject,
        dueDate,
        questionTypes: types,
        numberOfQuestions: totalQuestions,
        marksPerQuestion: Math.round(totalMarks / Math.max(totalQuestions, 1)),
        additionalInstructions: instructions,
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

  return (
    <div className="flex min-h-screen w-full bg-[#EBEBEB] overflow-x-hidden">
      <Sidebar />

      <div className="flex-1 min-w-0 lg:ml-[290px] flex flex-col min-h-screen">
        <TopBar title="Assignment" showBack={true} />

        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8 pb-32">
          <div className="max-w-4xl mx-auto">
            {/* Page heading */}
            <div className="flex items-center gap-2 mb-1">
              <div className="relative flex items-center justify-center w-[18px] h-[18px]">
                <div className="absolute w-full h-full bg-green-200 rounded-full opacity-60" />
                <div className="w-[8px] h-[8px] bg-green-500 rounded-full z-10" />
              </div>
              <h1 className="text-[18px] lg:text-[20px] font-bold text-gray-900 tracking-tight">Create Assignment</h1>
            </div>
            <p className="text-[13px] text-gray-400 mb-6">Set up a new assignment for your students</p>

            {/* Progress bar */}
            <div className="w-[80%] h-[3px] bg-gray-200 rounded-full mb-8">
              <div className="h-full w-[45%] bg-gray-600 rounded-full" />
            </div>

            {/* Main card */}
            <div className="bg-[#F8F9FA] rounded-[24px] lg:rounded-[32px] w-full shadow-sm border border-gray-100">
              <div className="px-5 lg:px-10 pt-6 lg:pt-8 pb-8 lg:pb-10">
                {/* Card heading */}
                <h2 className="text-[16px] lg:text-[18px] font-bold text-gray-900 mb-0.5">Assignment Details</h2>
                <p className="text-[12px] lg:text-[13px] text-gray-500 mb-6 lg:mb-8">Basic information about your assignment</p>

                {/* Assignment Name & Subject */}
                <div className="flex flex-col sm:flex-row gap-5 mb-8">
                  <div className="flex-1">
                    <label className="block text-[13.5px] font-bold text-gray-900 mb-2">Assignment Name</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Model Exam 1"
                      className="w-full px-5 py-3.5 rounded-[20px] bg-white border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] text-[13.5px] outline-none focus:border-gray-300 transition-colors placeholder:text-gray-400 text-gray-900"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[13.5px] font-bold text-gray-900 mb-2">Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. English"
                      className="w-full px-5 py-3.5 rounded-[20px] bg-white border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] text-[13.5px] outline-none focus:border-gray-300 transition-colors placeholder:text-gray-400 text-gray-900"
                    />
                  </div>
                </div>

              {/* File upload zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                onClick={() => !uploadedFile && fileRef.current?.click()}
                className={cn(
                  'border-2 border-dashed rounded-[24px] py-14 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all bg-white',
                  dragOver ? 'border-gray-400 bg-gray-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50',
                  uploadedFile && 'cursor-default'
                )}
              >
                {uploading ? (
                  <><Loader2 size={28} className="text-gray-400 animate-spin" /><p className="text-[13px] text-gray-500">Uploading…</p></>
                ) : uploadedFile ? (
                  <>
                    <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-lg">📄</div>
                      <div>
                        <p className="text-[13.5px] font-semibold text-gray-800 max-w-[250px] truncate">{uploadedFile.name}</p>
                        <p className="text-[11.5px] text-gray-400">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                        className="p-1.5 ml-3 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Cloud upload icon */}
                    <svg width="40" height="36" viewBox="0 0 40 36" fill="none" className="text-gray-700 mb-1">
                      <path d="M20 26V14M20 14L15 19M20 14L25 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 29.5C6.134 29.5 3 26.366 3 22.5C3 19.134 5.274 16.306 8.376 15.664C8.131 14.935 8 14.154 8 13.375C8 9.372 11.134 6.125 15 6.125C16.302 6.125 17.519 6.5 18.548 7.147C19.871 4.682 22.495 3 25.5 3C30.194 3 34 6.806 34 11.5C34 11.723 33.99 11.944 33.97 12.162C36.846 13.142 39 15.87 39 19.125C39 23.129 35.866 26.375 32 26.375H30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className="text-center">
                      <p className="text-[14px] font-semibold text-gray-800">Choose a file or drag &amp; drop it here</p>
                      <p className="text-[12px] text-gray-400 mt-1">JPEG, PNG, upto 10MB</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                      className="mt-3 px-6 py-2.5 bg-[#F3F4F6] rounded-full text-[12.5px] font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      Browse Files
                    </button>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept=".pdf,.txt,.jpg,.jpeg,.png" className="absolute w-0 h-0 opacity-0 overflow-hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              <p className="text-center text-[13px] text-gray-500 mt-4 mb-8">Upload images of your preferred document/image</p>

              {/* Due Date */}
              <div className="mb-8 relative">
                <label className="block text-[13.5px] font-bold text-gray-900 mb-2">Due Date</label>
                <div className="relative w-full">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={cn(
                      "w-full px-5 py-3.5 rounded-[20px] bg-white border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] text-[13.5px] outline-none focus:border-gray-300 transition-colors pr-14",
                      dueDate ? "text-gray-900" : "text-gray-400"
                    )}
                    style={{ WebkitAppearance: 'none' }}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 p-1 border border-gray-200 rounded-md text-gray-600 bg-white pointer-events-none">
                    <CalendarPlus size={16} strokeWidth={2} />
                  </div>
                </div>
              </div>

              {/* Question Type section */}
              <div className="mb-8">
                {/* Column headers */}
                <div className="flex items-center mb-4 px-2">
                  <div className="flex-1">
                    <span className="text-[13.5px] font-bold text-gray-900">Question Type</span>
                  </div>
                  <span className="text-[13px] font-bold text-gray-900 w-[140px] text-center">No. of Questions</span>
                  <span className="text-[13px] font-bold text-gray-900 w-[110px] text-center">Marks</span>
                </div>

                {/* Rows */}
                <div className="space-y-4">
                  {rows.map((row) => (
                    <div key={row.id} className="flex items-center gap-3">
                      {/* Type dropdown */}
                      <div className="flex-1 relative">
                        <button
                          type="button"
                          onClick={() => toggleDropdown(row.id)}
                          className="w-full flex items-center justify-between px-5 py-3.5 rounded-full bg-white shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] border border-gray-50 text-[13.5px] font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                        >
                          <span className="truncate">{row.label}</span>
                          <ChevronDown size={16} className="text-gray-500 flex-shrink-0 ml-2" />
                        </button>
                        {row.dropdownOpen && (
                          <div className="absolute left-0 top-[calc(100%+8px)] w-full z-50 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 max-h-48 overflow-y-auto">
                            {Q_TYPE_OPTIONS.map((opt) => (
                              <button
                                key={opt.label}
                                type="button"
                                onClick={() => selectType(row.id, opt)}
                                className="w-full text-left px-5 py-3 text-[13.5px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Remove X */}
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        className="px-2 text-gray-400 hover:text-gray-700 transition-colors font-medium flex-shrink-0"
                      >
                        ✕
                      </button>

                      {/* No. of Questions stepper */}
                      <div className="w-[140px] flex justify-center">
                        <div className="flex items-center gap-4 px-5 py-3 rounded-full bg-white shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] border border-gray-50">
                          <button type="button" onClick={() => setCount(row.id, Math.max(1, row.count - 1))} className="text-gray-300 hover:text-gray-500 font-bold text-lg leading-none">−</button>
                          <span className="w-4 text-center text-[14px] font-bold text-gray-900">{row.count}</span>
                          <button type="button" onClick={() => setCount(row.id, row.count + 1)} className="text-gray-300 hover:text-gray-500 font-bold text-lg leading-none">+</button>
                        </div>
                      </div>

                      {/* Marks stepper */}
                      <div className="w-[110px] flex justify-center">
                        <div className="flex items-center gap-4 px-5 py-3 rounded-full bg-white shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] border border-gray-50">
                          <button type="button" onClick={() => setMarks(row.id, Math.max(1, row.marks - 1))} className="text-gray-300 hover:text-gray-500 font-bold text-lg leading-none">−</button>
                          <span className="w-4 text-center text-[14px] font-bold text-gray-900">{row.marks}</span>
                          <button type="button" onClick={() => setMarks(row.id, row.marks + 1)} className="text-gray-300 hover:text-gray-500 font-bold text-lg leading-none">+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Question Type button & Totals Container */}
                <div className="flex items-end justify-between mt-6 px-2">
                  <button
                    type="button"
                    onClick={addRow}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-[34px] h-[34px] rounded-full bg-gray-900 flex items-center justify-center group-hover:bg-gray-800 transition-colors flex-shrink-0 shadow-sm">
                      <span className="text-white text-xl font-light leading-none relative bottom-[1px]">+</span>
                    </div>
                    <span className="text-[14px] font-bold text-gray-700 group-hover:text-gray-900 transition-colors">Add Question Type</span>
                  </button>

                  <div className="text-right space-y-1 pb-1">
                    <p className="text-[13px] font-bold text-gray-700">Total Questions : <span className="text-gray-900">{totalQuestions}</span></p>
                    <p className="text-[13px] font-bold text-gray-700">Total Marks : <span className="text-gray-900">{totalMarks}</span></p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="mt-8">
                <label className="block text-[13.5px] font-bold text-gray-900 mb-3">
                  Additional Information <span className="text-gray-500 font-medium text-[13px]">(For better output)</span>
                </label>
                <div className="relative border-2 border-dashed border-gray-200 rounded-[20px] bg-[#F9FAFB] hover:border-gray-300 transition-colors focus-within:border-gray-400 focus-within:bg-white">
                  <textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    rows={3}
                    placeholder="e.g Generate a question paper for 3 hour exam duration..."
                    className="w-full px-5 pt-4 pb-12 bg-transparent text-[13.5px] text-gray-900 outline-none resize-none placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={cn(
                      "absolute bottom-4 right-4 p-2 rounded-full transition-all duration-300 shadow-sm",
                      isRecording 
                        ? "bg-red-500 text-white animate-pulse" 
                        : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700"
                    )}
                  >
                    <Mic size={18} strokeWidth={2} />
                  </button>
                  {isTranscribing && (
                    <div className="absolute bottom-5 right-14 text-[12px] font-medium text-gray-500 flex items-center gap-2">
                      <Loader2 size={12} className="animate-spin" /> Transcribing...
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

            {/* Previous + Next buttons */}
            <div className="flex items-center justify-between mt-8 w-full">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center gap-2 px-7 py-3.5 bg-white rounded-full text-[13.5px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <ArrowLeft size={16} strokeWidth={2.5} />
                Previous
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={submitting || !title || !subject || !dueDate || rows.length === 0}
                className={cn(
                  'flex items-center gap-2 px-8 py-3.5 rounded-full text-[13.5px] font-semibold text-white transition-all shadow-sm',
                  submitting || !title || !subject || !dueDate || rows.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gray-900 hover:bg-gray-800 active:scale-[0.98]'
                )}
              >
                {submitting ? (
                  <><Loader2 size={16} className="animate-spin" /> Generating…</>
                ) : (
                  <> Next <ArrowRight size={16} strokeWidth={2.5} /></>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
