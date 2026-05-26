'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import MobileNav from '@/components/layout/MobileNav';
import AssignmentCard from '@/components/assignments/AssignmentCard';
import EmptyState from '@/components/assignments/EmptyState';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { getAllAssignments } from '@/services/api';

export default function AssignmentsPage() {
  const { assignments, setAssignments } = useAssignmentStore();

  useEffect(() => {
    getAllAssignments()
      .then((res) => setAssignments(res.assignments))
      .catch(() => {});
  }, [setAssignments]);

  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      <Sidebar />

      <div className="flex-1 ml-[240px] flex flex-col min-h-screen">
        <TopBar title="Assignment" showBack={false} />

        <main className="flex-1 p-6">
          {/* Page Header */}
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">Assignments</h2>
            <p className="text-sm text-gray-500 mt-0.5">Manage and create assignments for your classes.</p>
          </div>

          {assignments.length > 0 ? (
            <>
              {/* Search & Filter Bar */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-500 hover:border-gray-300 cursor-pointer transition-colors">
                  <Filter size={14} />
                  <span>Filter By</span>
                </div>
                <div className="flex-1 relative max-w-sm">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search Assignment"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* Assignment Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment._id}
                    assignment={assignment}
                    onDelete={(id) => setAssignments(assignments.filter((a) => a._id !== id))}
                  />
                ))}
              </div>

              {/* Sticky Create Button */}
              <div className="flex justify-center mt-6">
                <Link
                  href="/assignments/new"
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg"
                >
                  <Plus size={16} strokeWidth={2.5} />
                  Create Assignment
                </Link>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 min-h-[400px] flex items-center justify-center">
              <EmptyState />
            </div>
          )}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
