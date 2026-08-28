const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileMenu.tsx', 'utf8');

// 1. Add avatarUrl and onChangeAvatar to props
code = code.replace(
  "user: User | null;",
  "user: User | null;\n  avatarUrl?: string;\n  onChangeAvatar?: () => void;"
);
code = code.replace(
  "export function ProfileMenu({ user, onLogin, onOpenDashboard }: ProfileMenuProps) {",
  "export function ProfileMenu({ user, avatarUrl, onLogin, onOpenDashboard, onChangeAvatar }: ProfileMenuProps) {"
);

// 2. Change image src
code = code.replace(
  "src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}&backgroundColor=e2e8f0`}",
  "src={avatarUrl || user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}&backgroundColor=e2e8f0`}"
);

// 3. Add change avatar button in menu (before dashboard button)
const dashboardBtn = `<button
                  onClick={() => { setIsOpen(false); onOpenDashboard && onOpenDashboard(); }}`;

const changeAvatarBtn = `                <button
                  onClick={() => { setIsOpen(false); onChangeAvatar && onChangeAvatar(); }}
                  className="w-full text-right px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors border-b border-slate-100"
                >
                  <UserIcon className="w-4 h-4" />
                  تغيير الصورة الشخصية
                </button>
                <button
                  onClick={() => { setIsOpen(false); onOpenDashboard && onOpenDashboard(); }}`;

if (!code.includes("تغيير الصورة الشخصية")) {
  code = code.replace(dashboardBtn, changeAvatarBtn);
}

fs.writeFileSync('src/components/ProfileMenu.tsx', code);
console.log("Patched profile menu for avatarUrl");
