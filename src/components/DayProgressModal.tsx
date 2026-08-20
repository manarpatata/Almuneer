import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DailyStats } from '../types';
import { getDayNameArabic, getShortDate, addDays } from '../utils';
import { toBlob } from 'html-to-image';
import { Share2, X } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis } from 'recharts';

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  let fill = "#10b981"; // green
  if (payload.expelled) fill = "#1e293b"; // slate-800
  else if (payload.punished) fill = "#ef4444"; // red-500
  else if (payload.lessons >= 20) fill = "#10b981"; // emerald-500
  else if (payload.lessons >= 10) fill = "#34d399"; // emerald-400
  else fill = "#f59e0b"; // amber-500

  return (
    <circle cx={cx} cy={cy} r={5} stroke="#fff" strokeWidth={2} fill={fill} />
  );
};

interface DayProgressModalProps {
  date: string | null;
  stats: DailyStats | null;
  history: Record<string, DailyStats>;
  onClose: () => void;
}

export function DayProgressModal({ date, stats, history, onClose }: DayProgressModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (!cardRef.current || !date) return;
    try {
      const blob = await toBlob(cardRef.current, {
        backgroundColor: '#F8FAFC',
        pixelRatio: 2
      });
      
      if (!blob) return;
      
      const file = new File([blob], `progress-${date}.png`, { type: 'image/png' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'إنجازي اليومي',
          text: 'شاهد إنجازي في الإنجاز المنيري!',
          files: [file]
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `progress-${date}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error("Sharing failed", e);
    }
  };

  const hasLessons = stats && stats.lessonsCompleted > 0;
  const punished = stats?.punishedDaily || stats?.punished2Days;
  const expelled = stats?.expelled;
  const completed = stats?.lessonsCompleted || 0;

  let message = "";
  let msgColor = "";
  
  if (date) {
    const hash = date.charCodeAt(date.length - 1) % 4;
    if (expelled) {
      message = "طرد تأديبي من المجموعة 🚪";
      msgColor = "text-slate-800";
    } else if (punished) {
      message = "معاقبة 😔";
      msgColor = "text-rose-600";
    } else if (completed >= 20) {
      message = ["الأفضل في مجرة درب الشمبعانة 🌌", "ملكة الكون 👑", "أحسن وحدة في الحياتي 💖", "أشطر شطور 🌟"][hash];
      msgColor = "text-emerald-600";
    } else if (completed >= 10) {
      message = ["رائعة ✨", "ممتازة 👏", "أحسنت 👍", "فنانة 🎨"][hash];
      msgColor = "text-emerald-600";
    } else {
      message = "تحت التهديد ⚠️";
      msgColor = "text-amber-500";
    }
  }

  const chartData = date ? Array.from({ length: 7 }, (_, i) => {
    const d = addDays(date, -6 + i);
    const dayStats = history[d];
    return {
      name: getDayNameArabic(d).replace('ال', ''),
      lessons: dayStats?.lessonsCompleted || 0,
      punished: dayStats?.punishedDaily || dayStats?.punished2Days,
      expelled: dayStats?.expelled
    };
  }) : [];

  return (
    <AnimatePresence>
      {date && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div 
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-[2rem] shadow-2xl max-w-sm w-full overflow-hidden flex flex-col max-h-[95vh]"
            onClick={e => e.stopPropagation()}
            dir="rtl"
          >
            <div className="overflow-y-auto flex-1 w-full">
              <div ref={cardRef} className="p-6 sm:p-8 pb-6 sm:pb-10 bg-gradient-to-b from-white to-[#F8FAFC] relative flex flex-col border-b border-slate-100">
                
                <div className="text-center mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">{getDayNameArabic(date)}</h3>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-5xl sm:text-[3.5rem] font-black text-emerald-600 font-mono tracking-tighter leading-none" dir="ltr">
                      {completed}
                      <span className="text-2xl sm:text-3xl text-emerald-200">/28</span>
                    </span>
                  {expelled ? (
                    <span className="text-4xl" title="طرد تأديبي">🔪</span>
                  ) : punished || completed < 10 ? (
                    <span className="text-4xl" title="تحت التهديد">🔫</span>
                  ) : null}
                </div>
                <p className="text-slate-400 font-bold text-sm mt-2 uppercase tracking-wide">درس مكتمل</p>
              </div>

              <div className="w-full h-32 sm:h-40 mt-2 mb-4 sm:mb-6" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} dy={10} />
                    <Line 
                      type="monotone" 
                      dataKey="lessons" 
                      stroke="#cbd5e1" 
                      strokeWidth={3} 
                      dot={<CustomDot />} 
                      activeDot={{ r: 7 }}
                      animationDuration={1000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="text-center mb-4">
                <h4 className={`text-xl font-bold font-sans ${msgColor}`}>
                  {message}
                </h4>
              </div>

              <div className="text-center mt-auto pt-2">
                <p className="text-slate-400 font-medium text-sm">{getShortDate(date)}</p>
              </div>
            </div>
            </div>
            
            <div className="flex gap-3 p-3 sm:p-4 bg-slate-50 shrink-0">
              <button 
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-800 text-white py-3 sm:py-4 rounded-xl font-bold hover:bg-slate-700 transition-colors"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">مشاركة الإنجاز</span>
              </button>
              <button 
                onClick={onClose}
                className="p-3 sm:p-4 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
