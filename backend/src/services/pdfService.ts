import fs from 'fs';
import pdfParse from 'pdf-parse';

export const extractTextFromFile = async (filePath: string): Promise<string> => {
  const buffer = fs.readFileSync(filePath);
  const ext = filePath.split('.').pop()?.toLowerCase();

  if (ext === 'pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  }

  return buffer.toString('utf-8');
};
