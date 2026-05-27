'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, ClipboardList, BookOpen, Sparkles, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/home', label: 'Home', icon: LayoutGrid },
  { href: '/assignments', label: 'Assignments', icon: ClipboardList },
  { href: '/library', label: 'Library', icon: BookOpen },
  { href: '/toolkit', label: 'AI Toolkit', icon: Sparkles },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden pointer-events-none">
      
      {/* FAB: Floating Action Button above the nav pill */}
      <div className="absolute bottom-[88px] right-6 pointer-events-auto">
        <Link
          href="/assignments/new"
          className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-orange-500 shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-transform active:scale-95"
        >
          <Plus size={24} strokeWidth={2.5} />
        </Link>
      </div>

      {/* Dark rounded pill nav */}
      <div className="mx-4 mb-6 bg-[#1A1A1A] rounded-[24px] flex items-center justify-around px-2 py-3 shadow-xl pointer-events-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1.5 w-16 text-[10px] font-medium transition-colors relative',
                isActive ? 'text-white' : 'text-[#888888] hover:text-[#AAAAAA]'
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-white' : 'text-[#888888]'} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
