const fs = require('fs');
let code = fs.readFileSync('src/components/SupervisorDashboard.tsx', 'utf8');

// Replace local toast rendering
const renderToastStr = `{/* Toast Notification */}\n      {toastMessage && (\n        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-xl font-bold z-[300] animate-in slide-in-from-bottom-5">\n          {toastMessage}\n        </div>\n      )}\n    </div>\n  );\n}`;

code = code.replace(
  "    </div>\n  );\n}",
  renderToastStr
);

fs.writeFileSync('src/components/SupervisorDashboard.tsx', code);
