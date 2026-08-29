
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
export interface DailyStats {
  lessonsCompleted: number;
  punishedDaily: boolean;
  punished2Days: boolean;
  expelled?: boolean;
  resolvedPunishments?: number;
  failedPunishments?: number;
  pardonedPunishments?: number;
  punishmentResolved?: boolean;
}

export interface SupervisorGift {
  id: string;
  message: string;
  from: string;
  claimed: boolean;
  timestamp: number;
  giftType?: 'points' | 'freeze' | 'pardon';
}

export interface AppState {
  completedLessons: string[];
  khatmatCount: number;
  history: Record<string, DailyStats>;
  lastLoginDate: string;
  startDate?: string;
  pendingPunishment?: boolean;
  pendingPunishmentsCount?: number;
  dailyGoal?: number;
  immunityCards?: number;
  unclaimedGifts?: number;
  earnedGiftDates?: string[];
  lastClaimedGiftDate?: string;
  claimedGiftsByDate?: Record<string, number>;
  
  // Follow-up & Streak
  extraStreakFreezes?: number;
  claimedFollowUpGifts?: number;
  claimedFollowUpGiftsByDate?: Record<string, Array<'points' | 'freeze'>>; 
  points?: number;

  // Identity & Supervisor Features
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  kicked?: boolean;
  expelledUntil?: number;
  trackedUsers?: string[];
  supervisorGifts?: SupervisorGift[];
  supervisorPunishmentReason?: string;
  supervisorPunishments?: SupervisorPunishment[];
  leaderboardSettings?: LeaderboardSettings;
}
