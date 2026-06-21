import React, { useState } from 'react';

interface TimelineProps {
  timeline: any[];
  user: any;
  isDark: boolean;
  isUpdating: boolean;
  onSendComment: (msg: string) => Promise<void>;
}

export const TicketTimeline = ({ timeline, user, isDark, isUpdating, onSendComment }: TimelineProps) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await onSendComment(commentText);
    setCommentText('');
  };

  return (
    <div className={`border rounded-2xl p-6 transition-colors duration-300 shadow-sm ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100 border-slate-400'}`}>
      <h3 className={`text-sm font-bold mb-6 border-b pb-4 transition-colors ${isDark ? 'text-white border-slate-800' : 'text-slate-800 border-slate-300'}`}>
        Activity & Communication Log
      </h3>
      
      <div className="space-y-6 mb-8 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {timeline.length === 0 ? (
          <div className={`text-center p-6 border border-dashed rounded-xl text-sm font-mono transition-colors ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-300 text-slate-500'}`}>
            NO ACTIVITY LOGS YET.
          </div>
        ) : (
          timeline.map((item: any) => {
            // RENDER LOG AKTIVITAS
            if (item.type === 'ACTIVITY') {
              return (
                <div key={`act-${item.id}`} className="flex items-center gap-4 text-sm relative">
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 z-10 transition-colors ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'}`}>
                    <span className="text-[10px]">🔄</span>
                  </div>
                  <div className={`px-4 py-2 rounded-lg border flex-1 flex flex-col md:flex-row justify-between md:items-center gap-2 transition-colors ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-300'}`}>
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      <span className={isDark ? 'text-cyan-400 font-medium' : 'text-cyan-600 font-medium'}>{item.user?.name || 'System'}</span> mengubah status tiket menjadi <span className={`font-mono font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.activity?.replace('STATUS_CHANGED_TO_', '')}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">{new Date(item.createdAt).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              );
            }

            // RENDER KOMENTAR PENGGUNA
            const isMe = item.userId === user?.id;
            return (
              <div key={`com-${item.id}`} className={`flex flex-col text-sm ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`flex flex-col max-w-[85%] ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className={`font-semibold ${isMe ? (isDark ? 'text-cyan-400' : 'text-cyan-600') : (isDark ? 'text-slate-300' : 'text-slate-700')}`}>{item.user?.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono uppercase transition-colors ${isDark ? 'bg-slate-950 text-slate-500 border-slate-800' : 'bg-white text-slate-500 border-slate-200'}`}>{item.user?.role}</span>
                    <span className="text-[10px] text-slate-500 font-mono ml-2">{new Date(item.createdAt).toLocaleString('id-ID')}</span>
                  </div>
                  <div className={`p-4 transition-colors ${isMe ? `rounded-2xl rounded-tr-sm border ${isDark ? 'bg-cyan-900/20 border-cyan-800/30 text-slate-200' : 'bg-cyan-100 border-cyan-300 text-slate-800'}` : `rounded-2xl rounded-tl-sm border ${isDark ? 'bg-slate-800/30 border-slate-700/50 text-slate-200' : 'bg-white border-slate-300 text-slate-800'}`}`}>
                    {item.comment}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* INPUT FORM KOMENTAR */}
      <form onSubmit={handleSubmit} className={`flex gap-3 pt-4 border-t transition-colors ${isDark ? 'border-slate-800' : 'border-slate-300'}`}>
        <input 
          type="text" 
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Tambahkan komentar atau update progress..." 
          className={`flex-1 border rounded-lg px-4 py-3 text-sm outline-none focus:border-cyan-500 transition-colors ${isDark ? 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-800 placeholder:text-slate-400'}`}
        />
        <button disabled={isUpdating || !commentText.trim()} type="submit" className={`px-6 py-3 rounded-lg font-semibold text-sm transition-colors ${isDark ? 'bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-white' : 'bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-200 disabled:text-slate-400 text-white'}`}>
          Kirim
        </button>
      </form>
    </div>
  );
};