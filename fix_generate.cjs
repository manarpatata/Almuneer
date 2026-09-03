const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const tempState: AppState = \{\s*completedLessons: \[\],\s*khatmatCount: Math\.floor\(totalCompleted \/ 28\),\s*history: newHistory,\s*lastLoginDate: addDays\(todayStr, -7\),\s*startDate: addDays\(todayStr, -7\),\s*dailyGoal: state\.dailyGoal \|\| 10,\s*pendingPunishment: false,\s*pendingPunishmentsCount: 0\s*\};/g;

const replacement = `const tempState: AppState = {
      ...state,
      completedLessons: [],
      khatmatCount: Math.floor(totalCompleted / 28),
      history: newHistory,
      lastLoginDate: addDays(todayStr, -7),
      startDate: addDays(todayStr, -7),
      dailyGoal: state.dailyGoal || 10,
      pendingPunishment: false,
      pendingPunishmentsCount: 0,
      points: 0,
      immunityCards: 0,
      extraStreakFreezes: 0,
      supervisorGifts: [],
      unclaimedGifts: 0,
      claimedGiftsByDate: {},
      lastClaimedGiftDate: '',
      supervisorPunishments: [],
      claimedFollowUpGifts: 0,
      claimedFollowUpGiftsByDate: {},
      earnedGiftDates: []
    };`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Successfully replaced generate test data logic.");
} else {
  console.log("Regex didn't match.");
}
