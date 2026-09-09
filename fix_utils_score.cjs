const fs = require('fs');
let content = fs.readFileSync('src/utils.ts', 'utf8');

const regex = /export function calculateTotalScore\(state: AppState\) \{\s*let score = \(state\.khatmatCount \|\| 0\) \* 100;\s*const dailyGoal = state\.dailyGoal \|\| 10;\s*if \(state\.history\) \{\s*Object\.values\(state\.history\)\.forEach\(\(day: any\) => \{\s*const failed = \(day\.failedPunishments \? 1 : 0\) \+ \(day\.expelled \? 1 : 0\);\s*score -= failed \* 100;\s*if \(day\.punished2Days \|\| day\.punishedDaily\) \{\s*score -= 50;\s*\}\s*if \(day\.lessonsCompleted < dailyGoal\) \{\s*score -= 10;\s*\}\s*if \(day\.lessonsCompleted >= 20 && day\.lessonsCompleted < 28\) \{\s*score \+= 50;\s*\} else if \(day\.lessonsCompleted >= dailyGoal && day\.lessonsCompleted < 20\) \{\s*score \+= 10;\s*\}\s*\}\);\s*\}\s*return Math\.max\(0, score\) \+ \(state\.points \|\| 0\);\s*\}/g;

const replacement = `export function calculateTotalScore(state: AppState) {
  let score = (state.khatmatCount || 0) * 100;
  const dailyGoal = state.dailyGoal || 10;
  const today = getTodayDateString();
  
  if (state.history) {
    Object.keys(state.history).forEach((dateStr) => {
      const day = state.history[dateStr] as any;
      const failed = (day.failedPunishments || 0) + (day.expelled ? 1 : 0);
      score -= failed * 100;
      
      const isFinished = dateStr < today;
      if (isFinished) {
        if (day.punished2Days) {
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
      }
    });
  }
  
  return Math.max(0, score) + (state.points || 0);
}`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/utils.ts', content);
  console.log("Successfully replaced calculateTotalScore in utils.ts.");
} else {
  console.log("Regex didn't match in utils.ts.");
}
