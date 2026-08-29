const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import { UserLeaderboard }')) {
  code = code.replace(
    "import { CalendarTracker } from './components/CalendarTracker';",
    "import { CalendarTracker } from './components/CalendarTracker';\nimport { UserLeaderboard } from './components/UserLeaderboard';"
  );
  
  code = code.replace(
    "<CalendarTracker history={state.history} dailyGoal={dailyGoal} currentScore={currentScore} pendingPunishment={state.pendingPunishment} pendingPunishmentsCount={state.pendingPunishmentsCount} />",
    "<CalendarTracker history={state.history} dailyGoal={dailyGoal} currentScore={currentScore} pendingPunishment={state.pendingPunishment} pendingPunishmentsCount={state.pendingPunishmentsCount} />\n          {state.leaderboardSettings && <UserLeaderboard settings={state.leaderboardSettings} />}"
  );
  
  fs.writeFileSync('src/App.tsx', code);
  console.log("Patched App.tsx with UserLeaderboard");
}
