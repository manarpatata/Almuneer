const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldRender = `{showDashboard && <SupervisorDashboard onClose={() => setShowDashboard(false)} />}`;
const newRender = ``;

code = code.replace(oldRender, newRender);

const oldExpelledStart = `  const isExpelled = state.expelledUntil && state.expelledUntil > Date.now();`;
const newDashboardLogic = `  if (showDashboard && user) {
    return <SupervisorDashboard onClose={() => setShowDashboard(false)} supervisorId={user.uid} trackedUsers={state.trackedUsers || []} />;
  }

  const isExpelled = state.expelledUntil && state.expelledUntil > Date.now();`;

code = code.replace(oldExpelledStart, newDashboardLogic);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App render logic");
