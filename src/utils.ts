import { AppState } from './types';

export function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getDayNameArabic(dateStr: string): string {
  const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const d = new Date(dateStr);
  return days[d.getDay()];
}

export function getShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

export function processMissedDays(currentState: AppState) {
  const today = getTodayDateString();
  const newState: AppState = JSON.parse(JSON.stringify(currentState)); 
  
  if (!newState.history[today]) {
     newState.history[today] = { lessonsCompleted: 0, punishedDaily: false, punished2Days: false };
  }

  const activePunishments = {
     waterGuns: [] as string[],
     heavyPunishments: [] as string[]
  };

  let currDate = newState.lastLoginDate;
  
  while (currDate < today) {
    const dayStats = newState.history[currDate] || { lessonsCompleted: 0, punishedDaily: false, punished2Days: false };
    let punishedThisDay = false;
    
    // Check daily punishment
    if (dayStats.lessonsCompleted === 0 && !dayStats.punishedDaily) {
      dayStats.punishedDaily = true;
      activePunishments.waterGuns.push(currDate);
      // Removed pendingPunishment and pendingPunishmentsCount increment for daily failure
    }
    
    // Check 2-day punishment
    const prevDate = addDays(currDate, -1);
    const startDate = newState.startDate || newState.lastLoginDate;
    
    // Only check 2-day punishment if the previous day is on or after the start date
    if (prevDate >= startDate) {
      const prevStats = newState.history[prevDate] || { lessonsCompleted: 0, punishedDaily: false, punished2Days: false };
      const total2Days = dayStats.lessonsCompleted + prevStats.lessonsCompleted;
      const twoDayGoal = (newState.dailyGoal || 10) * 2;
      
      if (total2Days < twoDayGoal && !dayStats.punished2Days) {
        dayStats.punished2Days = true;
        activePunishments.heavyPunishments.push(currDate);
        newState.pendingPunishment = true;
        newState.pendingPunishmentsCount = (newState.pendingPunishmentsCount || 0) + 1;
      }
    }
    
    newState.history[currDate] = dayStats;
    currDate = addDays(currDate, 1);
  }
  
  newState.lastLoginDate = today;
  return { newState, activePunishments };
}


export function calculateStreak(history: Record<string, any>, startDate: string, today: string, extraFreezes: number = 0) {
  let currentStreak = 0;
  let freezesAvailable = 3 + extraFreezes;
  let longestStreak = 0;
  let earnedFollowUpGifts = 0;
  
  let curr = startDate;
  while (curr <= today) {
    const stats = history[curr];
    if (stats && stats.lessonsCompleted >= 1) {
      currentStreak++;
      if (currentStreak % 7 === 0) {
        earnedFollowUpGifts++;
      }
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      // Missing day (if it's not today yet, or if it is today and they haven't done anything but they still have time)
      // Actually, if it's today and they haven't completed a lesson yet, we shouldn't break the streak or use a freeze until tomorrow!
      if (curr < today) {
        if (freezesAvailable > 0) {
          freezesAvailable--;
        } else {
          currentStreak = 0;
        }
      }
    }
    curr = addDays(curr, 1);
  }
  return { currentStreak, freezesAvailable, longestStreak, earnedFollowUpGifts };
}

export function calculateTotalScore(state: AppState) {
  let score = (state.khatmatCount || 0) * 100;
  const dailyGoal = state.dailyGoal || 10;
  const today = getTodayDateString();
  
  if (state.history) {
    Object.keys(state.history).forEach((dateStr) => {
      const day = state.history[dateStr] as any;
      const failed = day.failedPunishments || (day.expelled ? 1 : 0);
      score -= failed * 100;
      
      const isFinished = dateStr < today;
      if (isFinished) {
        if (day.punished2Days) {
          score -= 50;
        }
        
        if (day.lessonsCompleted < dailyGoal) {
          score -= 10;
        }
        if (day.lessonsCompleted >= 20 && day.lessonsCompleted < 28) {
          score += 50;
        } else if (day.lessonsCompleted >= dailyGoal && day.lessonsCompleted < 20) {
          score += 10;
        }
      }
    });
  }
  
  return Math.max(0, score) + (state.points || 0);
}

export function getMostRecentThursday(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDay(); // 0 = Sun, 1 = Mon, ..., 4 = Thu
  const diff = day >= 4 ? day - 4 : day + 3;
  d.setDate(d.getDate() - diff);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getWeeklyLessons(history: Record<string, any>, todayStr: string): number {
  if (!history) return 0;
  const thursday = getMostRecentThursday(todayStr);
  let total = 0;
  let curr = thursday;
  while (curr <= todayStr) {
    total += (history[curr]?.lessonsCompleted || 0);
    curr = addDays(curr, 1);
  }
  return total;
}
