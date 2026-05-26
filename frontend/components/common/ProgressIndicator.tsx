'use client';

import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  progress: number;
  status: string;
  className?: string;
}

const statusMessages: Record<string, string> = {
  generating: 'Generating your question paper...',
  completed: 'Question paper ready!',
  failed: 'Generation failed. Please try again.',
};

const progressSteps = [
  { threshold: 10, label: 'Received request' },
  { threshold: 30, label: 'Analyzing content' },
  { threshold: 70, label: 'Generating questions' },
  { threshold: 100, label: 'Finalizing paper' },
];

export default function ProgressIndicator({ progress, status, className }: ProgressIndicatorProps) {
  const message = statusMessages[status] || 'Processing...';
  const currentStep = progressSteps.filter((s) => progress >= s.threshold).pop();

  return (
    <div className={cn('flex flex-col items-center py-16 px-6 text-center', className)}>
      {/* Spinner / Check */}
      <div className="relative w-20 h-20 mb-6">
        {status === 'completed' ? (
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M8 18L15 25L28 11" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ) : status === 'failed' ? (
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-red-500 text-3xl font-bold">✕</span>
          </div>
        ) : (
          <>
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#FEE4D2" strokeWidth="6" />
              <circle
                cx="40" cy="40" r="34" fill="none"
                stroke="#FF6B2C" strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress / 100)}`}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-base font-bold text-primary">{progress}%</span>
            </div>
          </>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-1">{message}</h3>
      {currentStep && status === 'generating' && (
        <p className="text-sm text-gray-500">{currentStep.label}</p>
      )}

      {/* Step bar */}
      {status === 'generating' && (
        <div className="mt-6 w-full max-w-xs">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-3">
            {progressSteps.map((step) => (
              <div key={step.threshold} className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'w-2 h-2 rounded-full',
                    progress >= step.threshold ? 'bg-primary' : 'bg-gray-200'
                  )}
                />
                <span className={cn('text-xs hidden sm:block', progress >= step.threshold ? 'text-primary' : 'text-gray-400')}>
                  {step.threshold}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
