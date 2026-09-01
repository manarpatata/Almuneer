const fs = require('fs');
let content = fs.readFileSync('src/components/SupervisorReports.tsx', 'utf8');

// 1. Remove 👑
content = content.replace('أبطال الأسبوع 👑', 'أبطال الأسبوع');

// 2. Remove the top export button
content = content.replace(
  /<button \s*onClick=\{handleDownload\}\s*className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors"\s*>\s*<Download className="w-4 h-4" \/>\s*تحميل كصورة\s*<\/button>/m,
  ''
);

// 3. Update handleDownload
content = content.replace(
  /const handleDownload = async \(\) => \{[\s\S]*?\}\s*\};/m,
  `const handleDownload = async () => {
    if (chartRef.current) {
      try {
        const dataUrl = await toPng(chartRef.current, { backgroundColor: '#f8fafc' });
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], \`report-\${new Date().toISOString().split('T')[0]}.png\`, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'تقرير الأبطال',
            text: 'تقرير أبطال الأسبوع',
            files: [file]
          });
        } else {
          const a = document.createElement('a');
          a.href = dataUrl;
          a.download = file.name;
          a.click();
        }
      } catch (e) {
        console.error("Failed to capture chart", e);
      }
    }
  };`
);

// 4. Append the list to the bottom of the chart
content = content.replace(
  /<\/ResponsiveContainer>\s*<\/div>/m,
  `</ResponsiveContainer>
                    </div>
                    
                    <div className="mt-12 flex flex-col gap-3">
                      {currentWeekEntries.map((entry, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-transform hover:scale-[1.01]">
                          <div className="flex items-center gap-4">
                            <div className={\`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow-inner
                              \${idx === 0 ? 'bg-amber-100 text-amber-600 border-2 border-amber-300' : 
                                 idx === 1 ? 'bg-slate-200 text-slate-600 border-2 border-slate-300' : 
                                 idx === 2 ? 'bg-orange-100 text-orange-700 border-2 border-orange-300' : 
                                 'bg-indigo-50 text-indigo-600 border border-indigo-100'}\`}
                            >
                              {idx + 1}
                            </div>
                            <span className="font-bold text-slate-700 text-lg">{entry.displayName}</span>
                          </div>
                          <span className="font-black text-indigo-600 bg-indigo-100 px-4 py-1.5 rounded-full text-sm">
                            {entry.weeklyLessons} درس
                          </span>
                        </div>
                      ))}
                    </div>`
);

fs.writeFileSync('src/components/SupervisorReports.tsx', content);
console.log('Fixed SupervisorReports');
