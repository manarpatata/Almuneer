/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LESSONS } from './data';
import { AppState } from './types';
import { getTodayDateString, processMissedDays, addDays, calculateStreak } from './utils';
import { LessonsList } from './components/LessonsList';
import { CalendarTracker } from './components/CalendarTracker';
import { UserLeaderboard } from './components/UserLeaderboard';
import { WaterGunOverlay } from './components/WaterGunOverlay';
import { StatsModal } from './components/StatsModal';
import { WalletModal } from './components/WalletModal';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Settings, X, AlertTriangle, RotateCcw, CheckCircle, HelpCircle, Trophy, Gift, Scale, Skull, Search, Shield, Star, Snowflake } from 'lucide-react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { Auth } from './components/Auth';
import { ProfileMenu } from './components/ProfileMenu';
import { SupervisorDashboard } from './components/SupervisorDashboard';
import { SupervisorGiftOverlay } from './components/SupervisorGiftOverlay';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [dataLoadedFromCloud, setDataLoadedFromCloud] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
      if (currentUser) {
        setShowAuthModal(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      let isFirstLoad = true;
      const unsubscribe = onSnapshot(doc(db, 'users', user.uid), async (docSnap) => {
        if (docSnap.exists()) {
          const cloudData = docSnap.data() as AppState;
          const { newState } = processMissedDays(cloudData);
          if (newState.dailyGoal === undefined) newState.dailyGoal = 10;
          
          setState(prev => {
            // Avoid triggering an immediate save loop
            return { ...newState };
          });
        } else {
          if (isFirstLoad) {
            // First time login, save current local state to cloud with user info
            const initialState = {
              ...state,
              email: user.email,
              displayName: user.displayName || user.email?.split('@')[0]
            };
            await setDoc(doc(db, 'users', user.uid), JSON.parse(JSON.stringify(initialState)));
            setState(initialState);
          }
        }
        if (isFirstLoad) {
          isFirstLoad = false;
          setDataLoadedFromCloud(true);
        }
      }, (err) => {
        console.error("Error loading cloud data:", err);
      });
      return () => unsubscribe();
    } else {
      setDataLoadedFromCloud(false);
    }
  }, [user]);

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
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmGenerate, setConfirmGenerate] = useState(false);
  const [tempGoal, setTempGoal] = useState(state.dailyGoal || 10);
  const [toastMessage, setToastMessage] = useState("");
  
  const [timeToMidnight, setTimeToMidnight] = useState("");

  useEffect(() => {
    localStorage.setItem('alMuneerState_v4', JSON.stringify(state));
    
    // Sync to Firestore if user is logged in and initial cloud load is complete
    if (user && dataLoadedFromCloud) {
      // Use a small timeout to debounce writes
      const timeoutId = setTimeout(() => {
        const stateToSave = {
          ...state,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0]
        };
        // Clean undefined values to prevent Firebase errors
        const cleanState = JSON.parse(JSON.stringify(stateToSave));
        setDoc(doc(db, 'users', user.uid), cleanState).catch(e => console.error("Error saving to cloud:", e));
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [state, user, dataLoadedFromCloud]);

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

  const [punishmentUIStates, setPunishmentUIStates] = useState<Record<number, 'idle' | 'resolving_done' | 'resolving_failed' | 'resolving_card'>>({});
  const [openedPunishmentBoxes, setOpenedPunishmentBoxes] = useState<Record<number, boolean>>({});
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

  const handleClaimGift = (idx: number) => {
    if (openedGiftsBoxes[idx]) return;
    
    setOpenedGiftsBoxes(prev => ({ ...prev, [idx]: true }));
    const todayStr = getTodayDateString();
    setState(prev => {
      const currentClaimedToday = prev.claimedGiftsByDate?.[todayStr] || 0;
      return {
        ...prev,
        unclaimedGifts: Math.max(0, (prev.unclaimedGifts || 0) - 1),
        immunityCards: (prev.immunityCards || 0) + 1,
        lastClaimedGiftDate: todayStr,
        claimedGiftsByDate: {
          ...(prev.claimedGiftsByDate || {}),
          [todayStr]: currentClaimedToday + 1
        }
      };
    });
    setToastMessage("تم إضافة كرت الإعفاء لرصيدك! 🎫");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const shiftRecordKeys = <T,>(prev: Record<number, T>, indexToRemove: number): Record<number, T> => {
    const next: Record<number, T> = {};
    for (const keyStr in prev) {
      const key = parseInt(keyStr, 10);
      if (key < indexToRemove) {
        next[key] = prev[key];
      } else if (key > indexToRemove) {
        next[key - 1] = prev[key];
      }
    }
    return next;
  };

  const handleOpenPunishmentBox = (index: number) => {
    setOpenedPunishmentBoxes(prev => ({ ...prev, [index]: true }));
  };

  const handleUseCardAction = (index: number, pId: string, isSystem: boolean) => {
    if ((state.immunityCards || 0) <= 0) return;
    
    setState(prev => ({
      ...prev,
      immunityCards: Math.max(0, (prev.immunityCards || 0) - 1)
    }));
    
    setPunishmentUIStates(prev => ({ ...prev, [index]: 'resolving_card' }));
    if (punishmentTimeoutRefs.current[index]) clearTimeout(punishmentTimeoutRefs.current[index]);
    
    punishmentTimeoutRefs.current[index] = setTimeout(() => {
      const today = getTodayDateString();
      setState(prev => {
        let newCount = prev.pendingPunishmentsCount || (prev.pendingPunishment ? 1 : 0);
        let newSupPuns = prev.supervisorPunishments || [];
        if (isSystem) {
          newCount = Math.max(0, newCount - 1);
        } else {
          newSupPuns = newSupPuns.filter(p => p.id !== pId);
        }
        return {
          ...prev,
          pendingPunishment: newCount > 0,
          pendingPunishmentsCount: newCount,
          supervisorPunishments: newSupPuns,
          history: {
            ...prev.history,
            [today]: {
              ...(prev.history[today] || { lessonsCompleted: 0, punishedDaily: false, punished2Days: false }),
              pardonedPunishments: (prev.history[today]?.pardonedPunishments || 0) + 1
            }
          }
        };
      });
      setPunishmentUIStates(prev => shiftRecordKeys(prev, index));
      setOpenedPunishmentBoxes(prev => shiftRecordKeys(prev, index));
    }, 3000);
  };

  const handlePunishmentAction = (index: number, fulfilled: boolean, pId: string, isSystem: boolean) => {
    setPunishmentUIStates(prev => ({ ...prev, [index]: fulfilled ? 'resolving_done' : 'resolving_failed' }));
    if (punishmentTimeoutRefs.current[index]) clearTimeout(punishmentTimeoutRefs.current[index]);
    
    punishmentTimeoutRefs.current[index] = setTimeout(() => {
      const today = getTodayDateString();
      setState(prev => {
        let newCount = prev.pendingPunishmentsCount || (prev.pendingPunishment ? 1 : 0);
        let newSupPuns = prev.supervisorPunishments || [];
        if (isSystem) {
          newCount = Math.max(0, newCount - 1);
        } else {
          newSupPuns = newSupPuns.filter(p => p.id !== pId);
        }
        return { 
          ...prev, 
          pendingPunishment: newCount > 0,
          pendingPunishmentsCount: newCount,
          supervisorPunishments: newSupPuns,
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
      setPunishmentUIStates(prev => shiftRecordKeys(prev, index));
      setOpenedPunishmentBoxes(prev => shiftRecordKeys(prev, index));
    }, 4000);
  };

  const handleUndoPunishment = (index: number) => {
    if (punishmentTimeoutRefs.current[index]) clearTimeout(punishmentTimeoutRefs.current[index]);
    setPunishmentUIStates(prev => ({ ...prev, [index]: 'idle' }));
  };

  const executeGenerateTestData = () => {
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
  
  let statusBoxClasses = "rounded-3xl p-4 text-white flex flex-col justify-center items-center gap-2 relative overflow-hidden shadow-lg transition-all duration-300 h-full w-full ";
  let statusBoxContent;

  const cornerFraction = (
    <div className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded font-mono font-bold text-xs" dir="ltr">
      {total2Days}/{twoDayGoal}
    </div>
  );

  if (total2Days < dailyGoal) {
    statusBoxClasses += "bg-gradient-to-br from-amber-400 to-amber-500 text-amber-950 shadow-amber-200/50";
    statusBoxContent = (
      <>
        <AlertTriangle className="w-6 h-6 opacity-80" />
        <h4 className="text-sm font-bold z-10 text-center">تحت التهديد!</h4>
        {cornerFraction}
      </>
    );
  } else if (total2Days >= dailyGoal && total2Days < twoDayGoal) {
    statusBoxClasses += "bg-gradient-to-br from-indigo-500 to-blue-600 shadow-blue-200/50";
    statusBoxContent = (
      <>
        <RotateCcw className="w-6 h-6 opacity-80" />
        <h4 className="text-sm font-bold z-10 text-center text-white">نصف المسافة</h4>
        {cornerFraction}
      </>
    );
  } else {
    statusBoxClasses += "bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-emerald-200/50";
    statusBoxContent = (
      <>
        <CheckCircle className="w-6 h-6 opacity-80" />
        <h4 className="text-sm font-bold z-10 text-center">بر الأمان!</h4>
        {cornerFraction}
      </>
    );
  }

  const handleReset = () => {
    setConfirmReset(true);
  };


  const handleClaimSupervisorGift = (giftId: string) => {
    setState(prev => {
      const gift = prev.supervisorGifts?.find(g => g.id === giftId);
      const newGifts = (prev.supervisorGifts || []).map(g => 
        g.id === giftId ? { ...g, claimed: true } : g
      );
      const giftType = gift?.giftType || 'points';
      
      let msg = "تم استلام هدية المشرف! ✨";
      if (giftType === 'freeze') msg = "تم إضافة كرت تجميد ستريك! 🧊";
      if (giftType === 'pardon') msg = "تم إضافة كرت إعفاء من العقوبة! 🛡️";
      
      setToastMessage(msg);
      setTimeout(() => setToastMessage(""), 3000);
      
      return {
        ...prev,
        supervisorGifts: newGifts,
        points: giftType === 'points' ? (prev.points || 0) + 300 : (prev.points || 0),
        extraStreakFreezes: giftType === 'freeze' ? (prev.extraStreakFreezes || 0) + 1 : (prev.extraStreakFreezes || 0),
        immunityCards: giftType === 'pardon' ? (prev.immunityCards || 0) + 1 : (prev.immunityCards || 0)
      };
    });
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

  const todayStr = getTodayDateString();
  const availableGiftsCount = useMemo(() => {
    const earnedDates = state.earnedGiftDates || [];
    const earnedBeforeToday = earnedDates.filter(d => d < todayStr).length;
    const totalClaimed = Math.max(0, earnedDates.length - (state.unclaimedGifts || 0));
    
    let legacyGifts = 0;
    if (earnedDates.length === 0 && (state.unclaimedGifts || 0) > 0) {
      legacyGifts = state.unclaimedGifts || 0;
    } else if (state.unclaimedGifts !== undefined && state.unclaimedGifts > earnedDates.length) {
      legacyGifts = state.unclaimedGifts - earnedDates.length;
    }
    
    return Math.max(0, earnedBeforeToday - totalClaimed) + legacyGifts;
  }, [state.earnedGiftDates, state.unclaimedGifts, todayStr]);

  const openedGiftsToday = useMemo(() => {
    const claimedToday = state.claimedGiftsByDate?.[todayStr] || 0;
    const legacyClaimedToday = (state.lastClaimedGiftDate === todayStr && !state.claimedGiftsByDate) ? 1 : 0;
    return Math.max(claimedToday, legacyClaimedToday);
  }, [state.claimedGiftsByDate, state.lastClaimedGiftDate, todayStr]);

  const totalGiftsToday = availableGiftsCount + openedGiftsToday;

  const { currentStreak, freezesAvailable, longestStreak, earnedFollowUpGifts } = useMemo(() => {
     const historyDates = Object.keys(state.history).sort();
     const actualStartDate = state.startDate || (historyDates.length > 0 ? historyDates[0] : state.lastLoginDate);
     return calculateStreak(state.history, actualStartDate, todayStr, state.extraStreakFreezes || 0);
  }, [state.history, state.startDate, state.lastLoginDate, todayStr, state.extraStreakFreezes]);

  const availableFollowUpGifts = Math.max(0, earnedFollowUpGifts - (state.claimedFollowUpGifts || 0));
  const openedFollowUpGiftsTodayList = state.claimedFollowUpGiftsByDate?.[todayStr] || [];
  const openedFollowUpGiftsToday = openedFollowUpGiftsTodayList.length;
  const totalFollowUpGiftsToday = availableFollowUpGifts + openedFollowUpGiftsToday;

  const [openedFollowUpBoxes, setOpenedFollowUpBoxes] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setOpenedFollowUpBoxes(prev => {
      const currentOpenedCount = Object.values(prev).filter(Boolean).length;
      if (currentOpenedCount === openedFollowUpGiftsToday) {
        return prev;
      }
      
      const newState: Record<number, boolean> = {};
      for (let i = 0; i < totalFollowUpGiftsToday; i++) {
        if (i >= availableFollowUpGifts) {
          newState[i] = true;
        } else {
          newState[i] = false;
        }
      }
      return newState;
    });
  }, [availableFollowUpGifts, openedFollowUpGiftsToday, totalFollowUpGiftsToday]);

  const handleClaimFollowUpGift = (idx: number) => {
    if (openedFollowUpBoxes[idx]) return;
    
    setOpenedFollowUpBoxes(prev => ({ ...prev, [idx]: true }));
    const outcome = Math.random() > 0.5 ? 'points' : 'freeze';
    
    setState(prev => {
      const currentList = prev.claimedFollowUpGiftsByDate?.[todayStr] || [];
      return {
        ...prev,
        claimedFollowUpGifts: (prev.claimedFollowUpGifts || 0) + 1,
        points: (prev.points || 0) + (outcome === 'points' ? 300 : 0),
        extraStreakFreezes: (prev.extraStreakFreezes || 0) + (outcome === 'freeze' ? 1 : 0),
        claimedFollowUpGiftsByDate: {
          ...(prev.claimedFollowUpGiftsByDate || {}),
          [todayStr]: [...currentList, outcome]
        }
      };
    });
    setToastMessage(outcome === 'points' ? "تم إضافة 300 نقطة! 🌟" : "تم إضافة كرت استعادة الستريك! 🧊");
    setTimeout(() => setToastMessage(""), 3000);
  };


  const [openedGiftsBoxes, setOpenedGiftsBoxes] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setOpenedGiftsBoxes(prev => {
      const currentOpenedCount = Object.values(prev).filter(Boolean).length;
      if (currentOpenedCount === openedGiftsToday) {
        return prev;
      }
      
      const newState: Record<number, boolean> = {};
      for (let i = 0; i < totalGiftsToday; i++) {
        if (i >= availableGiftsCount) {
          newState[i] = true;
        } else {
          newState[i] = false;
        }
      }
      return newState;
    });
  }, [availableGiftsCount, openedGiftsToday, totalGiftsToday]);





  if (showDashboard && user) {
    return <SupervisorDashboard onClose={() => setShowDashboard(false)} supervisorId={user.uid} trackedUsers={state.trackedUsers || []} showToast={(msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(''), 3000); }} />;
  }

  const isExpelled = state.expelledUntil && state.expelledUntil > Date.now();
  
  const mainBgClasses = isExpelled 
    ? "bg-gradient-to-br from-red-50 to-red-100/80 text-red-950" 
    : "bg-gradient-to-br from-slate-50 to-slate-100/80 text-slate-800";

  return (
    <div className={`flex flex-col min-h-screen w-full font-sans ${mainBgClasses}`} dir="rtl">
      {isExpelled && (
        <div className="bg-red-600 text-white text-center py-2 px-4 font-bold text-sm shadow-md flex items-center justify-center gap-2 sticky top-0 z-[60]">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>أنت مطرود بقرار من المشرف لمدة 24 ساعة، لكن يمكنك متابعة مهامك لتجنب خسارة الستريك!</span>
        </div>
      )}
      {showAuthModal && <Auth onClose={() => setShowAuthModal(false)} />}
      
      <SupervisorGiftOverlay gifts={state.supervisorGifts || []} onClaim={handleClaimSupervisorGift} />
      <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-3">
            <ProfileMenu user={user} avatarUrl={state.avatarUrl} onLogin={() => setShowAuthModal(true)} onOpenDashboard={() => setShowDashboard(true)} onChangeAvatar={() => setShowAvatarModal(true)} showToast={(msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(''), 3000); }} />
            <div className="flex flex-col md:flex-row gap-1.5 md:gap-2">
              <button
                onClick={() => setShowStats(true)}
                className="flex items-center justify-center gap-1.5 bg-yellow-50 hover:bg-yellow-100 transition-colors px-2.5 py-0.5 md:px-3 md:py-1 rounded-lg border border-yellow-200 text-yellow-700 shadow-sm"
              >
                <Trophy className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-500" />
                <span className="font-black font-mono text-[11px] md:text-sm pt-0.5">{currentScore + (state.points || 0)}</span>
              </button>
              
              <button
                onClick={() => setShowStats(true)}
                className="flex items-center justify-center gap-1.5 bg-orange-50 hover:bg-orange-100 transition-colors px-2.5 py-0.5 md:px-3 md:py-1 rounded-lg border border-orange-200 text-orange-700 shadow-sm"
              >
                <span className="text-[11px] md:text-sm">🔥</span>
                <span className="font-black font-mono text-[11px] md:text-sm pt-0.5">{currentStreak}</span>
                {freezesAvailable > 0 && (
                  <span className="flex items-center gap-1 ml-0.5 pl-1.5 border-l border-orange-200">
                    <span className="text-[10px] md:text-xs text-blue-500">🧊</span>
                    <span className="font-bold font-mono text-[10px] md:text-xs text-blue-600 pt-0.5">{freezesAvailable}</span>
                  </span>
                )}
              </button>
            </div>
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

          <div className="flex flex-col md:hidden gap-1">
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
          {state.leaderboardSettings && <UserLeaderboard settings={state.leaderboardSettings} />}
          
          {Array.from({ length: totalGiftsToday }).map((_, idx) => (
            !openedGiftsBoxes[idx] ? (
              <div key={`gift-${idx}`} onClick={() => handleClaimGift(idx)} className="relative w-full h-48 bg-[#facc15] rounded-xl overflow-hidden shadow-2xl cursor-pointer hover:scale-[1.03] active:scale-95 transition-all border-4 border-[#eab308] shrink-0">
                {/* Vertical Ribbon */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-12 bg-[#ef4444] shadow-sm"></div>
                {/* Horizontal Ribbon */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-12 bg-[#ef4444] shadow-sm"></div>
                {/* Knot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#dc2626] rotate-45 rounded-xl shadow-lg border-[3px] border-[#ef4444]"></div>
                
                {/* Gift Tag */}
                <div className="absolute bottom-4 right-4 bg-[#fdf8e6] px-3 py-2 rounded-lg shadow-xl border-2 border-[#eab308] rotate-[-8deg] z-10 w-[140px] pointer-events-none">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#fdf8e6] rounded-full border-2 border-[#eab308] flex items-center justify-center">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  </div>
                  <p className="text-sm font-black text-[#b37012] mb-1.5 leading-tight text-center mt-1">هدية لأنك أشطر شطور 🌟</p>
                  <p className="text-[10px] text-[#8c5508] font-bold border-t border-[#eab308]/40 pt-1.5 text-center">من: لجنة العقوبات</p>
                </div>
              </div>
            ) : (
              <div key={`opened-gift-${idx}`} className="bg-[#fdf3c8] border-[6px] border-[#e5a022] rounded-xl p-5 shadow-2xl relative flex flex-col items-center justify-center text-center transform -rotate-2 hover:rotate-0 transition-transform cursor-default h-48 overflow-hidden shrink-0">
                <div className="absolute inset-1 border-2 border-dashed border-[#e5a022] rounded-lg pointer-events-none"></div>
                <div className="w-12 h-12 bg-[#e5a022] text-white rounded-full flex items-center justify-center mb-3 shadow-inner z-10">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-black text-[#b37012] text-2xl uppercase tracking-widest mb-1 z-10">كرت الإعفاء</h3>
                <p className="text-[#8c5508] font-bold text-sm z-10 leading-relaxed max-w-[85%]">تعفيك من أي عقاب متى ما احتجتيه</p>
                
                <div className="absolute -bottom-2 right-2 w-24 h-24 rounded-full border-[5px] border-double border-red-700 flex flex-col items-center justify-center rotate-[-25deg] opacity-80 z-20">
                  <Scale className="w-6 h-6 text-red-700 mb-0.5" strokeWidth={2.5} />
                  <span className="text-[10px] font-black text-red-700 leading-tight text-center">لجنة<br/>العقوبات</span>
                </div>
              </div>
            )
          ))}

          {Array.from({ length: totalFollowUpGiftsToday }).map((_, idx) => {
            const outcome = state.claimedFollowUpGiftsByDate?.[todayStr]?.[idx] || 'points';
            return !openedFollowUpBoxes[idx] ? (
              <div key={`fu-gift-${idx}`} onClick={() => handleClaimFollowUpGift(idx)} className="relative w-full h-48 bg-indigo-500 rounded-xl overflow-hidden shadow-2xl cursor-pointer hover:scale-[1.03] active:scale-95 transition-all border-4 border-indigo-600 shrink-0">
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-12 bg-fuchsia-400 shadow-sm"></div>
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-12 bg-fuchsia-400 shadow-sm"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-fuchsia-500 rotate-45 rounded-xl shadow-lg border-[3px] border-fuchsia-400"></div>
                
                <div className="absolute bottom-4 right-4 bg-indigo-50 px-3 py-2 rounded-lg shadow-xl border-2 border-indigo-300 rotate-[-8deg] z-10 w-[140px] pointer-events-none">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-indigo-50 rounded-full border-2 border-indigo-300 flex items-center justify-center">
                    <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
                  </div>
                  <p className="text-sm font-black text-indigo-900 mb-1.5 leading-tight text-center mt-1">هدية لاستمراريتك الرهيبة 🚀</p>
                  <p className="text-[10px] text-indigo-700 font-bold border-t border-indigo-200 pt-1.5 text-center">من: لجنة المتابعة</p>
                </div>
              </div>
            ) : (
              <div key={`opened-fu-gift-${idx}`} className="bg-indigo-50 border-[6px] border-indigo-400 rounded-xl p-5 shadow-2xl relative flex flex-col items-center justify-center text-center transform -rotate-2 hover:rotate-0 transition-transform cursor-default h-48 overflow-hidden shrink-0">
                <div className="absolute inset-1 border-2 border-dashed border-indigo-300 rounded-lg pointer-events-none"></div>
                <div className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center mb-3 shadow-inner z-10">
                  {outcome === 'points' ? <Star className="w-6 h-6 fill-current" /> : <Snowflake className="w-6 h-6" />}
                </div>
                <h3 className="font-black text-indigo-800 text-xl uppercase tracking-widest mb-1 z-10">
                  {outcome === 'points' ? 'ربحت 300 نقطة!' : 'استعادة ستريك'}
                </h3>
                {outcome !== 'points' && (
                  <p className="text-indigo-600 font-bold text-sm z-10 leading-relaxed max-w-[85%]">
                    كرت استعادة أيام الانقطاع
                  </p>
                )}
                
                <div className="absolute -bottom-2 right-2 w-24 h-24 rounded-full border-[5px] border-double border-indigo-600 flex flex-col items-center justify-center rotate-[-25deg] opacity-80 z-20">
                  <div className="w-6 h-6 text-indigo-600 mb-0.5 flex items-center justify-center font-bold text-xl"><Search className="w-5 h-5 text-indigo-600" strokeWidth={2.5} /></div>
                  <span className="text-[10px] font-black text-indigo-600 leading-tight text-center">لجنة<br/>المتابعة</span>
                </div>
              </div>
            );
          })}
          

          
          {(() => {
            const systemPunishments = Array.from({ length: state.pendingPunishmentsCount || (state.pendingPunishment ? 1 : 0) }).map((_, i) => ({
              id: `sys-${i}`,
              type: 'system',
              reason: 'لم تنهي ٢٠ درسًا في اليومين الماضيين🔪',
              sender: 'لجنة العقوبات'
            }));
            const supPunishments = state.supervisorPunishments || [];
            const allPunishments = [...systemPunishments, ...supPunishments];
            
            return allPunishments.map((punishment, idx) => {
              let classes = "rounded-[2rem] p-6 text-white flex flex-col justify-center items-center gap-4 relative overflow-hidden shrink-0 shadow-lg transition-all duration-300 ";
              const uiState = punishmentUIStates[idx] || 'idle';
              let content;

            if (!openedPunishmentBoxes[idx]) {
              classes = "rounded-xl overflow-hidden shadow-2xl relative transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-95 bg-[#c19a6b] h-56 border-[4px] border-[#a68053] shrink-0";
              content = (
                <div onClick={() => handleOpenPunishmentBox(idx)} className="w-full h-full flex flex-col items-center justify-center relative">
                  {/* Cardboard Box Flaps / Tape */}
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-16 bg-[#a68053] opacity-80 border-l border-r border-[#8c6b44]"></div>
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-16 bg-[#a68053] opacity-80 border-t border-b border-[#8c6b44]"></div>
                  
                  {/* Skull and Blood */}
                  <div className="relative z-10 flex flex-col items-center justify-center mt-4">
                    <Skull className="w-16 h-16 text-[#4a3424] drop-shadow-xl opacity-90" />
                    {/* Blood splatters */}
                    <div className="absolute -top-1 -right-3 w-3 h-3 bg-red-700 rounded-full blur-[1px]"></div>
                    <div className="absolute top-3 -left-2 w-2 h-4 bg-red-800 rounded-full rotate-45 blur-[1px]"></div>
                    <div className="absolute bottom-1 -right-1 w-5 h-2 bg-red-700 rounded-full -rotate-12 blur-[1px]"></div>
                  </div>

                  {/* Seal */}
                  <div className="absolute bottom-2 right-2 w-24 h-24 rounded-full border-[5px] border-double border-red-700 flex flex-col items-center justify-center rotate-[-20deg] opacity-90 z-20">
                    <Scale className="w-6 h-6 text-red-700 mb-0.5" strokeWidth={2.5} />
                    <span className="text-[9px] font-black text-red-700 leading-tight text-center">{punishment.sender}</span>
                  </div>
                  
                  {/* Shipping Label */}
                  <div className="absolute top-4 left-4 bg-[#fdf8e6] px-3 py-2 rounded shadow-sm border border-[#d4b483] w-40 rotate-[5deg] z-20">
                    <div className="text-[8px] text-[#8c6b44] font-bold mb-1 border-b border-dashed border-[#8c6b44] pb-1">بيانات الشحن 📄</div>
                    <div className="text-[9px] text-[#4a3424] mb-1"><b>المرسل:</b> {punishment.sender}</div>
                    <div className="text-[9px] text-[#4a3424] mb-1"><b>السبب:</b> {punishment.reason}</div>
                    <div className="text-[8px] text-[#8c6b44] mt-1 pt-1 border-t border-dashed border-[#8c6b44]">التوقيع: {punishment.sender}</div>
                  </div>
                </div>
              );
            } else if (uiState === 'resolving_failed') {
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
                    <button onClick={() => handlePunishmentAction(idx, true, punishment.id, punishment.type === 'system')} className="flex-1 bg-white text-rose-600 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-rose-50 transition-colors">أتممت العقاب</button>
                    <button onClick={() => handlePunishmentAction(idx, false, punishment.id, punishment.type === 'system')} className="flex-1 bg-rose-800 text-white py-3 rounded-xl font-bold text-sm hover:bg-rose-900 transition-colors">لم أتمم</button>
                  </div>
                  {(state.immunityCards || 0) > 0 && (
                    <button onClick={() => handleUseCardAction(idx, punishment.id, punishment.type === 'system')} className="w-full bg-yellow-400 text-yellow-900 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-yellow-300 transition-colors flex justify-center items-center gap-2">
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
            });
          })()}

          <div className="flex gap-4 h-32 shrink-0">
            {/* Wallet Box (Right side in RTL) */}
            <div 
              onClick={() => setShowWalletModal(true)}
              className="flex-1 bg-amber-800 rounded-3xl relative overflow-hidden shadow-inner border-b-[6px] border-amber-900 cursor-pointer hover:bg-amber-700 transition-colors group"
            >
              {/* Flap */}
              <div className="absolute top-0 left-0 right-0 h-[55%] bg-amber-700 rounded-b-[2rem] border-b-4 border-amber-800 shadow-md flex items-end justify-center pb-2.5 transition-transform group-hover:-translate-y-1">
                {/* Clasp */}
                <div className="w-5 h-5 bg-yellow-600 rounded-full shadow-inner border-2 border-yellow-700 relative flex items-center justify-center">
                  <div className="w-2 h-2 bg-yellow-800/80 rounded-full"></div>
                </div>
              </div>
              {/* Stitching */}
              <div className="absolute inset-2 border-2 border-dashed border-amber-900/30 rounded-2xl pointer-events-none"></div>
            </div>

            {/* Status Box (Left side in RTL) */}
            <div className="flex-1">
              <div className={statusBoxClasses}>
                {statusBoxContent}
              </div>
            </div>
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
                <h3 className="font-bold text-indigo-600 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  خيارات المشرف
                </h3>
                <button 
                  onClick={() => {
                    setShowDashboard(true);
                    setShowSettings(false);
                  }}
                  className="mt-2 w-full flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-100 transition-colors"
                >
                  التحول إلى مشرف
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
                  onClick={() => setConfirmGenerate(true)}
                  className="mt-2 w-full flex items-center justify-center gap-2 bg-rose-50 text-rose-600 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-rose-100 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" />
                  توليد بيانات اختبار عشوائية (أسبوع)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmGenerate && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white p-5 rounded-2xl shadow-2xl z-[100] w-[90%] max-w-sm flex flex-col gap-4">
          <div className="flex items-center gap-3 text-rose-500 justify-center">
            <AlertTriangle className="w-6 h-6" />
            <h3 className="font-bold text-lg">تحذير خطير</h3>
          </div>
          <p className="text-center font-bold text-sm text-slate-300">سيتم استبدال جميع بياناتك الحالية ببيانات عشوائية، هل أنت متأكد؟</p>
          <div className="flex gap-3 w-full mt-2">
            <button onClick={() => { executeGenerateTestData(); setConfirmGenerate(false); }} className="flex-1 bg-rose-600 hover:bg-rose-700 py-2.5 rounded-xl text-sm font-bold transition-colors">نعم، متأكد</button>
            <button onClick={() => setConfirmGenerate(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 py-2.5 rounded-xl text-sm font-bold transition-colors">إلغاء</button>
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

      <AnimatePresence>
      {toastMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 bg-white text-slate-800 px-6 py-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-3 border border-slate-100 min-w-max"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="font-bold text-sm whitespace-nowrap">{toastMessage}</span>
        </motion.div>
      )}
      </AnimatePresence>

      {showWalletModal && (
        <WalletModal
          immunityCards={state.immunityCards || 0}
          freezeCards={freezesAvailable}
          pointsCards={Math.floor((state.points || 0) / 300)}
          onClose={() => setShowWalletModal(false)}
        />
      )}
      
      {showStats && (
        <StatsModal 
          history={state.history}
          dailyGoal={dailyGoal}
          khatmatCount={state.khatmatCount}
          immunityCards={state.immunityCards || 0} extraPoints={state.points || 0}
          onClose={() => setShowStats(false)} />
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
                  <p>إذا لم تنجزي الحد الأدنى في يوم ما، ستكونين مهددة بالعقاب في اليوم التالي.</p>
                  <p className="mt-1 text-blue-600 font-bold">🔫 التفتيق: إذا لم تتم أي درس في يوم ما (صفر درس) ستعاقب!</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold shrink-0">٣</div>
                <div>
                  <h3 className="font-bold text-base mb-1 text-red-700">لجنة العقوبات</h3>
                  <p>لتجنب العقاب العادي، عليكِ إكمال الهدف (الحد الأدنى × ٢) في يومين متتاليين. إذا لم تتمّ ذلك، ستعاقب.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold shrink-0">٤</div>
                <div>
                  <h3 className="font-bold text-base mb-1">الطرد من المجموعة</h3>
                  <p>عند وقوع العقاب، يجب عليكِ الضغط على "أتممت العقاب". إذا ضغطتِ على "لم أتمم" سيتم طردك نهائياً من المجموعة (يمكنك التراجع خلال ٤ ثوانٍ).</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">٥</div>
                <div>
                  <h3 className="font-bold text-base mb-1 text-indigo-700">الستريك</h3>
                  <ul className="list-disc pr-4 space-y-1 mt-1">
                    <li><strong>نظام الستريك 🔥:</strong> يتم حساب عدد الأيام المتتالية التي أنهيت فيها درساً واحداً على الأقل. انقطاع يوم يعيدك للصفر!</li>
                  </ul>
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
