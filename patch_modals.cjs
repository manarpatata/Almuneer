const fs = require('fs');
let content = fs.readFileSync('src/components/SupervisorDashboard.tsx', 'utf8');

content = content.replace(
  /<div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-md border-4 border-emerald-100">/,
  '<div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-md border-4 border-emerald-100 max-h-[90vh] overflow-y-auto">'
);

content = content.replace(
  /<div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-md border-4 border-amber-100">/,
  '<div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-md border-4 border-amber-100 max-h-[90vh] overflow-y-auto">'
);

fs.writeFileSync('src/components/SupervisorDashboard.tsx', content);
console.log('Modals Patched');
