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

  let calculatedTotalMarks = 0;
  let calculatedTotalQuestions = 0;

  parsed.sections = parsed.sections.map((section, sIdx) => ({
    sectionLabel: section.sectionLabel || `Section ${String.fromCharCode(65 + sIdx)}`,
    title: section.title || 'Questions',
    instruction: section.instruction || 'Attempt all questions',
    questions: (section.questions || []).map((q, qIdx) => {
      let qType = q.type || 'Short Answer';
      if (typeof qType === 'string') {
        if (qType.includes('Short')) qType = 'Short Answer';
        else if (qType.includes('Long')) qType = 'Long Answer';
        else if (qType.includes('MCQ') || qType.includes('Multiple')) qType = 'MCQ';
        else if (!['MCQ', 'Short Answer', 'Long Answer'].includes(qType)) qType = 'Short Answer';
      } else {
        qType = 'Short Answer';
      }

      const marks = q.marks || 1;
      calculatedTotalMarks += marks;
      calculatedTotalQuestions += 1;

      return {
        questionNumber: q.questionNumber || qIdx + 1,
        questionText: q.questionText || '',
        difficulty: (['Easy', 'Medium', 'Hard'].includes(q.difficulty) ? q.difficulty : 'Medium') as 'Easy' | 'Medium' | 'Hard',
        marks: marks,
        type: qType,
        options: q.options || [],
      };
    }),
  }));

  parsed.studentInfo = parsed.studentInfo || { name: '', rollNumber: '', section: '' };
  
  parsed.metadata.totalMarks = calculatedTotalMarks;
  parsed.metadata.totalQuestions = calculatedTotalQuestions;
  parsed.metadata.estimatedTime = calculatedTotalQuestions * 2;

  return parsed;
};
