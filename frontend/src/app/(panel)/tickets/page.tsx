"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTickets } from '@/hooks/useTickets';
import { useTheme } from '@/hooks/useTheme'; // 1. Impor useTheme
import { StatusBadge } from '@/components/tickets/StatusBadge';
import { Pagination } from '@/components/ui/Pagination';

export default function TicketList() {
  const router = useRouter();
  const { isDark } = useTheme(); // 2. Ambil fungsi isDark
  
  const {
    role, loading,
    search, setSearch,
    statusFilter, setStatusFilter,
    categoryFilter, setCategoryFilter,
    currentPage, setCurrentPage,
    totalPages, paginatedTickets,
    exportToExcel, exportToPDF
  } = useTickets(5);

  if (loading) {
    return <div className={`font-mono text-xs ${isDark ? 'text-cyan-500' : 'text-cyan-600'}`}>FETCHING TRANSMISSIONS...</div>;
  }

  return (
    <div>
      {/* 2. UPDATE HEADER DENGAN TOMBOL EXPORT */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
        <div>
          <h1 className={`text-3xl font-extrabold tracking-tight transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Ticket Repository
          </h1>
          <p className={`mt-1 transition-colors ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Gunakan panel filter untuk penyaringan data cepat.
          </p>
        </div>
        
        {/* Grup Tombol Aksi */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tombol Excel */}
          <button 
            onClick={exportToExcel}
            className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-colors flex items-center gap-2 shadow-sm ${isDark ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}
          >
            <span>📊</span> Excel
          </button>
          
          {/* Tombol PDF */}
          <button 
            onClick={exportToPDF}
            className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-colors flex items-center gap-2 shadow-sm ${isDark ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}
          >
            <span>📄</span> PDF
          </button>

          {/* Tombol Tambah Tiket */}
          {role === 'USER' && (
            <button 
              onClick={() => router.push('/tickets/create')} 
              className="px-5 py-2 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.2)] transition ml-2"
            >
              + Add Ticket
            </button>
          )}
        </div>
      </div>
      {/* CONTROL BAR (FILTERS) */}
      <div className={`shadow-sm rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between transition-colors duration-300 border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100 border-slate-400'}`}>
        <input 
          type="text" 
          placeholder="🔍 Cari judul atau ID..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className={`rounded-lg px-4 py-2 text-sm outline-none focus:border-cyan-500 w-full md:w-1/3 transition-colors border ${isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'}`} 
        />
        <div className="flex gap-4 w-full md:w-auto">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`rounded-lg px-4 py-2 text-sm outline-none cursor-pointer w-full transition-colors border ${isDark ? 'bg-slate-950 border-slate-700 text-slate-300' : 'bg-white border-slate-300 text-slate-700'}`}>
            <option value="ALL">Semua Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={`rounded-lg px-4 py-2 text-sm outline-none cursor-pointer w-full transition-colors border ${isDark ? 'bg-slate-950 border-slate-700 text-slate-300' : 'bg-white border-slate-300 text-slate-700'}`}>
            <option value="ALL">Semua Kategori</option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Network">Network</option>
            <option value="Account">Account</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* TABLE DATA */}
      <div className={`overflow-hidden shadow-sm transition-colors duration-300 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-slate-800/60' : 'bg-slate-100 border-slate-400'}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b text-xs font-mono transition-colors ${isDark ? 'bg-slate-800/40 border-slate-700/50 text-slate-400' : 'bg-slate-200/60 border-slate-400 text-slate-600'}`}>
              <th className="p-4">ID</th><th className="p-4">Subject</th><th className="p-4">Category</th><th className="p-4">Status</th>
              {role !== 'USER' && <th className="p-4">Author</th>}
            </tr>
          </thead>
          <tbody className={`divide-y text-sm transition-colors ${isDark ? 'divide-slate-800/50' : 'divide-slate-300'}`}>
            {paginatedTickets.length === 0 ? (
              <tr><td colSpan={5} className="p-12 text-center text-slate-500 font-mono">NO COMPATIBLE DATA FOUND</td></tr>
            ) : (
              paginatedTickets.map((t) => (
                <tr 
                  key={t.id} 
                  onClick={() => router.push(`/tickets/${t.id}`)} 
                  className={`transition cursor-pointer group ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-200/80'}`}
                >
                  <td className={`p-4 font-mono transition-colors ${isDark ? 'text-slate-500 group-hover:text-cyan-400' : 'text-slate-500 group-hover:text-cyan-600'}`}>#{t.id}</td>
                  <td className={`p-4 font-medium transition-colors ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{t.title}</td>
                  <td className={`p-4 transition-colors ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{t.category}</td>
                  
                  {/* Lempar state isDark ke Badge */}
                  <td className="p-4"><StatusBadge status={t.status} isDark={isDark} /></td>
                  
                  {role !== 'USER' && <td className={`p-4 transition-colors ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t.createdBy?.name}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Lempar state isDark ke Pagination */}
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
          isDark={isDark} 
        />
      </div>
    </div>
  );
}