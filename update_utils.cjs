const fs = require('fs');
let code = fs.readFileSync('src/utils.ts', 'utf8');

const searchStr = `
    // Check daily punishment
    if (dayStats.lessonsCompleted === 0 && !dayStats.punishedDaily) {
      dayStats.punishedDaily = true;
      activePunishments.waterGuns.push(currDate);
    }
`;

const replaceStr = `
    // Check daily punishment
    if (dayStats.lessonsCompleted === 0 && !dayStats.punishedDaily) {
      dayStats.punishedDaily = true;
      activePunishments.waterGuns.push(currDate);
      newState.pendingPunishment = true;
      newState.pendingPunishmentsCount = (newState.pendingPunishmentsCount || 0) + 1;
    }
`;

code = code.replace(searchStr.trim(), replaceStr.trim());
fs.writeFileSync('src/utils.ts', code);
