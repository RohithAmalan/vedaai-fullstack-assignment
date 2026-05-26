'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, Download } from 'lucide-react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import MobileNav from '@/components/layout/MobileNav';
import QuestionPaperDisplay from '@/components/assignments/QuestionPaperDisplay';
import ProgressIndicator from '@/components/common/ProgressIndicator';
import { ToastContainer } from '@/components/common/Toast';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { useJobProgress } from '@/hooks/useJobProgress';
import { useToast } from '@/hooks/useToast';
import { getAssignmentPaper, regenerateAssignment } from '@/services/api';

const PDFDownloadButton = dynamic(() => import('@/components/pdf/PDFDownloadButton'), { ssr: false });

export default function AssignmentOutputPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { toasts, addToast, removeToast } = useToast();
  const [regenerating, setRegenerating] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState('Question Paper');

  const {
    generationStatus,
    progress,
    generatedPaper,
    currentAssignmentId,
    setGeneratedPaper,
    setCurrentAssignmentId,
    setGenerationStatus,
    setProgress,
  } = useAssignmentStore();

  // Sync assignment id
  useEffect(() => {
    if (id && id !== currentAssignmentId) {
      setCurrentAssignmentId(id);
    }
  }, [id, currentAssignmentId, setCurrentAssignmentId]);

  // Subscribe to WebSocket
  useJobProgress(id);

  // When completed, fetch paper if not in store
  useEffect(() => {
    if (generationStatus === 'completed' && !generatedPaper) {
      getAssignmentPaper(id)
        .then((res) => setGeneratedPaper(res.paper))
        .catch(() => addToast('Failed to load paper', 'error'));
    }
  }, [generationStatus, generatedPaper, id, setGeneratedPaper, addToast]);

  // Poll status when arriving at page with pending/processing status
  useEffect(() => {
    if (generatedPaper) return;
    if (generationStatus === 'completed') return;

    const poll = setInterval(async () => {
      try {
        const res = await getAssignmentPaper(id);
        if (res.paper) {
          setGeneratedPaper(res.paper);
          setGenerationStatus('completed');
          setProgress(100);
          clearInterval(poll);
        }
      } catch {
        // Not ready yet
      }
    }, 3000);

    return () => clearInterval(poll);
  }, [id, generatedPaper, generationStatus, setGeneratedPaper, setGenerationStatus, setProgress]);

  const handleRegenerate = async () => {
    setRegenerating(true);
    setGenerationStatus('generating');
    setProgress(0);
    setGeneratedPaper(null);
    try {
      await regenerateAssignment(id);
      addToast('Regeneration started!', 'info');
    } catch {
      addToast('Failed to regenerate', 'error');
      setGenerationStatus('failed');
    } finally {
      setRegenerating(false);
    }
  };

  const isLoading = generationStatus === 'generating' || generationStatus === 'uploading';

  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      <Sidebar />

      <div className="flex-1 ml-[240px] flex flex-col min-h-screen">
        <TopBar title="Assignment" showBack={true} />

        <main className="flex-1 p-6">
          {/* Action Bar */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Question Paper</h2>
              <p className="text-sm text-gray-500 mt-0.5">AI-generated assessment paper</p>
            </div>

            {generatedPaper && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRegenerate}
                  disabled={regenerating}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw size={15} className={regenerating ? 'animate-spin' : ''} />
                  Regenerate
                </button>

                <PDFDownloadButton paper={generatedPaper} title={assignmentTitle} />
              </div>
            )}
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="bg-white rounded-2xl border border-gray-200 min-h-[400px] flex items-center justify-center">
              <ProgressIndicator progress={progress} status={generationStatus} />
            </div>
          ) : generationStatus === 'failed' ? (
            <div className="bg-white rounded-2xl border border-red-200 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-2xl">✕</span>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">Generation Failed</h3>
              <p className="text-sm text-gray-500 mb-5">
                Something went wrong while generating your question paper.
              </p>
              <button
                onClick={handleRegenerate}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-colors mx-auto"
              >
                <RefreshCw size={15} />
                Try Again
              </button>
            </div>
          ) : generatedPaper ? (
            <QuestionPaperDisplay paper={generatedPaper} assignmentTitle={assignmentTitle} />
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 min-h-[400px] flex items-center justify-center">
              <ProgressIndicator progress={progress} status="generating" />
            </div>
          )}
        </main>
      </div>

      <MobileNav />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
