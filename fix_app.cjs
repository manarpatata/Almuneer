const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  '{showDashboard ? (\n          <SupervisorDashboard onClose={() => setShowDashboard(false)} supervisorId={user?.uid || \'guest\'} trackedUsers={state.trackedUsers || []} showToast={(msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(\'\'), 3000); }} />\n        ) : (\n        {activeTab === \'home\' && (',
  '{showDashboard ? (\n          <SupervisorDashboard onClose={() => setShowDashboard(false)} supervisorId={user?.uid || \'guest\'} trackedUsers={state.trackedUsers || []} showToast={(msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(\'\'), 3000); }} />\n        ) : (\n        <>\n        {activeTab === \'home\' && ('
);

content = content.replace(
  ')}\n      </main>',
  '</>\n        )}\n      </main>'
);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx syntax fixed');
