const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add Dashboard import
code = code.replace(
  "import { ProfileMenu } from './components/ProfileMenu';",
  "import { ProfileMenu } from './components/ProfileMenu';\nimport { SupervisorDashboard } from './components/SupervisorDashboard';"
);

// 2. Add showDashboard state
const stateDeclarations = "const [showAuthModal, setShowAuthModal] = useState(false);\n  const [dataLoadedFromCloud, setDataLoadedFromCloud] = useState(false);";
const newDeclarations = stateDeclarations + "\n  const [showDashboard, setShowDashboard] = useState(false);";
code = code.replace(stateDeclarations, newDeclarations);

// 3. Update ProfileMenu usage
const oldProfileMenu = "<ProfileMenu user={user} onLogin={() => setShowAuthModal(true)} />";
const newProfileMenu = "<ProfileMenu user={user} onLogin={() => setShowAuthModal(true)} onOpenDashboard={() => setShowDashboard(true)} />";
code = code.replace(oldProfileMenu, newProfileMenu);

// 4. Render Dashboard and Kicked screen
const oldMainRenderStart = `  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100/80 font-sans text-slate-800" dir="rtl">
      {showAuthModal && <Auth onClose={() => setShowAuthModal(false)} />}`;

const newMainRenderStart = `  if (state.kicked) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white" dir="rtl">
        <div className="w-24 h-24 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6 border-4 border-red-500">
          <AlertTriangle className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-black mb-4">لقد تم طردك من المجموعة</h1>
        <p className="text-slate-400 font-medium max-w-md">نأسف لإبلاغك بأنه قد تم إنهاء صلاحية وصولك بناءً على قرار المشرف.</p>
        <button onClick={() => { auth.signOut(); localStorage.removeItem('alMuneerState_v4'); window.location.reload(); }} className="mt-8 px-6 py-3 bg-slate-800 rounded-xl font-bold hover:bg-slate-700 transition-colors">
          تسجيل الخروج والبدء من جديد
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100/80 font-sans text-slate-800" dir="rtl">
      {showAuthModal && <Auth onClose={() => setShowAuthModal(false)} />}
      {showDashboard && <SupervisorDashboard onClose={() => setShowDashboard(false)} />}`;

code = code.replace(oldMainRenderStart, newMainRenderStart);


fs.writeFileSync('src/App.tsx', code);
console.log("Patched UI");
