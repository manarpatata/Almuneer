const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

if (!code.includes('giftType?:')) {
  code = code.replace(
    "timestamp: number;",
    "timestamp: number;\n  giftType?: 'points' | 'freeze' | 'pardon';"
  );
}

if (!code.includes('avatarUrl?: string;')) {
  code = code.replace(
    "displayName?: string;",
    "displayName?: string;\n  avatarUrl?: string;"
  );
}

fs.writeFileSync('src/types.ts', code);
console.log("Patched types with giftType and avatarUrl");
