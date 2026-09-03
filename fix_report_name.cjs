const fs = require('fs');
let content = fs.readFileSync('src/components/SupervisorReports.tsx', 'utf8');

const target = `  const handleSaveWeeklyReport = async () => {
    if (currentWeekEntries.length === 0) return;
    const dateStr = new Date().toISOString().split('T')[0];
    const newReport = {`;
const replacement = `  const handleSaveWeeklyReport = async () => {
    if (currentWeekEntries.length === 0) return;
    const weekNumber = reports.length + 1;
    const dateStr = \`\${weekNumber}\`;
    const newReport = {`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/SupervisorReports.tsx', content);
  console.log('Fixed report name');
} else {
  console.log('Target not found');
}
