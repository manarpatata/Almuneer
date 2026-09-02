const fs = require('fs');
let content = fs.readFileSync('src/components/WalletModal.tsx', 'utf8');

// 1. Remove pointsCards from WalletModalProps
content = content.replace(
  /\s*pointsCards: number; \/\/ calculated from points \/ 300/,
  ''
);

// 2. Remove pointsCards from WalletModal signature
content = content.replace(
  /export function WalletModal\(\{ immunityCards, freezeCards, pointsCards, onClose \}: WalletModalProps\) \{/,
  'export function WalletModal({ immunityCards, freezeCards, onClose }: WalletModalProps) {'
);

// 3. Remove points from cards array
content = content.replace(
  /\.\.\.Array\(pointsCards\)\.fill\('points'\)/,
  ''
);

// Cleanup empty elements in array if there's a trailing comma left over
content = content.replace(
  /,\s*\]/,
  '\n  ]'
);

// 4. In App.tsx, remove pointsCards prop when calling WalletModal
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(
  /\s*pointsCards=\{Math\.floor\(\(state\.points \|\| 0\) \/ 300\)\}/,
  ''
);
fs.writeFileSync('src/App.tsx', appContent);

fs.writeFileSync('src/components/WalletModal.tsx', content);
console.log('WalletModal patched');
