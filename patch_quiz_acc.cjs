const fs = require('fs');
let content = fs.readFileSync('src/components/SupervisorDashboard.tsx', 'utf8');

// Add icons
content = content.replace(
  /import \{ (.*) \} from 'lucide-react';/,
  "import { $1, ChevronDown, ChevronUp } from 'lucide-react';"
);

// Add states
content = content.replace(
  /const \[usersMap, setUsersMap\] = useState<Record<string, any>>\(\{\}\);/,
  `const [usersMap, setUsersMap] = useState<Record<string, any>>({});
  const [isQuizFormOpen, setIsQuizFormOpen] = useState(false);
  const [isQuizAnswersOpen, setIsQuizAnswersOpen] = useState(false);`
);

// Patch Quiz Form Section
const oldQuizFormHeader = `<div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <FileText className="w-6 h-6 text-indigo-500" />
               <div>
                 <h2 className="text-lg font-black text-slate-800">إنشاء اختبار جديد</h2>
                 <p className="text-sm font-bold text-slate-500">إنشاء اختبار وإرساله لجميع الطلاب</p>
               </div>
             </div>
          </div>
          <div className="p-6">`;

const newQuizFormHeader = `<button onClick={() => setIsQuizFormOpen(!isQuizFormOpen)} className="w-full p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between hover:bg-slate-100 transition-colors text-right">
             <div className="flex items-center gap-3">
               <FileText className="w-6 h-6 text-indigo-500" />
               <div>
                 <h2 className="text-lg font-black text-slate-800">إنشاء اختبار جديد</h2>
                 <p className="text-sm font-bold text-slate-500">إنشاء اختبار وإرساله لجميع الطلاب</p>
               </div>
             </div>
             {isQuizFormOpen ? <ChevronUp className="w-6 h-6 text-slate-400" /> : <ChevronDown className="w-6 h-6 text-slate-400" />}
          </button>
          {isQuizFormOpen && (
          <div className="p-6">`;

content = content.replace(oldQuizFormHeader, newQuizFormHeader);

// Close the if condition for quiz form before Completed Quizzes Section
content = content.replace(
  /<div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8">\s*<div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-2">\s*<FileText className="w-5 h-5 text-indigo-500" \/>\s*<h2 className="text-lg font-black text-slate-800">إجابات الطلاب على الاختبارات<\/h2>/,
  `</div>
        )}
        {/* Completed Quizzes Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8">
          <button onClick={() => setIsQuizAnswersOpen(!isQuizAnswersOpen)} className="w-full p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between hover:bg-slate-100 transition-colors text-right">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-black text-slate-800">إجابات الطلاب على الاختبارات</h2>
            </div>
            {isQuizAnswersOpen ? <ChevronUp className="w-6 h-6 text-slate-400" /> : <ChevronDown className="w-6 h-6 text-slate-400" />}
          </button>`
);

content = content.replace(
  /      <\/main>/,
  `          )}
        </div>
      </main>`
);

// Let's make sure that `<div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">` is wrapped correctly.
// The structure is:
//          <button ...> ... </button>
//          <div className="p-6 grid grid-cols-1 ...">

content = content.replace(
  /<button onClick=\{\(\) => setIsQuizAnswersOpen\(!isQuizAnswersOpen\)\} className="w-full p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between hover:bg-slate-100 transition-colors text-right">\s*<div className="flex items-center gap-2">\s*<FileText className="w-5 h-5 text-indigo-500" \/>\s*<h2 className="text-lg font-black text-slate-800">إجابات الطلاب على الاختبارات<\/h2>\s*<\/div>\s*\{isQuizAnswersOpen \? <ChevronUp className="w-6 h-6 text-slate-400" \/> : <ChevronDown className="w-6 h-6 text-slate-400" \/>\}\s*<\/button>\s*<div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">/,
  `<button onClick={() => setIsQuizAnswersOpen(!isQuizAnswersOpen)} className="w-full p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between hover:bg-slate-100 transition-colors text-right">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-black text-slate-800">إجابات الطلاب على الاختبارات</h2>
            </div>
            {isQuizAnswersOpen ? <ChevronUp className="w-6 h-6 text-slate-400" /> : <ChevronDown className="w-6 h-6 text-slate-400" />}
          </button>
          {isQuizAnswersOpen && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">`
);

fs.writeFileSync('src/components/SupervisorDashboard.tsx', content);
console.log('Accordion patched');
