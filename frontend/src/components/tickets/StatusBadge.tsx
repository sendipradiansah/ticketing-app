import React from 'react';

// Tambahkan isDark ke dalam parameter
export const StatusBadge = ({ status, isDark }: { status: string; isDark: boolean }) => {
  
  if (status === 'OPEN') return (
    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border transition-colors ${isDark ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-cyan-100 text-cyan-700 border-cyan-300'}`}>
      OPEN
    </span>
  );
  
  if (status === 'IN_PROGRESS') return (
    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border transition-colors ${isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-100 text-amber-700 border-amber-300'}`}>
      IN PROGRESS
    </span>
  );
  
  if (status === 'DONE') return (
    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border transition-colors ${isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-100 text-emerald-700 border-emerald-300'}`}>
      DONE
    </span>
  );
  
  return (
    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border transition-colors ${isDark ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-100 text-rose-700 border-rose-300'}`}>
      REJECTED
    </span>
  );
};