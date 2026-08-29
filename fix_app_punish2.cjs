const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "const newCount = Math.max(0, (prev.pendingPunishmentsCount || (prev.pendingPunishment ? 1 : 0)) - 1);",
  "const newCount = 0;"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Forced newCount to 0");
