"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export const useTicketDetail = (ticketId: string | string[]) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchTicketDetail = useCallback(async () => {
    if (ticketId === 'create') return;
    
    const token = localStorage.getItem('token');
    if (!token) return router.push('/');

    try {
      const profileRes = await axios.get('http://localhost:3000/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      setUser(profileRes.data);

      const ticketRes = await axios.get(`http://localhost:3000/tickets/${ticketId}`, { headers: { Authorization: `Bearer ${token}` } });
      setTicket(ticketRes.data);
    } catch (error) {
      console.error(error);
      alert('Tiket tidak ditemukan atau Anda tidak memiliki akses.');
      router.push('/tickets');
    } finally {
      setLoading(false);
    }
  }, [ticketId, router]);

  useEffect(() => {
    fetchTicketDetail();
  }, [fetchTicketDetail]);

  const changeStatus = async (newStatus: string) => {
    if (!confirm(`Ubah status tiket menjadi ${newStatus}?`)) return;
    try {
      setIsUpdating(true);
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:3000/tickets/${ticketId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchTicketDetail();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mengubah status tiket.');
    } finally {
      setIsUpdating(false);
    }
  };

  const sendComment = async (message: string) => {
    try {
      setIsUpdating(true);
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:3000/tickets/${ticketId}/comments`, 
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchTicketDetail();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mengirim komentar.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Fungsi penggabung Activity & Comment menjadi satu garis waktu (Timeline)
  const getTimeline = () => {
    if (!ticket) return [];
    const comments = (ticket.comments || []).map((c: any) => ({ ...c, type: 'COMMENT', timestamp: new Date(c.createdAt).getTime() }));
    const activities = (ticket.activities || []).map((a: any) => ({ ...a, type: 'ACTIVITY', timestamp: new Date(a.createdAt).getTime() }));
    return [...comments, ...activities].sort((a, b) => a.timestamp - b.timestamp);
  };

  return { user, ticket, loading, isUpdating, changeStatus, sendComment, timeline: getTimeline() };
};