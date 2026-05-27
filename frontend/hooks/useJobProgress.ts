'use client';

import { useEffect, useCallback } from 'react';
import { getSocket, subscribeToJob, unsubscribeFromJob } from '@/socket/socketClient';
import { useAssignmentStore } from '@/store/useAssignmentStore';

export const useJobProgress = (assignmentId: string | null) => {
  const { setProgress, setGenerationStatus, setGeneratedPaper, setJobId } = useAssignmentStore();

  const handleGenerationStarted = useCallback(
    (data: { assignmentId: string; progress: number }) => {
      if (data.assignmentId === assignmentId) {
        setGenerationStatus('generating');
        setProgress(data.progress);
      }
    },
    [assignmentId, setGenerationStatus, setProgress]
  );

  const handleProgress = useCallback(
    (data: { assignmentId: string; progress: number }) => {
      if (data.assignmentId === assignmentId) {
        setProgress(data.progress);
      }
    },
    [assignmentId, setProgress]
  );

  const handleComplete = useCallback(
    (data: { assignmentId: string; paper: unknown }) => {
      if (data.assignmentId === assignmentId) {
        setGenerationStatus('completed');
        setProgress(100);
        setGeneratedPaper(data.paper as Parameters<typeof setGeneratedPaper>[0]);
      }
    },
    [assignmentId, setGenerationStatus, setProgress, setGeneratedPaper]
  );

  const handleFailed = useCallback(
    (data: { assignmentId: string; error?: string }) => {
      if (data.assignmentId === assignmentId) {
        setGenerationStatus('failed');
        if (data.error) useAssignmentStore.getState().setError(data.error);
      }
    },
    [assignmentId, setGenerationStatus]
  );

  useEffect(() => {
    if (!assignmentId) return;

    const socket = getSocket();
    subscribeToJob(assignmentId);

    socket.on('generation-started', handleGenerationStarted);
    socket.on('generation-progress', handleProgress);
    socket.on('generation-complete', handleComplete);
    socket.on('generation-failed', handleFailed);

    return () => {
      unsubscribeFromJob(assignmentId);
      socket.off('generation-started', handleGenerationStarted);
      socket.off('generation-progress', handleProgress);
      socket.off('generation-complete', handleComplete);
      socket.off('generation-failed', handleFailed);
    };
  }, [assignmentId, handleGenerationStarted, handleProgress, handleComplete, handleFailed]);
};
