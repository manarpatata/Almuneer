const fs = require('fs');
let content = fs.readFileSync('src/components/SupervisorReports.tsx', 'utf8');

content = content.replace(
  /\{currentWeekEntries\.length > 0 \? \(\s*<div className="h-\[400px\] w-full mt-12" dir="ltr">/m,
  "{currentWeekEntries.length > 0 ? (\n                    <>\n                    <div className=\"h-[400px] w-full mt-12\" dir=\"ltr\">"
);

content = content.replace(
  /<\/div>\s*\)\s*:\s*\(\s*<div className="text-center text-slate-500 py-12 font-bold">لا يوجد بيانات كافية لهذا الأسبوع.<\/div>/m,
  "</>\n                  ) : (\n                    <div className=\"text-center text-slate-500 py-12 font-bold\">لا يوجد بيانات كافية لهذا الأسبوع.</div>"
);

fs.writeFileSync('src/components/SupervisorReports.tsx', content);
