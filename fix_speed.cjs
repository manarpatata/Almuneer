const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const loadingBlock = `  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
        <div className="text-xl font-bold text-slate-700 animate-pulse flex items-center gap-3">
          <div className="w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          جارٍ التحميل...
        </div>
      </div>
    );
  }`;

if (code.includes(loadingBlock)) {
  code = code.replace(loadingBlock, "");
  fs.writeFileSync('src/App.tsx', code);
  console.log("Removed blocking loading screen from App.tsx");
} else {
  console.log("Could not find loading block in App.tsx");
}

let authCode = fs.readFileSync('src/components/Auth.tsx', 'utf8');

const oldEmailAuth = `    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {`;

const newEmailAuth = `    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      if (onClose) onClose();
    } catch (err: any) {`;

authCode = authCode.replace(oldEmailAuth, newEmailAuth);

const oldGoogleAuth = `    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {`;

const newGoogleAuth = `    try {
      await signInWithPopup(auth, googleProvider);
      if (onClose) onClose();
    } catch (err: any) {`;

authCode = authCode.replace(oldGoogleAuth, newGoogleAuth);

fs.writeFileSync('src/components/Auth.tsx', authCode);
console.log("Added immediate close to Auth.tsx");

