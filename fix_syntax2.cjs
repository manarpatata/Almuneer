const fs = require('fs');
let content = fs.readFileSync('src/components/SupervisorDashboard.tsx', 'utf8');

const regex = /إضافة سؤال جديد[\s\S]*?\{\(\(\) => \{/;

const replacement = `إضافة سؤال جديد
              </button>
            </div>
            <div className="flex gap-3 pt-6 mt-6 border-t border-slate-100">
              <button 
                onClick={handleSendQuiz}
                className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                إرسال الاختبار للكل
              </button>
            </div>
          </div>
          )}
        </div>

        {/* Completed Quizzes Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8">
          <button onClick={() => setIsQuizAnswersOpen(!isQuizAnswersOpen)} className="w-full p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between hover:bg-slate-100 transition-colors text-right">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-black text-slate-800">إجابات الطلاب على الاختبارات</h2>
            </div>
            {isQuizAnswersOpen ? <ChevronUp className="w-6 h-6 text-slate-400" /> : <ChevronDown className="w-6 h-6 text-slate-400" />}
          </button>
          {isQuizAnswersOpen && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(() => {`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/components/SupervisorDashboard.tsx', content);
