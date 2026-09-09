const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const currentScore = useMemo\(\(\) => \{\s*let score = state\.khatmatCount \* 100;\s*Object\.values\(state\.history\)\.forEach\(\(day: any\) => \{\s*const failed = day\.failedPunishments \|\| \(day\.expelled \? 1 : 0\);\s*score -= failed \* 100;\s*if \(day\.punished2Days \|\| day\.punishedDaily\) \{\s*score -= 50;\s*\}\s*if \(day\.lessonsCompleted < dailyGoal\) \{\s*score -= 10;\s*\}\s*if \(day\.lessonsCompleted >= 20 && day\.lessonsCompleted < 28\) \{\s*score \+= 50;\s*\} else if \(day\.lessonsCompleted >= dailyGoal && day\.lessonsCompleted < 20\) \{\s*score \+= 10;\s*\}\s*\}\);\s*return Math\.max\(0, score\);\s*\}, \[state\.history, dailyGoal, state\.khatmatCount\]\);/g;

const replacement = `const currentScore = useMemo(() => {
    let score = state.khatmatCount * 100;
    Object.keys(state.history).forEach((dateStr) => {
      const day = state.history[dateStr] as any;
      const failed = (day.failedPunishments || 0) + (day.expelled ? 1 : 0);
      score -= failed * 100;
      
      const isFinished = dateStr < getTodayDateString();
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
    return Math.max(0, score);
  }, [state.history, dailyGoal, state.khatmatCount]);`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Successfully replaced currentScore logic in App.tsx.");
} else {
  console.log("Regex didn't match in App.tsx.");
}
