const fs = require('fs');
let content = fs.readFileSync('src/components/SupervisorReports.tsx', 'utf8');

// 1. Add arrayUnion to imports if not there
if (!content.includes('arrayUnion')) {
  content = content.replace(
    /import \{ doc, updateDoc, getDoc \} from 'firebase\/firestore';/,
    `import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';`
  );
}

// 2. Add handleSaveWeeklyReport
const saveFunction = `
  const handleSaveWeeklyReport = async () => {
    if (currentWeekEntries.length === 0) return;
    const dateStr = new Date().toISOString().split('T')[0];
    const newReport = {
      id: \`report-\${Date.now()}\`,
      dateStr,
      entries: currentWeekEntries,
      timestamp: Date.now()
    };
    try {
      await updateDoc(doc(db, 'users', supervisorId), {
        weeklyReports: arrayUnion(newReport)
      });
      setReports(prev => [...prev, newReport]);
      alert('تم حفظ التقرير الأسبوعي بنجاح!');
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء حفظ التقرير');
    }
  };
`;
content = content.replace(
  /const handleDownload = async \(\) => \{/,
  saveFunction + '\n  const handleDownload = async () => {'
);

// 3. Add Save Button
content = content.replace(
  /\{\s*showGlobal \? 'مرئي للطلاب' : 'مخفي عن الطلاب'\s*\}\s*<\/button>/,
  `{showGlobal ? 'مرئي للطلاب' : 'مخفي عن الطلاب'}
          </button>
          {!selectedReportId && (
            <button 
              onClick={handleSaveWeeklyReport}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-sm"
            >
              حفظ وإغلاق الأسبوع
            </button>
          )}`
);

// 4. Add Tabs for selecting reports
const tabsHtml = `
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex gap-2 overflow-x-auto shrink-0 hide-scrollbar">
        <button
          onClick={() => setSelectedReportId(null)}
          className={\`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-colors \${!selectedReportId ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}\`}
        >
          أبطال الأسبوع الحالي
        </button>
        {reports.map((report) => (
          <button
            key={report.id}
            onClick={() => setSelectedReportId(report.id)}
            className={\`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-colors \${selectedReportId === report.id ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}\`}
          >
            أسبوع ({report.dateStr})
          </button>
        ))}
      </div>
`;

content = content.replace(
  /<\/div>\s*<\/div>\s*<div className="p-6" ref=\{chartRef\}>/,
  '</div>\n      </div>\n' + tabsHtml + '\n      <div className="p-6" ref={chartRef}>'
);

fs.writeFileSync('src/components/SupervisorReports.tsx', content);
console.log('Added UI for saving/viewing reports');
