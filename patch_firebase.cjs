const fs = require('fs');
let code = fs.readFileSync('src/firebase.ts', 'utf8');
code = code.replace(
  'import { getAuth, GoogleAuthProvider } from "firebase/auth";',
  'import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";'
);
if (!code.includes('setPersistence')) {
  code += "\nsetPersistence(auth, browserLocalPersistence).catch(console.error);\n";
}
fs.writeFileSync('src/firebase.ts', code);
console.log("Patched firebase.ts for explicit persistence");
