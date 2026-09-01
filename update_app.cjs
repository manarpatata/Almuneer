const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove early return for showDashboard
content = content.replace(
  'if (showDashboard) {\n    return <SupervisorDashboard onClose={() => setShowDashboard(false)} supervisorId={user?.uid || \'guest\'} trackedUsers={state.trackedUsers || []} showToast={(msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(\'\'), 3000); }} />;\n  }',
  ''
);

// 2. Hide points and streak
content = content.replace(
  '<div className="flex flex-col md:flex-row gap-1.5 md:gap-2">',
  '{!showDashboard && <div className="flex flex-col md:flex-row gap-1.5 md:gap-2">'
);
content = content.replace(
  '</button>\n              </div>\n            </div>',
  '</button>\n              </div>}\n            </div>'
);

// 3. Hide tabs and timer
content = content.replace(
  '{/* Desktop Tabs */}\n          <div className="hidden md:flex gap-2 p-1.5 bg-slate-200/50 rounded-xl mx-auto w-full max-w-sm">',
  '{/* Desktop Tabs */}\n          {!showDashboard && <div className="hidden md:flex gap-2 p-1.5 bg-slate-200/50 rounded-xl mx-auto w-full max-w-sm">'
);
content = content.replace(
  '</button>\n          </div>\n          \n          <div className="flex gap-2 md:gap-6 items-center">',
  '</button>\n          </div>}\n          \n          <div className="flex gap-2 md:gap-6 items-center">'
);

content = content.replace(
  '<div className="flex gap-2 md:gap-6 items-center">\n            <div className="flex flex-col items-center justify-center bg-red-50 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-red-100 min-w-[90px] md:min-w-[120px]">',
  '<div className="flex gap-2 md:gap-6 items-center">\n            {!showDashboard && <div className="flex flex-col items-center justify-center bg-red-50 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-red-100 min-w-[90px] md:min-w-[120px]">'
);
content = content.replace(
  '</span>\n            </div>\n\n            <div className="flex flex-col md:hidden gap-1">',
  '</span>\n            </div>}\n\n            {showDashboard && (\n              <button onClick={() => setShowDashboard(false)} className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold transition-colors">\n                العودة\n              </button>\n            )}\n            <div className="flex flex-col md:hidden gap-1">'
);

content = content.replace(
  '{/* Mobile Tabs */}\n        <div className="md:hidden flex gap-2 p-1.5 bg-slate-200/50 rounded-xl mt-3 w-full">',
  '{/* Mobile Tabs */}\n        {!showDashboard && <div className="md:hidden flex gap-2 p-1.5 bg-slate-200/50 rounded-xl mt-3 w-full">'
);
content = content.replace(
  '</button>\n        </div>\n      </header>',
  '</button>\n        </div>}\n      </header>'
);

// 4. Wrap the main content with !showDashboard check and render SupervisorDashboard instead
content = content.replace(
  '<main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-6 relative z-10">',
  '<main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-6 relative z-10">\n        {showDashboard ? (\n          <SupervisorDashboard onClose={() => setShowDashboard(false)} supervisorId={user?.uid || \'guest\'} trackedUsers={state.trackedUsers || []} showToast={(msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(\'\'), 3000); }} />\n        ) : ('
);
content = content.replace(
  '</main>\n\n      {viewCompletedQuiz && (',
  ')}\n      </main>\n\n      {viewCompletedQuiz && ('
);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx updated');
