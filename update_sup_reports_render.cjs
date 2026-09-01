const fs = require('fs');
let content = fs.readFileSync('src/components/SupervisorReports.tsx', 'utf8');

// Define displayEntries and reportTitle
content = content.replace(
  /const handleSaveWeeklyReport = async \(\) => \{/,
  `const activeReport = selectedReportId ? reports.find(r => r.id === selectedReportId) : null;
  const displayEntries = activeReport ? activeReport.entries : currentWeekEntries;
  const reportTitle = activeReport ? \`تقرير الأسبوع (\${activeReport.dateStr})\` : 'أبطال الأسبوع الحالي';
  
  const handleSaveWeeklyReport = async () => {`
);

// Replace currentWeekEntries with displayEntries in the render block
// Replace currentWeekEntries.length with displayEntries.length
// Replace currentWeekEntries.map with displayEntries.map
// Replace currentWeekEntries[0] with displayEntries[0]
content = content.replace(/currentWeekEntries/g, 'displayEntries');
// Oh wait! In the useEffect that populates currentWeekEntries, I don't want to replace that!
