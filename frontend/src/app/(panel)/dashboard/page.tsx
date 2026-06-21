"use client";

import React from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useTheme } from '@/hooks/useTheme';
import { StatCard } from '@/components/dashboard/StatCard';

export default function Dashboard() {
  const { stats, userName, loading } = useDashboardData();
  
  // Ambil state isDark untuk disuntikkan ke komponen lain
  const { isDark } = useTheme(); 

  if (loading) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const STAT_CARDS: Array<{ title: string; value: number; color: 'blue' | 'purple' | 'amber' | 'emerald' }> = [
    { title: 'Total Tickets', value: stats.total, color: 'blue' },
    { title: 'Open', value: stats.open, color: 'purple' },
    { title: 'In Progress', value: stats.inProgress, color: 'amber' },
    { title: 'Done', value: stats.done, color: 'emerald' },
  ];

  return (
    <div className="w-full space-y-8">
      
      {/* HEADER Teks */}
      <div>
        <h1 className={`text-2xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-700'}`}>
          Welcome back, {userName.split(' ')[0]}!
        </h1>
        <p className={`text-sm mt-1 transition-colors duration-300 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
          Here is the current overview of your ticketing system.
        </p>
      </div>

      {/* RENDER STAT CARD DENGAN PROP ISDARK */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAT_CARDS.map((card, index) => (
          <StatCard 
            key={index} 
            title={card.title} 
            value={card.value} 
            color={card.color}
            isDark={isDark} // <-- Ini yang akan mengubah warna kotak!
          />
        ))}
      </div>

    </div>
  );
}