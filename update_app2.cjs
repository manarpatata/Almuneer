const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace main content wrap
content = content.replace(
  '<main className="flex-1 p-4 md:p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">',
  '<main className="flex-1 p-4 md:p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">\n        {showDashboard ? (\n          <SupervisorDashboard onClose={() => setShowDashboard(false)} supervisorId={user?.uid || \'guest\'} trackedUsers={state.trackedUsers || []} showToast={(msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(\'\'), 3000); }} />\n        ) : ('
);
content = content.replace(
  '</main>\n\n      {viewCompletedQuiz && (',
  ')}\n      </main>\n\n      {viewCompletedQuiz && ('
);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx updated 2');
