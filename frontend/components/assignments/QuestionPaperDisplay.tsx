'use client';

import { GeneratedPaper } from '@/types/question.types';
import { Difficulty } from '@/types/assignment.types';
import { cn } from '@/lib/utils';

interface QuestionPaperDisplayProps {
  paper: GeneratedPaper;
  assignmentTitle?: string;
}

const difficultyStyle: Record<Difficulty, string> = {
  Easy: 'bg-green-100 text-green-700 border-green-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Hard: 'bg-red-100 text-red-700 border-red-200',
};

export default function QuestionPaperDisplay({ paper, assignmentTitle }: QuestionPaperDisplayProps) {
  const { studentInfo, sections, metadata } = paper;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" id="question-paper">
      {/* Exam Paper Header */}
      <div className="bg-gray-900 text-white px-8 py-6 text-center">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
          {metadata.subject}
        </p>
        <h1 className="text-xl font-bold text-white mb-2">
          {assignmentTitle || 'Question Paper'}
        </h1>
        <div className="flex items-center justify-center gap-6 text-sm text-gray-300 mt-3">
          <span>Total Marks: <strong className="text-white">{metadata.totalMarks}</strong></span>
          <span className="text-gray-600">|</span>
          <span>Questions: <strong className="text-white">{metadata.totalQuestions}</strong></span>
          <span className="text-gray-600">|</span>
          <span>Time: <strong className="text-white">{metadata.estimatedTime} mins</strong></span>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Student Info */}
        <div className="grid grid-cols-3 gap-6 pb-5 border-b border-gray-200">
          {[
            { label: 'Name', value: studentInfo.name },
            { label: 'Roll Number', value: studentInfo.rollNumber },
            { label: 'Section', value: studentInfo.section },
          ].map(({ label }) => (
            <div key={label}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                {label}
              </label>
              <div className="h-8 border-b-2 border-gray-300 w-full" />
            </div>
          ))}
        </div>

        {/* Sections */}
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-4">
            {/* Section Header */}
            <div className="flex items-baseline gap-3">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-gray-900">{section.sectionLabel}</span>
                  <span className="text-gray-400">—</span>
                  <span className="text-base font-semibold text-gray-800">{section.title}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 italic">{section.instruction}</p>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-3 pl-2">
              {section.questions.map((q, qIdx) => (
                <div
                  key={qIdx}
                  className="flex gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  {/* Question Number */}
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                    {q.questionNumber}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 leading-relaxed font-medium mb-2">
                      {q.questionText}
                    </p>

                    {/* MCQ Options */}
                    {q.type === 'MCQ' && q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-2 gap-1.5 mb-2">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-1.5 text-xs text-gray-600">
                            <span className="font-semibold text-gray-500">
                              {String.fromCharCode(65 + oIdx)}.
                            </span>
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tags row */}
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border',
                          difficultyStyle[q.difficulty]
                        )}
                      >
                        {q.difficulty}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                        {q.type}
                      </span>
                    </div>
                  </div>

                  {/* Marks */}
                  <div className="flex-shrink-0 text-right">
                    <span className="text-xs font-bold text-gray-900">[{q.marks}M]</span>
                  </div>
                </div>
              ))}
            </div>

            {sIdx < sections.length - 1 && (
              <hr className="border-gray-200 mt-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
