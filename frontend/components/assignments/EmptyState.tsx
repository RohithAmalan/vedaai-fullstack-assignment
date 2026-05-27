'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 text-center w-full">
      {/* Illustration — pixel-perfect Figma match */}
      <div className="relative w-[300px] h-[260px] mb-6 select-none">

        {/* Large lavender/mauve background circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[52%] w-[220px] h-[220px] rounded-full bg-[#E2DFEF]" />

        {/* Back document (rotated left, behind) */}
        <div className="absolute top-[32px] left-[60px] w-[110px] h-[135px] bg-[#EDEAF7] rounded-2xl border border-[#D5D0ED] rotate-[-7deg] shadow-sm" />

        {/* Front document (white card) */}
        <div className="absolute top-[24px] left-[70px] w-[110px] h-[135px] bg-white rounded-2xl border border-gray-200 shadow-md flex flex-col gap-[5px] pt-5 px-4">
          {/* Top black bar (title) */}
          <div className="h-[9px] bg-gray-800 rounded-full w-[70%]" />
          {/* Lines */}
          <div className="h-[6px] bg-gray-200 rounded-full w-full mt-1.5" />
          <div className="h-[6px] bg-gray-200 rounded-full w-[85%]" />
          <div className="h-[6px] bg-gray-200 rounded-full w-[65%]" />
          <div className="h-[6px] bg-gray-200 rounded-full w-[80%]" />
          <div className="h-[6px] bg-gray-200 rounded-full w-[55%]" />
        </div>

        {/* Floating mini pill card top-right of document */}
        <div className="absolute top-[18px] right-[44px] w-[56px] h-[22px] bg-gray-200 rounded-full flex items-center gap-1.5 px-2">
          <div className="w-[10px] h-[10px] rounded-full bg-gray-400 flex-shrink-0" />
          <div className="h-[5px] bg-gray-400 rounded-full flex-1" />
        </div>

        {/* Magnifying glass circle — bottom right */}
        <div className="absolute bottom-[10px] right-[20px] w-[96px] h-[96px]">
          {/* Glass circle */}
          <div className="absolute inset-0 rounded-full border-[7px] border-[#9B94C4] bg-[#E4E1F5]/70" />
          {/* Red X inside */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
              <line x1="11" y1="11" x2="27" y2="27" stroke="#EF4444" strokeWidth="5.5" strokeLinecap="round" />
              <line x1="27" y1="11" x2="11" y2="27" stroke="#EF4444" strokeWidth="5.5" strokeLinecap="round" />
            </svg>
          </div>
          {/* Handle stick */}
          <div
            className="absolute bg-[#9B94C4] rounded-full"
            style={{
              width: '30px',
              height: '9px',
              bottom: '-13px',
              right: '-11px',
              transform: 'rotate(-42deg)',
              transformOrigin: 'top left',
            }}
          />
        </div>

        {/* Blue dot — right side middle */}
        <div className="absolute top-[72px] right-[12px] w-[13px] h-[13px] rounded-full bg-[#60A5FA]" />

        {/* Blue sparkle star — bottom left */}
        <svg className="absolute bottom-[44px] left-[22px]" width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path
            d="M11 0 L12.8 9.2 L22 11 L12.8 12.8 L11 22 L9.2 12.8 L0 11 L9.2 9.2 Z"
            fill="#60A5FA"
          />
        </svg>

        {/* Pen / squiggle top-left */}
        <svg
          className="absolute top-[26px] left-[22px]"
          width="50"
          height="44"
          viewBox="0 0 50 44"
          fill="none"
        >
          {/* Curved stroke */}
          <path
            d="M46 3 C38 3 8 20 4 40"
            stroke="#1F2937"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* Pen nib dot */}
          <circle cx="46" cy="3" r="3.5" fill="#1F2937" />
        </svg>
      </div>

      {/* Text */}
      <h2 className="text-[18px] font-bold text-gray-900 mb-2.5">No assignments yet</h2>
      <p className="text-[13px] text-gray-500 max-w-[340px] mb-8 leading-[1.65]">
        Create your first assignment to start collecting and grading student
        submissions. You can set up rubrics, define marking criteria, and let AI
        assist with grading.
      </p>

      {/* CTA button — dark pill */}
      <Link
        href="/assignments/new"
        className="inline-flex items-center gap-2 px-7 py-3.5 bg-gray-900 hover:bg-gray-800 text-white text-[13.5px] font-semibold rounded-full transition-colors shadow-lg"
      >
        <Plus size={15} strokeWidth={2.5} />
        Create Your First Assignment
      </Link>
    </div>
  );
}
