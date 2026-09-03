const fs = require('fs');
let content = fs.readFileSync('src/components/SupervisorReports.tsx', 'utf8');

const targetEffect = `  useEffect(() => {
    // Check if global leaderboard is enabled for users`;

const replacementEffect = `  // Auto close weeks
  useEffect(() => {
    if (!usersMap || Object.keys(usersMap).length === 0 || supervisorId === 'guest') return;

    const autoClosePastWeeks = async () => {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const currentThursday = getMostRecentThursday(todayStr);
        const pastThursday = addDays(currentThursday, -7);
        
        // We check if a report exists for the past week
        // We will identify auto-generated reports by id: report-{thursdayDate}
        const pastWeekReportId = \`report-\${pastThursday}\`;
        
        // We need to fetch supervisor data to check existing reports
        const snap = await getDoc(doc(db, 'users', supervisorId));
        if (snap.exists()) {
          const data = snap.data();
          const existingReports = data.weeklyReports || [];
          
          if (!existingReports.find((r: any) => r.id === pastWeekReportId)) {
            // Generate entries for the past week
            const pastEntries = Object.entries(usersMap)
              .map(([uid, uData]) => {
                let weeklyLessons = 0;
                let curr = pastThursday;
                for (let i = 0; i < 7; i++) {
                  weeklyLessons += (uData.history?.[curr]?.lessonsCompleted || 0);
                  curr = addDays(curr, 1);
                }
                return {
                  uid,
                  displayName: uData.displayName || 'مستخدم غير معروف',
                  weeklyLessons,
                  avatarUrl: uData.avatarUrl || null
                };
              })
              .filter(u => u.weeklyLessons > 0)
              .sort((a, b) => b.weeklyLessons - a.weeklyLessons);
              
            if (pastEntries.length > 0) {
              const weekNumber = existingReports.length + 1;
              const newReport = {
                id: pastWeekReportId,
                dateStr: \`\${weekNumber}\`,
                entries: pastEntries,
                timestamp: Date.now()
              };
              
              await updateDoc(doc(db, 'users', supervisorId), {
                weeklyReports: arrayUnion(newReport)
              });
              
              // We don't need to update state here as the next useEffect will fetch it,
              // but we can just let it fetch normally
            }
          }
        }
      } catch (e) {
        console.error("Auto close failed", e);
      }
    };
    
    autoClosePastWeeks();
  }, [usersMap, supervisorId]);

  useEffect(() => {
    // Check if global leaderboard is enabled for users`;

if (content.includes(targetEffect)) {
  content = content.replace(targetEffect, replacementEffect);
  fs.writeFileSync('src/components/SupervisorReports.tsx', content);
  console.log('Added auto close');
} else {
  console.log('Target not found');
}
