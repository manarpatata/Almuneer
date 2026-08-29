const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

const additions = `
export interface SupervisorPunishment {
  id: string;
  reason: string;
  sender: string;
  timestamp: number;
}

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  weeklyLessons: number;
  avatarUrl?: string;
}

export interface LeaderboardSettings {
  show: boolean;
  entries: LeaderboardEntry[];
  lastUpdated: number;
}
`;

if (!code.includes('SupervisorPunishment')) {
  code = additions + code;
  code = code.replace(
    "supervisorPunishmentReason?: string;",
    "supervisorPunishmentReason?: string;\n  supervisorPunishments?: SupervisorPunishment[];\n  leaderboardSettings?: LeaderboardSettings;"
  );
  fs.writeFileSync('src/types.ts', code);
  console.log("Updated types.ts");
}
