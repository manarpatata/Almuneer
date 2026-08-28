const fs = require('fs');

const utilCode = `
export function calculateTotalScore(state: AppState) {
  let score = (state.khatmatCount || 0) * 100;
  const dailyGoal = state.dailyGoal || 10;
  
  if (state.history) {
    Object.values(state.history).forEach((day: any) => {
      const failed = (day.failedPunishments ? 1 : 0) + (day.expelled ? 1 : 0);
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
  }
  
  return Math.max(0, score) + (state.points || 0);
}
`;

let utilsFile = fs.readFileSync('src/utils.ts', 'utf8');
if (!utilsFile.includes('calculateTotalScore')) {
  utilsFile = utilsFile + utilCode;
  fs.writeFileSync('src/utils.ts', utilsFile);
}
console.log("Patched utils.ts");
