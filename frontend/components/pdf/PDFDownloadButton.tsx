'use client';

import dynamic from 'next/dynamic';
import { Download } from 'lucide-react';
import { GeneratedPaper } from '@/types/question.types';
import { cn } from '@/lib/utils';

import PDFDocument from './PDFDocument';

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

interface PDFDownloadButtonProps {
  paper: GeneratedPaper;
  title?: string;
  className?: string;
}

export default function PDFDownloadButton({ paper, title, className }: PDFDownloadButtonProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Link = PDFDownloadLink as any;
  return (
    <Link
      document={<PDFDocument paper={paper} title={title} />}
      fileName={`${title || 'question-paper'}.pdf`}
    >
      {({ loading }: { loading: boolean }) => (
        <button
          disabled={loading}
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-gray-900 text-[13.5px] font-semibold hover:bg-gray-100 disabled:opacity-60 transition-colors shadow-sm',
            className
          )}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          {loading ? 'Preparing PDF...' : 'Download as PDF'}
        </button>
      )}
    </Link>
  );
}
