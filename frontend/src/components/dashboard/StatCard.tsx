import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  color: 'blue' | 'purple' | 'amber' | 'emerald';
  isDark: boolean; 
}

// Warna textValue sekarang diubah untuk mengikuti warna status aslinya
const colorStyles = {
  blue: {
    light: { bg: 'bg-blue-100', border: 'border-blue-300', textLabel: 'text-blue-500', textValue: 'text-blue-600' },
    dark:  { bg: 'bg-blue-500/10', border: 'border-blue-500/20', textLabel: 'text-blue-200', textValue: 'text-blue-400' },
  },
  purple: {
    light: { bg: 'bg-purple-100', border: 'border-purple-300', textLabel: 'text-purple-500', textValue: 'text-purple-600' },
    dark:  { bg: 'bg-purple-500/10', border: 'border-purple-500/20', textLabel: 'text-purple-200', textValue: 'text-purple-400' },
  },
  amber: {
    light: { bg: 'bg-amber-100', border: 'border-amber-300', textLabel: 'text-amber-500', textValue: 'text-amber-600' },
    dark:  { bg: 'bg-amber-500/10', border: 'border-amber-500/20', textLabel: 'text-amber-200', textValue: 'text-amber-400' },
  },
  emerald: {
    light: { bg: 'bg-emerald-100', border: 'border-emerald-300', textLabel: 'text-emerald-500', textValue: 'text-emerald-600' },
    dark:  { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', textLabel: 'text-emerald-200', textValue: 'text-emerald-400' },
  },
};

export const StatCard = ({ title, value, color, isDark }: StatCardProps) => {
  const theme = isDark ? colorStyles[color].dark : colorStyles[color].light;

  return (
    <div className={`${theme.bg} border ${theme.border} rounded-2xl p-6 shadow-sm transition-colors duration-300 flex flex-col justify-center`}>
      
      {/* Label Judul */}
      <div className={`text-sm font-semibold ${theme.textLabel} mb-1 transition-colors duration-300`}>
        {title}
      </div>
      
      {/* Angka Jumlah Tiket (Sekarang berwarna senada dengan kotaknya!) */}
      <div className={`text-4xl font-bold ${theme.textValue} transition-colors duration-300`}>
        {value}
      </div>
      
    </div>
  );
};