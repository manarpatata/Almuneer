const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileMenu.tsx', 'utf8');

code = code.replace(
  "export function ProfileMenu({ user, avatarUrl, onLogin, onOpenDashboard, onChangeAvatar }: ProfileMenuProps) {",
  "export function ProfileMenu({ user, avatarUrl, onLogin, onOpenDashboard, onChangeAvatar, showToast }: ProfileMenuProps & { showToast?: (msg: string) => void }) {"
);
code = code.replace(
  "onClick={() => { navigator.clipboard.writeText(user.uid); alert('تم نسخ الكود بنجاح!'); }}",
  "onClick={() => { navigator.clipboard.writeText(user.uid); showToast ? showToast('تم نسخ الكود بنجاح! 📋') : alert('تم نسخ الكود بنجاح!'); }}"
);

fs.writeFileSync('src/components/ProfileMenu.tsx', code);
console.log("Patched ProfileMenu alerts");
