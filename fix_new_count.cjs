const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// I might have replaced it in two places: handleUseCardAction and handlePunishmentAction.
// Let's replace "const newCount = 0;" with the proper decrement logic in both handlers.

// Wait, I should just grep where I put "const newCount = 0;".
console.log(code.match(/const newCount = 0;/g));

code = code.replace(
  /const newCount = 0;/g,
  "const newCount = Math.max(0, (prev.pendingPunishmentsCount || (prev.pendingPunishment ? 1 : 0)) - 1);"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Reverted newCount to proper decrement");
