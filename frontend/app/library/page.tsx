'use client';

import { BookOpen, FileText, Download, Star, Clock, Search, Filter } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import MobileNav from '@/components/layout/MobileNav';

const templates = [
  {
    id: '1',
    title: 'Standard MCQ Template',
    category: 'Question Paper',
    categoryColor: 'bg-orange-100 text-orange-600',
    description: '50-question MCQ template with 4 options each. Pre-formatted with marking scheme.',
    downloads: 128,
    starred: true,
    gradient: 'from-orange-400 to-red-500',
    icon: FileText,
  },
  {
    id: '2',
    title: 'CBSE Science Paper',
    category: 'Syllabus',
    categoryColor: 'bg-emerald-100 text-emerald-700',
    description: 'Full CBSE Grade 10 Science curriculum aligned paper with section A/B/C structure.',
    downloads: 87,
    starred: true,
    gradient: 'from-emerald-400 to-teal-600',
    icon: BookOpen,
  },
  {
    id: '3',
    title: 'Short Answer Template',
    category: 'Question Paper',
    categoryColor: 'bg-orange-100 text-orange-600',
    description: 'Structured short-answer template with section headings, marks per question, and total marks.',
    downloads: 64,
    starred: false,
    gradient: 'from-sky-400 to-blue-600',
    icon: FileText,
  },
  {
    id: '4',
    title: 'Grade 12 Math Syllabus',
    category: 'Syllabus',
    categoryColor: 'bg-emerald-100 text-emerald-700',
    description: 'Comprehensive Grade 12 Mathematics syllabus covering all chapters with topic weights.',
    downloads: 45,
    starred: false,
    gradient: 'from-violet-400 to-purple-600',
    icon: BookOpen,
  },
  {
    id: '5',
    title: 'Essay & Long Answer',
    category: 'Question Paper',
    categoryColor: 'bg-orange-100 text-orange-600',
    description: '10-question long-answer template with word limit guidelines and evaluation criteria.',
    downloads: 39,
    starred: false,
    gradient: 'from-rose-400 to-pink-600',
    icon: FileText,
  },
  {
    id: '6',
    title: 'Mixed Format Paper',
    category: 'Generated PDF',
    categoryColor: 'bg-blue-100 text-blue-700',
    description: 'AI-generated paper with MCQ + short + long answer sections. Exported on 20-06-2025.',
    downloads: 22,
    starred: false,
    gradient: 'from-amber-400 to-orange-600',
    icon: FileText,
  },
];

export default function LibraryPage() {
  return (
    <div className="flex min-h-screen w-full bg-[#F3F4F6] overflow-x-hidden">
      <Sidebar />

      <div className="flex-1 min-w-0 lg:ml-[290px] flex flex-col min-h-screen">
        <TopBar title="My Library" showBack={false} />

        <main className="flex-1 px-4 lg:px-8 py-5 lg:py-7 pb-32">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-2.5 h-2.5 rounded-full bg-sky-500 flex-shrink-0" />
                <h1 className="text-[20px] font-bold text-gray-900 tracking-tight">My Library</h1>
              </div>
              <p className="text-[13px] text-gray-500 ml-[18px]">
                Saved templates, syllabi, and exported question papers.
              </p>
            </div>
          </div>

          {/* Search + Filter */}
          <div className="flex items-center gap-3 mb-6">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
              <Filter size={13} strokeWidth={2} />
              Filter By
            </button>
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2} />
              <input
                type="text"
                placeholder="Search library…"
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-white text-[13px] outline-none focus:border-gray-300 transition-colors shadow-sm placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
            <div className="bg-white rounded-[24px] lg:rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                <BookOpen size={20} className="text-sky-500" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">6</p>
                <p className="text-xs text-gray-500 font-medium">Total Resources</p>
              </div>
            </div>
            <div className="bg-white rounded-[24px] lg:rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Star size={20} className="text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">2</p>
                <p className="text-xs text-gray-500 font-medium">Starred Items</p>
              </div>
            </div>
            <div className="bg-white rounded-[24px] lg:rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <Download size={20} className="text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">385</p>
                <p className="text-xs text-gray-500 font-medium">Total Downloads</p>
              </div>
            </div>
          </div>

          {/* Templates grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((tpl) => {
              const Icon = tpl.icon;
              return (
                <div
                  key={tpl.id}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden"
                >
                  <div className={`h-1.5 bg-gradient-to-r ${tpl.gradient}`} />
                  <div className="px-5 py-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tpl.gradient} flex items-center justify-center shadow-sm`}>
                        <Icon size={17} className="text-white" />
                      </div>
                      <div className="flex items-center gap-2">
                        {tpl.starred && (
                          <Star size={14} className="text-amber-400 fill-amber-400" />
                        )}
                        <span className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-full ${tpl.categoryColor}`}>
                          {tpl.category}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-[14px] font-bold text-gray-900 mb-1.5">{tpl.title}</h3>
                    <p className="text-[12px] text-gray-500 leading-relaxed mb-4">{tpl.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
                        <Download size={12} />
                        <span>{tpl.downloads} downloads</span>
                      </div>
                      <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-[11.5px] font-semibold rounded-lg transition-colors">
                        <Download size={12} />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
