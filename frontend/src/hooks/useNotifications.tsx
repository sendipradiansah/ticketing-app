"use client";

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // Menarik data dari endpoint yang sudah kita buat di backend
      const res = await axios.get('http://localhost:3000/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(res.data);
      // Menghitung notifikasi yang memiliki isRead: false
      setUnreadCount(res.data.filter((n: any) => !n.isRead).length);
    } catch (error) {
      console.error('Gagal mengambil notifikasi:', error);
    }
  }, []);

  useEffect(() => {
    // Jalankan saat pertama kali di-load
    fetchNotifications();
    
    // Melakukan pengecekan ulang (polling) setiap 30 detik
    const interval = setInterval(fetchNotifications, 30000);
    
    // Membersihkan interval saat komponen tidak lagi dipakai (unmount)
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Fungsi untuk menandai SEMUA notifikasi sebagai sudah dibaca
  const markAllAsRead = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch('http://localhost:3000/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Gagal menandai semua sebagai dibaca:', error);
    }
  };

  // Fungsi untuk menandai SATU notifikasi spesifik sebagai dibaca
  const markAsRead = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`http://localhost:3000/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update state lokal agar notifikasi langsung hilang status "unread"-nya
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Gagal menandai notifikasi sebagai dibaca:', error);
    }
  };

  return { notifications, unreadCount, markAllAsRead, markAsRead, refreshNotifications: fetchNotifications };
};