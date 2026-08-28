const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  "kicked?: boolean;",
  "kicked?: boolean;\n  expelledUntil?: number;"
);

fs.writeFileSync('src/types.ts', code);
console.log("Patched types");
