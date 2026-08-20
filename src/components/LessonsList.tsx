import React, { useMemo } from 'react';
import { LESSONS } from '../data';
import { CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'motion/react';

interface LessonsListProps {
  completedLessons: string[];
  onToggle: (lesson: string, isCompleted: boolean) => void;
}

export function LessonsList({ completedLessons, onToggle }: LessonsListProps) {
  const progress = (completedLessons.length / LESSONS.length) * 100;

  const sortedLessons = useMemo(() => {
    return [...LESSONS].sort((a, b) => {
      const aDone = completedLessons.includes(a);
      const bDone = completedLessons.includes(b);
      if (aDone && !bDone) return 1;
      if (!aDone && bDone) return -1;
      return LESSONS.indexOf(a) - LESSONS.indexOf(b);
    });
  }, [completedLessons]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shrink-0 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)]">
        <h2 className="font-bold text-lg flex items-center gap-2 text-slate-800">
          <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
          قائمة الدروس
        </h2>
        <span className="text-sm bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold font-mono" dir="ltr">
          {completedLessons.length}/{LESSONS.length}
        </span>
      </div>

      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shrink-0" dir="ltr">
        <motion.div 
          className="h-full bg-emerald-500 rounded-full ml-auto"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-2 pb-4">
        {sortedLessons.map((lesson) => {
          const isCompleted = completedLessons.includes(lesson);
          return (
            <motion.button
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              key={lesson}
              onClick={() => onToggle(lesson, !isCompleted)}
              className={`flex items-center gap-3 p-3 bg-white rounded-xl border transition-all text-right focus:outline-none ${
                isCompleted 
                  ? 'border-emerald-500 bg-emerald-50/50' 
                  : 'border-slate-100 hover:border-emerald-200'
              }`}
            >
              <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded border-2 transition-colors relative">
                {isCompleted ? (
                  <div className="absolute inset-0 bg-emerald-500 border-emerald-500 rounded flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="absolute inset-0 border-slate-300 rounded" />
                )}
              </div>
              <span className={`text-sm font-bold leading-tight transition-colors ${
                isCompleted ? 'text-emerald-700 opacity-70' : 'text-slate-700'
              }`}>
                {lesson}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
