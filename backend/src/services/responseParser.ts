import { GeneratedPaper } from '../types';

export const parseGroqResponse = (content: string): GeneratedPaper => {
  let cleaned = content.trim();

  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  const parsed = JSON.parse(cleaned) as GeneratedPaper;

  if (!parsed.sections || !Array.isArray(parsed.sections)) {
    throw new Error('Invalid response: missing sections array');
  }
  if (!parsed.metadata) {
    throw new Error('Invalid response: missing metadata');
  }

  parsed.sections = parsed.sections.map((section, sIdx) => ({
    sectionLabel: section.sectionLabel || `Section ${String.fromCharCode(65 + sIdx)}`,
    title: section.title || 'Questions',
    instruction: section.instruction || 'Attempt all questions',
    questions: (section.questions || []).map((q, qIdx) => ({
      questionNumber: q.questionNumber || qIdx + 1,
      questionText: q.questionText || '',
      difficulty: (['Easy', 'Medium', 'Hard'].includes(q.difficulty) ? q.difficulty : 'Medium') as 'Easy' | 'Medium' | 'Hard',
      marks: q.marks || 1,
      type: q.type || 'Short Answer',
      options: q.options || [],
    })),
  }));

  parsed.studentInfo = parsed.studentInfo || { name: '', rollNumber: '', section: '' };

  return parsed;
};
