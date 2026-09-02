const fs = require('fs');
let content = fs.readFileSync('src/components/SupervisorReports.tsx', 'utf8');

const target = `  const handleToggleGlobal = async () => {`;
const replacement = `  // Auto-sync leaderboard if shown
  useEffect(() => {
    if (showGlobal && supervisorId !== 'guest' && currentWeekEntries.length > 0) {
      const timeoutId = setTimeout(() => {
        const settings = {
          show: true,
          entries: currentWeekEntries.slice(0, 10),
          lastUpdated: Date.now()
        };
        updateDoc(doc(db, 'users', supervisorId), { leaderboardSettings: settings }).catch(console.error);
        Object.keys(usersMap).forEach((uid) => {
          updateDoc(doc(db, 'users', uid), { leaderboardSettings: settings }).catch(console.error);
        });
      }, 1000); // Debounce
      return () => clearTimeout(timeoutId);
    }
  }, [currentWeekEntries, showGlobal, supervisorId, usersMap]);

  const handleToggleGlobal = async () => {`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync('src/components/SupervisorReports.tsx', content);
    console.log("Auto-sync patched!");
} else {
    console.log("Not found!");
}
