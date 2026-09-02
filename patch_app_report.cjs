const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add gotPunished2DaysToday
content = content.replace(
  /const gotSplashedToday = yesterdayCompleted === 0 && state.history\[yesterdayDate\]\?\.punishedDaily;/,
  `const gotPunished2DaysToday = yesterdayCompleted === 0 && state.history[yesterdayDate]?.punished2Days;
  const gotSplashedToday = yesterdayCompleted === 0 && state.history[yesterdayDate]?.punishedDaily && !gotPunished2DaysToday;`
);

// 2. Change mainBgClasses
content = content.replace(
  /const mainBgClasses = isExpelled\s*\?\s*"bg-gradient-to-br from-red-50 to-red-100\/80 text-red-950"\s*:\s*gotSplashedToday\s*\?\s*"bg-gradient-to-br from-blue-50 to-cyan-100\/80 text-blue-900 relative"/,
  `const mainBgClasses = isExpelled 
    ? "bg-gradient-to-br from-red-50 to-red-100/80 text-red-950" 
    : gotPunished2DaysToday
    ? "bg-gradient-to-br from-red-50 to-rose-100/80 text-red-900 relative"
    : gotSplashedToday
    ? "bg-gradient-to-br from-blue-50 to-cyan-100/80 text-blue-900 relative"`
);

// 3. Change progress report message
content = content.replace(
  /\{gotSplashedToday && \(\s*<div className="bg-blue-100 border-2 border-blue-400 text-blue-700 p-4 rounded-xl font-bold text-center mb-4">\s*يتم تفتيقها لعدم مذاكرتها أي درس🔫!\s*<\/div>\s*\)\}/,
  `{gotPunished2DaysToday ? (
              <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 rounded-xl font-bold text-center mb-4">
                تُحال إلى لجنة التفتيق والعقاب🔫💥
              </div>
            ) : gotSplashedToday ? (
              <div className="bg-blue-100 border-2 border-blue-400 text-blue-700 p-4 rounded-xl font-bold text-center mb-4">
                يتم تفتيقها لعدم مذاكرتها أي درس🔫!
              </div>
            ) : null}`
);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx report logic patched');
