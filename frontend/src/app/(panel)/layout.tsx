"use client";

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme, ThemeProvider } from '../../hooks/useTheme'; 
import { DesktopSidebar, MobileHeader, MobileDrawer } from '../../components/layout/Navigation';
// Import komponen lonceng yang baru kita buat
import { NotificationBell } from '../../components/layout/NotificationBell';

// 1. KOMPONEN ISI
function PanelContent({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme(); 
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center font-mono text-sm transition-colors duration-300 ${isDark ? 'bg-slate-950 text-cyan-500' : 'bg-slate-100 text-cyan-600'}`}>
        <div className={`animate-spin w-10 h-10 border-4 border-t-transparent rounded-full ${isDark ? 'border-cyan-500' : 'border-cyan-600'}`}></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isDark ? 'dark bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* GLOBAL NOTIFICATION BELL */}
      {/* Karena posisinya sudah 'fixed' di komponen, ini akan selalu muncul di sudut kanan */}
      <NotificationBell isDark={isDark} />

      <DesktopSidebar user={user} isDark={isDark} toggleTheme={toggleTheme} onLogout={logout} />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader isDark={isDark} toggleTheme={toggleTheme} toggleMenu={() => setIsMobileOpen(!isMobileOpen)} isMobileOpen={isMobileOpen} />
        
        {isMobileOpen && (
          <MobileDrawer isDark={isDark} onLogout={logout} closeMenu={() => setIsMobileOpen(false)} />
        )}

        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}

// 2. KOMPONEN INDUK UTAMA
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <PanelContent>{children}</PanelContent>
    </ThemeProvider>
  );
}