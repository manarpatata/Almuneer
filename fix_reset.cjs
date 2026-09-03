const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const executeReset = \(\) => \{\s*const today = getTodayDateString\(\);\s*setState\(\{[\s\S]*?pendingPunishmentsCount: 0\s*\}\);/g;

const replacement = `const executeReset = () => {
    const today = getTodayDateString();
    setState(prev => ({
      ...prev,
      completedLessons: [],
      khatmatCount: 0,
      history: {
        [today]: { lessonsCompleted: 0, punishedDaily: false, punished2Days: false }
      },
      lastLoginDate: today,
      startDate: today,
      dailyGoal: prev.dailyGoal || 10,
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
    }));`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Successfully replaced executeReset logic.");
} else {
  console.log("Regex didn't match.");
}
