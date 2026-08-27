const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldStreakCall = `const { currentStreak, freezesAvailable, longestStreak, earnedFollowUpGifts } = useMemo(() => {
     return calculateStreak(state.history, state.startDate || state.lastLoginDate, todayStr, state.extraStreakFreezes || 0);
  }, [state.history, state.startDate, state.lastLoginDate, todayStr, state.extraStreakFreezes]);`;

const newStreakCall = `const { currentStreak, freezesAvailable, longestStreak, earnedFollowUpGifts } = useMemo(() => {
     const historyDates = Object.keys(state.history).sort();
     const actualStartDate = state.startDate || (historyDates.length > 0 ? historyDates[0] : state.lastLoginDate);
     return calculateStreak(state.history, actualStartDate, todayStr, state.extraStreakFreezes || 0);
  }, [state.history, state.startDate, state.lastLoginDate, todayStr, state.extraStreakFreezes]);`;

code = code.replace(oldStreakCall, newStreakCall);
fs.writeFileSync('src/App.tsx', code);
