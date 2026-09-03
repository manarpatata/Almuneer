const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const cleanState = JSON\.parse\(JSON\.stringify\(stateToSave\)\);\s*setDoc\(doc\(db, 'users', user\.uid\), cleanState, \{ merge: true \}\)\.catch\(e => console\.error\("Error saving to cloud:", e\)\);/g;

const replacement = `const cleanState = JSON.parse(JSON.stringify(stateToSave));
        updateDoc(doc(db, 'users', user.uid), cleanState).catch(e => {
          // If document doesn't exist yet, fallback to setDoc
          setDoc(doc(db, 'users', user.uid), cleanState);
        });`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Successfully replaced cloud sync logic.");
} else {
  console.log("Regex didn't match.");
}
