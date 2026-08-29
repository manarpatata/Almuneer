import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Target, AlertTriangle, ShieldAlert, Star, BookOpen } from 'lucide-react';
import { AppState, DailyStats } from '../types';
import { getWeeklyLessons, getTodayDateString } from '../utils';

interface StatsModalProps {
  history: Record<string, DailyStats>;
  dailyGoal: number;
  khatmatCount: number;
  immunityCards: number;
  extraPoints: number;
  onClose: () => void;
}

export function StatsModal({ history, dailyGoal, khatmatCount, immunityCards, extraPoints, onClose }: StatsModalProps) {
  let totalLessons = 0;
  let superDays = 0; // days with >= 20 lessons (but < 28)
  let normalDays = 0; // days with >= dailyGoal (but < 20)
  let threatenedDays = 0; // days with < dailyGoal (but not punished)
  let punishments = 0;
  let expulsions = 0;
  let waterGunShots = 0;
  let score = (khatmatCount * 100) + (extraPoints || 0);

  Object.values(history).forEach(day => {
    totalLessons += day.lessonsCompleted;
    
    // Counters
    const failed = day.failedPunishments || (day.expelled ? 1 : 0);
    
    expulsions += failed;
    
    if (day.punishedDaily) {
      waterGunShots++;
    }

    // Penalties
    score -= failed * 100;
    
    if (day.punished2Days || day.punishedDaily) {
      punishments++;
      score -= 50;
    }
    
    if (day.lessonsCompleted < dailyGoal) {
      threatenedDays++;
      score -= 10;
    }

    // Rewards
    if (day.lessonsCompleted >= dailyGoal * 2 && day.lessonsCompleted < 28) {
      superDays++;
      score += 50;
    } else if (day.lessonsCompleted >= dailyGoal && day.lessonsCompleted < dailyGoal * 2) {
      normalDays++;
      score += 10;
    }
  });

  score = Math.max(0, score); // Prevent negative total score

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          onClick={e => e.stopPropagation()}
          dir="rtl"
        >
          <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-300" />
              تقرير الإنجازات
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex flex-col gap-6">
            {/* Score Header */}
            <div className="flex flex-col items-center justify-center bg-emerald-50 rounded-2xl p-6 border border-emerald-100 text-emerald-800">
              <span className="text-sm font-bold mb-2">إجمالي النقاط</span>
              <div className="flex items-center gap-2">
                <span className="text-5xl font-black font-mono tracking-tighter">{score}</span>
                <span className="text-emerald-500">نقطة</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                <BookOpen className="w-8 h-8 text-blue-500 mb-2" />
                <span className="text-2xl font-bold text-slate-800 font-mono">{totalLessons}</span>
                <span className="text-xs font-bold text-slate-500">إجمالي الدروس</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                <Star className="w-8 h-8 text-yellow-500 mb-2" />
                <span className="text-2xl font-bold text-slate-800 font-mono">{khatmatCount}</span>
                <span className="text-xs font-bold text-slate-500">الختمات الكاملة (٢٨)</span>
              </div>
              <div className="col-span-2 bg-yellow-50 p-4 rounded-2xl border border-yellow-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-xl">🎫</div>
                  <div className="flex flex-col">
                    <span className="font-bold text-yellow-900">كروت الإعفاء</span>
                    <span className="text-xs font-medium text-yellow-700">رصيدك الحالي من الكروت</span>
                  </div>
                </div>
                <span className="text-3xl font-black font-mono text-yellow-600">{immunityCards || 0}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">تفاصيل الأيام</h3>
              
              <div className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">🚀</div>
                  <span className="font-bold text-slate-700 text-sm">أيام خارقة (ضعف الهدف)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-emerald-600">{superDays}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-700 text-sm">أيام حققت الهدف</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-blue-600">{normalDays}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg">🔫</div>
                  <span className="font-bold text-slate-700 text-sm">رشات الماء</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-blue-600">{waterGunShots}</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-700 text-sm">أيام تحت التهديد</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-amber-600">{threatenedDays}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-rose-50/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-700 text-sm">العقابات</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-rose-600">{punishments}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center">🔪</div>
                  <span className="font-bold text-slate-800 text-sm">الطردات</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-slate-800">{expulsions}</span>
                </div>
              </div>

            </div>
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
            <button
              onClick={onClose}
              className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors"
            >
              إغلاق
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
