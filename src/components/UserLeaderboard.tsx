import React from 'react';
import { Trophy } from 'lucide-react';
import { LeaderboardSettings } from '../types';

export function UserLeaderboard({ settings }: { settings: LeaderboardSettings }) {
  if (!settings || !settings.show || !settings.entries || settings.entries.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 mt-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500"></div>
      
      <div className="flex items-center gap-3 mb-8 justify-center">
        <Trophy className="w-8 h-8 text-amber-500" />
        <h2 className="text-2xl font-black text-slate-800">أبطال الأسبوع 👑</h2>
      </div>
      
      <div className="flex flex-col gap-3">
        {settings.entries.slice(0, 5).map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-transform hover:scale-[1.01]">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow-inner
                ${idx === 0 ? 'bg-amber-100 text-amber-600 border-2 border-amber-300' : 
                  idx === 1 ? 'bg-slate-200 text-slate-600 border-2 border-slate-300' : 
                  idx === 2 ? 'bg-orange-100 text-orange-700 border-2 border-orange-300' : 
                  'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}
              >
                {idx + 1}
              </div>
              <span className="font-bold text-slate-700 text-lg">{entry.displayName}</span>
            </div>
            <span className="font-black text-indigo-600 bg-indigo-100 px-4 py-1.5 rounded-full text-sm">
              {entry.weeklyLessons} درس
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
