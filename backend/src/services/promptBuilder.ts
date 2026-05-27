import { AssignmentConfig } from '../types';

export const buildPrompt = (config: AssignmentConfig, fileText?: string): string => {
  const sections = config.questionTypes.map((type, i) => {
    const label = String.fromCharCode(65 + i);
    return `Section ${label}: ${type} questions`;
  });

  const contextBlock = fileText
    ? `\nSource Material:\n${fileText.slice(0, 3000)}\n`
    : '';

  return `Generate a complete question paper for the following requirements.
${fileText ? 'CRITICAL INSTRUCTION: You MUST generate all questions STRICTLY based on the provided Source Material below. Do not include concepts or questions outside of this context.' : ''}

Subject: ${config.subject}
Title: ${config.title}
${config.classLevel ? `Class Level: ${config.classLevel}` : ''}
Total Questions: ${config.numberOfQuestions}
Question Types: ${config.questionTypes.join(', ')}
Sections: ${sections.join(', ')}
Difficulty Distribution: 30% Easy, 40% Medium, 30% Hard
${config.additionalInstructions ? `Additional Instructions: ${config.additionalInstructions}` : ''}
${contextBlock}

CRITICAL INSTRUCTION FOR MARKS:
Check the "Additional Instructions" above to see the exact number of marks assigned to each question type. You MUST assign the correct marks to each question, and calculate the totalMarks accordingly.

Return ONLY a valid JSON object in EXACTLY this structure. No markdown. No explanation. No code blocks. Just raw JSON:

{
  "studentInfo": {
    "name": "",
    "rollNumber": "",
    "section": ""
  },
  "sections": [
    {
      "sectionLabel": "Section A",
      "title": "Multiple Choice Questions",
      "instruction": "Attempt all questions. Each question carries <X> marks.",
      "questions": [
        {
          "questionNumber": 1,
          "questionText": "Question text here",
          "difficulty": "Easy",
          "marks": 2,
          "type": "MCQ",
          "options": ["Option A", "Option B", "Option C", "Option D"]
        }
      ]
    }
  ],
  "metadata": {
    "totalQuestions": ${config.numberOfQuestions},
    "totalMarks": 100,
    "estimatedTime": ${config.numberOfQuestions * 2},
    "subject": "${config.subject}"
  }
}`;
};
