'use client';

import { Sparkles, FileText, ListChecks, BookOpen, Calculator, BarChart2, Brain, ArrowRight } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import MobileNav from '@/components/layout/MobileNav';

const tools = [
  {
    icon: ListChecks,
    name: 'Rubric Builder',
    description: 'Generate detailed grading rubrics for any assignment type. Define criteria, weight marks, and share with students instantly.',
    tag: 'Assessment',
    tagColor: 'bg-orange-100 text-orange-600',
    gradient: 'from-orange-400 to-red-500',
    soon: false,
  },
  {
    icon: BookOpen,
    name: 'Lesson Planner',
    description: 'Create structured lesson plans aligned to your curriculum. Set learning objectives, activities, and assessments in minutes.',
    tag: 'Planning',
    tagColor: 'bg-violet-100 text-violet-600',
    gradient: 'from-violet-400 to-purple-600',
    soon: false,
  },
  {
    icon: Brain,
    name: 'Question Generator',
    description: 'Upload any reference material and let AI craft a full question paper — MCQs, short and long answers — tailored to your specs.',
    tag: 'AI Core',
    tagColor: 'bg-emerald-100 text-emerald-700',
    gradient: 'from-emerald-400 to-teal-600',
    soon: false,
  },
  {
    icon: Calculator,
    name: 'Math Formatter',
    description: 'Render complex equations and math expressions beautifully in question papers using LaTeX-style formatting powered by AI.',
    tag: 'STEM',
    tagColor: 'bg-sky-100 text-sky-600',
    gradient: 'from-sky-400 to-blue-600',
    soon: false,
  },
  {
    icon: BarChart2,
    name: 'Performance Analytics',
    description: 'Visualise student performance trends, identify knowledge gaps, and generate personalised feedback reports automatically.',
    tag: 'Analytics',
    tagColor: 'bg-rose-100 text-rose-600',
    gradient: 'from-rose-400 to-pink-600',
    soon: true,
  },
  {
    icon: FileText,
    name: 'PDF Export Suite',
    description: 'Export beautifully formatted question papers, answer keys, and marking schemes as PDFs ready to print or share digitally.',
    tag: 'Export',
    tagColor: 'bg-amber-100 text-amber-700',
    gradient: 'from-amber-400 to-orange-600',
    soon: true,
  },
];

export default function ToolkitPage() {
  return (
    <div className="flex min-h-screen bg-[#F3F4F6]">
      <Sidebar />

      <div className="flex-1 lg:ml-[290px] flex flex-col min-h-screen">
        <TopBar title="AI Teacher's Toolkit" showBack={false} />

        <main className="flex-1 px-4 lg:px-8 py-7 pb-32">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-2.5 h-2.5 rounded-full bg-violet-500 flex-shrink-0" />
              <h1 className="text-[18px] lg:text-[20px] font-bold text-gray-900 tracking-tight">AI Teacher's Toolkit</h1>
            </div>
            <p className="text-[13px] text-gray-500 ml-[18px]">
              Powerful AI-powered tools to help you teach smarter.
            </p>
          </div>

          {/* Featured banner */}
          <div
            className="relative rounded-[24px] lg:rounded-2xl overflow-hidden mb-8 px-6 lg:px-8 py-6"
            style={{ background: 'linear-gradient(135deg, #3b0764 0%, #6d28d9 60%, #7c3aed 100%)' }}
          >
            <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/5" />
            <div className="absolute bottom-0 right-24 w-28 h-28 rounded-full bg-violet-300/10" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-violet-300 text-sm font-semibold mb-1 uppercase tracking-wide">
                  AI Powered
                </p>
                <h2 className="text-white text-[20px] lg:text-[22px] font-extrabold leading-tight mb-1">
                  Supercharge Your Teaching
                </h2>
                <p className="text-violet-200/70 text-[13px] max-w-md">
                  All tools use Groq LLaMA 3.3 70B under the hood — blazing fast, incredibly accurate.
                </p>
              </div>
              <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/10 border border-white/20 items-center justify-center">
                <Sparkles size={28} className="text-white" />
              </div>
            </div>
          </div>

          {/* Tools grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.name}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden"
                >
                  <div className={`h-1.5 bg-gradient-to-r ${tool.gradient}`} />
                  <div className="px-5 py-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-sm`}>
                        <Icon size={18} className="text-white" />
                      </div>
                      <span className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-full ${tool.tagColor}`}>
                        {tool.tag}
                      </span>
                    </div>
                    <h3 className="text-[14.5px] font-bold text-gray-900 mb-1.5">{tool.name}</h3>
                    <p className="text-[12.5px] text-gray-500 leading-relaxed mb-4">{tool.description}</p>
                    <button
                      disabled={tool.soon}
                      className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[12.5px] font-semibold transition-all ${
                        tool.soon
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }`}
                    >
                      {tool.soon ? (
                        'Coming Soon'
                      ) : (
                        <>
                          Launch Tool
                          <ArrowRight size={13} />
                        </>
                      )}
                    </button>
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
