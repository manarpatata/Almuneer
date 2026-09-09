const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex1 = /return Math\.max\(0, score\);\s*\}, \[state\.history, dailyGoal, state\.khatmatCount\]\);/g;
const replacement1 = `return Math.max(0, score) + (state.points || 0);
  }, [state.history, dailyGoal, state.khatmatCount, state.points]);`;

content = content.replace(regex1, replacement1);

// Now remove the manual + (state.points || 0) additions
const regex2 = /\{currentScore \+ \(state\.points \|\| 0\)\}/g;
const replacement2 = `{currentScore}`;

content = content.replace(regex2, replacement2);

const regex3 = /points=\{currentScore \+ \(state\.points \|\| 0\)\}/g;
const replacement3 = `points={currentScore}`;

content = content.replace(regex3, replacement3);

fs.writeFileSync('src/App.tsx', content);
console.log("Fixed currentScore to include state.points");
