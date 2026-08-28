const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

if (!code.includes('trackedUsers?: string[]')) {
  code = code.replace(
    "expelledUntil?: number;",
    "expelledUntil?: number;\n  trackedUsers?: string[];"
  );
  fs.writeFileSync('src/types.ts', code);
  console.log("Patched types");
}
