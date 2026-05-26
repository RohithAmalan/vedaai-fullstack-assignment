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
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/groups', label: 'My Groups', icon: Users },
  { href: '/assignments', label: 'Assignments', icon: FileText, badge: 10 },
  { href: '/toolkit', label: "AI Teacher's Toolkit", icon: Wrench },
  { href: '/library', label: 'My Library', icon: Library },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-[240px] min-h-screen bg-white border-r border-gray-100 fixed left-0 top-0 z-20">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-white font-bold text-sm">V</span>
        </div>
        <span className="text-lg font-bold text-gray-900">VedaAI</span>
      </div>

      {/* Create Assignment CTA */}
      <div className="px-4 py-4">
        <Link
          href="/assignments/new"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus size={16} strokeWidth={2.5} />
          Create Assignment
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const isActive =
            href === '/'
              ? pathname === '/'
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-orange-50 text-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon
                size={18}
                className={cn(isActive ? 'text-primary' : 'text-gray-500')}
              />
              <span className="flex-1">{label}</span>
              {badge !== undefined && (
                <span className="bg-gray-900 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="mt-auto border-t border-gray-100">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Settings size={16} />
          Settings
        </Link>
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden flex-shrink-0">
            <span className="text-primary font-semibold text-sm">D</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">Delhi Public School</p>
            <p className="text-xs text-gray-500 truncate">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
