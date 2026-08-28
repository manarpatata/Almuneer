const fs = require('fs');
let code = fs.readFileSync('src/components/SupervisorDashboard.tsx', 'utf8');

code = code.replace(
  "import { calculateStreak } from '../utils';",
  "import { calculateStreak, getTodayDateString } from '../utils';"
);

code = code.replace(
  "const streak = calculateStreak(u.data.history);",
  "const streak = calculateStreak(u.data.history, u.data.startDate || getTodayDateString(), getTodayDateString(), u.data.extraStreakFreezes || 0);"
);

fs.writeFileSync('src/components/SupervisorDashboard.tsx', code);
console.log("Fixed calculateStreak in Dashboard");
