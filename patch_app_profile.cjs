const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add ProfileMenu import
code = code.replace(
  "import { Auth } from './components/Auth';",
  "import { Auth } from './components/Auth';\nimport { ProfileMenu } from './components/ProfileMenu';"
);

// 2. Add showAuthModal state
const stateBlock = `  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);`;
  
const newStateBlock = `  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);`;

code = code.replace(stateBlock, newStateBlock);

// 3. Auto-close auth modal on user login
const authStateEffect = `      setUser(currentUser);
      setLoadingAuth(false);
    });`;

const newAuthStateEffect = `      setUser(currentUser);
      setLoadingAuth(false);
      if (currentUser) {
        setShowAuthModal(false);
      }
    });`;

code = code.replace(authStateEffect, newAuthStateEffect);

// 4. Remove the early return for Auth
const earlyReturnAuth = `  if (!user) {
    return <Auth />;
  }`;
  
code = code.replace(earlyReturnAuth, "");

// 5. Replace header logo with ProfileMenu
const oldHeaderLogo = `<div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200/50 shrink-0">
              <BookOpen className="w-6 h-6 md:w-7 md:h-7" />
            </div>`;

const newHeaderLogo = `<ProfileMenu user={user} onLogin={() => setShowAuthModal(true)} />`;

code = code.replace(oldHeaderLogo, newHeaderLogo);

// 6. Insert the Auth Modal into the main render
const mainRenderStart = `  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100/80 font-sans text-slate-800" dir="rtl">`;

const newMainRenderStart = `  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100/80 font-sans text-slate-800" dir="rtl">
      {showAuthModal && <Auth onClose={() => setShowAuthModal(false)} />}`;

code = code.replace(mainRenderStart, newMainRenderStart);

// Remove the `overflow-hidden` from the header if it exists so the menu can drop down,
// but the header has `sticky top-0 z-50` which is fine for drop downs as long as there's no `overflow-hidden`.
// Let's ensure the header overflow isn't cutting it off. Currently:
// <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 shrink-0 sticky top-0 z-50">
// This should be fine.

fs.writeFileSync('src/App.tsx', code);
console.log("App patched for profile menu");
