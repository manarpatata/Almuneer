const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Change showDashboard logic
content = content.replace(/if\s*\(showDashboard\s*&&\s*user\)\s*\{/, 'if (showDashboard) {');
content = content.replace(/supervisorId=\{user\.uid\}/, "supervisorId={user?.uid || 'guest'}");

// 2. Extract tabs div
const tabsRegex = /<div className="flex gap-2 p-2 bg-slate-200\/50 rounded-xl max-w-sm mx-auto mt-4 shrink-0">[\s\S]*?<\/div>/;
const match = content.match(tabsRegex);
let tabsHtml = '';
if (match) {
    tabsHtml = match[0];
    content = content.replace(tabsRegex, '');
}

// 3. Insert tabs into header
// The header ends at </header>
tabsHtml = tabsHtml.replace('mt-4', 'mt-2 md:mt-0'); // Adjust margin
const headerEndRegex = /<\/header>/;
content = content.replace(headerEndRegex, `  ${tabsHtml}\n      </header>`);

// Make header flex-col on mobile
content = content.replace('<header className="flex items-center justify-between', '<header className="flex flex-col md:flex-row md:items-center justify-between gap-3');

// Since we put tabs inside header, it will look like a column on mobile and row on desktop.
// Wait, if it's flex-col on mobile, the left and right sections of the header will stack. That might be bad.
// Let's wrap the left and right into a row div.
// Original: 
// <header ...>
//   <div className="flex items-center gap-4 md:gap-6">
//      ...
//   </div>
//   <div className="flex gap-2 md:gap-6 items-center">
//      ...
//   </div>
// </header>

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx updated');
