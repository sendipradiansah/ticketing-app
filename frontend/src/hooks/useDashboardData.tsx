"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useDashboardData = () => {
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, done: 0 });
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const userRes = await axios.get('http://localhost:3000/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserName(userRes.data.name);

        const ticketRes = await axios.get('http://localhost:3000/tickets', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const tickets = ticketRes.data;
        
        setStats({
          total: tickets.length,
          open: tickets.filter((t: any) => t.status === 'OPEN').length,
          inProgress: tickets.filter((t: any) => t.status === 'IN_PROGRESS').length,
          done: tickets.filter((t: any) => t.status === 'DONE').length,
        });

      } catch (error) {
        console.error('Gagal memuat data dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, userName, loading };
};