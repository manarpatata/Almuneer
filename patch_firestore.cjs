const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add Firestore imports
code = code.replace(
  "import { auth } from './firebase';",
  "import { auth, db } from './firebase';\nimport { doc, getDoc, setDoc } from 'firebase/firestore';"
);

// 2. Insert dataLoadedFromCloud state
code = code.replace(
  "const [showAuthModal, setShowAuthModal] = useState(false);",
  "const [showAuthModal, setShowAuthModal] = useState(false);\n  const [dataLoadedFromCloud, setDataLoadedFromCloud] = useState(false);"
);

// 3. Insert cloud load effect after auth effect
const authEffect = `  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
      if (currentUser) {
        setShowAuthModal(false);
      }
    });
    return () => unsubscribe();
  }, []);`;

const cloudLoadEffect = `

  useEffect(() => {
    if (user) {
      const loadCloudData = async () => {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const cloudData = docSnap.data();
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
      loadCloudData();
    } else {
      setDataLoadedFromCloud(false);
    }
  }, [user]);`;

code = code.replace(authEffect, authEffect + cloudLoadEffect);

// 4. Update the save effect
const oldSaveEffect = `  useEffect(() => {
    localStorage.setItem('alMuneerState_v4', JSON.stringify(state));
  }, [state]);`;

const newSaveEffect = `  useEffect(() => {
    localStorage.setItem('alMuneerState_v4', JSON.stringify(state));
    
    // Sync to Firestore if user is logged in and initial cloud load is complete
    if (user && dataLoadedFromCloud) {
      // Use a small timeout to debounce writes
      const timeoutId = setTimeout(() => {
        setDoc(doc(db, 'users', user.uid), state).catch(e => console.error("Error saving to cloud:", e));
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [state, user, dataLoadedFromCloud]);`;

code = code.replace(oldSaveEffect, newSaveEffect);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx for Firestore sync");
