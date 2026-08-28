const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldCode = `        points: giftType === 'points' ? (prev.points || 0) + 300 : prev.points,
        extraStreakFreezes: giftType === 'freeze' ? (prev.extraStreakFreezes || 0) + 1 : prev.extraStreakFreezes,
        immunityCards: giftType === 'pardon' ? (prev.immunityCards || 0) + 1 : prev.immunityCards`;

const newCode = `        points: giftType === 'points' ? (prev.points || 0) + 300 : (prev.points || 0),
        extraStreakFreezes: giftType === 'freeze' ? (prev.extraStreakFreezes || 0) + 1 : (prev.extraStreakFreezes || 0),
        immunityCards: giftType === 'pardon' ? (prev.immunityCards || 0) + 1 : (prev.immunityCards || 0)`;

code = code.replace(oldCode, newCode);
fs.writeFileSync('src/App.tsx', code);
console.log("Fixed undefined gift values");
