"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useTicketDetail } from '../../../../hooks/useTicketDetail'; 
import { useTheme } from '../../../../hooks/useTheme'; 
import { StatusBadge } from '../../../../components/tickets/StatusBadge'; 
import { TicketTimeline } from '../../../../components/tickets/TicketTimeline';

export default function TicketDetail() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const { isDark } = useTheme();
  const { user, ticket, loading, isUpdating, changeStatus, sendComment, timeline } = useTicketDetail(ticketId);
  
  // State untuk fitur Assign
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');

  // Fetch daftar staff jika user adalah ADMIN
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      axios.get(`http://localhost:3000/tickets/staff-list`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then(res => setStaffList(res.data)).catch(err => console.error(err));
    }
  }, [user]);

  const handleAssign = async () => {
    if (!selectedStaff) return;
    try {
      await axios.patch(`http://localhost:3000/tickets/${ticketId}/assign`, 
        { assignedToId: parseInt(selectedStaff) },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Staff berhasil ditugaskan!');
      window.location.reload(); 
    } catch (err) {
      alert('Gagal menugaskan staff.');
    }
  };

  if (loading || !ticket) {
    return <div className={`min-h-[50vh] flex items-center justify-center font-mono text-sm animate-pulse ${isDark ? 'text-cyan-500' : 'text-cyan-600'}`}>DECRYPTING DATABANK...</div>;
  }

  const rawFileUrl = ticket.fileUrl || ticket.file_url || ticket.file_path || ticket.attachment || ticket.attachmentUrl || ticket.file;
  const fullFileUrl = rawFileUrl ? (rawFileUrl.startsWith('http') ? rawFileUrl : `http://localhost:3000${rawFileUrl.startsWith('/') ? '' : '/'}${rawFileUrl}`) : null;

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <button onClick={() => router.push('/tickets')} className={`text-xs font-mono transition-colors mb-6 flex items-center gap-2 ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
        <span>←</span> BACK TO TICKET LIST
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className={`border rounded-2xl p-6 relative overflow-hidden transition-colors duration-300 shadow-sm ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100 border-slate-400'}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-bl-full pointer-events-none"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className={`font-mono text-xs mb-2 transition-colors ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>TICKET #{ticket.id}</div>
                <h1 className={`text-2xl font-bold mb-2 transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>{ticket.title}</h1>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  <span className={`px-2.5 py-1 rounded border transition-colors ${isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-white border-slate-300 text-slate-700'}`}>{ticket.category}</span>
                  <span className={`px-2.5 py-1 rounded border transition-colors ${isDark ? 'bg-slate-950 border-slate-800 text-orange-400' : 'bg-white border-slate-300 text-orange-600'}`}>PRIORITY: {ticket.priority}</span>
                </div>
              </div>
              <StatusBadge status={ticket.status} isDark={isDark} />
            </div>
            <div className={`border-t pt-5 transition-colors ${isDark ? 'border-slate-800/60' : 'border-slate-300'}`}>
              <h3 className="text-xs font-mono text-slate-500 mb-3 uppercase">Description</h3>
              <div className={`whitespace-pre-wrap text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{ticket.description}</div>
            </div>
            {fullFileUrl && (
              <div className={`mt-5 p-4 border rounded-xl flex items-center justify-between transition-colors ${isDark ? 'bg-slate-950/50 border-slate-800/50' : 'bg-white border-slate-300'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>📎</div>
                  <div>
                    <div className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Lampiran File</div>
                  </div>
                </div>
                <a href={fullFileUrl} target="_blank" rel="noreferrer" className={`px-4 py-2 rounded-lg text-sm border ${isDark ? 'bg-slate-800 border-slate-700 text-cyan-400' : 'bg-white border-slate-300 text-cyan-600'}`}>Open File</a>
              </div>
            )}
          </div>

          <TicketTimeline timeline={timeline} user={user} isDark={isDark} isUpdating={isUpdating} onSendComment={sendComment} />
        </div>

        <div className="space-y-6">
          {/* Metadata Creator */}
          <div className={`border rounded-2xl p-6 ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100 border-slate-400'}`}>
            <h3 className="text-xs font-mono text-slate-500 mb-4 uppercase">Ticket Origin</h3>
            <div className="space-y-4 text-sm">
              <div className="flex flex-col gap-1 border-b pb-3 border-slate-800">
                <span className="text-xs text-slate-500">Dibuat Oleh</span>
                <span className="font-medium text-slate-200">{ticket.createdBy?.name}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">Waktu Dibuat</span>
                <span className="font-mono text-slate-200">{new Date(ticket.createdAt).toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Panel Assign (Khusus Admin) */}
          {user?.role === 'ADMIN' && (
            <div className={`border rounded-2xl p-6 ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100 border-slate-400'}`}>
              <h3 className="text-xs font-mono text-slate-500 mb-4 uppercase">Assign to Staff</h3>
              <select 
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className={`w-full border rounded-lg px-4 py-2 mb-4 ${isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-white border-slate-300'}`}
              >
                <option value="">Pilih Staff...</option>
                {staffList.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <button onClick={handleAssign} className="w-full py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500">Assign Staff</button>
            </div>
          )}

          {/* Panel Kontrol Status */}
          {user?.role !== 'USER' && (
            <div className={`border rounded-2xl p-6 ${isDark ? 'bg-slate-900/60 border-amber-900/30' : 'bg-amber-50 border-amber-300'}`}>
              <h3 className="text-xs font-mono mb-4 uppercase text-amber-500">⚙️ Change Ticket Status</h3>
              <select 
                value={ticket.status} 
                onChange={(e) => changeStatus(e.target.value)}
                disabled={isUpdating}
                className={`w-full border rounded-lg px-4 py-3 text-sm cursor-pointer ${isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-white border-slate-300'}`}
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}