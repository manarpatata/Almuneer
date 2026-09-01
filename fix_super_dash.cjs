const fs = require('fs');
let content = fs.readFileSync('src/components/SupervisorDashboard.tsx', 'utf8');

// Remove the top UserLeaderboard render
content = content.replace(/\{\/\* Champions Board \*\/\}[\s\S]*?\}\)\(\)\}/m, '');

// Also clean up import if necessary (though it won't break anything if unused but better to be safe)
content = content.replace("import { UserLeaderboard } from './UserLeaderboard';", "");

fs.writeFileSync('src/components/SupervisorDashboard.tsx', content);
console.log('Fixed SupervisorDashboard');
