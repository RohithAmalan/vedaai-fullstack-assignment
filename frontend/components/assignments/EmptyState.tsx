'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {/* Illustration */}
      <div className="relative w-40 h-36 mb-6">
        {/* Paper stack */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-32 bg-gray-100 rounded-lg border border-gray-200 rotate-3" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-32 bg-white rounded-lg border border-gray-200" />
        {/* Lines on paper */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-20 space-y-1.5">
          <div className="h-1.5 bg-gray-200 rounded-full" />
          <div className="h-1.5 bg-gray-200 rounded-full w-4/5" />
          <div className="h-1.5 bg-gray-200 rounded-full w-3/5" />
        </div>
        {/* Magnifier */}
        <div className="absolute top-0 right-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-[3px] border-gray-400 bg-gray-50 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-1 bg-gray-400 rounded-full rotate-45 translate-x-2 translate-y-1" />
          </div>
        </div>
        {/* X mark */}
        <div className="absolute top-2 right-6 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">✕</span>
        </div>
        {/* Sparkles */}
        <div className="absolute top-1 left-3 text-primary text-lg">✦</div>
        <div className="absolute top-6 right-0 text-blue-400 text-sm">✦</div>
        <div className="absolute bottom-4 left-0 text-blue-300 text-xs">✦</div>
      </div>

      <h3 className="text-base font-semibold text-gray-900 mb-2">No assignments yet</h3>
      <p className="text-sm text-gray-500 max-w-xs mb-6 leading-relaxed">
        Create your first assignment to start collecting and grading student submissions. You can set
        up rubrics, define marking criteria, and let AI assist with grading.
      </p>

      <Link
        href="/assignments/new"
        className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-colors"
      >
        <Plus size={16} strokeWidth={2.5} />
        Create Your First Assignment
      </Link>
    </div>
  );
}
