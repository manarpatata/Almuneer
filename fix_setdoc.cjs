const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetSave = `        const stateToSave = {
          ...state,
          email: user.email,
          displayName: state.displayName || user.displayName || user.email?.split('@')[0]
        };
        // Clean undefined values to prevent Firebase errors
        const cleanState = JSON.parse(JSON.stringify(stateToSave));
        setDoc(doc(db, 'users', user.uid), cleanState).catch(e => console.error("Error saving to cloud:", e));`;

const replacementSave = `        const stateToSave = {
          ...state,
          email: user.email
        };
        // Preserve displayName if it exists in state
        if (state.displayName) {
          stateToSave.displayName = state.displayName;
        }
        
        // Clean undefined values to prevent Firebase errors
        const cleanState = JSON.parse(JSON.stringify(stateToSave));
        setDoc(doc(db, 'users', user.uid), cleanState, { merge: true }).catch(e => console.error("Error saving to cloud:", e));`;

if (content.includes(targetSave)) {
  content = content.replace(targetSave, replacementSave);
  fs.writeFileSync('src/App.tsx', content);
  console.log('Fixed setDoc to use merge: true and preserve displayName');
} else {
  console.log('Target not found');
}
