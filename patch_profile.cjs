const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileMenu.tsx', 'utf8');

// Add ShieldCheck icon
code = code.replace("import { LogOut, LogIn, User as UserIcon } from 'lucide-react';", "import { LogOut, LogIn, User as UserIcon, ShieldCheck } from 'lucide-react';");

// Update props
code = code.replace(
  "  onLogin: () => void;\n}",
  "  onLogin: () => void;\n  onOpenDashboard?: () => void;\n}"
);

code = code.replace(
  "export function ProfileMenu({ user, onLogin }: ProfileMenuProps) {",
  "export function ProfileMenu({ user, onLogin, onOpenDashboard }: ProfileMenuProps) {"
);

// Insert dashboard button
const dashboardBtn = `
                {user.email === 'manarpatata147@gmail.com' && (
                  <button
                    onClick={() => { setIsOpen(false); onOpenDashboard && onOpenDashboard(); }}
                    className="w-full text-right px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 transition-colors border-b border-slate-100"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    لوحة المشرف
                  </button>
                )}`;

code = code.replace(
  "<button\n                  onClick={handleLogout}",
  dashboardBtn + "\n                <button\n                  onClick={handleLogout}"
);

fs.writeFileSync('src/components/ProfileMenu.tsx', code);
console.log("Patched profile menu");
