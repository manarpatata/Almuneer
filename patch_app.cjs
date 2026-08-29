const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Pass showToast to SupervisorDashboard
code = code.replace(
  '<SupervisorDashboard onClose={() => setShowDashboard(false)} supervisorId={user.uid} trackedUsers={state.trackedUsers || []} />',
  "<SupervisorDashboard onClose={() => setShowDashboard(false)} supervisorId={user.uid} trackedUsers={state.trackedUsers || []} showToast={(msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(''), 3000); }} />"
);

// 2. Pass showToast to ProfileMenu
code = code.replace(
  '<ProfileMenu user={user} avatarUrl={state.avatarUrl} onLogin={() => setShowAuthModal(true)} onOpenDashboard={() => setShowDashboard(true)} onChangeAvatar={() => setShowAvatarModal(true)} />',
  "<ProfileMenu user={user} avatarUrl={state.avatarUrl} onLogin={() => setShowAuthModal(true)} onOpenDashboard={() => setShowDashboard(true)} onChangeAvatar={() => setShowAvatarModal(true)} showToast={(msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(''), 3000); }} />"
);

// 3. Stack Settings and Instructions on Mobile
code = code.replace(
  '<div className="flex md:hidden gap-1">',
  '<div className="flex flex-col md:hidden gap-1">'
);

// 4. Add "Switch to Supervisor" inside Settings modal
const oldSettingsBottom = `                <button 
                  onClick={() => setConfirmGenerate(true)}
                  className="mt-2 w-full flex items-center justify-center gap-2 bg-rose-50 text-rose-600 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-rose-100 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" />
                  توليد بيانات اختبار عشوائية (أسبوع)
                </button>
              </div>`;

const newSettingsBottom = `                <button 
                  onClick={() => setConfirmGenerate(true)}
                  className="mt-2 w-full flex items-center justify-center gap-2 bg-rose-50 text-rose-600 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-rose-100 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" />
                  توليد بيانات اختبار عشوائية (أسبوع)
                </button>
              </div>
              <div className="border-t border-slate-100 pt-8 flex flex-col gap-3">
                <h3 className="font-bold text-indigo-600 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  خيارات المشرف
                </h3>
                <button 
                  onClick={() => {
                    setShowDashboard(true);
                    setShowSettings(false);
                  }}
                  className="mt-2 w-full flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-100 transition-colors"
                >
                  التحول إلى مشرف
                </button>
              </div>`;

if (!code.includes("خيارات المشرف")) {
  code = code.replace(oldSettingsBottom, newSettingsBottom);
}

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx for layout, toast, and settings");
