const fs = require('fs');
let content = fs.readFileSync('src/components/ProfileMenu.tsx', 'utf8');

// Replace the user.photoURL with the dicebear avatar if avatarUrl is missing
content = content.replace(
  /\{user\?\.photoURL \? \([\s\S]*?\) : \([\s\S]*?UserIcon[\s\S]*?\) : \(\s*<UserIcon[^>]*\/>\s*\)\}/m,
  `{avatarUrl ? (
          <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
        ) : user?.email ? (
          <img src={\`https://api.dicebear.com/7.x/avataaars/svg?seed=\${user.email}&backgroundColor=e2e8f0\`} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <UserIcon className="w-6 h-6 md:w-7 md:h-7" />
        )}`
);

fs.writeFileSync('src/components/ProfileMenu.tsx', content);
console.log('Fixed ProfileMenu pic');
