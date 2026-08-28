const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldSync = `        const stateToSave = {
          ...state,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0]
        };
        setDoc(doc(db, 'users', user.uid), stateToSave).catch(e => console.error("Error saving to cloud:", e));`;

const newSync = `        const stateToSave = {
          ...state,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0]
        };
        // Clean undefined values to prevent Firebase errors
        const cleanState = JSON.parse(JSON.stringify(stateToSave));
        setDoc(doc(db, 'users', user.uid), cleanState).catch(e => console.error("Error saving to cloud:", e));`;

code = code.replace(oldSync, newSync);
fs.writeFileSync('src/App.tsx', code);
console.log("Fixed undefined sync");
