import Groq from 'groq-sdk';
import { AssignmentConfig, GeneratedPaper } from '../types';
import { buildPrompt } from './promptBuilder';
import { parseGroqResponse } from './responseParser';

let groq: Groq;

const SYSTEM_PROMPT = `You are an expert educator and question paper setter.
Respond ONLY with valid JSON.
No markdown.
No explanation.
No code blocks.
No additional text.`;

export const generateQuestionPaper = async (
  config: AssignmentConfig,
  fileText?: string
): Promise<GeneratedPaper> => {
  if (!groq) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  const userPrompt = buildPrompt(config, fileText);

  const attempt = async (): Promise<GeneratedPaper> => {
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    });

    const content = completion.choices[0]?.message?.content || '';
    return parseGroqResponse(content);
  };

  try {
    return await attempt();
  } catch {
    return await attempt();
  }
};
