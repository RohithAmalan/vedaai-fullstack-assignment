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

const progressSteps = [10, 30, 70, 100];

export default function ProgressIndicator({ progress, status, className }: ProgressIndicatorProps) {
  const message = statusMessages[status] || 'Processing...';

  return (
    <div className={cn('flex flex-col items-center justify-center h-full w-full py-16', className)}>
      {/* Progress Circle */}
      <div className="relative w-[72px] h-[72px] mb-8">
        {status === 'completed' ? (
          <div className="w-full h-full rounded-full bg-green-100 flex items-center justify-center">
            <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
              <path d="M8 18L15 25L28 11" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ) : status === 'failed' ? (
          <div className="w-full h-full rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-red-500 text-3xl font-bold">✕</span>
          </div>
        ) : (
          <>
            <svg className="w-[72px] h-[72px] -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#FFECE1" strokeWidth="6" />
              <circle
                cx="40" cy="40" r="34" fill="none"
                stroke="#FF6B2C" strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress / 100)}`}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[17px] font-bold text-[#FF6B2C]">{progress}%</span>
            </div>
          </>
        )}
      </div>

      <h3 className="text-[19px] font-bold text-gray-900 mb-8">{message}</h3>

      {/* Stepper track */}
      {status === 'generating' && (
        <div className="relative w-[340px]">
          {/* Background line */}
          <div className="absolute top-[3px] left-2 right-2 h-[4px] bg-[#F2F2F2] rounded-full" />
          
          {/* Filled line */}
          <div
            className="absolute top-[3px] left-2 h-[4px] bg-[#FF6B2C] rounded-full transition-all duration-700 ease-out"
            style={{ width: `calc(${Math.max(0, progress - 10) * (100 / 90)}% - 16px)` }}
          />

          {/* Points */}
          <div className="relative flex justify-between w-full">
            {progressSteps.map((step) => {
              const isActive = progress >= step;
              return (
                <div key={step} className="flex flex-col items-center gap-2 relative z-10 w-8">
                  <div
                    className={cn(
                      'w-[10px] h-[10px] rounded-full border-2 transition-colors duration-300',
                      isActive ? 'bg-[#FF6B2C] border-[#FF6B2C]' : 'bg-[#E5E7EB] border-white shadow-sm'
                    )}
                  />
                  <span className={cn('text-[12px] font-medium transition-colors', isActive ? 'text-gray-900' : 'text-gray-400')}>
                    {step}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
