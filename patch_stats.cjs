const fs = require('fs');
let code = fs.readFileSync('src/components/StatsModal.tsx', 'utf8');

if (!code.includes('getWeeklyLessons')) {
  code = code.replace(
    "import { AppState, DailyStats } from '../types';",
    "import { AppState, DailyStats } from '../types';\nimport { getWeeklyLessons, getTodayDateString } from '../utils';"
  );
}

const oldLessons = `            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-bold">إجمالي الدروس</p>
                <p className="text-2xl font-black text-slate-800 font-mono">{totalLessons}</p>
              </div>
            </div>`;

const newLessons = `            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-bold">إجمالي الدروس</p>
                <p className="text-2xl font-black text-slate-800 font-mono">{totalLessons}</p>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-bold">دروس هذا الأسبوع</p>
                <p className="text-2xl font-black text-slate-800 font-mono">{getWeeklyLessons(history, getTodayDateString())}</p>
              </div>
            </div>`;

code = code.replace(oldLessons, newLessons);
fs.writeFileSync('src/components/StatsModal.tsx', code);
console.log("Patched StatsModal");
