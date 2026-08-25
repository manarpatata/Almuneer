import React, { useState } from 'react';
import { DailyStats } from '../types';
import { getTodayDateString, addDays, getDayNameArabic, getShortDate } from '../utils';
import { Droplets, AlertTriangle, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { DayProgressModal } from './DayProgressModal';

interface CalendarTrackerProps {
  history: Record<string, DailyStats>;
  pendingPunishment?: boolean;
}

export function CalendarTracker({ history, pendingPunishment }: CalendarTrackerProps) {
  const today = getTodayDateString();
  const past7Days = Array.from({ length: 7 }, (_, i) => addDays(today, -6 + i));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <>
      <div className="bg-white rounded-[1.5rem] p-6 border border-slate-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] shrink-0">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-slate-800">📅 الإنجاز الأسبوعي</h3>
        <div className="grid grid-cols-7 gap-2 text-center">
          {past7Days.map((date) => {
            const stats = history[date];
            const isToday = date === today;
            const hasLessons = stats && stats.lessonsCompleted > 0;
            const expelled = stats?.failedPunishments ? true : stats?.expelled;
            const resolved = stats?.resolvedPunishments || (stats?.punishmentResolved ? 1 : 0);
            const punished = stats?.punishedDaily || stats?.punished2Days;
            const completed = stats?.lessonsCompleted || 0;
            
            let boxClass = "w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer hover:scale-110 active:scale-95 relative ";
            let content: React.ReactNode = "";
            
            let extraBadges = [];
            if (resolved > 0) {
              extraBadges.push(<span key="res" className="absolute -bottom-1.5 -left-1.5 text-[14px]">✅</span>);
            }
            if (expelled) {
              extraBadges.push(<span key="exp" className="absolute -bottom-1.5 -left-1.5 text-[14px]">🔪</span>);
            }

            if (isToday) {
                if (expelled) {
                    boxClass += "bg-slate-100 border-2 border-slate-800 text-lg shadow-sm";
                    content = <>🔪{extraBadges}</>;
                } else if (punished) {
                    boxClass += "bg-red-100 border-2 border-red-500 text-lg shadow-sm";
                    content = <>🔫{extraBadges}</>;
                } else if (completed >= 20) {
                    boxClass += "bg-emerald-100 border-2 border-emerald-500 text-emerald-700";
                    content = <>{completed}<span className="absolute -top-1.5 -right-1.5 text-[14px]">⭐</span>{extraBadges}</>;
                } else if (completed >= 10) {
                    boxClass += "bg-emerald-50 border-2 border-emerald-400 text-emerald-600";
                    content = <>{completed}{extraBadges}</>;
                } else if (stats) {
                    boxClass += "bg-amber-50 border-2 border-amber-400 text-amber-600";
                    content = <>{completed}{extraBadges}</>;
                } else {
                    boxClass += "bg-slate-50 border-2 border-slate-200 text-slate-400";
                    content = <>{extraBadges}</>;
                }
            } else {
                if (expelled) {
                    boxClass += "bg-slate-800 text-white text-lg shadow-sm";
                    content = <>🔪{extraBadges}</>;
                } else if (punished) {
                    boxClass += "bg-red-500 text-white text-lg shadow-sm shadow-red-200";
                    content = <>🔫{extraBadges}</>;
                } else if (completed >= 20) {
                    boxClass += "bg-emerald-500 text-white shadow-sm shadow-emerald-200";
                    content = <>{completed}<span className="absolute -top-1.5 -right-1.5 text-[14px]">⭐</span>{extraBadges}</>;
                } else if (completed >= 10) {
                    boxClass += "bg-emerald-400 text-white shadow-sm shadow-emerald-100";
                    content = <>{completed}{extraBadges}</>;
                } else if (stats) {
                    boxClass += "bg-amber-400 text-white shadow-sm shadow-amber-200";
                    content = <>{completed}{extraBadges}</>;
                } else {
                    boxClass += "bg-slate-100 text-transparent hover:bg-slate-200";
                    content = <>{extraBadges}</>;
                }
            }
            
            return (
              <div 
                key={date} 
                className={`flex flex-col items-center gap-2 ${date > today ? 'opacity-30 pointer-events-none' : ''}`}
              >
                <span className={`text-[10px] font-bold uppercase ${isToday ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {isToday ? 'اليوم' : getDayNameArabic(date).replace('ال', '')}
                </span>
                <button 
                  onClick={() => setSelectedDate(date)}
                  className={boxClass}
                >
                  {content}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      
      <DayProgressModal 
        date={selectedDate} 
        stats={selectedDate ? history[selectedDate] : null} 
        history={history}
        pendingPunishment={pendingPunishment}
        onClose={() => setSelectedDate(null)} 
      />
    </>
  );
}
