"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useTheme, ThemeProvider } from '../hooks/useTheme';
import { Sun, Moon } from 'lucide-react'; // Pastikan library ikon Anda sudah terinstal

// 1. KOMPONEN ISI (Form Login)
function LoginContent() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });

      const token = response.data.access_token;
      localStorage.setItem('token', token);
      router.push('/dashboard');
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email atau password salah!');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      
      {/* Tombol Toggle Theme yang baru dengan posisi absolut */}
      <div className="absolute top-6 right-6">
        <button 
          onClick={toggleTheme} 
          className={`p-1.5 rounded-lg border transition-all ${
            isDark 
              ? 'bg-slate-950 border-slate-800 text-amber-400 hover:bg-slate-800' 
              : 'bg-slate-100 border-slate-400 text-slate-700 hover:bg-slate-200 shadow-sm'
          }`}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Kotak Card Form Login */}
      <div className={`max-w-md w-full rounded-2xl shadow-2xl p-8 border transition-colors duration-300 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Helpdesk System
          </h2>
          <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Silakan masuk untuk mengelola tiket keluhan Anda
          </p>
        </div>

        {error && (
          <div className={`border text-sm p-3 rounded-lg mb-6 text-center ${
            isDark 
              ? 'bg-red-500/10 border-red-500/50 text-red-400' 
              : 'bg-red-50 border-red-200 text-red-600'
          }`}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Alamat Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                isDark 
                  ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Kata Sandi
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                isDark 
                  ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            Masuk Aplikasi
          </button>
        </form>
      </div>
    </div>
  );
}

// 2. KOMPONEN INDUK UTAMA (Wrapper Provider)
export default function Login() {
  return (
    <ThemeProvider>
      <LoginContent />
    </ThemeProvider>
  );
}