const fs = require('fs');
let code = fs.readFileSync('src/components/SupervisorDashboard.tsx', 'utf8');

code = code.replace(/\\\`/g, '\`');
code = code.replace(/\\\$/g, '$');

fs.writeFileSync('src/components/SupervisorDashboard.tsx', code);
console.log("Fixed slashes");
