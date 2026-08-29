const fs = require('fs');
let code = fs.readFileSync('src/utils.ts', 'utf8');

const oldCode = `  while (currDate < today) {
    const dayStats = newState.history[currDate] || { lessonsCompleted: 0, punishedDaily: false, punished2Days: false };
    
    // Check daily punishment
    if (dayStats.lessonsCompleted === 0 && !dayStats.punishedDaily) {
      dayStats.punishedDaily = true;
      activePunishments.waterGuns.push(currDate);
      newState.pendingPunishment = true;
      newState.pendingPunishmentsCount = 1;
    }
    
    // Check 2-day punishment
    const prevDate = addDays(currDate, -1);
    const startDate = newState.startDate || newState.lastLoginDate;
    
    // Only check 2-day punishment if the previous day is on or after the start date
    if (prevDate >= startDate) {
      const prevStats = newState.history[prevDate] || { lessonsCompleted: 0, punishedDaily: false, punished2Days: false };
      const total2Days = dayStats.lessonsCompleted + prevStats.lessonsCompleted;
      const twoDayGoal = (newState.dailyGoal || 10) * 2;
      
      if (total2Days < twoDayGoal && !dayStats.punished2Days) {
        dayStats.punished2Days = true;
        activePunishments.heavyPunishments.push(currDate);
        newState.pendingPunishment = true;
        newState.pendingPunishmentsCount = 1;
      }
    }`;

const newCode = `  while (currDate < today) {
    const dayStats = newState.history[currDate] || { lessonsCompleted: 0, punishedDaily: false, punished2Days: false };
    let punishedThisDay = false;
    
    // Check daily punishment
    if (dayStats.lessonsCompleted === 0 && !dayStats.punishedDaily) {
      dayStats.punishedDaily = true;
      activePunishments.waterGuns.push(currDate);
      newState.pendingPunishment = true;
      if (!punishedThisDay) {
        newState.pendingPunishmentsCount = (newState.pendingPunishmentsCount || 0) + 1;
        punishedThisDay = true;
      }
    }
    
    // Check 2-day punishment
    const prevDate = addDays(currDate, -1);
    const startDate = newState.startDate || newState.lastLoginDate;
    
    // Only check 2-day punishment if the previous day is on or after the start date
    if (prevDate >= startDate) {
      const prevStats = newState.history[prevDate] || { lessonsCompleted: 0, punishedDaily: false, punished2Days: false };
      const total2Days = dayStats.lessonsCompleted + prevStats.lessonsCompleted;
      const twoDayGoal = (newState.dailyGoal || 10) * 2;
      
      if (total2Days < twoDayGoal && !dayStats.punished2Days) {
        dayStats.punished2Days = true;
        activePunishments.heavyPunishments.push(currDate);
        newState.pendingPunishment = true;
        if (!punishedThisDay) {
          newState.pendingPunishmentsCount = (newState.pendingPunishmentsCount || 0) + 1;
          punishedThisDay = true;
        }
      }
    }`;

code = code.replace(oldCode, newCode);
fs.writeFileSync('src/utils.ts', code);
console.log("Patched utils.ts");
