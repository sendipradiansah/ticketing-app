"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useTheme } from '@/hooks/useTheme';

export default function CreateTicket() {
  const router = useRouter();
  const { isDark } = useTheme();
  
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // State untuk persentase progress bar
  const [file, setFile] = useState<File | null>(null); // State untuk menyimpan file

  const [formData, setFormData] = useState({
    title: '',
    category: 'Hardware',
    priority: 'LOW',
    description: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0); // Reset progress di angka 0
    
    try {
      const token = localStorage.getItem('token');
      
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('category', formData.category);
      submitData.append('priority', formData.priority);
      submitData.append('description', formData.description);
      
      if (file) {
        submitData.append('file', file); 
      }

      await axios.post('http://localhost:3000/tickets', submitData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', 
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            // Jika di localhost terlalu cepat, ini akan memastikan state tetap terupdate
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      });
      
      // Paksa progress menjadi 100% untuk berjaga-jaga jika proses terlalu cepat
      setUploadProgress(100);

      // BERI JEDA 0.8 DETIK: Agar animasi progress bar terlihat penuh oleh user sebelum pindah halaman
      setTimeout(() => {
        alert('Tiket dan lampiran berhasil dikirim!');
        router.push('/tickets');
      }, 800);

    } catch (error: any) {
      alert(error.response?.data?.message || 'Gagal membuat tiket.');
      setUploadProgress(0); 
      setLoading(false); // Matikan loading hanya jika gagal (jika sukses biarkan true agar bar tidak hilang)
    } 
  };

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <button onClick={() => router.push('/tickets')} className={`text-xs font-mono transition-colors mb-6 flex items-center gap-2 ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
        <span>←</span> CANCEL & BACK
      </button>

      <div className={`border rounded-2xl p-6 md:p-8 transition-colors duration-300 shadow-sm ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100 border-slate-400'}`}>
        <h1 className={`text-2xl font-bold mb-2 transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>Transmit New Ticket</h1>
        <p className={`text-sm mb-8 transition-colors ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Silakan lengkapi detail permasalahan yang Anda alami.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Judul Tiket */}
          <div>
            <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Subject / Title</label>
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className={`w-full border rounded-lg px-4 py-3 text-sm outline-none focus:border-cyan-500 transition-colors ${isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'}`}
              placeholder="Contoh: Monitor tidak menyala"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kategori */}
            <div>
              <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className={`w-full border rounded-lg px-4 py-3 text-sm outline-none focus:border-cyan-500 transition-colors ${isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'}`}
              >
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Network">Network</option>
                <option value="Account">Account</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Prioritas */}
            <div>
              <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Priority Level</label>
              <select 
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className={`w-full border rounded-lg px-4 py-3 text-sm outline-none focus:border-cyan-500 transition-colors ${isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'}`}
              >
                <option value="LOW">Low (Tidak mendesak)</option>
                <option value="MEDIUM">Medium (Cukup mengganggu)</option>
                <option value="HIGH">High (Sistem lumpuh total)</option>
              </select>
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Detailed Description</label>
            <textarea 
              required
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className={`w-full border rounded-lg px-4 py-3 text-sm outline-none focus:border-cyan-500 transition-colors ${isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'}`}
              placeholder="Ceritakan secara detail kronologi atau pesan error yang muncul..."
            />
          </div>

          {/* Upload File Attachment */}
          <div>
            <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Attachment (Optional)</label>
            <div className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors ${isDark ? 'bg-slate-950/50 border-slate-700 hover:border-cyan-500' : 'bg-slate-50 border-slate-300 hover:border-cyan-500'}`}>
              <input 
                type="file" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" 
              />
              <span className="text-2xl mb-2">📎</span>
              <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {file ? file.name : 'Klik atau seret file ke sini'}
              </p>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Maksimal 5MB (JPG, PNG, PDF)'}
              </p>
            </div>
          </div>

          {/* Progress Bar (Muncul saat proses loading dan ADA file yang dikirim) */}
          {loading && file && (
            <div className="w-full transition-all duration-300">
              <div className="flex justify-between items-center mb-1 text-xs font-mono text-cyan-600 dark:text-cyan-400">
                <span>{uploadProgress === 100 ? 'Upload Complete!' : 'Transmitting data...'}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-500 transition-all duration-500 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Tombol Submit */}
          <div className={`pt-4 border-t transition-colors ${isDark ? 'border-slate-800' : 'border-slate-300'}`}>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto px-8 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-500 dark:disabled:bg-slate-800 disabled:text-slate-300 text-white font-semibold rounded-lg shadow-md transition-colors"
            >
              {loading ? 'Processing...' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}