const fs = require('fs');
let content = fs.readFileSync('src/components/SupervisorReports.tsx', 'utf8');

content = content.replace(
  "import { getWeeklyLessons, getMostRecentThursday } from '../utils';",
  "import { getWeeklyLessons, getMostRecentThursday, addDays } from '../utils';"
);

fs.writeFileSync('src/components/SupervisorReports.tsx', content);
console.log('Fixed import');
