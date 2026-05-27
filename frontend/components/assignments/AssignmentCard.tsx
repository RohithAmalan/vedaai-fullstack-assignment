'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { MoreVertical } from 'lucide-react';
import { Assignment } from '@/types/assignment.types';
import { formatDate } from '@/lib/utils';

interface AssignmentCardProps {
  assignment: Assignment;
  onDelete?: (id: string) => void;
}

export default function AssignmentCard({ assignment, onDelete }: AssignmentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  return (
    <div className="bg-white rounded-[24px] border border-gray-200/80 px-5 py-5 hover:shadow-sm transition-shadow relative">
      {/* Top row: title + 3-dot */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[17px] font-bold text-gray-900 leading-snug">
          {assignment.title}
        </h3>

        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1 -mr-1 -mt-0.5 rounded text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MoreVertical size={17} strokeWidth={2} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-8 z-30 bg-white rounded-xl shadow-xl border border-gray-100/80 py-1 w-[160px]">
              <Link
                href={`/assignments/${assignment._id}`}
                className="block px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                View Assignment
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete?.(assignment._id);
                }}
                className="block w-full text-left px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Spacer — large empty middle area like Figma */}
      <div className="h-8" />

      {/* Bottom row: Assigned on + Due */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
        <div className="flex items-center">
          <span className="font-bold text-gray-900">Assigned on</span>
          <span className="font-semibold text-gray-500 ml-1.5">: {formatDate(assignment.createdAt)}</span>
        </div>
        <div className="flex items-center">
          <span className="font-bold text-gray-900">Due</span>
          <span className="font-semibold text-gray-500 ml-1.5">: {formatDate(assignment.dueDate)}</span>
        </div>
      </div>
    </div>
  );
}
