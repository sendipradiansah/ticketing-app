"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, CheckSquare } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

export const NotificationBell = ({ isDark }: { isDark: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();

  // Logika untuk menutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // LOGIKA BARU: Penanganan klik dan ekstraksi ID
  const handleNotifClick = (notif: any) => {
    markAsRead(notif.id);
    
    // Mengekstrak angka setelah simbol '#' dari pesan (misal dari "Tiket #123")
    const match = notif.message.match(/#(\d+)/);
    const extractedTicketId = match ? match[1] : null;

    // Gunakan notif.ticketId jika dari backend sudah dikirim, jika tidak gunakan hasil ekstrak regex
    const finalTicketId = notif.ticketId || extractedTicketId;

    if (finalTicketId) {
      router.push(`/tickets/${finalTicketId}`);
    }
    
    setIsOpen(false); // Tutup dropdown setelah diklik
  };

  return (
    <div className="fixed top-4 right-6 z-[100]" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`p-2 rounded-full border shadow-md transition-all ${
          isDark 
            ? 'bg-slate-900 border-slate-700 text-cyan-400 hover:bg-slate-800' 
            : 'bg-white border-slate-200 text-cyan-600 hover:bg-slate-50'
        }`}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={`absolute top-12 right-0 w-80 rounded-xl border shadow-2xl z-50 overflow-hidden ${
          isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          {/* Header Dropdown dengan tombol Mark All */}
          <div className={`p-3 flex justify-between items-center border-b text-xs font-semibold ${
            isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-100 bg-slate-50'
          }`}>
            <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>NOTIFICATIONS</span>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead} 
                className="text-[10px] text-cyan-500 hover:text-cyan-400 flex items-center gap-1 font-bold transition-colors"
              >
                <CheckSquare className="w-3 h-3" /> MARK ALL READ
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">NO NEW NOTIFICATIONS</div>
            ) : (
              notifications.map((notif: any) => (
                <div 
                  key={notif.id} 
                  onClick={() => handleNotifClick(notif)}
                  className={`p-3 text-xs cursor-pointer transition flex flex-col gap-1 ${
                    !notif.isRead 
                      ? (isDark ? 'bg-cyan-900/20' : 'bg-cyan-50') 
                      : ''
                  } hover:opacity-80`}
                >
                  <p className={notif.isRead 
                    ? (isDark ? 'text-slate-500' : 'text-slate-400') 
                    : (isDark ? 'text-slate-200 font-medium' : 'text-slate-800 font-medium')
                  }>
                    {/* Teks notifikasi akan dirender di sini */}
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(notif.createdAt).toLocaleTimeString('id-ID')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};