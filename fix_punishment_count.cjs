const fs = require('fs');
let code = fs.readFileSync('src/utils.ts', 'utf8');

code = code.replace(
  /newState\.pendingPunishmentsCount = \(newState\.pendingPunishmentsCount \|\| 0\) \+ 1;/g,
  "newState.pendingPunishmentsCount = 1;"
);

fs.writeFileSync('src/utils.ts', code);
console.log("Fixed pendingPunishmentsCount");
