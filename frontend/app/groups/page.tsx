'use client';

import Link from 'next/link';
import { Users, Plus, ChevronRight, BookOpen, UserCheck } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import MobileNav from '@/components/layout/MobileNav';

const groups = [
  {
    id: '1',
    name: 'Grade 10 – Science',
    subject: 'Physics & Chemistry',
    students: 34,
    assignments: 8,
    color: 'from-orange-400 to-red-500',
    emoji: '🔬',
  },
  {
    id: '2',
    name: 'Grade 9 – Mathematics',
    subject: 'Algebra & Geometry',
    students: 28,
    assignments: 5,
    color: 'from-violet-400 to-purple-600',
    emoji: '📐',
  },
  {
    id: '3',
    name: 'Grade 11 – Biology',
    subject: 'Life Sciences',
    students: 31,
    assignments: 6,
    color: 'from-emerald-400 to-teal-600',
    emoji: '🧬',
  },
  {
    id: '4',
    name: 'Grade 8 – History',
    subject: 'Social Studies',
    students: 29,
    assignments: 3,
    color: 'from-sky-400 to-blue-600',
    emoji: '📜',
  },
  {
    id: '5',
    name: 'Grade 10 – English',
    subject: 'Literature & Grammar',
    students: 36,
    assignments: 7,
    color: 'from-rose-400 to-pink-600',
    emoji: '📖',
  },
  {
    id: '6',
    name: 'Grade 12 – Economics',
    subject: 'Macro & Micro Economics',
    students: 25,
    assignments: 4,
    color: 'from-amber-400 to-orange-600',
    emoji: '📊',
  },
];

export default function GroupsPage() {
  return (
    <div className="flex min-h-screen bg-[#F3F4F6]">
      <Sidebar />

      <div className="flex-1 lg:ml-[290px] flex flex-col min-h-screen">
        <TopBar title="My Groups" showBack={false} />

        <main className="flex-1 px-8 py-7 pb-24">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-500 flex-shrink-0" />
                <h1 className="text-[20px] font-bold text-gray-900 tracking-tight">My Groups</h1>
              </div>
              <p className="text-[13px] text-gray-500 ml-[18px]">
                Manage your classroom groups and student assignments.
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-full shadow-lg transition-colors">
              <Plus size={15} strokeWidth={2.5} />
              New Group
            </button>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4 mb-7">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                <Users size={20} className="text-violet-500" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">6</p>
                <p className="text-xs text-gray-500 font-medium">Total Groups</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                <UserCheck size={20} className="text-sky-500" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">183</p>
                <p className="text-xs text-gray-500 font-medium">Total Students</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <BookOpen size={20} className="text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">33</p>
                <p className="text-xs text-gray-500 font-medium">Assignments Given</p>
              </div>
            </div>
          </div>

          {/* Groups grid */}
          <div className="grid grid-cols-3 gap-4">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden"
              >
                {/* Gradient top bar */}
                <div className={`h-2 bg-gradient-to-r ${group.color}`} />

                <div className="px-5 py-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center text-2xl flex-shrink-0 border border-gray-100">
                      {group.emoji}
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <h3 className="text-[14.5px] font-bold text-gray-900 mb-0.5">{group.name}</h3>
                  <p className="text-[12px] text-gray-400 mb-4">{group.subject}</p>

                  <div className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Users size={13} className="text-gray-400" />
                      <span className="font-semibold text-gray-700">{group.students}</span>
                      <span>students</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <BookOpen size={13} className="text-gray-400" />
                      <span className="font-semibold text-gray-700">{group.assignments}</span>
                      <span>assignments</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
