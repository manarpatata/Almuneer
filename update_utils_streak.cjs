const fs = require('fs');
let code = fs.readFileSync('src/utils.ts', 'utf8');

// Remove the old calculateStreakAndFreezes if I accidentally appended it
code = code.replace(/export function calculateStreakAndFreezes[\s\S]*$/, '');

const streakCode = `
export function calculateStreak(history: Record<string, any>, startDate: string, today: string, extraFreezes: number = 0) {
  let currentStreak = 0;
  let freezesAvailable = 3 + extraFreezes;
  let longestStreak = 0;
  let earnedFollowUpGifts = 0;
  
  let curr = startDate;
  while (curr <= today) {
    const stats = history[curr];
    if (stats && stats.lessonsCompleted >= 1) {
      currentStreak++;
      if (currentStreak % 7 === 0) {
        earnedFollowUpGifts++;
      }
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      // Missing day (if it's not today yet, or if it is today and they haven't done anything but they still have time)
      // Actually, if it's today and they haven't completed a lesson yet, we shouldn't break the streak or use a freeze until tomorrow!
      if (curr < today) {
        if (freezesAvailable > 0) {
          freezesAvailable--;
        } else {
          currentStreak = 0;
        }
      }
    }
    curr = addDays(curr, 1);
  }
  return { currentStreak, freezesAvailable, longestStreak, earnedFollowUpGifts };
}
`;

fs.writeFileSync('src/utils.ts', code + streakCode);
