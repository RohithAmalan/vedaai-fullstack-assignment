import fs from 'fs';
import pdfParse from 'pdf-parse';

export const extractTextFromFile = async (filePath: string): Promise<string> => {
  const buffer = fs.readFileSync(filePath);
  const ext = filePath.split('.').pop()?.toLowerCase();

  if (ext === 'pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (['txt', 'md', 'csv'].includes(ext || '')) {
    return buffer.toString('utf-8');
  }

  // For images, we would need an OCR package or Vision model
  if (['jpg', 'jpeg', 'png'].includes(ext || '')) {
    return "Image uploaded (Text extraction requires OCR)";
  }

  return "";
};
