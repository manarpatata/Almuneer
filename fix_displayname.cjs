const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /displayName: user.displayName \|\| user.email\?.split\('@'\)\[0\]/g,
  "displayName: state.displayName || user.displayName || user.email?.split('@')[0]"
);

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed displayName saving');
