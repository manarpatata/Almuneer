const fs = require('fs');
let content = fs.readFileSync('src/components/SupervisorReports.tsx', 'utf8');

// Replace everything from `return (` down to `<div className="flex-1 overflow-y-auto p-6" ref={chartRef}>`
const topRegex = /return \([\s\S]*?<div className="flex-1 overflow-y-auto p-6" ref=\{chartRef\}>/;
content = content.replace(topRegex, `return (
    <div className="w-full mt-8 bg-slate-50 rounded-3xl shadow-sm border border-slate-200 overflow-hidden" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-center p-6 bg-white border-b border-slate-200 shrink-0 gap-4">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <Trophy className="w-8 h-8 text-amber-500" />
          التقرير الأسبوعي ولوحة الأبطال ⭐️
        </h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleToggleGlobal}
            className={\`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors \${showGlobal ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}\`}
          >
            {showGlobal ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {showGlobal ? 'مرئي للطلاب' : 'مخفي عن الطلاب'}
          </button>
          <button 
            onClick={downloadReport}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            تحميل كصورة
          </button>
        </div>
      </div>
      
      <div className="p-6" ref={chartRef}>`);

const bottomRegex = /<\/div>\s*<\/motion\.div>\s*<\/div>\s*\)\}\s*<\/AnimatePresence>\s*<\/>/;
content = content.replace(bottomRegex, '</div>\n    </div>');

// also remove unused imports
content = content.replace(/import \{ motion, AnimatePresence \} from 'framer-motion';\n/, '');

fs.writeFileSync('src/components/SupervisorReports.tsx', content);
console.log('Reports syntax fixed');
