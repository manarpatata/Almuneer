const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "const cloudData = docSnap.data();",
  "const cloudData = docSnap.data() as AppState;"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed type");
