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
  claimedFollowUpGiftsByDate?: Record<string, Array<'points' | 'freeze'>>; // Track what they got today!
  points?: number;
}
