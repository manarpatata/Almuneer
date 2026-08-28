const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldSync = `            const initialState = {
              ...state,
              email: user.email,
              displayName: user.displayName || user.email?.split('@')[0]
            };
            await setDoc(doc(db, 'users', user.uid), initialState);`;

const newSync = `            const initialState = {
              ...state,
              email: user.email,
              displayName: user.displayName || user.email?.split('@')[0]
            };
            await setDoc(doc(db, 'users', user.uid), JSON.parse(JSON.stringify(initialState)));`;

if(code.includes(oldSync)) {
  code = code.replace(oldSync, newSync);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Fixed init sync");
}
