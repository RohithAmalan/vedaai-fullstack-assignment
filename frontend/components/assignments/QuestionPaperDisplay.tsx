'use client';

import { GeneratedPaper } from '@/types/question.types';
import { useSettingsStore } from '@/store/useSettingsStore';

interface QuestionPaperDisplayProps {
  paper: GeneratedPaper;
  assignmentTitle?: string;
}

export default function QuestionPaperDisplay({ paper, assignmentTitle }: QuestionPaperDisplayProps) {
  const { studentInfo, sections, metadata } = paper;
  const { schoolName, schoolAddress } = useSettingsStore();

  return (
    <div className="bg-white rounded-[32px] shadow-xl w-full max-w-4xl mx-auto overflow-hidden mt-2" id="question-paper">
      <div className="px-14 py-16 text-gray-900 bg-white min-h-[800px]">
        {/* Document Header */}
        <div className="text-center mb-10 space-y-2">
          <h1 className="text-[26px] font-bold tracking-tight text-gray-900">
            {schoolName}{schoolAddress ? `, ${schoolAddress}` : ''}
          </h1>
          <p className="text-[19px] font-semibold text-gray-800">
            Subject: {metadata.subject || 'English'}
          </p>
        </div>

        {/* Info Row: Time & Marks */}
        <div className="flex items-center justify-between text-[16px] font-semibold text-gray-900 mb-6">
          <p>Time Allowed: {metadata.estimatedTime} minutes</p>
          <p>Maximum Marks: {metadata.totalMarks}</p>
        </div>

        {/* Global Instruction */}
        <p className="text-[15px] font-medium text-gray-900 mb-8">
          All questions are compulsory unless stated otherwise.
        </p>

        {/* Student Detail Lines */}
        <div className="space-y-3 mb-12 text-[15px] font-bold text-gray-900">
          <div className="flex items-end gap-1 w-full max-w-sm">
            <span>Name:</span>
            <div className="flex-1 border-b border-gray-900 pb-0.5 ml-1"></div>
          </div>
          <div className="flex items-end gap-1 w-full max-w-sm">
            <span>Roll Number:</span>
            <div className="flex-1 border-b border-gray-900 pb-0.5 ml-1"></div>
          </div>
          <div className="flex items-end gap-1 w-full max-w-[420px]">
            <span>Class:</span>
            <div className="w-16 border-b border-gray-900 pb-0.5 ml-1"></div>
            <span className="ml-4">Section:</span>
            <div className="flex-1 border-b border-gray-900 pb-0.5 ml-1"></div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-6">
              {/* Section Header */}
              <div className="text-center mb-8">
                <h2 className="text-[22px] font-bold text-gray-900">
                  {section.sectionLabel}
                </h2>
              </div>

              {/* Section Title & Instructions */}
              <div className="space-y-1 mb-6">
                <h3 className="text-[17px] font-bold text-gray-900">
                  {section.title}
                </h3>
                <p className="text-[14.5px] italic text-gray-600">
                  {section.instruction}
                </p>
              </div>

              {/* Questions List */}
              <div className="space-y-5">
                {section.questions.map((q, qIdx) => (
                  <div key={qIdx} className="text-[15px] text-gray-900 leading-relaxed">
                    <div className="flex items-start gap-2">
                      <p className="flex-1">
                        {q.questionNumber}. {q.questionText}
                      </p>
                      <div className="flex flex-col items-end">
                        <span className="text-[14px] font-medium italic text-gray-600">
                          [{q.difficulty}]
                        </span>
                        <span className="text-[13px] font-bold text-gray-800">
                          ({q.marks} Mark{q.marks > 1 ? 's' : ''})
                        </span>
                      </div>
                    </div>
                    {/* MCQ Options (if any) */}
                    {q.type === 'MCQ' && q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 mt-3 ml-6 text-[14.5px]">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex gap-2">
                            <span className="font-semibold">{String.fromCharCode(65 + oIdx)}.</span>
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
