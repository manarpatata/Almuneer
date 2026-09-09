const fs = require('fs');
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
let utilsContent = fs.readFileSync('src/utils.ts', 'utf8');

const regex = /const failed = \(day\.failedPunishments \|\| 0\) \+ \(day\.expelled \? 1 : 0\);/g;
const replacement = `const failed = day.failedPunishments || (day.expelled ? 1 : 0);`;

if (regex.test(appContent)) {
  appContent = appContent.replace(regex, replacement);
  fs.writeFileSync('src/App.tsx', appContent);
  console.log("Fixed failed in App.tsx");
}

if (regex.test(utilsContent)) {
  utilsContent = utilsContent.replace(regex, replacement);
  fs.writeFileSync('src/utils.ts', utilsContent);
  console.log("Fixed failed in utils.ts");
}

// In case the utils one had a different regex:
const regexUtils2 = /const failed = \(day\.failedPunishments \? 1 : 0\) \+ \(day\.expelled \? 1 : 0\);/g;
if (regexUtils2.test(utilsContent)) {
  utilsContent = utilsContent.replace(regexUtils2, replacement);
  fs.writeFileSync('src/utils.ts', utilsContent);
  console.log("Fixed failed in utils.ts (regex 2)");
}
