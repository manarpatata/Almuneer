const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "import { calculateStreak, getTodayDateString, addDays, getDayNameArabic, getShortDate, processMissedDays } from './utils';",
  "import { calculateStreak, getTodayDateString, addDays, getDayNameArabic, getShortDate, processMissedDays, calculateTotalScore } from './utils';"
);

const oldScoreCode = `  const currentScore = useMemo(() => {
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
  }, [state.history, state.khatmatCount, dailyGoal]);`;

const newScoreCode = `  const currentScore = useMemo(() => {
    // we just use calculateTotalScore minus state.points because calculateTotalScore includes state.points
    // actually, let's just use it to match the rest of the code that expects currentScore to NOT include state.points
    return calculateTotalScore(state) - (state.points || 0);
  }, [state]);`;

code = code.replace(oldScoreCode, newScoreCode);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx score");
