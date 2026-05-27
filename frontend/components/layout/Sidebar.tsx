'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  FileText,
  Wrench,
  Library,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import Logo from '@/components/ui/Logo';

const navItems = [
  { href: '/assignments', label: 'Home', icon: Home, matchExact: true },
  { href: '/groups', label: 'My Groups', icon: Users },
  { href: '/assignments', label: 'Assignments', icon: FileText, isAssignments: true },
  { href: '/toolkit', label: "AI Teacher's Toolkit", icon: Wrench },
  { href: '/library', label: 'My Library', icon: Library },
];

export default function Sidebar() {
  const pathname = usePathname();
  const assignments = useAssignmentStore((s) => s.assignments);
  const assignmentCount = assignments.length;

  // "Assignments" nav item is active whenever we're in /assignments/**
  const isAssignmentsActive = pathname.startsWith('/assignments');

  return (
    <aside className="hidden lg:flex flex-col w-[240px] h-[calc(100vh-48px)] bg-white rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] fixed left-6 top-6 z-20">
      <div className="flex items-center gap-[6px] px-5 pt-6 pb-5">
        <Logo className="w-10 h-10 flex-shrink-0" />
        <span className="text-[26px] font-black tracking-tighter text-[#2a2a2a]">VedaAI</span>
      </div>

      {/* Create Assignment CTA */}
      <div className="px-4 pb-5">
        <div className="p-[1.5px] rounded-full" style={{ background: 'linear-gradient(135deg, #FF6B2C, #C94010)' }}>
          <Link
            href="/assignments/new"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white text-[13px] font-semibold rounded-full transition-colors"
          >
            <span className="text-[15px] leading-none font-light">✦</span>
            Create Assignment
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon, isAssignments }) => {
          // "Assignments" item is active for any /assignments path
          // "Home" item is never highlighted (Assignments takes priority)
          const isActive = isAssignments
            ? isAssignmentsActive
            : false;

          return (
            <Link
              key={label}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-[9px] rounded-lg text-[13.5px] font-medium transition-colors',
                isActive
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              )}
            >
              <Icon
                size={17}
                strokeWidth={isActive ? 2.2 : 1.8}
                className={cn(isActive ? 'text-gray-800' : 'text-gray-400')}
              />
              <span className="flex-1">{label}</span>
              {isAssignments && assignmentCount > 0 && (
                <span className="bg-[#FF6B2C] text-white text-[10px] font-bold px-[7px] py-[2px] rounded-full min-w-[20px] text-center leading-4">
                  {assignmentCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Settings + School card */}
      <div className="mt-auto">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-6 py-3 text-[13px] font-medium text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Settings size={15} strokeWidth={1.8} />
          Settings
        </Link>
        <div className="mx-3 mb-3 flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-50 border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            <span className="text-xl">🏫</span>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-gray-900 truncate">Delhi Public School</p>
            <p className="text-[11px] text-gray-400 truncate">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
