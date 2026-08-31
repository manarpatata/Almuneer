const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileMenu.tsx', 'utf8');

const notLoggedInMenu = `              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogin();
                }}
                className="w-full text-right px-4 py-2 text-sm font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 transition-colors border-b border-slate-100"
              >
                <LogIn className="w-4 h-4" />
                تسجيل الدخول
              </button>
              <button
                  onClick={() => { setIsOpen(false); onOpenDashboard && onOpenDashboard(); }}
                  className="w-full text-right px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  لوحة المشرف
              </button>`;

code = code.replace(
  /<button\s+onClick=\{\(\) => \{\s+setIsOpen\(false\);\s+onLogin\(\);\s+\}\}\s+className="w-full text-right px-4 py-2 text-sm font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 transition-colors"\s*>\s*<LogIn className="w-4 h-4" \/>\s*تسجيل الدخول\s*<\/button>/g,
  notLoggedInMenu
);

fs.writeFileSync('src/components/ProfileMenu.tsx', code);
