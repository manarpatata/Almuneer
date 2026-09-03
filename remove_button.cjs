const fs = require('fs');
let content = fs.readFileSync('src/components/SupervisorReports.tsx', 'utf8');

const targetButton = `          {!selectedReportId && (
            <button 
              onClick={handleSaveWeeklyReport}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-sm"
            >
              حفظ وإغلاق الأسبوع
            </button>
          )}`;

if (content.includes(targetButton)) {
  content = content.replace(targetButton, '');
  fs.writeFileSync('src/components/SupervisorReports.tsx', content);
  console.log('Removed button');
} else {
  console.log('Target button not found');
}
