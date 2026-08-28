const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace getDoc with onSnapshot
code = code.replace(
  "import { doc, getDoc, setDoc } from 'firebase/firestore';",
  "import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';"
);

// Replace loadCloudData logic
const oldLoadLogic = `      const loadCloudData = async () => {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const cloudData = docSnap.data() as AppState;
            const { newState } = processMissedDays(cloudData);
            if (newState.dailyGoal === undefined) newState.dailyGoal = 10;
            setState(newState);
          } else {
            // First time login, save current local state to cloud
            await setDoc(docRef, state);
          }
        } catch (e) {
          console.error("Error loading cloud data:", e);
        } finally {
          setDataLoadedFromCloud(true);
        }
      };
      loadCloudData();`;

const newLoadLogic = `      let isFirstLoad = true;
      const unsubscribe = onSnapshot(doc(db, 'users', user.uid), async (docSnap) => {
        if (docSnap.exists()) {
          const cloudData = docSnap.data() as AppState;
          const { newState } = processMissedDays(cloudData);
          if (newState.dailyGoal === undefined) newState.dailyGoal = 10;
          
          setState(prev => {
            // Avoid triggering an immediate save loop
            return { ...newState };
          });
        } else {
          if (isFirstLoad) {
            // First time login, save current local state to cloud with user info
            const initialState = {
              ...state,
              email: user.email,
              displayName: user.displayName || user.email?.split('@')[0]
            };
            await setDoc(doc(db, 'users', user.uid), initialState);
            setState(initialState);
          }
        }
        if (isFirstLoad) {
          isFirstLoad = false;
          setDataLoadedFromCloud(true);
        }
      }, (err) => {
        console.error("Error loading cloud data:", err);
      });
      return () => unsubscribe();`;

code = code.replace(oldLoadLogic, newLoadLogic);

// Ensure we attach user info when saving
const oldSaveLogic = `const timeoutId = setTimeout(() => {
        setDoc(doc(db, 'users', user.uid), state).catch(e => console.error("Error saving to cloud:", e));
      }, 500);`;

const newSaveLogic = `const timeoutId = setTimeout(() => {
        const stateToSave = {
          ...state,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0]
        };
        setDoc(doc(db, 'users', user.uid), stateToSave).catch(e => console.error("Error saving to cloud:", e));
      }, 500);`;

code = code.replace(oldSaveLogic, newSaveLogic);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched cloud logic");
