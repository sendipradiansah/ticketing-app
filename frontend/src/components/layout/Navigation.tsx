"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Ticket, Power, Hexagon, Menu, X, Terminal, Sun, Moon } from 'lucide-react';
import { NotificationBell } from './NotificationBell'; // Import komponen yang baru kita buat

// Daftar Menu Navigasi
const MENU_ITEMS = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Ticket List', path: '/tickets', icon: Ticket },
];

export const DesktopSidebar = ({ user, isDark, toggleTheme, onLogout }: any) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <aside className={`hidden md:flex flex-col w-64 sticky top-0 h-screen z-40 border-r transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800/60' : 'bg-slate-50 border-slate-300'}`}>
      <div className={`h-16 flex items-center justify-between px-6 border-b transition-colors ${isDark ? 'border-slate-800/60' : 'border-slate-300'}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded flex items-center justify-center shadow-md">
            <Hexagon className="w-5 h-5 text-white" />
          </div>
          <span className={`font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-white to-slate-400' : 'from-slate-800 to-slate-500'}`}>HELPDESK</span>
        </div>
        
        {/* GRUP TOMBOL KANAN (Notifikasi + Tema) */}
        <div className="flex items-center gap-2">
          <NotificationBell isDark={isDark} />
          <button onClick={toggleTheme} className={`p-1.5 rounded-lg border transition-all ${isDark ? 'bg-slate-950 border-slate-800 text-amber-400 hover:bg-slate-800' : 'bg-slate-100 border-slate-400 text-slate-700 hover:bg-slate-200 shadow-sm'}`}>
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className={`p-4 mx-4 my-4 border rounded-xl flex items-center gap-3 transition-colors ${isDark ? 'bg-slate-950/50 border-slate-800/40' : 'bg-slate-100 border-slate-400 shadow-sm'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-slate-400 text-slate-600'}`}>
          <Terminal className="w-4 h-4" />
        </div>
        <div className="overflow-hidden">
          <div className={`text-sm font-semibold truncate ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{user?.name}</div>
          <div className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 mt-0.5 uppercase tracking-wider">{user?.role}</div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} href={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              isActive(item.path) 
                ? (isDark ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-slate-200 text-slate-900 border border-slate-400 shadow-sm') 
                : (isDark ? 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900')
            }`}>
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className={`p-4 border-t transition-colors ${isDark ? 'border-slate-800/60' : 'border-slate-300'}`}>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20 transition-all group">
          <Power className="w-5 h-5 text-rose-500/80 dark:text-rose-400/80 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export const MobileHeader = ({ isDark, toggleTheme, toggleMenu, isMobileOpen }: any) => (
  <header className={`md:hidden border-b h-16 flex items-center justify-between px-4 sticky top-0 z-50 transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800/60 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}>
    <div className="font-bold tracking-wider flex items-center gap-2">
      <Hexagon className="w-6 h-6 text-cyan-600 dark:text-cyan-500" /> Helpdesk
    </div>
    <div className="flex items-center gap-2">
      {/* GRUP TOMBOL KANAN MOBILE */}
      <NotificationBell isDark={isDark} />
      <button onClick={toggleTheme} className={`p-2 rounded-lg border transition-all ${isDark ? 'bg-slate-950 border-slate-800 text-amber-400' : 'bg-slate-100 border-slate-400 text-slate-700 shadow-sm'}`}>
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
      <button onClick={toggleMenu} className="p-2 text-slate-500 hover:text-slate-800 outline-none">
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  </header>
);
// ... sisakan MobileDrawer tetap sama

export const MobileDrawer = ({ isDark, onLogout, closeMenu }: any) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <div className={`md:hidden fixed inset-0 top-16 z-40 px-4 py-6 space-y-3 flex flex-col border-b transition-colors ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'}`}>
      {MENU_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.path} href={item.path} onClick={closeMenu} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${isActive(item.path) ? (isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-200 text-slate-900 border border-slate-400') : 'text-slate-600'}`}>
            <Icon className="w-5 h-5" /> {item.name}
          </Link>
        );
      })}
      <div className={`pt-6 border-t mt-auto ${isDark ? 'border-slate-800' : 'border-slate-300'}`}>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 dark:text-rose-500 text-sm font-medium hover:bg-rose-100 dark:hover:bg-rose-500/10 rounded-lg transition">
          <Power className="w-5 h-5" /> Sign Out
        </button>
      </div>
    </div>
  );
};