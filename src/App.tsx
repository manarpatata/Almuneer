/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LESSONS } from './data';
import { AppState } from './types';
import { getTodayDateString, processMissedDays, addDays } from './utils';
import { LessonsList } from './components/LessonsList';
import { CalendarTracker } from './components/CalendarTracker';
import { WaterGunOverlay } from './components/WaterGunOverlay';
import { BookOpen, Settings, X, AlertTriangle, RotateCcw, CheckCircle } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('alMuneerState_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const { newState } = processMissedDays(parsed);
        if (newState.dailyGoal === undefined) newState.dailyGoal = 10;
        return newState;
      } catch (e) {
        console.error("Failed to parse state", e);
      }
    }
    
    const today = getTodayDateString();
    
    return {
      completedLessons: [],
      khatmatCount: 0,
      history: {
        [today]: { lessonsCompleted: 0, punishedDaily: false, punished2Days: false }
      },
      lastLoginDate: today,
      startDate: today,
      dailyGoal: 10,
    };
  });

  const [showWaterGun, setShowWaterGun] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [tempGoal, setTempGoal] = useState(state.dailyGoal || 10);
  const [toastMessage, setToastMessage] = useState("");
  
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
        const expectedTotal = Number(parsed.khatmatCount || 0) * 28 + Number(parsed.completedLessons?.length || 0);
        const actualTotal = Number(Object.values(parsed.history || {}).reduce((sum: number, day: any) => sum + Number(day.lessonsCompleted || 0), 0));
        
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

  const [punishmentUIState, setPunishmentUIState] = useState<'idle' | 'resolving_done' | 'resolving_failed'>('idle');
  const punishmentTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const PUNISHMENT_TITLES = [
    "معاقبة من لجنة العقاب🔫💥",
    "واقعة تحت بند العقوبة🔫💥",
    "محكوم عليك بالعقاب🔫💥"
  ];
  const PUNISHMENT_FAILED = [
    "إزالة قسرية من المجموعة 🔪🚫",
    "طرد تأديبي من المجموعة 🔪🚪",
    "تمت إزالتك من المجموعة 🔪📤",
    "تمت تصفيتك من الجروب 🔪🧹"
  ];
  const PUNISHMENT_DONE = [
    "انتهت العقوبة رسميًا ✅",
    "خرجتِ بشرف من العقوبة 🎖️",
    "تم قضاء العقاب بالكامل 🔓",
    "عقوبتك انتهت رسميًا 📁",
    "فكّ عنك قيد العقوبة 🔗"
  ];
  const THREATENED_TEXTS = [
    "مهددة بالعقاب🔫",
    "مهددة بالانقراض🔫",
    "مهددة بالتفتيق🔫",
    "تحت التهديد🔫",
    "تحتاج جهد🔫",
    "قريبة من الخطر🔫"
  ];
  const SAFE_TEXTS = [
    "في بر الأمان ⚓",
    "خرجتِ من العاصفة 🌤️",
    "عادت المياه لمجاريها 💧",
    "طلعتِ من تحت الأنقاض 🌟",
    "كسرتِ حاجز الخطر 🚧",
    "خرجتِ بلا خدوش 🛡️"
  ];
  const DEFAULT_TEXTS = [
    "الوقت يمشي بسرعة ⏳",
    "ليس وقت الاسترخاء👀",
    "الاحتمالات مفتوحة 🎲",
    "ما انحسمت لسه 🔄",
    "على مفترق الطرق 🛣️",
    "لم تستقر الأمور بعد 🌊"
  ];

  const dailyGoal = state.dailyGoal || 10;

  const todayCompleted = state.history[getTodayDateString()]?.lessonsCompleted || 0;
  const yesterdayDate = addDays(getTodayDateString(), -1);
  const yesterdayCompleted = state.history[yesterdayDate]?.lessonsCompleted || 0;
  const isYesterdayBeforeStart = yesterdayDate < (state.startDate || state.lastLoginDate);
  
  let currentBoxType = 'default';
  if (state.pendingPunishment) currentBoxType = 'punishment';
  else if (todayCompleted >= dailyGoal) currentBoxType = 'safe';
  else if (!isYesterdayBeforeStart && yesterdayCompleted < dailyGoal) currentBoxType = 'threatened';

  const randomTexts = useMemo(() => ({
    punishmentTitle: PUNISHMENT_TITLES[Math.floor(Math.random() * PUNISHMENT_TITLES.length)],
    punishmentFailed: PUNISHMENT_FAILED[Math.floor(Math.random() * PUNISHMENT_FAILED.length)],
    punishmentDone: PUNISHMENT_DONE[Math.floor(Math.random() * PUNISHMENT_DONE.length)],
    threatened: THREATENED_TEXTS[Math.floor(Math.random() * THREATENED_TEXTS.length)],
    safe: SAFE_TEXTS[Math.floor(Math.random() * SAFE_TEXTS.length)],
    default: DEFAULT_TEXTS[Math.floor(Math.random() * DEFAULT_TEXTS.length)],
  }), [currentBoxType]);

  const handlePunishmentAction = (fulfilled: boolean) => {
    setPunishmentUIState(fulfilled ? 'resolving_done' : 'resolving_failed');
    if (punishmentTimeoutRef.current) clearTimeout(punishmentTimeoutRef.current);
    
    punishmentTimeoutRef.current = setTimeout(() => {
      const today = getTodayDateString();
      setState(prev => ({ 
        ...prev, 
        pendingPunishment: false,
        history: fulfilled ? prev.history : {
          ...prev.history,
          [today]: {
            ...(prev.history[today] || { lessonsCompleted: 0, punishedDaily: false, punished2Days: false }),
            expelled: true
          }
        }
      }));
      setPunishmentUIState('idle');
    }, 4000);
  };

  const handleUndoPunishment = () => {
    if (punishmentTimeoutRef.current) clearTimeout(punishmentTimeoutRef.current);
    setPunishmentUIState('idle');
  };

  let boxClasses = "rounded-[2rem] p-6 text-white flex flex-col justify-center items-center gap-4 relative overflow-hidden shrink-0 shadow-lg transition-all duration-300 ";
  let boxContent;

  if (state.pendingPunishment) {
    if (punishmentUIState === 'resolving_failed') {
      boxClasses += "bg-slate-900";
      boxContent = (
        <div className="relative z-10 flex flex-col items-center w-full gap-4">
          <h4 className="text-xl font-bold text-rose-500 text-center">{randomTexts.punishmentFailed}</h4>
          <button onClick={handleUndoPunishment} className="mt-2 bg-slate-800 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-slate-700 transition-colors flex items-center gap-2">
             <RotateCcw className="w-4 h-4" /> تراجع
          </button>
        </div>
      );
    } else if (punishmentUIState === 'resolving_done') {
      boxClasses += "bg-emerald-600";
      boxContent = (
        <div className="relative z-10 flex flex-col items-center w-full gap-4">
          <h4 className="text-xl font-bold text-white text-center">{randomTexts.punishmentDone}</h4>
          <button onClick={handleUndoPunishment} className="mt-2 bg-emerald-800 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center gap-2">
             <RotateCcw className="w-4 h-4" /> تراجع
          </button>
        </div>
      );
    } else {
      boxClasses += "bg-rose-600";
      boxContent = (
        <div className="relative z-10 flex flex-col items-center w-full gap-4">
          <h4 className="text-xl font-bold text-center">{randomTexts.punishmentTitle}</h4>
          <div className="flex gap-3 w-full mt-2">
            <button onClick={() => handlePunishmentAction(true)} className="flex-1 bg-white text-rose-600 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-rose-50 transition-colors">أتممت العقاب</button>
            <button onClick={() => handlePunishmentAction(false)} className="flex-1 bg-rose-800 text-white py-3 rounded-xl font-bold text-sm hover:bg-rose-900 transition-colors">لم أتمم</button>
          </div>
        </div>
      );
    }
  } else if (todayCompleted >= dailyGoal) {
    boxClasses += "bg-emerald-500";
    boxContent = <h4 className="text-2xl font-bold z-10 text-center">{randomTexts.safe}</h4>;
  } else if (!isYesterdayBeforeStart && yesterdayCompleted < dailyGoal) {
    boxClasses += "bg-yellow-500 text-yellow-950";
    boxContent = <h4 className="text-2xl font-bold z-10 text-center">{randomTexts.threatened}</h4>;
  } else {
    boxClasses += "bg-gradient-to-br from-blue-500 to-blue-600";
    boxContent = <h4 className="text-xl font-bold z-10 text-center">{randomTexts.default}</h4>;
  }

  const handleReset = () => {
    setConfirmReset(true);
  };

  const executeReset = () => {
    const today = getTodayDateString();
    setState({
      completedLessons: [],
      khatmatCount: 0,
      history: {
        [today]: { lessonsCompleted: 0, punishedDaily: false, punished2Days: false }
      },
      lastLoginDate: today,
      startDate: today,
      dailyGoal: state.dailyGoal || 10,
      pendingPunishment: false
    });
    setConfirmReset(false);
    setShowSettings(false);
    setToastMessage("تم تصفير الإنجازات بنجاح");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleSaveGoal = () => {
    if (tempGoal < 1 || tempGoal > 28) return;
    setState(prev => ({ ...prev, dailyGoal: tempGoal }));
    setShowSettings(false);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F8FAFC] font-sans text-slate-800" dir="rtl">
      <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-white border-b border-slate-200 shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#059669] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <button 
            onClick={() => {
              setTempGoal(state.dailyGoal || 10);
              setShowSettings(true);
            }} 
            className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
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

      <main className="flex-1 p-4 md:p-6 flex flex-col-reverse md:flex-row gap-6 max-w-7xl mx-auto w-full">
        <section className="flex-[1.8] flex flex-col gap-4 h-full">
          <LessonsList 
            completedLessons={state.completedLessons} 
            onToggle={handleToggleLesson} 
          />
        </section>
        
        <aside className="flex-1 flex flex-col gap-6 pb-6 pr-1">
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

      {showSettings && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden" dir="rtl">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-400" />
                الإعدادات
              </h2>
              <button 
                onClick={() => setShowSettings(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <label className="font-bold text-slate-700">الحد الأدنى للدروس اليومية</label>
                <p className="text-xs text-slate-500">عدد الدروس المطلوبة يومياً لتجنب العقاب</p>
                <div className="flex items-center gap-4 mt-2">
                  <input 
                    type="range" 
                    min="1" 
                    max="28" 
                    value={tempGoal} 
                    onChange={(e) => setTempGoal(Number(e.target.value))}
                    className="flex-1 accent-emerald-500"
                  />
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 font-bold text-lg border border-emerald-100">
                    {tempGoal}
                  </div>
                </div>
                <button 
                  onClick={handleSaveGoal}
                  className="mt-4 w-full bg-[#059669] text-white py-3 rounded-xl font-bold text-sm shadow-md hover:bg-emerald-700 transition-colors"
                >
                  حفظ التغييرات
                </button>
              </div>

              <div className="border-t border-slate-100 pt-8 flex flex-col gap-3">
                <h3 className="font-bold text-rose-600 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  منطقة الخطر
                </h3>
                <p className="text-xs text-slate-500">هذا الإجراء سيقوم بتصفير جميع إنجازاتك والبدء من جديد تماماً.</p>
                <button 
                  onClick={handleReset}
                  className="mt-2 w-full flex items-center justify-center gap-2 bg-rose-50 text-rose-600 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-rose-100 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  تصفير الإنجازات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmReset && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white p-5 rounded-2xl shadow-2xl z-[100] w-[90%] max-w-sm flex flex-col gap-4">
          <p className="text-center font-bold text-sm">هل أنت متأكد من التصفير والبدء من جديد؟ لن يمكنك التراجع.</p>
          <div className="flex gap-3 w-full">
            <button onClick={executeReset} className="flex-1 bg-rose-500 hover:bg-rose-600 py-2.5 rounded-xl text-sm font-bold transition-colors">نعم، متأكد</button>
            <button onClick={() => setConfirmReset(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 py-2.5 rounded-xl text-sm font-bold transition-colors">إلغاء</button>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-3 rounded-full shadow-lg z-[100] flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span className="font-bold text-sm">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
