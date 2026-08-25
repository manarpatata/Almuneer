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
import { StatsModal } from './components/StatsModal';
import { BookOpen, Settings, X, AlertTriangle, RotateCcw, CheckCircle, HelpCircle, Trophy, Gift } from 'lucide-react';

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
  const [showInstructions, setShowInstructions] = useState(false);
  const [showStats, setShowStats] = useState(false);
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

  useEffect(() => {
    let newGifts = 0;
    let newEarnedDates = [...(state.earnedGiftDates || [])];
    let stateChanged = false;

    const dates = Object.keys(state.history).sort();
    for (let i = 1; i < dates.length; i++) {
      const curr = dates[i];
      const prev = dates[i - 1];
      
      if (addDays(prev, 1) === curr) {
        if (state.history[curr].lessonsCompleted >= 20 && state.history[prev].lessonsCompleted >= 20) {
          if (!newEarnedDates.includes(curr)) {
            newEarnedDates.push(curr);
            newGifts++;
            stateChanged = true;
          }
        }
      }
    }

    if (stateChanged) {
      setState(s => ({
        ...s,
        earnedGiftDates: newEarnedDates,
        unclaimedGifts: (s.unclaimedGifts || 0) + newGifts
      }));
    }
  }, [state.history, state.earnedGiftDates]);

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

  const [punishmentUIStates, setPunishmentUIStates] = useState<Record<number, 'idle' | 'resolving_done' | 'resolving_failed'>>({});
  const punishmentTimeoutRefs = useRef<Record<number, NodeJS.Timeout>>({});

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

  const currentScore = useMemo(() => {
    let score = state.khatmatCount * 100;
    Object.values(state.history).forEach((day: any) => {
      const failed = day.failedPunishments || (day.expelled ? 1 : 0);
      score -= failed * 100;
      
      if (day.punished2Days || day.punishedDaily) {
        score -= 50;
      }
      
      if (day.lessonsCompleted < dailyGoal) {
        score -= 10;
      }

      if (day.lessonsCompleted >= 20 && day.lessonsCompleted < 28) {
        score += 50;
      } else if (day.lessonsCompleted >= dailyGoal && day.lessonsCompleted < 20) {
        score += 10;
      }
    });
    return Math.max(0, score);
  }, [state.history, dailyGoal, state.khatmatCount]);

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

  const PARDONED_BOX_PHRASES = useMemo(() => [
    "كرتك السحري أبعد عنكِ العقاب 🎫",
    "سحبتِ كرت الإعفاء من العقاب 🎫",
    "فعّلتِ كرت الإعفاء بنجاح 🎫",
    "لعبتِ ورقتك الرابحة.. الإعفاء من العقاب 🎫",
    "استخدمتِ كرت الإعفاء من العقاب 🎫"
  ], []);

  const handleClaimGift = () => {
    setState(prev => ({
      ...prev,
      unclaimedGifts: Math.max(0, (prev.unclaimedGifts || 0) - 1),
      immunityCards: (prev.immunityCards || 0) + 1
    }));
    setToastMessage("حصلتِ على كرت إعفاء من العقاب! 🎫");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleUseCardAction = (index: number) => {
    if ((state.immunityCards || 0) <= 0) return;
    
    setPunishmentUIStates(prev => ({ ...prev, [index]: 'resolving_card' }));
    if (punishmentTimeoutRefs.current[index]) clearTimeout(punishmentTimeoutRefs.current[index]);
    
    punishmentTimeoutRefs.current[index] = setTimeout(() => {
      const today = getTodayDateString();
      setState(prev => {
        const newCount = Math.max(0, (prev.pendingPunishmentsCount || (prev.pendingPunishment ? 1 : 0)) - 1);
        return {
          ...prev,
          pendingPunishment: newCount > 0,
          pendingPunishmentsCount: newCount,
          immunityCards: Math.max(0, (prev.immunityCards || 0) - 1),
          history: {
            ...prev.history,
            [today]: {
              ...(prev.history[today] || { lessonsCompleted: 0, punishedDaily: false, punished2Days: false }),
              pardonedPunishments: (prev.history[today]?.pardonedPunishments || 0) + 1
            }
          }
        };
      });
    }, 3000);
  };

  const handlePunishmentAction = (index: number, fulfilled: boolean) => {
    setPunishmentUIStates(prev => ({ ...prev, [index]: fulfilled ? 'resolving_done' : 'resolving_failed' }));
    if (punishmentTimeoutRefs.current[index]) clearTimeout(punishmentTimeoutRefs.current[index]);
    
    punishmentTimeoutRefs.current[index] = setTimeout(() => {
      const today = getTodayDateString();
      setState(prev => {
        const newCount = Math.max(0, (prev.pendingPunishmentsCount || (prev.pendingPunishment ? 1 : 0)) - 1);
        return { 
          ...prev, 
          pendingPunishment: newCount > 0,
          pendingPunishmentsCount: newCount,
          history: fulfilled ? {
            ...prev.history,
            [today]: {
              ...(prev.history[today] || { lessonsCompleted: 0, punishedDaily: false, punished2Days: false }),
              resolvedPunishments: (prev.history[today]?.resolvedPunishments || 0) + 1,
              punishmentResolved: true // Keep for backward compatibility
            }
          } : {
            ...prev.history,
            [today]: {
              ...(prev.history[today] || { lessonsCompleted: 0, punishedDaily: false, punished2Days: false }),
              failedPunishments: (prev.history[today]?.failedPunishments || 0) + 1,
              expelled: true // Keep for backward compatibility
            }
          }
        };
      });
      setPunishmentUIStates(prev => ({ ...prev, [index]: 'idle' }));
    }, 4000);
  };

  const handleUndoPunishment = (index: number) => {
    if (punishmentTimeoutRefs.current[index]) clearTimeout(punishmentTimeoutRefs.current[index]);
    setPunishmentUIStates(prev => ({ ...prev, [index]: 'idle' }));
  };

  const handleGenerateTestData = () => {
    const newHistory: Record<string, any> = {};
    const todayStr = getTodayDateString();
    let currDate = addDays(todayStr, -7);
    
    let totalCompleted = 0;
    
    while (currDate <= todayStr) {
      const rand = Math.random();
      let lessons = 0;
      if (rand > 0.8) lessons = 28;
      else if (rand > 0.5) lessons = 20;
      else if (rand > 0.3) lessons = 10;
      else if (rand > 0.15) lessons = 5;
      else lessons = 0;
      
      newHistory[currDate] = { lessonsCompleted: lessons, punishedDaily: false, punished2Days: false };
      totalCompleted += lessons;
      currDate = addDays(currDate, 1);
    }
    
    const tempState: AppState = {
      completedLessons: [],
      khatmatCount: Math.floor(totalCompleted / 28),
      history: newHistory,
      lastLoginDate: addDays(todayStr, -7),
      startDate: addDays(todayStr, -7),
      dailyGoal: state.dailyGoal || 10,
      pendingPunishment: false,
      pendingPunishmentsCount: 0
    };
    
    const { newState } = processMissedDays(tempState);
    if (!newState.history[todayStr]) {
      newState.history[todayStr] = { lessonsCompleted: 0, punishedDaily: false, punished2Days: false };
    }
    newState.lastLoginDate = todayStr;
    
    setState(newState);
    setToastMessage("تم توليد بيانات اختبار بنجاح 🧪");
    setTimeout(() => setToastMessage(""), 3000);
    setShowSettings(false);
  };

  const total2Days = todayCompleted + yesterdayCompleted;
  const twoDayGoal = dailyGoal * 2;
  
  let statusBoxClasses = "rounded-[2rem] p-6 text-white flex flex-col justify-center items-center gap-4 relative overflow-hidden shrink-0 shadow-lg transition-all duration-300 ";
  let statusBoxContent;

  const cornerFraction = (
    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg font-mono font-bold text-sm" dir="ltr">
      {total2Days}/{twoDayGoal}
    </div>
  );

  if (total2Days < dailyGoal) {
    statusBoxClasses += "bg-gradient-to-br from-amber-400 to-amber-500 text-amber-950 shadow-amber-200/50";
    statusBoxContent = (
      <>
        {cornerFraction}
        <h4 className="text-2xl font-bold z-10 text-center">{randomTexts.threatened}</h4>
      </>
    );
  } else if (total2Days >= dailyGoal && total2Days < twoDayGoal) {
    statusBoxClasses += "bg-gradient-to-br from-indigo-500 to-blue-600 shadow-blue-200/50";
    statusBoxContent = (
      <>
        {cornerFraction}
        <h4 className="text-xl font-bold z-10 text-center">{randomTexts.default}</h4>
      </>
    );
  } else {
    statusBoxClasses += "bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-emerald-200/50";
    statusBoxContent = (
      <>
        {cornerFraction}
        <h4 className="text-2xl font-bold z-10 text-center">{randomTexts.safe}</h4>
      </>
    );
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
      pendingPunishment: false,
      pendingPunishmentsCount: 0
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
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100/80 font-sans text-slate-800" dir="rtl">
      <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200/50 shrink-0">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <button
              onClick={() => setShowStats(true)}
              className="flex items-center gap-2 bg-yellow-50 hover:bg-yellow-100 transition-colors px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-yellow-200 text-yellow-700 shadow-sm"
            >
              <Trophy className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
              <span className="font-bold font-mono text-sm md:text-base">{currentScore}</span>
            </button>
          </div>
          
          <div className="flex gap-2 hidden md:flex">
            <button 
              onClick={() => {
                setTempGoal(state.dailyGoal || 10);
                setShowSettings(true);
              }} 
              className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowInstructions(true)} 
              className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex gap-2 md:gap-6 items-center">
          <div className="flex flex-col items-center justify-center bg-red-50 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-red-100 min-w-[90px] md:min-w-[120px]">
            <span className="text-[10px] md:text-xs font-bold text-red-400">منتصف الليل</span>
            <span className="text-lg md:text-2xl font-black text-red-600 font-mono" dir="ltr">{timeToMidnight}</span>
          </div>

          <div className="flex md:hidden gap-1">
            <button 
              onClick={() => {
                setTempGoal(state.dailyGoal || 10);
                setShowSettings(true);
              }} 
              className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setShowInstructions(true)} 
              className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
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
          <CalendarTracker history={state.history} dailyGoal={dailyGoal} currentScore={currentScore} pendingPunishment={state.pendingPunishment} pendingPunishmentsCount={state.pendingPunishmentsCount} />
          
          {(state.unclaimedGifts || 0) > 0 && (
            <div onClick={handleClaimGift} className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-[2rem] p-5 flex items-center justify-between shadow-lg shadow-yellow-200/50 cursor-pointer hover:scale-[1.02] transition-transform">
               <div className="flex items-center gap-4">
                 <div className="text-4xl animate-bounce">🎁</div>
                 <div>
                   <h3 className="font-bold text-yellow-800 text-lg">هدية جديدة بانتظارك!</h3>
                   <p className="text-yellow-700 text-sm font-medium">لإتمامك ٢٠ درس أو أكثر ليومين متتاليين</p>
                 </div>
               </div>
               <button className="bg-yellow-500 text-white font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-yellow-600 transition-colors shrink-0">
                 افتح الهدية
               </button>
            </div>
          )}

          {Array.from({ length: state.pendingPunishmentsCount || (state.pendingPunishment ? 1 : 0) }).map((_, idx) => {
            let classes = "rounded-[2rem] p-6 text-white flex flex-col justify-center items-center gap-4 relative overflow-hidden shrink-0 shadow-lg transition-all duration-300 ";
            const uiState = punishmentUIStates[idx] || 'idle';
            let content;

            if (uiState === 'resolving_failed') {
              classes += "bg-gradient-to-br from-slate-800 to-slate-900 shadow-slate-300/50";
              content = (
                <div className="relative z-10 flex flex-col items-center w-full gap-4">
                  <h4 className="text-xl font-bold text-rose-500 text-center">{randomTexts.punishmentFailed}</h4>
                  <button onClick={() => handleUndoPunishment(idx)} className="mt-2 bg-slate-700/50 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-slate-600 transition-colors flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> تراجع
                  </button>
                </div>
              );
            } else if (uiState === 'resolving_done') {
              classes += "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-200/50";
              content = (
                <div className="relative z-10 flex flex-col items-center w-full gap-4">
                  <h4 className="text-xl font-bold text-white text-center">{randomTexts.punishmentDone}</h4>
                  <button onClick={() => handleUndoPunishment(idx)} className="mt-2 bg-emerald-800/50 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> تراجع
                  </button>
                </div>
              );
            } else if (uiState === 'resolving_card') {
              classes += "bg-gradient-to-br from-yellow-400 to-amber-500 shadow-yellow-200/50";
              const phrase = PARDONED_BOX_PHRASES[idx % PARDONED_BOX_PHRASES.length];
              content = (
                <div className="relative z-10 flex flex-col items-center w-full gap-4">
                  <h4 className="text-xl font-bold text-yellow-900 text-center">{phrase}</h4>
                  <button onClick={() => handleUndoPunishment(idx)} className="mt-2 bg-yellow-600/20 text-yellow-900 px-6 py-2 rounded-xl font-bold text-sm hover:bg-yellow-600/30 transition-colors flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> تراجع
                  </button>
                </div>
              );
            } else {
              classes += "bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-200/50";
              content = (
                <div className="relative z-10 flex flex-col items-center w-full gap-4">
                  <h4 className="text-xl font-bold text-center">{randomTexts.punishmentTitle}</h4>
                  <div className="flex gap-3 w-full mt-2">
                    <button onClick={() => handlePunishmentAction(idx, true)} className="flex-1 bg-white text-rose-600 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-rose-50 transition-colors">أتممت العقاب</button>
                    <button onClick={() => handlePunishmentAction(idx, false)} className="flex-1 bg-rose-800 text-white py-3 rounded-xl font-bold text-sm hover:bg-rose-900 transition-colors">لم أتمم</button>
                  </div>
                  {(state.immunityCards || 0) > 0 && (
                    <button onClick={() => handleUseCardAction(idx)} className="w-full bg-yellow-400 text-yellow-900 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-yellow-300 transition-colors flex justify-center items-center gap-2">
                      <Gift className="w-4 h-4" />
                      استخدام كرت إعفاء من العقاب 🎫
                    </button>
                  )}
                </div>
              );
            }

            return (
              <div key={`punishment-${idx}`} className={classes}>
                {content}
              </div>
            );
          })}

          <div className={statusBoxClasses}>
            {statusBoxContent}
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
                <button 
                  onClick={handleGenerateTestData}
                  className="mt-2 w-full flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-100 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  توليد بيانات اختبار عشوائية (أسبوع)
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

      {showStats && (
        <StatsModal 
          history={state.history}
          dailyGoal={dailyGoal}
          khatmatCount={state.khatmatCount}
          immunityCards={state.immunityCards || 0}
          onClose={() => setShowStats(false)}
        />
      )}

      {showInstructions && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" dir="rtl">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-500" />
                تعليمات البرنامج
              </h2>
              <button 
                onClick={() => setShowInstructions(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex flex-col gap-6 text-slate-700 text-sm leading-relaxed">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">١</div>
                <div>
                  <h3 className="font-bold text-base mb-1">الهدف اليومي</h3>
                  <p>عليك إكمال الحد الأدنى من الدروس يومياً (يمكنك تعديله من الإعدادات، الافتراضي هو ١٠ دروس).</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold shrink-0">٢</div>
                <div>
                  <h3 className="font-bold text-base mb-1">منطقة التهديد</h3>
                  <p>إذا لم تنجزي الحد الأدنى في يوم ما، ستكونين مهددة بالعقاب في اليوم التالي. الصندوق سيتحول للون الأصفر التحذيري.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">٣</div>
                <div>
                  <h3 className="font-bold text-base mb-1">العقاب</h3>
                  <p>لتجنب العقاب، عليكِ إكمال {dailyGoal * 2} درساً في يومين متتاليين. إذا قصرتِ في ذلك، سيطبق عليكِ العقاب وسيظهر صندوق أحمر منفصل لطلب تنفيذه.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold shrink-0">٤</div>
                <div>
                  <h3 className="font-bold text-base mb-1">الطرد من المجموعة</h3>
                  <p>عند وقوع العقاب، يجب عليكِ الضغط على "أتممت العقاب". إذا ضغطتِ على "لم أتمم" سيتم طردك نهائياً من المجموعة (يمكنك التراجع خلال ٤ ثوانٍ).</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
              <button 
                onClick={() => setShowInstructions(false)}
                className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors"
              >
                فهمت ذلك 👍
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
