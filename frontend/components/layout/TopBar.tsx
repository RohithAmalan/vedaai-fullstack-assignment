'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/ui/Logo';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  className?: string;
  hideMobileBreadcrumb?: boolean;
}

export default function TopBar({ title = 'Assignment', showBack = false, className, hideMobileBreadcrumb = false }: TopBarProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        'flex flex-col justify-center h-auto lg:flex-row lg:items-center lg:justify-between lg:h-[54px] px-0 lg:px-6 bg-white border-b border-gray-100 sticky top-0 z-10',
        className
      )}
    >
      {/* --- DESKTOP LAYOUT --- */}
      <div className="hidden lg:flex items-center justify-between w-full">
        <div className="flex items-center gap-2.5">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={17} strokeWidth={2} />
            </button>
          )}
          <div className="flex items-center gap-1.5">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-gray-400">
              <rect x="1" y="1" width="5.5" height="5.5" rx="1.2" fill="currentColor" opacity="0.5" />
              <rect x="8.5" y="1" width="5.5" height="5.5" rx="1.2" fill="currentColor" opacity="0.5" />
              <rect x="1" y="8.5" width="5.5" height="5.5" rx="1.2" fill="currentColor" opacity="0.5" />
              <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.2" fill="currentColor" opacity="0.5" />
            </svg>
            <span className="text-[13.5px] font-medium text-gray-600">{title}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute top-[7px] right-[7px] w-[7px] h-[7px] rounded-full bg-orange-500 border-[1.5px] border-white" />
          </button>
          <button className="flex items-center gap-2 py-1.5 pl-1.5 pr-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-[30px] h-[30px] rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center">
              <span className="text-white text-[11px] font-bold">JD</span>
            </div>
            <span className="text-[13px] font-medium text-gray-800">John Doe</span>
            <ChevronDown size={13} className="text-gray-400" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* --- MOBILE LAYOUT --- */}
      <div className="flex lg:hidden flex-col w-full">
        {/* Row 1: Logo and Icons */}
        <div className="flex items-center justify-between w-full h-[60px] px-4 bg-white">
          <div className="flex items-center gap-[6px]">
            <Logo className="w-8 h-8" />
            <span className="text-[22px] font-black tracking-tighter text-[#2a2a2a]">VedaAI</span>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative text-gray-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute top-[2px] right-[2px] w-2 h-2 rounded-full bg-orange-500 border border-white" />
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">JD</span>
            </div>
            <button className="text-gray-700 ml-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Row 2: Breadcrumb / Title */}
        {!hideMobileBreadcrumb && (
          <div className="flex items-center h-[48px] px-4 bg-[#F5F5F5] border-t border-gray-200">
            <div className="flex items-center gap-3 w-full">
              {showBack ? (
                <button onClick={() => router.back()} className="p-1.5 -ml-1.5 rounded-full bg-white shadow-sm border border-gray-200 text-gray-700 active:scale-95 transition-transform">
                  <ArrowLeft size={16} strokeWidth={2.5} />
                </button>
              ) : (
                <div className="w-[28px]" /> /* spacer */
              )}
              <span className="text-[15px] font-bold text-gray-900 mx-auto absolute left-1/2 -translate-x-1/2">{title}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
