const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');
content = content.replace(
  /export interface SupervisorPunishment \{/,
  'export interface SupervisorPunishment {\n  signature?: string;'
);
fs.writeFileSync('src/types.ts', content);
