const fs = require('fs');
let content = fs.readFileSync('src/components/SupervisorReports.tsx', 'utf8');

const regex = /const handleSaveWeeklyReport = async \(\) => \{[\s\S]*?alert\('حدث خطأ أثناء حفظ التقرير'\);\s*\}\s*\};\s*/;

content = content.replace(regex, ''); // remove the first match

fs.writeFileSync('src/components/SupervisorReports.tsx', content);
console.log('Removed duplicate save logic');
