'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import MobileNav from '@/components/layout/MobileNav';
import AssignmentCard from '@/components/assignments/AssignmentCard';
import EmptyState from '@/components/assignments/EmptyState';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { getAllAssignments, deleteAssignment } from '@/services/api';

export default function AssignmentsPage() {
  const { assignments, setAssignments } = useAssignmentStore();

  useEffect(() => {
    getAllAssignments()
      .then((res) => setAssignments(res.assignments))
      .catch(() => {});
  }, [setAssignments]);

  const handleDelete = async (id: string) => {
    try {
      await deleteAssignment(id);
    } catch {
      // still remove from UI
    }
    setAssignments(assignments.filter((a) => a._id !== id));
  };

  return (
    <div className="flex min-h-screen w-full bg-[#EBEBEB] overflow-x-hidden">
      <Sidebar />

      {/* Main area — offset by sidebar width */}
      <div className="flex-1 min-w-0 lg:ml-[290px] flex flex-col min-h-screen">
        <TopBar title="Assignment" showBack={false} />

        <main className="flex-1 px-6 pt-5 pb-28">
          {assignments.length > 0 ? (
            <>
              {/* Page heading row */}
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-[10px] h-[10px] rounded-full bg-green-500 flex-shrink-0" />
                <h1 className="text-[19px] font-bold text-gray-900 tracking-tight">Assignments</h1>
              </div>
              <p className="text-[12.5px] text-gray-500 mb-5 ml-[18px]">
                Manage and create assignments for your classes.
              </p>

              {/* Filter + Search row (joined pill) */}
              <div className="flex items-center w-full h-[50px] bg-white rounded-full border border-gray-200/60 shadow-sm mb-6 px-4">
                <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors shrink-0">
                  <SlidersHorizontal size={15} strokeWidth={2} />
                  <span className="text-[13px] font-medium">Filter</span>
                </button>
                
                <div className="w-[1px] h-[24px] bg-gray-200 mx-4 shrink-0" />
                
                <div className="flex-1 flex items-center relative">
                  <Search size={15} className="text-gray-400 absolute left-0" strokeWidth={2} />
                  <input
                    type="text"
                    placeholder="Search Name"
                    className="w-full pl-7 bg-transparent text-[13px] outline-none placeholder:text-gray-400 text-gray-700"
                  />
                </div>
              </div>

              {/* Grid: 1 col on mobile, 2 cols on desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {assignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment._id}
                    assignment={assignment}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </>
          ) : (
            /* Empty state — centered in available space */
            <div className="flex items-center justify-center min-h-[calc(100vh-54px-80px)]">
              <EmptyState />
            </div>
          )}
        </main>
      </div>

      {/* Floating "+ Create Assignment" button (Desktop only) */}
      <div
        className="hidden lg:flex fixed bottom-7 z-40"
        style={{
          left: 'calc(290px + (100vw - 290px) / 2)',
          transform: 'translateX(-50%)',
        }}
      >
        <Link
          href="/assignments/new"
          className="flex items-center gap-2 px-7 py-[13px] bg-gray-900 hover:bg-gray-800 text-white text-[13px] font-semibold rounded-full shadow-2xl transition-colors"
        >
          <Plus size={14} strokeWidth={2.5} />
          Create Assignment
        </Link>
      </div>

      {/* Mobile FAB */}
      <Link
        href="/assignments/new"
        className="lg:hidden fixed bottom-[100px] right-6 z-40 w-14 h-14 bg-white rounded-full shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] flex items-center justify-center text-orange-500 hover:scale-105 active:scale-95 transition-transform border border-gray-100"
      >
        <Plus size={28} strokeWidth={2} />
      </Link>

      <MobileNav />
    </div>
  );
}
