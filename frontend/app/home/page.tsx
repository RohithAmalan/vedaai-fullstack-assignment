import Link from 'next/link';
import { Plus } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import MobileNav from '@/components/layout/MobileNav';
import EmptyState from '@/components/assignments/EmptyState';

export default function HomePage() {
  return (
    <div className="flex min-h-screen w-full bg-[#F3F4F6] overflow-x-hidden">
      <Sidebar />

      <div className="flex-1 min-w-0 lg:ml-[290px] flex flex-col min-h-screen">
        <TopBar title="Home" showBack={false} hideMobileBreadcrumb={true} />

        <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-60px-80px)] px-6 pb-28">
          <EmptyState />
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
