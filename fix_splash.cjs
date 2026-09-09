const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const splashRegex = /const gotPunished2DaysToday = yesterdayCompleted === 0 && state\.history\[yesterdayDate\]\?\.punished2Days;\s*const gotSplashedToday = yesterdayCompleted === 0 && state\.history\[yesterdayDate\]\?\.punishedDaily && !gotPunished2DaysToday;/g;

const splashReplacement = `const gotPunished2DaysToday = state.history[yesterdayDate]?.punished2Days;
  const gotSplashedToday = yesterdayCompleted === 0 && !isYesterdayBeforeStart;`;

content = content.replace(splashRegex, splashReplacement);

const bgRegex = /const mainBgClasses = gotPunished2DaysToday\s*\?\s*"bg-gradient-to-br from-rose-50 to-rose-100\/80 text-rose-900 relative"\s*:\s*gotSplashedToday\s*\?\s*"bg-gradient-to-br from-blue-50 to-cyan-100\/80 text-blue-900 relative"\s*:\s*"bg-gradient-to-br from-slate-50 to-slate-100\/80 text-slate-800";/g;

const bgReplacement = `const mainBgClasses = gotSplashedToday
    ? "bg-gradient-to-br from-blue-50 to-cyan-100/80 text-blue-900 relative"
    : gotPunished2DaysToday 
    ? "bg-gradient-to-br from-rose-50 to-rose-100/80 text-rose-900 relative"
    : "bg-gradient-to-br from-slate-50 to-slate-100/80 text-slate-800";`;

content = content.replace(bgRegex, bgReplacement);

fs.writeFileSync('src/App.tsx', content);
console.log("Successfully replaced splash logic.");
