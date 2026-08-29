const fs = require('fs');
let code = fs.readFileSync('src/components/SupervisorDashboard.tsx', 'utf8');

// Import getWeeklyLessons and SupervisorReports
if (!code.includes('import { SupervisorReports }')) {
  code = code.replace(
    "import { calculateTotalScore } from '../utils';",
    "import { calculateTotalScore, getWeeklyLessons, getTodayDateString } from '../utils';\nimport { SupervisorReports } from './SupervisorReports';"
  );
}

// Add Weekly Lessons to User List
const oldUserListItem = `                    <div className="flex flex-col items-end">
                      <span className="font-black text-amber-600 bg-amber-100 px-3 py-1 rounded-full text-sm">
                        {calculateTotalScore(userData)} نقطة
                      </span>
                      {hasPending && (`;
const newUserListItem = `                    <div className="flex flex-col items-end gap-1">
                      <div className="flex gap-2">
                        <span className="font-black text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full text-sm">
                          {getWeeklyLessons(userData.history, getTodayDateString())} درس أسبوعي
                        </span>
                        <span className="font-black text-amber-600 bg-amber-100 px-3 py-1 rounded-full text-sm">
                          {calculateTotalScore(userData)} نقطة
                        </span>
                      </div>
                      {hasPending && (`;
code = code.replace(oldUserListItem, newUserListItem);

// Add SupervisorReports at the bottom
const oldReturn = `    </div>
  );
}`;
const newReturn = `      <SupervisorReports usersMap={usersMap} supervisorId={supervisorId} />
    </div>
  );
}`;
code = code.replace(oldReturn, newReturn);

fs.writeFileSync('src/components/SupervisorDashboard.tsx', code);
console.log("Patched SupervisorDashboard.tsx with Reports");
