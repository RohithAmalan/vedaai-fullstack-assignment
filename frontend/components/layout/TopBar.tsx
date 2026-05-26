'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  className?: string;
}

export default function TopBar({ title = 'Assignment', showBack = false, className }: TopBarProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        'flex items-center justify-between h-14 px-6 bg-white border-b border-gray-100 sticky top-0 z-10',
        className
      )}
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="text-gray-400">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" fill="currentColor" opacity="0.4" />
              <rect x="8" y="1" width="5" height="5" rx="1" fill="currentColor" opacity="0.4" />
              <rect x="1" y="8" width="5" height="5" rx="1" fill="currentColor" opacity="0.4" />
              <rect x="8" y="8" width="5" height="5" rx="1" fill="currentColor" opacity="0.4" />
            </svg>
          </span>
          <span className="text-gray-600 font-medium">{title}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell size={18} />
        </button>

        <button className="flex items-center gap-2 py-1.5 px-3 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-primary font-semibold text-xs">J</span>
          </div>
          <span className="text-sm font-medium text-gray-700">John Doe</span>
          <ChevronDown size={14} className="text-gray-400" />
        </button>
      </div>
    </header>
  );
}
