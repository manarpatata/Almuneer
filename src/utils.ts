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
    
    // Check daily punishment
    if (dayStats.lessonsCompleted === 0 && !dayStats.punishedDaily) {
      dayStats.punishedDaily = true;
      activePunishments.waterGuns.push(currDate);
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
