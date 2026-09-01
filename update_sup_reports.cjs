const fs = require('fs');
let content = fs.readFileSync('src/components/SupervisorReports.tsx', 'utf8');

// Replace any[] with WeeklyReport[]
content = content.replace(
  /const \[reports, setReports\] = useState<any\[\]>\(\[\]\);/,
  `const [reports, setReports] = useState<import('../types').WeeklyReport[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);`
);

// We need an arrayUnion import for firebase
if (!content.includes('arrayUnion')) {
  content = content.replace(
    /import \{ doc, getDoc, updateDoc \} from 'firebase\/firestore';/,
    `import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';`
  );
}

const saveReportFn = `
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
  saveReportFn + '\n  const handleDownload = async () => {'
);

fs.writeFileSync('src/components/SupervisorReports.tsx', content);
console.log('Added save logic');
