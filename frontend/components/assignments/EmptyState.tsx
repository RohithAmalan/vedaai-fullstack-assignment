'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* Illustration — matches Figma */}
      <div className="relative w-72 h-60 mb-8 select-none">
        {/* Large lavender background circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full bg-[#E8E6F0]" />

        {/* Back document card (rotated) */}
        <div className="absolute top-[38px] left-[64px] w-[108px] h-[128px] bg-[#F0EFF8] rounded-xl border border-[#DDD9F0] rotate-[-6deg] shadow-sm" />

        {/* Front document card */}
        <div className="absolute top-[30px] left-[72px] w-[108px] h-[128px] bg-white rounded-xl border border-gray-200 shadow-md flex flex-col gap-2 pt-5 px-4">
          <div className="h-[10px] bg-gray-800 rounded-full w-3/4" />
          <div className="h-[7px] bg-gray-200 rounded-full w-full mt-1" />
          <div className="h-[7px] bg-gray-200 rounded-full w-5/6" />
          <div className="h-[7px] bg-gray-200 rounded-full w-4/6" />
          <div className="h-[7px] bg-gray-200 rounded-full w-5/6" />
          <div className="h-[7px] bg-gray-200 rounded-full w-3/6" />
        </div>

        {/* Floating mini card top-right */}
        <div className="absolute top-[22px] right-[40px] w-[52px] h-[26px] bg-gray-200 rounded-lg flex items-center gap-1.5 px-2">
          <div className="w-3 h-3 rounded-full bg-gray-400 flex-shrink-0" />
          <div className="h-2 bg-gray-400 rounded-full flex-1" />
        </div>

        {/* Magnifying glass */}
        <div className="absolute bottom-[14px] right-[24px] w-[90px] h-[90px]">
          <div className="absolute inset-0 rounded-full border-[6px] border-[#A89EC8] bg-[#EAE8F4]/60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <line x1="10" y1="10" x2="26" y2="26" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
              <line x1="26" y1="10" x2="10" y2="26" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="absolute bottom-[-12px] right-[-10px] w-[28px] h-[8px] bg-[#A89EC8] rounded-full rotate-[-40deg] origin-top-left" />
        </div>

        {/* Blue dot */}
        <div className="absolute top-[80px] right-[14px] w-3 h-3 rounded-full bg-[#60A5FA]" />

        {/* Sparkle bottom-left */}
        <svg className="absolute bottom-[48px] left-[24px]" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" fill="#60A5FA" />
        </svg>

        {/* Pen squiggle top-left */}
        <svg className="absolute top-[32px] left-[28px]" width="48" height="40" viewBox="0 0 48 40" fill="none">
          <path d="M44 2 C36 2 8 18 4 36" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="44" cy="2" r="3" fill="#1F2937" />
        </svg>
      </div>

      <h3 className="text-[17px] font-bold text-gray-900 mb-2">No assignments yet</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-7 leading-relaxed">
        Create your first assignment to start collecting and grading student submissions.
        You can set up rubrics, define marking criteria, and let AI assist with grading.
      </p>

      <Link
        href="/assignments/new"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-full transition-colors shadow-sm"
      >
        <Plus size={16} strokeWidth={2.5} />
        Create Your First Assignment
      </Link>
    </div>
  );
}
