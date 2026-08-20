/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LESSONS } from './data';
import { AppState } from './types';
import { getTodayDateString, processMissedDays, addDays } from './utils';
import { LessonsList } from './components/LessonsList';
import { CalendarTracker } from './components/CalendarTracker';
import { WaterGunOverlay } from './components/WaterGunOverlay';
import { BookOpen } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('alMuneerState_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const { newState } = processMissedDays(parsed);
        return newState;
      } catch (e) {
        console.error("Failed to parse state", e);
      }
    }
    
    const today = getTodayDateString();
    const dMinus = (days: number) => addDays(today, -days);
    
    return {
      completedLessons: LESSONS.slice(0, 25),
      khatmatCount: 3,
      history: {
        [dMinus(6)]: { lessonsCompleted: 22, punishedDaily: false, punished2Days: false },
        [dMinus(5)]: { lessonsCompleted: 14, punishedDaily: false, punished2Days: false },
        [dMinus(4)]: { lessonsCompleted: 8, punishedDaily: false, punished2Days: false },
        [dMinus(3)]: { lessonsCompleted: 0, punishedDaily: true, punished2Days: false },
        [dMinus(2)]: { lessonsCompleted: 0, punishedDaily: false, punished2Days: true, expelled: true },
        [dMinus(1)]: { lessonsCompleted: 15, punishedDaily: false, punished2Days: false },
        [today]: { lessonsCompleted: 25, punishedDaily: false, punished2Days: false }
      },
      lastLoginDate: today,
    };
  });

  const [showWaterGun, setShowWaterGun] = useState(false);
  
  const [timeToMidnight, setTimeToMidnight] = useState("");

  useEffect(() => {
    localStorage.setItem('alMuneerState_v4', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const saved = localStorage.getItem('alMuneerState_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // --- State Healing Logic ---
        const expectedTotal = (parsed.khatmatCount || 0) * 28 + (parsed.completedLessons?.length || 0);
        const actualTotal = Object.values(parsed.history || {}).reduce((sum: number, day: any) => sum + (day.lessonsCompleted || 0), 0);
        
        if (actualTotal > expectedTotal) {
          const diff = actualTotal - expectedTotal;
          const today = getTodayDateString();
          if (parsed.history && parsed.history[today]) {
             parsed.history[today].lessonsCompleted = Math.max(0, parsed.history[today].lessonsCompleted - diff);
          }
        }
        // ---------------------------
        
        const { activePunishments } = processMissedDays(parsed);
        if (activePunishments.waterGuns.length > 0) setShowWaterGun(true);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      
      setTimeToMidnight(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      );

      const today = getTodayDateString();
      if (state.lastLoginDate !== today) {
        const { newState, activePunishments } = processMissedDays(state);
        setState(newState);
        if (activePunishments.waterGuns.length > 0) setShowWaterGun(true);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [state]);

  const handleToggleLesson = (lesson: string, isCompleted: boolean) => {
    const today = getTodayDateString();
    setState(prev => {
      const newState = { 
        ...prev,
        history: { ...prev.history }
      };
      
      if (!newState.history[today]) {
        newState.history[today] = { lessonsCompleted: 0, punishedDaily: false, punished2Days: false };
      } else {
        newState.history[today] = { ...newState.history[today] };
      }

      if (isCompleted) {
        newState.completedLessons = [...newState.completedLessons, lesson];
        newState.history[today].lessonsCompleted += 1;
        
        if (newState.completedLessons.length === LESSONS.length) {
          newState.khatmatCount += 1;
          newState.completedLessons = [];
        }
      } else {
        newState.completedLessons = newState.completedLessons.filter(l => l !== lesson);
        newState.history[today].lessonsCompleted = Math.max(0, newState.history[today].lessonsCompleted - 1);
      }
      
      return newState;
    });
  };

  const [expulsionMessage, setExpulsionMessage] = useState(false);

  const todayCompleted = state.history[getTodayDateString()]?.lessonsCompleted || 0;
  const yesterdayDate = addDays(getTodayDateString(), -1);
  const yesterdayCompleted = state.history[yesterdayDate]?.lessonsCompleted || 0;

  const handlePunishmentAction = (fulfilled: boolean) => {
    if (fulfilled) {
      setState(prev => ({ ...prev, pendingPunishment: false }));
    } else {
      setExpulsionMessage(true);
      setTimeout(() => {
        setExpulsionMessage(false);
        const today = getTodayDateString();
        setState(prev => ({ 
          ...prev, 
          pendingPunishment: false,
          history: {
            ...prev.history,
            [today]: {
              ...(prev.history[today] || { lessonsCompleted: 0, punishedDaily: false, punished2Days: false }),
              expelled: true
            }
          }
        }));
      }, 3000);
    }
  };

  let boxClasses = "rounded-[2rem] p-6 text-white flex flex-col justify-center items-center gap-4 relative overflow-hidden shrink-0 shadow-lg transition-all duration-300 ";
  let boxContent;

  if (expulsionMessage) {
    boxClasses += "bg-slate-900";
    boxContent = <h4 className="text-xl font-bold z-10 text-rose-500">يتم الطرد من المجموعة</h4>;
  } else if (state.pendingPunishment) {
    boxClasses += "bg-rose-600";
    boxContent = (
      <div className="relative z-10 flex flex-col items-center w-full gap-4">
        <h4 className="text-xl font-bold">⚠️ عقاب التقصير</h4>
        <p className="text-sm text-center font-medium leading-relaxed">
          لم تنجز 20 درساً في اليومين الماضيين. عليك تنفيذ العقاب.
        </p>
        <div className="flex gap-3 w-full mt-2">
          <button onClick={() => handlePunishmentAction(true)} className="flex-1 bg-white text-rose-600 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-rose-50 transition-colors">أتممت العقاب</button>
          <button onClick={() => handlePunishmentAction(false)} className="flex-1 bg-rose-800 text-white py-3 rounded-xl font-bold text-sm hover:bg-rose-900 transition-colors">لم أتمم</button>
        </div>
      </div>
    );
  } else if (todayCompleted >= 10) {
    boxClasses += "bg-emerald-500";
    boxContent = <h4 className="text-2xl font-bold z-10">وصلت إلى بر الأمان 🌿</h4>;
  } else if (yesterdayCompleted < 10) {
    boxClasses += "bg-rose-500";
    boxContent = <h4 className="text-2xl font-bold z-10">مهددة بالعقاب 🔫</h4>;
  } else {
    boxClasses += "bg-gradient-to-br from-blue-500 to-blue-600";
    boxContent = <h4 className="text-xl font-bold z-10">بانتظار إنجازك اليوم 💧</h4>;
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#F8FAFC] font-sans text-slate-800" dir="rtl">
      <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#059669] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="flex gap-2 md:gap-6 items-center">
          <div className="flex flex-col items-center bg-slate-50 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-slate-200">
            <span className="text-[10px] md:text-xs font-bold text-slate-400">عدد الختمات</span>
            <span className="text-lg md:text-2xl font-black text-[#059669]">{state.khatmatCount}</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-red-50 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-red-100 min-w-[90px] md:min-w-[120px]">
            <span className="text-[10px] md:text-xs font-bold text-red-400">منتصف الليل</span>
            <span className="text-lg md:text-2xl font-black text-red-600 font-mono" dir="ltr">{timeToMidnight}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 flex flex-col-reverse md:flex-row gap-6 overflow-hidden max-w-7xl mx-auto w-full">
        <section className="flex-[1.8] flex flex-col gap-4 overflow-hidden h-full">
          <LessonsList 
            completedLessons={state.completedLessons} 
            onToggle={handleToggleLesson} 
          />
        </section>
        
        <aside className="flex-1 flex flex-col gap-6 overflow-y-auto pb-6 pr-1">
          <CalendarTracker history={state.history} />
          
          <div className={boxClasses}>
            {boxContent}
          </div>
        </aside>
      </main>

      <footer className="px-4 md:px-8 py-3 bg-slate-900 text-white/50 text-xs flex justify-between items-center shrink-0">
        <span>جميع البيانات محفوظة محلياً على جهازك</span>
        <div className="flex gap-4">
          <span>الإصدار ١.٠</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            متصل
          </span>
        </div>
      </footer>

      <WaterGunOverlay 
        isVisible={showWaterGun} 
        onClose={() => setShowWaterGun(false)} 
      />
    </div>
  );
}
