const fs = require('fs');
let code = fs.readFileSync('src/components/SupervisorDashboard.tsx', 'utf8');

code = code.replace(
  "import { calculateStreak, getTodayDateString } from '../utils';",
  "import { calculateStreak, getTodayDateString, calculateTotalScore } from '../utils';"
);

fs.writeFileSync('src/components/SupervisorDashboard.tsx', code);
console.log("Patched dashboard imports");
