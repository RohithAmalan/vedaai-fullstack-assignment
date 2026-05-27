'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw } from 'lucide-react';
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
import { getAssignmentPaper, regenerateAssignment, getAssignmentStatus } from '@/services/api';
import { cn } from '@/lib/utils';

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
    currentAssignment,
    setGeneratedPaper,
    setCurrentAssignmentId,
    setGenerationStatus,
    setProgress,
    setCurrentAssignment,
  } = useAssignmentStore();

  useEffect(() => {
    if (id && id !== currentAssignmentId) {
      setCurrentAssignmentId(id);
    }
  }, [id, currentAssignmentId, setCurrentAssignmentId]);

  useJobProgress(id);

  useEffect(() => {
    if (generationStatus === 'completed' && !generatedPaper) {
      getAssignmentPaper(id)
        .then((res) => {
          setGeneratedPaper(res.paper);
          if (res.assignment) setCurrentAssignment(res.assignment);
        })
        .catch(() => addToast('Failed to load paper', 'error'));
    }
  }, [generationStatus, generatedPaper, id, setGeneratedPaper, setCurrentAssignment, addToast]);

  useEffect(() => {
    if (generatedPaper) return;
    if (generationStatus === 'completed') return;

    const poll = setInterval(async () => {
      try {
        const statusRes = await getAssignmentStatus(id);
        
        if (statusRes.status === 'failed') {
          setGenerationStatus('failed');
          clearInterval(poll);
          return;
        }

        if (statusRes.status === 'completed') {
          const res = await getAssignmentPaper(id);
          if (res.paper) {
            setGeneratedPaper(res.paper);
            if (res.assignment) setCurrentAssignment(res.assignment);
            setGenerationStatus('completed');
            setProgress(100);
            clearInterval(poll);
          }
        }
      } catch {
        // Not ready yet
      }
    }, 2000);

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

  // For completed state, we want a dark background layout
  if (generatedPaper) {
    return (
      <div className="flex min-h-screen w-full bg-[#EBEBEB] overflow-x-hidden">
        <Sidebar />

      <div className="flex-1 min-w-0 lg:ml-[290px] flex flex-col min-h-screen">
          <TopBar title="Create New" showBack={true} />

          <main className="flex-1 p-8 pb-32">
            {/* Dark container */}
            <div className="bg-[#374151] rounded-[32px] p-6 shadow-sm max-w-4xl mx-auto">
              
              {/* Header section inside dark container */}
              <div className="mb-8 px-4 pt-2">
                <p className="text-[15.5px] font-semibold text-white mb-6 leading-relaxed">
                  Certainly! Here is your customized Question Paper for your {currentAssignment?.subject || 'Science'} classes on the {currentAssignment?.title || 'NCERT'} chapters:
                </p>
                
                <div className="flex gap-4">
                  <PDFDownloadButton paper={generatedPaper} title={currentAssignment?.title || assignmentTitle} />
                  
                  <button
                    onClick={handleRegenerate}
                    disabled={regenerating}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-[13.5px] font-semibold hover:bg-white/20 disabled:opacity-50 transition-colors shadow-sm"
                  >
                    <RefreshCw size={15} className={regenerating ? 'animate-spin' : ''} strokeWidth={2.5} />
                    {regenerating ? 'Regenerating...' : 'Regenerate'}
                  </button>
                </div>
              </div>

              {/* White Question Paper */}
              <QuestionPaperDisplay 
                paper={generatedPaper} 
                assignmentTitle={assignmentTitle} 
              />

            </div>
          </main>
        </div>

        <MobileNav />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  // Pending / Loading State
  return (
    <div className="flex min-h-screen w-full bg-[#EBEBEB] overflow-x-hidden">
      <Sidebar />

      <div className="flex-1 min-w-0 lg:ml-[290px] flex flex-col min-h-screen">
        <TopBar title="Assignment" showBack={true} />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-[19px] font-bold text-gray-900">Question Paper</h2>
            <p className="text-[13px] text-gray-500 mt-0.5">AI-generated assessment paper</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 min-h-[500px] flex items-center justify-center">
            {isLoading ? (
              <ProgressIndicator progress={progress} status={generationStatus} />
            ) : generationStatus === 'failed' ? (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-500 text-2xl font-bold">✕</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Generation Failed</h3>
                <p className="text-sm text-gray-500 mb-5">Something went wrong while generating.</p>
                <button
                  onClick={handleRegenerate}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-full transition-colors mx-auto"
                >
                  <RefreshCw size={14} />
                  Try Again
                </button>
              </div>
            ) : (
              <ProgressIndicator progress={progress} status="generating" />
            )}
          </div>
        </main>
      </div>

      <MobileNav />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
