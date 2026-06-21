import React from 'react';

// Tambahkan properti isDark
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isDark: boolean;
}

export const Pagination = ({ currentPage, totalPages, onPageChange, isDark }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`p-4 flex justify-between items-center border-t transition-colors ${isDark ? 'bg-slate-900/80 border-slate-800/60' : 'bg-slate-200/40 border-slate-400'}`}>
      <span className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex gap-2">
        <button 
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))} 
          disabled={currentPage === 1} 
          className={`px-3 py-1 text-xs rounded disabled:opacity-30 transition-colors ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-300 text-slate-700'}`}
        >
          Prev
        </button>
        <button 
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))} 
          disabled={currentPage === totalPages} 
          className={`px-3 py-1 text-xs rounded disabled:opacity-30 transition-colors ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-300 text-slate-700'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};