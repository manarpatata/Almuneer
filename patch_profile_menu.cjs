const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileMenu.tsx', 'utf8');

// Replace the dashboard button logic to remove email restriction and add UID copy
const oldDashboardBtn = `                {user.email === 'manarpatata147@gmail.com' && (
                  <button
                    onClick={() => { setIsOpen(false); onOpenDashboard && onOpenDashboard(); }}
                    className="w-full text-right px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 transition-colors border-b border-slate-100"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    لوحة المشرف
                  </button>
                )}`;

const newDashboardBtn = `                <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                  <div className="flex justify-between items-center bg-white border border-slate-200 rounded-lg p-2">
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold mb-0.5">كود المشارك الخاص بك:</div>
                      <div className="text-[10px] font-mono text-slate-400 w-24 truncate">{user.uid}</div>
                    </div>
                    <button 
                      onClick={() => { navigator.clipboard.writeText(user.uid); alert('تم نسخ الكود بنجاح!'); }}
                      className="text-xs text-indigo-600 font-bold hover:underline bg-indigo-50 px-2 py-1 rounded"
                    >
                      نسخ
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => { setIsOpen(false); onOpenDashboard && onOpenDashboard(); }}
                  className="w-full text-right px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 transition-colors border-b border-slate-100"
                >
                  <ShieldCheck className="w-4 h-4" />
                  لوحة المشرف
                </button>`;

code = code.replace(oldDashboardBtn, newDashboardBtn);

fs.writeFileSync('src/components/ProfileMenu.tsx', code);
console.log("Patched profile menu for UID and public dashboard");
