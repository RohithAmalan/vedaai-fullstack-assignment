'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MoreVertical, Eye, Trash2 } from 'lucide-react';
import { Assignment } from '@/types/assignment.types';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface AssignmentCardProps {
  assignment: Assignment;
  onDelete?: (id: string) => void;
}

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  processing: 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
};

export default function AssignmentCard({ assignment, onDelete }: AssignmentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-card-hover transition-shadow relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 leading-snug pr-6 line-clamp-2">
          {assignment.title}
        </h3>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-7 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[140px]">
                <Link
                  href={`/assignments/${assignment._id}`}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  <Eye size={14} className="text-gray-500" />
                  View Assignment
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete?.(assignment._id);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-3">
        <span
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
            statusColors[assignment.status] || 'bg-gray-100 text-gray-600'
          )}
        >
          {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div>
          <span className="font-medium text-gray-700">Assigned on: </span>
          {formatDate(assignment.createdAt)}
        </div>
        <div>
          <span className="font-medium text-gray-700">Due: </span>
          {formatDate(assignment.dueDate)}
        </div>
      </div>
    </div>
  );
}
