'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Calculator, CreditCard, PiggyBank, Briefcase, Lightbulb, TrendingUp,
} from 'lucide-react';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/budget', label: 'Budget', icon: Calculator },
  { href: '/debt', label: 'Debt Tracker', icon: CreditCard },
  { href: '/savings', label: 'Savings', icon: PiggyBank },
  { href: '/business', label: 'Business', icon: Briefcase },
  { href: '/insights', label: 'Insights', icon: Lightbulb },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-200 flex flex-col min-h-screen">
      <div className="px-6 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 rounded-xl p-2">
            <TrendingUp size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-tight">George&apos;s</p>
            <p className="text-xs text-gray-400">Budget App</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = path === href || path.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">Built for Entrepreneurs</p>
      </div>
    </aside>
  );
}
