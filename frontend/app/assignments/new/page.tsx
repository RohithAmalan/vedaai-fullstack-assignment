'use client';

import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import MobileNav from '@/components/layout/MobileNav';
import AssignmentForm from '@/components/assignments/AssignmentForm';

export default function NewAssignmentPage() {
  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      <Sidebar />

      <div className="flex-1 ml-[240px] flex flex-col min-h-screen">
        <TopBar title="Assignment" showBack={true} />

        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            {/* Page header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create Assignment</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Configure your assignment and let AI generate the question paper.
              </p>
            </div>

            {/* Form card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <AssignmentForm />
            </div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
