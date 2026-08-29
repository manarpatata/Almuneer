const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "Array.from({ length: Math.min(1, state.pendingPunishmentsCount || (state.pendingPunishment ? 1 : 0)) })",
  "Array.from({ length: state.pendingPunishmentsCount || (state.pendingPunishment ? 1 : 0) })"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Removed Math.min(1) from punishment map");
