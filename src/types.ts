export interface DailyStats {
  lessonsCompleted: number;
  punishedDaily: boolean;
  punished2Days: boolean;
  expelled?: boolean;
  punishmentResolved?: boolean;
}

export interface AppState {
  completedLessons: string[];
  khatmatCount: number;
  history: Record<string, DailyStats>;
  lastLoginDate: string;
  startDate?: string;
  pendingPunishment?: boolean;
  dailyGoal?: number;
}
