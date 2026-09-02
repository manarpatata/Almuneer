const fs = require('fs');

// Patch App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// Remove desktop store button
appContent = appContent.replace(
  /<button\s+onClick=\{\(\) => setShowStoreModal\(true\)\}\s+className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 hover:bg-indigo-100 transition-colors"\s*>\s*<ShoppingCart className="w-5 h-5" \/>\s*<\/button>/g,
  ''
);

// Remove mobile store button
appContent = appContent.replace(
  /<button\s+onClick=\{\(\) => setShowStoreModal\(true\)\}\s+className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 hover:bg-indigo-100 transition-colors"\s*>\s*<ShoppingCart className="w-4 h-4" \/>\s*<\/button>/g,
  ''
);

// Add onOpenStore to ProfileMenu
appContent = appContent.replace(
  /onChangeAvatar=\{\(\) => setShowAvatarModal\(true\)\}/,
  'onChangeAvatar={() => setShowAvatarModal(true)} onOpenStore={() => setShowStoreModal(true)}'
);

fs.writeFileSync('src/App.tsx', appContent);

// Patch ProfileMenu.tsx
let menuContent = fs.readFileSync('src/components/ProfileMenu.tsx', 'utf8');

menuContent = menuContent.replace(
  /import \{ LogOut, LogIn, User as UserIcon, ShieldCheck \} from 'lucide-react';/,
  "import { LogOut, LogIn, User as UserIcon, ShieldCheck, ShoppingCart } from 'lucide-react';"
);

menuContent = menuContent.replace(
  /onOpenDashboard\?: \(\) => void;/,
  'onOpenDashboard?: () => void;\n  onOpenStore?: () => void;'
);

menuContent = menuContent.replace(
  /export function ProfileMenu\(\{ user, avatarUrl, onLogin, onOpenDashboard, onChangeAvatar, showToast \}/,
  'export function ProfileMenu({ user, avatarUrl, onLogin, onOpenDashboard, onChangeAvatar, onOpenStore, showToast }'
);

// Add to logged-in section
menuContent = menuContent.replace(
  /<button\s+onClick=\{\(\) => \{ setIsOpen\(false\); onOpenDashboard && onOpenDashboard\(\); \}\}\s+className="w-full text-right px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 transition-colors border-b border-slate-100"\s*>\s*<ShieldCheck className="w-4 h-4" \/>\s*لوحة المشرف\s*<\/button>/,
  `<button
                  onClick={() => { setIsOpen(false); onOpenStore && onOpenStore(); }}
                  className="w-full text-right px-4 py-2 text-sm font-bold text-amber-600 hover:bg-amber-50 flex items-center gap-2 transition-colors border-b border-slate-100"
                >
                  <ShoppingCart className="w-4 h-4" />
                  المتجر
                </button>
                <button
                  onClick={() => { setIsOpen(false); onOpenDashboard && onOpenDashboard(); }}
                  className="w-full text-right px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 transition-colors border-b border-slate-100"
                >
                  <ShieldCheck className="w-4 h-4" />
                  لوحة المشرف
                </button>`
);

// Add to non-logged-in section
menuContent = menuContent.replace(
  /<button\s+onClick=\{\(\) => \{ setIsOpen\(false\); onOpenDashboard && onOpenDashboard\(\); \}\}\s+className="w-full text-right px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 transition-colors"\s*>\s*<ShieldCheck className="w-4 h-4" \/>\s*لوحة المشرف\s*<\/button>/,
  `<button
                  onClick={() => { setIsOpen(false); onOpenStore && onOpenStore(); }}
                  className="w-full text-right px-4 py-2 text-sm font-bold text-amber-600 hover:bg-amber-50 flex items-center gap-2 transition-colors border-b border-slate-100"
                >
                  <ShoppingCart className="w-4 h-4" />
                  المتجر
                </button>
                <button
                  onClick={() => { setIsOpen(false); onOpenDashboard && onOpenDashboard(); }}
                  className="w-full text-right px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  لوحة المشرف
              </button>`
);

fs.writeFileSync('src/components/ProfileMenu.tsx', menuContent);
console.log('Patched nav and profile menu successfully');
