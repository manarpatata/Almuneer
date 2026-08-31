const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const gotSplashedStr = `  const isYesterdayBeforeStart = yesterdayDate < (state.startDate || state.lastLoginDate);
  const gotSplashedToday = yesterdayCompleted === 0 && state.history[yesterdayDate]?.punishedDaily;`;

code = code.replace(
  "  const isYesterdayBeforeStart = yesterdayDate < (state.startDate || state.lastLoginDate);",
  gotSplashedStr
);

const bgStr = `  const mainBgClasses = isExpelled 
    ? "bg-gradient-to-br from-red-50 to-red-100/80 text-red-950" 
    : gotSplashedToday
    ? "bg-gradient-to-br from-blue-50 to-cyan-100/80 text-blue-900 relative"
    : "bg-gradient-to-br from-slate-50 to-slate-100/80 text-slate-800";`;

code = code.replace(
  /  const mainBgClasses = isExpelled \n    \? "bg-gradient-to-br from-red-50 to-red-100\/80 text-red-950" \n    : "bg-gradient-to-br from-slate-50 to-slate-100\/80 text-slate-800";/g,
  bgStr
);

const waterDrops = `      {gotSplashedToday && (
        <div className="fixed inset-0 pointer-events-none z-[45] overflow-hidden opacity-40">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute bg-blue-400 w-1 h-3 rounded-full animate-bounce" style={{ left: \`\${Math.random() * 100}%\`, top: \`\${Math.random() * 100}%\`, animationDuration: \`\${0.5 + Math.random()}s\`, animationDelay: \`\${Math.random()}s\` }}></div>
          ))}
        </div>
      )}
      <header`;

code = code.replace(
  "      <header",
  waterDrops
);

const splashedTextInLessons = `            {gotSplashedToday && (
              <div className="bg-blue-100 border-2 border-blue-400 text-blue-700 p-4 rounded-xl font-bold text-center mb-4">
                يتم تفتيقها لعدم مذاكرتها أي درس🔫!
              </div>
            )}
            <LessonsList`;

code = code.replace(
  "            <LessonsList",
  splashedTextInLessons
);

fs.writeFileSync('src/App.tsx', code);
