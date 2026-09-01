const fs = require('fs');
let content = fs.readFileSync('src/components/SupervisorReports.tsx', 'utf8');

// Add display variables
content = content.replace(
  /const handleToggleGlobal = async \(\) => \{/,
  `const activeReport = selectedReportId ? reports.find(r => r.id === selectedReportId) : null;
  const displayEntries = activeReport ? activeReport.entries : currentWeekEntries;
  const reportTitle = activeReport ? \`تقرير الأسبوع (\${activeReport.dateStr})\` : 'أبطال الأسبوع الحالي';

  const handleToggleGlobal = async () => {`
);

// Replace "أبطال الأسبوع" with {reportTitle}
content = content.replace(
  /<h3 className="text-center font-black text-3xl text-slate-800 mb-8">أبطال الأسبوع<\/h3>/,
  '<h3 className="text-center font-black text-3xl text-slate-800 mb-8">{reportTitle}</h3>'
);

// We need to replace `currentWeekEntries` with `displayEntries` but ONLY inside the `return (` block.
const returnIndex = content.indexOf('return (');
if (returnIndex !== -1) {
  const beforeReturn = content.substring(0, returnIndex);
  let afterReturn = content.substring(returnIndex);
  
  afterReturn = afterReturn.replace(/currentWeekEntries/g, 'displayEntries');
  
  content = beforeReturn + afterReturn;
}

fs.writeFileSync('src/components/SupervisorReports.tsx', content);
console.log('Render variables updated');
