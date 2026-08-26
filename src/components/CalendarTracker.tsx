import React, { useState, useMemo } from 'react';
import { DailyStats } from '../types';
import { getTodayDateString, addDays, getDayNameArabic } from '../utils';
import { ChevronDown, ChevronUp, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DayProgressModal } from './DayProgressModal';

interface CalendarTrackerProps {
  history: Record<string, DailyStats>;
  dailyGoal: number;
  currentScore: number;
  pendingPunishment?: boolean;
  pendingPunishmentsCount?: number;
}

export function CalendarTracker({ history, dailyGoal, currentScore, pendingPunishment, pendingPunishmentsCount }: CalendarTrackerProps) {
  const today = getTodayDateString();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay(); // 0 is Sunday
  };

  const pad = (n: number) => String(n).padStart(2, '0');

  const { calendarDays, emptyDays } = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentMonthDate);
    const firstDay = getFirstDayOfMonth(currentMonthDate);
    const empty = Array.from({ length: firstDay }, (_, i) => i);
    
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth() + 1;
    
    const days = Array.from({ length: daysInMonth }, (_, i) => {
      return `${year}-${pad(month)}-${pad(i + 1)}`;
    });
    
    return { calendarDays: days, emptyDays: empty };
  }, [currentMonthDate]);

  const past7Days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(today, -6 + i));
  }, [today]);

  const renderDay = (date: string, showDayName = false) => {
    const stats = history[date];
    const isToday = date === today;
    const expelled = stats?.failedPunishments ? true : stats?.expelled;
    const resolved = stats?.resolvedPunishments || (stats?.punishmentResolved ? 1 : 0);
    const punished = stats?.punishedDaily || stats?.punished2Days;
    const completed = stats?.lessonsCompleted || 0;
    
    let boxClass = "w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer hover:scale-110 active:scale-95 relative ";
    let content: React.ReactNode = "";

    if (isToday) {
        if (expelled) {
            boxClass += "bg-slate-100 border-2 border-slate-800 text-lg shadow-sm";
            content = <>🔪</>;
        } else if (punished) {
            boxClass += "bg-red-100 border-2 border-red-500 text-lg shadow-sm";
            content = <>🔫</>;
        } else if (completed >= dailyGoal * 2) {
            boxClass += "bg-emerald-100 border-2 border-emerald-500 text-emerald-700";
            content = <>{completed}<span className="absolute -top-1.5 -right-1.5 text-[14px]">⭐</span></>;
        } else if (completed >= dailyGoal) {
            boxClass += "bg-emerald-50 border-2 border-emerald-400 text-emerald-600";
            content = <>{completed}</>;
        } else if (stats) {
            boxClass += "bg-amber-50 border-2 border-amber-400 text-amber-600";
            content = <>{completed}</>;
        } else {
            boxClass += "bg-slate-50 border-2 border-slate-200 text-slate-400";
            content = <></>;
        }
    } else {
        if (expelled) {
            boxClass += "bg-slate-800 text-white text-lg shadow-sm";
            content = <>🔪</>;
        } else if (punished) {
            boxClass += "bg-red-500 text-white text-lg shadow-sm shadow-red-200";
            content = <>🔫</>;
        } else if (completed >= dailyGoal * 2) {
            boxClass += "bg-emerald-500 text-white shadow-sm shadow-emerald-200";
            content = <>{completed}<span className="absolute -top-1.5 -right-1.5 text-[14px]">⭐</span></>;
        } else if (completed >= dailyGoal) {
            boxClass += "bg-emerald-400 text-white shadow-sm shadow-emerald-100";
            content = <>{completed}</>;
        } else if (stats) {
            boxClass += "bg-amber-400 text-white shadow-sm shadow-amber-200";
            content = <>{completed}</>;
        } else {
            boxClass += "bg-slate-100 text-transparent hover:bg-slate-200";
            content = <></>;
        }
    }
    
    return (
      <div 
         key={date} 
         className={`flex flex-col items-center gap-2 ${date > today ? 'opacity-30 pointer-events-none' : ''}`}
      >
        {showDayName && (
          <span className={`text-[10px] font-bold uppercase ${isToday ? 'text-emerald-600' : 'text-slate-400'}`}>
            {isToday ? 'اليوم' : getDayNameArabic(date).replace('ال', '')}
          </span>
        )}
        <button 
          onClick={() => setSelectedDate(date)}
          className={boxClass}
        >
          {content}
        </button>
      </div>
    );
  };

  const handlePrevMonth = () => {
    setCurrentMonthDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

  return (
    <>
      <div className="bg-white rounded-[1.5rem] p-6 border border-slate-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] shrink-0 transition-all">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
            📅 {isExpanded ? 'الإنجاز الشهري' : 'الإنجاز الأسبوعي'}
          </h3>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.div 
              key="week"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-7 gap-2 text-center"
            >
              {past7Days.map((date) => renderDay(date, true))}
            </motion.div>
          ) : (
            <motion.div 
              key="month"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-200 rounded-lg transition-colors"><ChevronRight className="w-5 h-5 text-slate-600" /></button>
                <span className="font-bold text-slate-700">{monthNames[currentMonthDate.getMonth()]} {currentMonthDate.getFullYear()}</span>
                <button onClick={handleNextMonth} className="p-2 hover:bg-slate-200 rounded-lg transition-colors"><ChevronLeft className="w-5 h-5 text-slate-600" /></button>
              </div>
              
              <div className="grid grid-cols-7 gap-2 text-center mb-2">
                {['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'].map(d => (
                  <span key={d} className="text-xs font-bold text-slate-400">{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-3 gap-x-2 text-center">
                {emptyDays.map(i => <div key={`empty-${i}`} />)}
                {calendarDays.map(date => renderDay(date, false))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <DayProgressModal 
        date={selectedDate} 
        stats={selectedDate ? history[selectedDate] : null} 
        history={history}
        dailyGoal={dailyGoal}
        currentScore={currentScore}
        pendingPunishment={pendingPunishment}
        pendingPunishmentsCount={pendingPunishmentsCount}
        onClose={() => setSelectedDate(null)} 
      />
    </>
  );
}
