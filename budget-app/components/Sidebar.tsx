'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Calculator, CreditCard, PiggyBank, Briefcase, Lightbulb,
  TrendingUp, LineChart, Target, FlaskConical, Scale, FileBarChart, RefreshCw,
} from 'lucide-react';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/budget', label: 'Budget', icon: Calculator },
  { href: '/debt', label: 'Debt Tracker', icon: CreditCard },
  { href: '/savings', label: 'Savings', icon: PiggyBank },
  { href: '/business', label: 'Business', icon: Briefcase },
  { href: '/insights', label: 'Insights', icon: Lightbulb },
  { section: 'Advanced' },
  { href: '/forecast', label: 'Cash Flow', icon: LineChart },
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/scenarios', label: 'Scenarios', icon: FlaskConical },
  { href: '/networth', label: 'Net Worth', icon: Scale },
  { href: '/reports', label: 'Reports', icon: FileBarChart },
  { href: '/recurring', label: 'Recurring Bills', icon: RefreshCw },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-60 shrink-0 bg-white border-r border-gray-200 flex flex-col min-h-screen">
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 rounded-xl p-2">
            <TrendingUp size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-tight">George&apos;s</p>
            <p className="text-xs text-gray-400">Budget App</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {nav.map((item, i) => {
          if ('section' in item) {
            return <p key={i} className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 pt-4 pb-1">{item.section}</p>;
          }
          const { href, label, icon: Icon } = item as { href: string; label: string; icon: React.ElementType };
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-3 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">Built for Entrepreneurs</p>
      </div>
    </aside>
  );
}
