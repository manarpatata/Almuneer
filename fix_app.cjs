const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The corrupted block currently is:
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoadingAuth(false);
//     });
//     if (loadingAuth) {
//     return ( ... ) } if (!user) { return <Auth />; } return () => unsubscribe();
//   }, []);
//   const [state, setState] = useState<AppState>(() => {

// Let's replace the whole useEffect down to the state init with the clean correct version.

const corruptedStart = "  useEffect(() => {\n    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {";
const corruptedEnd = "  const [state, setState] = useState<AppState>(() => {";

const idxStart = code.indexOf(corruptedStart);
const idxEnd = code.indexOf(corruptedEnd);

if (idxStart !== -1 && idxEnd !== -1) {
  const cleanUseEffect = `  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

`;
  
  code = code.substring(0, idxStart) + cleanUseEffect + code.substring(idxEnd);
}

// Now we need to inject the loading and auth checks right before the MAIN return.
// The main return is `  return (\n    <div className="min-h-screen bg-slate-50 flex flex-col" dir="rtl">` (or similar)
// Let's find it.
const mainReturnMatch = "  return (\n    <div className=\"min-h-screen bg-slate-50";
const authChecks = `  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
        <div className="text-xl font-bold text-slate-700 animate-pulse flex items-center gap-3">
          <div className="w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          جارٍ التحميل...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

`;

if (code.includes(mainReturnMatch)) {
  code = code.replace(mainReturnMatch, authChecks + mainReturnMatch);
} else {
  // Try another match
  const altMatch = "  return (\n    <div";
  const altIdx = code.indexOf(altMatch, code.indexOf("const totalFollowUpGiftsToday"));
  if (altIdx !== -1) {
    code = code.substring(0, altIdx) + authChecks + code.substring(altIdx);
  } else {
    console.log("Could not find main return");
  }
}

fs.writeFileSync('src/App.tsx', code);
console.log("App.tsx fixed");
