import { AssignmentConfig } from '../types';

export const buildPrompt = (config: AssignmentConfig, fileText?: string): string => {
  const sections = config.questionTypes.map((type, i) => {
    const label = String.fromCharCode(65 + i);
    return `Section ${label}: ${type} questions`;
  });

  const contextBlock = fileText
    ? `\nSource Material:\n${fileText.slice(0, 3000)}\n`
    : '';

  return `Generate a complete question paper for the following requirements:

Subject: ${config.subject}
Title: ${config.title}
Total Questions: ${config.numberOfQuestions}
Marks per Question: ${config.marksPerQuestion}
Question Types: ${config.questionTypes.join(', ')}
Sections: ${sections.join(', ')}
Difficulty Distribution: 40% Easy, 40% Medium, 20% Hard
${config.additionalInstructions ? `Additional Instructions: ${config.additionalInstructions}` : ''}
${contextBlock}

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
      "instruction": "Attempt all questions. Each question carries ${config.marksPerQuestion} marks.",
      "questions": [
        {
          "questionNumber": 1,
          "questionText": "Question text here",
          "difficulty": "Easy",
          "marks": ${config.marksPerQuestion},
          "type": "MCQ",
          "options": ["Option A", "Option B", "Option C", "Option D"]
        }
      ]
    }
  ],
  "metadata": {
    "totalQuestions": ${config.numberOfQuestions},
    "totalMarks": ${config.numberOfQuestions * config.marksPerQuestion},
    "estimatedTime": ${config.numberOfQuestions * 2},
    "subject": "${config.subject}"
  }
}`;
};
