const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');

if (!content.includes('WeeklyReport')) {
  content = content.replace(
    /export interface LeaderboardSettings {/,
    `export interface WeeklyReport {
  id: string;
  dateStr: string;
  entries: LeaderboardEntry[];
  timestamp: number;
}

export interface LeaderboardSettings {`
  );
  
  content = content.replace(
    /leaderboardSettings\?: LeaderboardSettings;/,
    `leaderboardSettings?: LeaderboardSettings;
  weeklyReports?: WeeklyReport[];`
  );
  
  fs.writeFileSync('src/types.ts', content);
  console.log('Updated types.ts');
}
