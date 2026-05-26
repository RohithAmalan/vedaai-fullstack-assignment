'use client';

import dynamic from 'next/dynamic';
import { Download } from 'lucide-react';
import { GeneratedPaper } from '@/types/question.types';

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

const PDFDocumentComp = dynamic(() => import('./PDFDocument'), { ssr: false });

interface PDFDownloadButtonProps {
  paper: GeneratedPaper;
  title?: string;
}

export default function PDFDownloadButton({ paper, title }: PDFDownloadButtonProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Link = PDFDownloadLink as any;
  return (
    <Link
      document={<PDFDocumentComp paper={paper} title={title} />}
      fileName={`${title || 'question-paper'}.pdf`}
    >
      {({ loading }: { loading: boolean }) => (
        <button
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-semibold disabled:opacity-60 transition-colors"
        >
          <Download size={15} />
          {loading ? 'Preparing...' : 'Download PDF'}
        </button>
      )}
    </Link>
  );
}
